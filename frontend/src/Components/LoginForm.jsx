import axios from "axios";
import { useState } from "react";
import { Typography, Box, TextField, Alert, Button } from "@mui/material";
import api from "../services/api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [errorConfig, setErrorConfig] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

   try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const data = response.data;
      localStorage.setItem("userId", data.userId);
      setUser(data);
      console.log("Login exitoso:", data.message);

      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error("Detalle completo del error:", error);

      if (!error.response) {
        setErrorConfig({
          message: "No pudimos conectar con el servidor. Revisa tu conexión a internet.",
          type: "NETWORK_ERROR"
        });
      } 
      else {
        const statusCode = error.response.status;

        const mensajeBackend = error.response.data?.message || "";

        if (statusCode === 401) {
          if (mensajeBackend.includes("desactivada")) {
             setErrorConfig({
              message: mensajeBackend, 
              type: "DEACTIVATED"
            });
          } 
          else {
             setErrorConfig({
              message: mensajeBackend, 
              type: "INVALID_CREDENTIALS"
            });
          }
        } 
        else if (statusCode === 400) {
           setErrorConfig({
            message: "Faltan datos o el formato del correo es incorrecto.",
            type: "BAD_REQUEST"
          });
        }
        else {
          setErrorConfig({
            message: "Ocurrió un error inesperado. Inténtalo nuevamente.",
            type: "UNKNOWN"
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 1,
        borderRadius: 1,
        p: 2,
        minWidth: 300,
        maxWidth: 400,
        mx: "auto", 
        mt: 4,
      }}
    >
      <Typography variant="h4" component="h3" gutterBottom color="primary">
        Iniciar sesión
      </Typography>

    {errorConfig.message && (
        <Alert 
          severity={errorConfig.type === "INVALID_CREDENTIALS" ? "warning" : "error"} 
          sx={{ mb: 3 }}
          action={
            errorConfig.type === "DEACTIVATED" ? (
              <Button color="inherit" size="small" onClick={() => alert("Abriendo chat de soporte...")}>
                SOPORTE
              </Button>
            ) : null
          }
        >
          {errorConfig.type === "NETWORK_ERROR" && <AlertTitle>Fallo de red</AlertTitle>}
          {errorConfig.type === "DEACTIVATED" && <AlertTitle>Acceso denegado</AlertTitle>}
          
          {errorConfig.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </Box>
    </Box>
  );
}

export default LoginForm;
