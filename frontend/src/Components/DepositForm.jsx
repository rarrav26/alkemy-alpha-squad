import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import accountService from "../services/accountService";

function DepositForm({ onDepositSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const validateAmount = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "El importe es obligatorio.";
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return "Ingrese un número válido.";
    }
    if (num <= 0) {
      return "El importe debe ser mayor a cero.";
    }
    // Check max 2 decimals
    const parts = value.toString().split(".");
    if (parts.length === 2 && parts[1].length > 2) {
      return "El importe no puede tener más de 2 decimales.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError("");

    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await accountService.deposit(parseFloat(amount));
      setSuccess(result);
      setAmount("");
      if (onDepositSuccess) {
        onDepositSuccess(result.newBalance);
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;

        if (status === 401) {
          setError("Sesión expirada o usuario inactivo. Vuelva a iniciar sesión.");
        } else if (status === 400) {
          setError(msg || "Importe inválido. Verifique el monto ingresado.");
        } else {
          setError(msg || "Ocurrió un error inesperado. Intente nuevamente.");
        }
      } else {
        setError("No se pudo conectar con el servidor. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: { xs: "100%", ms: "80%", md: "60%" },
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(7, 79, 150, 0.12)",
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2.5,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: 1.2,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.15)",
            mb: 0.5,
          }}
        >
          <AccountBalanceWallet sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Ingresar Dinero
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.3 }}>
          Depósito simulado a tu cuenta
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success.message} — Nuevo saldo:{" "}
            <strong>
              ${success.newBalance.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="deposit-amount"
            label="Importe a depositar"
            name="amount"
            type="number"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
              htmlInput: {
                min: "0.01",
                step: "0.01",
              },
            }}
            helperText="Ingrese un monto mayor a $0 con hasta 2 decimales"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
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
              "Depositar"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DepositForm;
