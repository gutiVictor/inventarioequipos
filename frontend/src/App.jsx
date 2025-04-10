import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import BuildIcon from '@mui/icons-material/Build';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import ConstructionIcon from '@mui/icons-material/Construction';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Articles from './components/Articles';
import Clients from './components/Clients';
import Rentals from './components/Rentals';
import Payments from './components/Payments';
import Maintenance from './components/Maintenance';
import Reservations from './components/Reservations';
import Footer from './components/Footer';
 import Reports from './components/Reports'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Categorías', icon: <CategoryIcon />, path: '/categorias' },
    { text: 'Artículos', icon: <InventoryIcon />, path: '/articulos' },
    { text: 'Sucursales', icon: <StoreIcon />, path: '/sucursales' },
    { text: 'Clientes', icon: <PersonIcon />, path: '/clientes' },
    { text: 'Reservas', icon: <CalendarTodayIcon />, path: '/reservas' },
    { text: 'Alquileres', icon: <HistoryIcon />, path: '/alquileres' },
    { text: 'Pagos', icon: <PaymentIcon />, path: '/pagos' },
    { text: 'Mantenimiento', icon: <ConstructionIcon />, path: '/mantenimiento' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="abrir menú"
                  edge="start"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  Sistema de Alquiler de Equipos
                </Typography>
              </Toolbar>
            </AppBar>

            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
            >
              <Toolbar />
              <Box sx={{ overflow: 'auto' }}>
                <List>
                  {menuItems.map((item) => (
                    <ListItem
                      button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: 8,
                backgroundColor: 'background.default',
              }}
            >
              <Container maxWidth="lg">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/categorias" element={<Categories />} />
                  <Route path="/articulos" element={<Articles />} />
                  <Route path="/clientes" element={<Clients />} />
                  <Route path="/reservas" element={<Reservations />} />
                  <Route path="/alquileres" element={<Rentals />} />
                  <Route path="/pagos" element={<Payments />} />
                  <Route path="/mantenimiento" element={<Maintenance />} />
                  <Route path="/reportes" element={<Reports />} />
                </Routes>
              </Container>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
