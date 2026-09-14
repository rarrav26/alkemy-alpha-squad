import {
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  AccountBalanceWallet,
} from "@mui/icons-material";


function Navbar() {

    return(
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
        </Toolbar>
      </AppBar>
    )
}

export default Navbar;