import { useState ,useContext} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import AuthComponent from "./Components/Containers/Auth";
import Dashboard from "./Components/Containers/Dashboard";
import TransactionHistory from "./Components/Containers/TransactionHistory";
import RootLayout from "./Components/Containers/RootLayout";
import AuthContext from "./Contexts/AuthContext";


const ProtectedRoute = () => {
  const { userId } = useContext(AuthContext);
  return userId ? <Outlet /> : <Navigate to="/auth" replace />;
};


const PublicRoute = () => {
  const { userId } = useContext(AuthContext);
  return !userId ? <AuthComponent /> : <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />, // Protege todo el layout principal
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "", element: <Navigate to="/dashboard" replace /> }, // Si entra a "/" va a dashboard si está logueado
          { path: "dashboard", element: <Dashboard /> },
          { path: "transactionHistory", element: <TransactionHistory /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <PublicRoute />, // Si ya está logueado, lo saca de auth
  },
]);

function App() {
const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const value = {
    userId,
    setUserId,
    userToken,
    setUserToken
  };
  return (
    <AuthContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
