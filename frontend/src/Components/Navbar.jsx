import{useState} from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem, 
  Avatar, 
  ListItemIcon, 
  ListItemButton,
  ListItemText, 
  Divider, 
  Box,
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  Dashboard as DashboardIcon, 
  Logout as LogoutIcon, 
  KeyboardArrowDown as ArrowDownIcon 
} from '@mui/icons-material';
import { AccountBalanceWallet } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // Handlers to open and close the menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Simulated navigation handler
  const handleNavigate = (page) => {
    navigate(`/${page}`, { replace: true });
    handleClose();
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: "#074f96" }}>
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <AccountBalanceWallet sx={{ mr: 1.5, fontSize: 30 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 0.5 }}
        >
          DigitalArs
        </Typography>
          <Box>
          <ListItemButton component="a" href="/">
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </Box>
        <Box>
          <ListItemButton component="a" href="/transactionHistory">
            <ListItemText primary="Historial" />
          </ListItemButton>
        </Box>
       <Box>
              <Button
                onClick={handleProfileClick}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{
                  textTransform: 'none',
                  borderRadius: '9999px',
                  padding: '4px 12px 4px 4px',
                  backgroundColor: '#f1f5f9',
                  '&:hover': { backgroundColor: '#e2e8f0' },
                }}
              >
                <Avatar 
                  alt="Alex Morgan" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" 
                  sx={{ width: 36, height: 36, mr: 1.5 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', display: { xs: 'none', sm: 'block' }, mr: 0.5 }}>
                  Alex Morgan
                </Typography>
                <ArrowDownIcon sx={{ fontSize: 18, color: '#64748b' }} />
              </Button>

              {/* Profile Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.08))',
                    mt: 1.5,
                    borderRadius: '16px',
                    minWidth: 220,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info Header inside Dropdown */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Alex Morgan
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                    alex.morgan@example.com
                  </Typography>
                </Box>
                <Divider />

                {/* Dropdown Navigation Links */}
                <MenuItem onClick={() => handleNavigate('Dashboard')}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" sx={{ color: '#6366f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('Profile Page')}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" sx={{ color: '#6366f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Mi Perfil" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('Settings Page')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" sx={{ color: '#6366f1' }} />
                  </ListItemIcon>
                  <ListItemText primary="Configuración" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => handleNavigate('Logout')} sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2' } }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                </MenuItem>
              </Menu>
            </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
