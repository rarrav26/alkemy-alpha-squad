import {
  Typography,
  Box,
} from "@mui/material";



function Footer() {

    return(
       <Box
        component="footer"
        sx={{
          py: 2.5,
          textAlign: "center",
          bgcolor: "white",
          borderTop: "1px solid #e2e8f0",
          mt: "auto",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} DigitalArs - Solución Integral de
          Billetera Virtual
        </Typography>
      </Box>
    )
}

export default Footer;