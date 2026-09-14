import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthComponent from "./Components/Containers/Auth";
import Dashboard from "./Components/Containers/Dashboard";
import History from "./Components/Containers/History";
import RootLayout from "./Components/Containers/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "history", element: <History /> },
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
