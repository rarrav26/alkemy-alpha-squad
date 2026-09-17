import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DepositForm from "../DepositForm";
import accountService from "../../services/accountService";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await accountService.getBalance();
        setAccount(data);
        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Sesión expirada. Vuelva a iniciar sesión.");
        } else {
          setError("No se pudo obtener el saldo de la cuenta.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const toggleShowBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const handleDepositSuccess = (newBalance) => {
    setAccount((prev) => (prev ? { ...prev, balance: newBalance } : prev));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {account && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* Balance Card con botón de ojo y estado activo */}
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(7, 79, 150, 0.12)",
              minWidth: { xs: "100%", md: 320 },
            }}
          >
            <Box
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                p: 2.5,
                textAlign: "center",
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: 36, mb: 0.5 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Saldo disponible
              </Typography>

              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 0.5 }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {showBalance
                    ? `$ ${account.balance.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "••••••••"}
                </Typography>
                <IconButton
                  onClick={toggleShowBalance}
                  size="small"
                  sx={{ color: "white" }}
                  aria-label="Ocultar o mostrar saldo"
                >
                  {showBalance ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </Stack>

              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {account.currency}
              </Typography>
            </Box>

            <CardContent sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>Alias:</strong> {account.alias}
                </Typography>
                <Chip label="Activa" color="primary" size="small" />
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>CVU:</strong> {account.cvu}
              </Typography>
            </CardContent>
          </Card>

          {/* Deposit Form */}
          <DepositForm onDepositSuccess={handleDepositSuccess} />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
