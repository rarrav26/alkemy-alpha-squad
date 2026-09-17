import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthComponent from "./Components/Containers/Auth";
import Dashboard from "./Components/Containers/Dashboard";
import TransactionHistory from "./Components/Containers/TransactionHistory";
import RootLayout from "./Components/Containers/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <Navigate to="/auth" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "transactionHistory", element: <TransactionHistory /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthComponent />, // La pantalla de Auth queda afuera para que no tenga Navbar ni Footer
  },
]);

function App() {

 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
