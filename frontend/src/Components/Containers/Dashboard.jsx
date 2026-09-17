import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Stack,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import accountService from "../../services/accountService";

function Dashboard() {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await accountService.getMyAccount();
        setAccountData(data);
      } catch (err) {
        const mensajeError =
          err.response?.data?.mensaje ||
          err.message ||
          "Error al obtener los datos de la cuenta.";
        setError(mensajeError);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const toggleShowBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const formattedBalance = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: accountData?.currency || "ARS",
  }).format(accountData?.balance || 0);

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4, px: 2 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#004b93">
          ¡Bienvenido a DigitalArs!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona tus fondos en pesos argentinos en todo momento.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            bgcolor: "#004b93",
            color: "white",
            p: 2.5,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              p: 1.2,
              bgcolor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              mb: 1,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Saldo Disponible
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            CVU: {accountData?.cvu || "••••••••••••••••••••••"}
          </Typography>
        </Box>

        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            mb={1}
          >
            {loading ? (
              <Skeleton variant="text" width={180} height={50} />
            ) : (
              <Typography variant="h3" fontWeight="bold" color="#004b93">
                {showBalance ? formattedBalance : "••••••••"}
              </Typography>
            )}

            <IconButton
              onClick={toggleShowBalance}
              size="small"
              sx={{ color: "#004b93" }}
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Alias: <strong>{accountData?.alias || "—"}</strong>
            </Typography>
            <Chip
              label="Activa"
              color="primary"
              size="small"
              sx={{ bgcolor: "#004b93", fontWeight: "bold" }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;