import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

function Payments() {
  const [value, setValue] = useState(0);
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    alquiler_id: '',
    monto: '',
    fecha_pago: '',
    metodo_pago: ''
  });
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    fetchPayments();
    fetchRentals();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/pagos');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/alquileres');
      setRentals(response.data.filter(rental => rental.estado === 'activo'));
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNewPaymentChange = (event) => {
    setNewPayment({
      ...newPayment,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3006/api/pagos', newPayment);
      setOpenDialog(false);
      fetchPayments();
      setNewPayment({
        alquiler_id: '',
        monto: '',
        fecha_pago: '',
        metodo_pago: ''
      });
    } catch (error) {
      console.error('Error creating payment:', error);
    }
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
          <Tab label="Registrar Pago" />
          <Tab label="Historial de Pagos" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 3 }}
        >
          Registrar Nuevo Pago
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              margin="normal"
              name="alquiler_id"
              label="Alquiler"
              value={newPayment.alquiler_id}
              onChange={handleNewPaymentChange}
            >
              {rentals.map((rental) => (
                <MenuItem key={rental.id} value={rental.id}>
                  {`${rental.cliente_nombre} - ${rental.articulo_nombre}`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="monto"
              label="Monto"
              type="number"
              value={newPayment.monto}
              onChange={handleNewPaymentChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="fecha_pago"
              label="Fecha de Pago"
              type="date"
              value={newPayment.fecha_pago}
              onChange={handleNewPaymentChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              name="metodo_pago"
              label="Método de Pago"
              value={newPayment.metodo_pago}
              onChange={handleNewPaymentChange}
            >
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Registrar
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Alquiler</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha de Pago</TableCell>
                <TableCell>Método de Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{`${payment.cliente_nombre} - ${payment.articulo_nombre}`}</TableCell>
                  <TableCell>${payment.monto}</TableCell>
                  <TableCell>{new Date(payment.fecha_pago).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.metodo_pago}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}

export default Payments;