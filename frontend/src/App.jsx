import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Button,
  Avatar,
} from '@mui/material';
import {
  AccountBalanceWallet,
  LoginOutlined,
  PersonAddOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import theme from './theme/theme';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setCurrentUser(null);
    setAuthTab('login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation / Header */}
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: '#074f96' }}>
          <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
            <AccountBalanceWallet sx={{ mr: 1.5, fontSize: 30 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 0.5 }}
            >
              DigitalArs
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth={currentUser ? 'lg' : 'md'} sx={{ flexGrow: 1, py: { xs: 3, sm: 4 } }}>
          {currentUser ? (
            /* Logged-In State: Virtual Wallet */
            <WalletDashboard user={currentUser} onLogout={handleLogout} />
          ) : (
            /* Logged-Out State: Welcome & Auth View */
            <Box>
              {/* Welcome Banner */}
              <Box sx={{ textAlign: 'center', mb: 4, pt: 1 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  ¡Bienvenido a DigitalArs!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 550, mx: 'auto' }}
                >
                  Tu billetera virtual simple, segura y al instante. Gestiona tus fondos en pesos argentinos y opera en todo momento.
                </Typography>

                {/* Tabs Switcher for Login / Register */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Tabs
                    value={authTab}
                    onChange={(e, val) => setAuthTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 3,
                      p: 0.5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #e2e8f0',
                      '& .MuiTabs-indicator': {
                        height: '100%',
                        borderRadius: 2.5,
                        zIndex: 1,
                        bgcolor: 'primary.main',
                      },
                    }}
                  >
                    <Tab
                      value="login"
                      icon={<LoginOutlined />}
                      iconPosition="start"
                      label="Iniciar Sesión"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        zIndex: 2,
                        minHeight: 44,
                        px: 3,
                        transition: 'color 0.2s',
                        '&.Mui-selected': { color: 'white !important' },
                      }}
                    />
                    <Tab
                      value="register"
                      icon={<PersonAddOutlined />}
                      iconPosition="start"
                      label="Crear Cuenta"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        zIndex: 2,
                        minHeight: 44,
                        px: 3,
                        transition: 'color 0.2s',
                        '&.Mui-selected': { color: 'white !important' },
                      }}
                    />
                  </Tabs>
                </Box>
              </Box>

              {/* Form Display */}
              <Box sx={{ maxWidth: authTab === 'register' ? 700 : 450, mx: 'auto' }}>
                {authTab === 'login' ? (
                  <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onToggleRegister={() => setAuthTab('register')}
                  />
                ) : (
                  <RegisterForm onToggleLogin={() => setAuthTab('login')} />
                )}
              </Box>
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2.5,
            textAlign: 'center',
            bgcolor: 'white',
            borderTop: '1px solid #e2e8f0',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DigitalArs - Solución Integral de Billetera Virtual
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
