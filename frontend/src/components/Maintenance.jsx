import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

function Maintenance() {
  const [value, setValue] = useState(0);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    articulo_id: '',
    fecha_programada: '',
    tipo: '',
    descripcion: '',
    estado: 'pendiente'
  });
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchMaintenanceRecords();
    fetchEquipment();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/mantenimientos');
      setMaintenanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/articulos');
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNewMaintenanceChange = (event) => {
    setNewMaintenance({
      ...newMaintenance,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3006/api/mantenimientos', newMaintenance);
      setOpenDialog(false);
      fetchMaintenanceRecords();
      setNewMaintenance({
        articulo_id: '',
        fecha_programada: '',
        tipo: '',
        descripcion: '',
        estado: 'pendiente'
      });
    } catch (error) {
      console.error('Error creating maintenance record:', error);
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
          <Tab label="Programar Mantenimiento" />
          <Tab label="Historial" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 3 }}
        >
          Programar Nuevo Mantenimiento
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Programar Mantenimiento</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              margin="normal"
              name="articulo_id"
              label="Equipo"
              value={newMaintenance.articulo_id}
              onChange={handleNewMaintenanceChange}
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
              name="fecha_programada"
              label="Fecha Programada"
              type="date"
              value={newMaintenance.fecha_programada}
              onChange={handleNewMaintenanceChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              name="tipo"
              label="Tipo de Mantenimiento"
              value={newMaintenance.tipo}
              onChange={handleNewMaintenanceChange}
            >
              <MenuItem value="preventivo">Preventivo</MenuItem>
              <MenuItem value="correctivo">Correctivo</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="descripcion"
              label="Descripción"
              multiline
              rows={4}
              value={newMaintenance.descripcion}
              onChange={handleNewMaintenanceChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Programar
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo</TableCell>
                <TableCell>Fecha Programada</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.articulo_nombre}</TableCell>
                  <TableCell>{new Date(record.fecha_programada).toLocaleDateString()}</TableCell>
                  <TableCell>{record.tipo}</TableCell>
                  <TableCell>{record.descripcion}</TableCell>
                  <TableCell>{record.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}

export default Maintenance;