import { Box, Container, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '0.5rem 0',
        marginTop: 'auto',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © {new Date().getFullYear()} Rental Equipment Pro horarios de atencion 9:00 AM - 6:00 PM Lunes a Viernes 
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;