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
  Paper,
} from "@mui/material";
import { Send, CheckCircle, Person } from "@mui/icons-material";
import accountService from "../services/accountService";

function TransferForm({ onTransferSuccess, availableBalance }) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [lookupError, setLookupError] = useState("");

  const validateDestinationFormat = (val) => {
    const trimmed = (val || "").trim();
    if (!trimmed) return "El destino es obligatorio.";
    const isCvu = /^\d{22}$/.test(trimmed);
    const isAlias = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){2}(\.[0-9]+)?$/.test(trimmed);
    if (!isCvu && !isAlias) {
      return "Ingrese un CVU válido (22 dígitos) o un Alias (ej. auto.perro.gato).";
    }
    return null;
  };

  const handleLookup = async (destToLookup) => {
    const target = destToLookup || destination;
    const formatErr = validateDestinationFormat(target);
    if (formatErr) {
      setLookupError(formatErr);
      setRecipient(null);
      return;
    }

    setLookingUp(true);
    setLookupError("");
    setRecipient(null);

    try {
      const data = await accountService.lookupRecipient(target.trim());
      setRecipient(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "No se pudo encontrar el destinatario. Verifique el Alias o CVU ingresado.";
      setLookupError(msg);
      setRecipient(null);
    } finally {
      setLookingUp(false);
    }
  };

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
    const parts = value.toString().split(".");
    if (parts.length === 2 && parts[1].length > 2) {
      return "El importe no puede tener más de 2 decimales.";
    }
    if (availableBalance !== undefined && num > availableBalance) {
      return `Saldo insuficiente. Tu saldo disponible es $${availableBalance.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError("");

    const destError = validateDestinationFormat(destination);
    if (destError) {
      setError(destError);
      return;
    }

    const amountError = validateAmount(amount);
    if (amountError) {
      setError(amountError);
      return;
    }

    setLoading(true);
    try {
      const result = await accountService.transfer(
        destination.trim(),
        parseFloat(amount)
      );

      setSuccess(result);
      setDestination("");
      setAmount("");
      setRecipient(null);
      setLookupError("");

      if (onTransferSuccess) {
        onTransferSuccess(result.newBalance);
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message;

        if (status === 401) {
          setError("Sesión expirada o usuario inactivo. Vuelva a iniciar sesión.");
        } else if (status === 404) {
          setError(msg || "La cuenta de destino no fue encontrada.");
        } else if (status === 400) {
          setError(msg || "Datos de transferencia inválidos.");
        } else {
          setError(msg || "Ocurrió un error inesperado al procesar la transferencia.");
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
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(7, 79, 150, 0.12)",
        maxWidth: 480,
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.dark",
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
          <Send sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Transferir Dinero
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.3 }}>
          Envía dinero ingresando Alias o CVU
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(null)}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              {success.message}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Transferiste{" "}
              <strong>
                $
                {success.amount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>{" "}
              a <strong>{success.recipientName}</strong>.
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.85 }}>
              Nuevo saldo: $
              {success.newBalance.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Input único de Destino */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="transfer-destination"
            label="Alias o CVU de destino"
            name="destination"
            placeholder="Ej: auto.perro.gato o 22 dígitos"
            value={destination}
            disabled={loading}
            onChange={(e) => {
              setDestination(e.target.value);
              setRecipient(null);
              setLookupError("");
            }}
            onBlur={() => {
              if (destination.trim()) {
                handleLookup(destination);
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {lookingUp ? (
                      <CircularProgress size={20} />
                    ) : recipient ? (
                      <CheckCircle color="success" />
                    ) : null}
                  </InputAdornment>
                ),
              },
            }}
            helperText="Ingresá el Alias (3 palabras) o CVU (22 números)"
            error={Boolean(lookupError)}
          />

          {/* Feedback de búsqueda de destinatario */}
          {lookupError && (
            <Alert severity="warning" sx={{ mt: 1, mb: 1 }} onClose={() => setLookupError("")}>
              {lookupError}
            </Alert>
          )}

          {recipient && (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 1.5,
                borderRadius: 2,
                bgcolor: "success.light",
                color: "success.contrastText",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Person />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {recipient.recipientName}
                </Typography>
                <Typography variant="caption" display="block">
                  Alias: {recipient.alias} | CVU: {recipient.cvu}
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Input de Importe */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="transfer-amount"
            label="Importe a transferir"
            name="amount"
            type="number"
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
            helperText={
              availableBalance !== undefined
                ? `Disponible: $${availableBalance.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "Monto mayor a $0 con hasta 2 decimales"
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || lookingUp}
            sx={{
              mt: 2,
              py: 1.3,
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              bgcolor: "primary.dark",
              "&:hover": {
                bgcolor: "primary.main",
              },
              boxShadow: "0 4px 12px rgba(7, 79, 150, 0.25)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirmar y Transferir"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TransferForm;
