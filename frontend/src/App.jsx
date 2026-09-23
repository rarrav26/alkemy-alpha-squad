import { useState, useContext } from "react";
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
import UsersList from "./Components/Containers/UsersList";
import RootLayout from "./Components/Containers/RootLayout";
import LandingPage from "./Components/Containers/LandingPage";
import AdminRoute from "./Components/AdminRoute";
import AuthContext from "./Contexts/AuthContext";


const ProtectedRoute = () => {
  const { userId, userToken } = useContext(AuthContext);
  return (userId && userToken) ? <Outlet /> : <Navigate to="/auth" replace />;
};

const PublicRoute = () => {
  const { userId, userToken } = useContext(AuthContext);
  return (!userId || !userToken) ? <AuthComponent /> : <Navigate to="/dashboard" replace />;
};

// Landing page: show welcome if not logged in, redirect to dashboard if logged in
const LandingRoute = () => {
  const { userId, userToken } = useContext(AuthContext);
  return (!userId || !userToken) ? <LandingPage /> : <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  {
    // Landing page — public welcome screen
    path: "/",
    element: <LandingRoute />,
  },
  {
    // Authenticated app routes
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "transactionHistory", element: <TransactionHistory /> },
          {
            element: <AdminRoute />,
            children: [
              { path: "users", element: <UsersList /> },
            ],
          },
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
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  const value = {
    userId,
    setUserId,
    userToken,
    setUserToken,
    userRole,
    setUserRole,
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
