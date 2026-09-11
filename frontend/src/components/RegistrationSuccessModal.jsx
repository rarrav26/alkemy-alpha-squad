import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  ContentCopy,
  Check,
  AccountBalanceWallet,
} from '@mui/icons-material';

export default function RegistrationSuccessModal({ open, onClose, registrationData }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!registrationData) return null;

  const { firstName, lastName, email, documentTypeCode, documentNumber, account, role } = registrationData;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          boxShadow: '0 12px 36px rgba(7, 79, 150, 0.2)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'success.light',
            color: 'success.dark',
            mb: 1.5,
          }}
        >
          <CheckCircle sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h5" component="div" fontWeight="bold" color="primary">
          ¡Cuenta creada con éxito!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Bienvenido/a, <strong>{firstName} {lastName}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Chip
            icon={<AccountBalanceWallet />}
            label={`Rol: ${role || 'Usuario'} | Doc: ${documentTypeCode} ${documentNumber}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Account Details Box */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: '#f4f8fc',
            border: '1px solid #d0e2f5',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Saldo inicial en cuenta
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              ${account?.balance?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0,00'} {account?.currency || 'ARS'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Alias */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight="medium">
              ALIAS DE LA CUENTA
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'white',
                p: 1.2,
                borderRadius: 1.5,
                border: '1px solid #e0e0e0',
                mt: 0.5,
              }}
            >
              <Typography variant="body1" fontWeight="bold" color="primary.main" sx={{ wordBreak: 'break-all' }}>
                {account?.alias}
              </Typography>
              <Tooltip title={copiedField === 'alias' ? '¡Copiado!' : 'Copiar Alias'}>
                <IconButton
                  size="small"
                  color={copiedField === 'alias' ? 'success' : 'primary'}
                  onClick={() => handleCopy(account?.alias, 'alias')}
                  aria-label="Copiar Alias"
                >
                  {copiedField === 'alias' ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* CVU */}
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight="medium">
              CVU (22 DÍGITOS - INMODIFICABLE)
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'white',
                p: 1.2,
                borderRadius: 1.5,
                border: '1px solid #e0e0e0',
                mt: 0.5,
              }}
            >
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ letterSpacing: 1, fontFamily: 'monospace', wordBreak: 'break-all' }}
              >
                {account?.cvu}
              </Typography>
              <Tooltip title={copiedField === 'cvu' ? '¡Copiado!' : 'Copiar CVU'}>
                <IconButton
                  size="small"
                  color={copiedField === 'cvu' ? 'success' : 'primary'}
                  onClick={() => handleCopy(account?.cvu, 'cvu')}
                  aria-label="Copiar CVU"
                >
                  {copiedField === 'cvu' ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          Se ha enviado un correo de confirmación a <strong>{email}</strong>.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={onClose}
          sx={{ borderRadius: 2, py: 1.2, fontWeight: 'bold' }}
        >
          Aceptar y Comenzar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
