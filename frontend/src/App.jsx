import { ThemeProvider, CssBaseline, Container, Typography, Box, } from '@mui/material';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            DigitalArs - Billetera Virtual
          </Typography>
          <Typography variant="body1" color="secondary" paragraph>
         Frontend inicializado correctamente 
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
