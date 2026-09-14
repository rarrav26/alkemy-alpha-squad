import { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LoginOutlined } from "@mui/icons-material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


function LoginForm({ onToggleRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorConfig, setErrorConfig] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorConfig({ message: "", type: "" });

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      const data = response.data;
      if (data?.userId) {
        localStorage.setItem("userId", data.userId);
      }
      console.log("Login exitoso:", data.message);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Detalle completo del error:", error);

      if (!error.response) {
        setErrorConfig({
          message:
            "No pudimos conectar con el servidor. Puedes probar con las credenciales o el acceso demo.",
          type: "NETWORK_ERROR",
        });
      } else {
        const statusCode = error.response.status;
        const mensajeBackend = error.response.data?.message || "";

        if (statusCode === 401) {
          if (mensajeBackend.includes("desactivada")) {
            setErrorConfig({
              message: mensajeBackend,
              type: "DEACTIVATED",
            });
          } else {
            setErrorConfig({
              message:
                mensajeBackend ||
                "Credenciales inválidas. Verifica tu correo y contraseña.",
              type: "INVALID_CREDENTIALS",
            });
          }
        } else if (statusCode === 400) {
          setErrorConfig({
            message: "Faltan datos o el formato del correo es incorrecto.",
            type: "BAD_REQUEST",
          });
        } else {
          setErrorConfig({
            message: "Ocurrió un error inesperado. Inténtalo nuevamente.",
            type: "UNKNOWN",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(7, 79, 150, 0.12)",
        maxWidth: 450,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: 1.5,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.15)",
            mb: 1,
          }}
        >
          <LoginOutlined sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Iniciar Sesión
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          Accede a tu billetera virtual DigitalArs
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        {errorConfig.message && (
          <Alert
            severity={
              errorConfig.type === "INVALID_CREDENTIALS" ? "warning" : "error"
            }
            sx={{ mb: 3 }}
            action={
              errorConfig.type === "DEACTIVATED" ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => alert("Abriendo chat de soporte...")}
                >
                  SOPORTE
                </Button>
              ) : null
            }
          >
            {errorConfig.type === "NETWORK_ERROR" && (
              <AlertTitle>Fallo de conexión</AlertTitle>
            )}
            {errorConfig.type === "DEACTIVATED" && (
              <AlertTitle>Acceso denegado</AlertTitle>
            )}
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
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="alternar visibilidad de contraseña"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.3,
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(7, 79, 150, 0.25)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Ingresar"
            )}
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Aún no tienes una cuenta?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={onToggleRegister}
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  p: 0,
                  minWidth: 0,
                }}
              >
                Regístrate aquí
              </Button>
            </Typography>
          </Box> 
        </Box>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
