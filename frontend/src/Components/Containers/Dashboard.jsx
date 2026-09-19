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
  Button,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import DepositForm from "../DepositForm";
import TransferForm from "./TransferForm";
import accountService from "../../services/accountService";
import TransactionHistory from "./TransactionHistory";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [activeAction, setActiveAction] = useState(null); // 'deposit' | 'transfer' | null
  const [historyKey, setHistoryKey] = useState(0);

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

  const handleOperationSuccess = (newBalance) => {
    setAccount((prev) => (prev ? { ...prev, balance: newBalance } : prev));
    setHistoryKey((prev) => prev + 1);
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
    <Box sx={{ minHeight: "100vh" }}>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/auth";
              }}
            >
              Iniciar Sesión
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {account && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            mt: 3,
          }}
        >
          {/* Balance Card con botón de ojo y estado activo */}
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(7, 79, 150, 0.12)",
              minWidth: { xs: "100%", md: 320 },
              width: { xs: "100%", ms: "80%", md: "60%" },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#074f96",
                color: "white",
                p: 2.5,
                textAlign: "start",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
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
              <Box>
                <Button
                  onClick={() =>
                    setActiveAction(activeAction === "deposit" ? null : "deposit")
                  }
                  sx={{
                    backgroundColor:
                      activeAction === "deposit" ? "#FFF" : "rgba(255, 255, 255, 0.2)",
                    color: activeAction === "deposit" ? "#074f96" : "#FFF",
                    fontWeight: "bold",
                    mr: 1,
                    "&:hover": {
                      backgroundColor:
                        activeAction === "deposit"
                          ? "#f0f0f0"
                          : "rgba(255, 255, 255, 0.35)",
                    },
                  }}
                >
                  Depósito
                </Button>
                <Button
                  onClick={() =>
                    setActiveAction(
                      activeAction === "transfer" ? null : "transfer"
                    )
                  }
                  sx={{
                    backgroundColor:
                      activeAction === "transfer"
                        ? "#FFF"
                        : "rgba(255, 255, 255, 0.2)",
                    color: activeAction === "transfer" ? "#074f96" : "#FFF",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor:
                        activeAction === "transfer"
                          ? "#f0f0f0"
                          : "rgba(255, 255, 255, 0.35)",
                    },
                  }}
                >
                  Transferencia
                </Button>
              </Box>
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

          {/* Formulario Dinámico: Depósito o Transferencia */}
          {activeAction === "deposit" && (
            <DepositForm onDepositSuccess={handleOperationSuccess} />
          )}

          {activeAction === "transfer" && (
            <TransferForm
              availableBalance={account.balance}
              onTransferSuccess={handleOperationSuccess}
            />
          )}

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "scroll",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(7, 79, 150, 0.12)",
              minWidth: { xs: "100%", md: 320 },
              width: { xs: "100%", ms: "80%", md: "60%" },
              maxHeight: 400,
            }}
          >
            <TransactionHistory
              key={historyKey}
              limit={5}
              title="Últimos Movimientos"
              showFilters={false}
            />
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
