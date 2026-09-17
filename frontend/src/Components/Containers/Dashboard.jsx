import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { AccountBalanceWallet, Send, AddCircle } from "@mui/icons-material";
import DepositForm from "../DepositForm";
import TransferForm from "../TransferForm";
import accountService from "../../services/accountService";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

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

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleBalanceUpdate = (newBalance) => {
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
          {/* Balance Card */}
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
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5 }}>
                $
                {account.balance.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {account.currency}
              </Typography>
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Alias:</strong> {account.alias}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                <strong>CVU:</strong> {account.cvu}
              </Typography>
            </CardContent>
          </Card>

          {/* Operations Section: Tabs for Transfer / Deposit */}
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                variant="fullWidth"
              >
                <Tab icon={<Send />} iconPosition="start" label="Transferir" />
                <Tab icon={<AddCircle />} iconPosition="start" label="Ingresar Dinero" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <TransferForm
                onTransferSuccess={handleBalanceUpdate}
                availableBalance={account.balance}
              />
            )}

            {activeTab === 1 && (
              <DepositForm onDepositSuccess={handleBalanceUpdate} />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;

