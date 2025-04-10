import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

function Rentals() {
  const [value, setValue] = useState(0);
  const [rentals, setRentals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRental, setNewRental] = useState({
    cliente_id: '',
    articulo_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activo'
  });
  const [clients, setClients] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchRentals();
    fetchClients();
    fetchEquipment();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/alquileres');
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/clientes');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/articulos');
      setEquipment(response.data.filter(item => item.estado === 'disponible'));
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNewRentalChange = (event) => {
    setNewRental({
      ...newRental,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3006/api/alquileres', newRental);
      setOpenDialog(false);
      fetchRentals();
      setNewRental({
        cliente_id: '',
        articulo_id: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'activo'
      });
    } catch (error) {
      console.error('Error creating rental:', error);
    }
  };

  const filterRentals = (status) => {
    return rentals.filter(rental => rental.estado === status);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Nuevo Alquiler" />
          <Tab label="Alquileres Activos" />
          <Tab label="Histórico" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 3 }}
        >
          Crear Nuevo Alquiler
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Nuevo Alquiler</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              margin="normal"
              name="cliente_id"
              label="Cliente"
              value={newRental.cliente_id}
              onChange={handleNewRentalChange}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              margin="normal"
              name="articulo_id"
              label="Equipo"
              value={newRental.articulo_id}
              onChange={handleNewRentalChange}
            >
              {equipment.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="fecha_inicio"
              label="Fecha Inicio"
              type="date"
              value={newRental.fecha_inicio}
              onChange={handleNewRentalChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              name="fecha_fin"
              label="Fecha Fin"
              type="date"
              value={newRental.fecha_fin}
              onChange={handleNewRentalChange}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Crear
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Equipo</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterRentals('activo').map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.cliente_nombre}</TableCell>
                  <TableCell>{rental.articulo_nombre}</TableCell>
                  <TableCell>{new Date(rental.fecha_inicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(rental.fecha_fin).toLocaleDateString()}</TableCell>
                  <TableCell>{rental.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Equipo</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterRentals('finalizado').map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.cliente_nombre}</TableCell>
                  <TableCell>{rental.articulo_nombre}</TableCell>
                  <TableCell>{new Date(rental.fecha_inicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(rental.fecha_fin).toLocaleDateString()}</TableCell>
                  <TableCell>{rental.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}

export default Rentals;