import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
import theme from './theme/theme';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation / Header */}
        <AppBar position="static" elevation={1} sx={{ bgcolor: '#074f96' }}>
          <Toolbar>
            <AccountBalanceWallet sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 0.5 }}>
              DigitalArs
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
          <RegisterForm />
        </Container>

        {/* Footer */}
        <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'white', borderTop: '1px solid #e2e8f0', mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DigitalArs - Solución Integral de Billetera Virtual
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
