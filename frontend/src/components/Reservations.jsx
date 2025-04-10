import { useState, useEffect } from 'react';
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem,
  IconButton, TablePagination, InputAdornment, Select,
  FormControl, InputLabel, Alert, Snackbar,
  Grid
} from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

function Reservations() {
  // Estados para datos
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [equipment, setEquipment] = useState([]);
  
  // Estados para UI
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estado para nueva reserva
  const [newReservation, setNewReservation] = useState({
    articulo_id: '',
    cliente_id: '',    
    fecha_reserva: dayjs().format('YYYY-MM-DD'),
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'pendiente',
    notas: ''
  });

  // Obtener datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchReservations(),
          fetchClients(),
          fetchEquipment()
        ]);
      } catch (err) {
        setError('Error al cargar los datos iniciales');
      }
    };
    
    fetchData();
  }, []);

  // Filtrar reservas cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter(reservation => 
        Object.values(reservation).some(
          value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredReservations(filtered);
    }
    setPage(0);
  }, [searchTerm, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/reservas');
      const sortedReservations = response.data.sort((a, b) => 
        new Date(b.fecha_reserva) - new Date(a.fecha_reserva)
      );
      setReservations(sortedReservations);
      setFilteredReservations(sortedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Error al cargar las reservas');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/clientes');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Error al cargar los clientes');
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/articulos');
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Error al cargar los artículos');
    }
  };

  // Validación de fechas
  const validateDates = () => {
    if (!newReservation.fecha_inicio || !newReservation.fecha_fin) {
      return false;
    }
    return dayjs(newReservation.fecha_inicio).isSameOrBefore(dayjs(newReservation.fecha_fin));
  };

  // Manejador de envío del formulario
  const handleSubmit = async () => {
    if (!validateDates()) {
      setError('La fecha de inicio debe ser anterior o igual a la fecha de fin');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3006/api/reservas/${selectedReservation.id}`, newReservation);
      } else {
        await axios.post('http://localhost:3006/api/reservas', newReservation);
      }
      setOpenDialog(false);
      fetchReservations();
      setNewReservation({
        articulo_id: '',
        cliente_id: '',    
        fecha_reserva: dayjs().format('YYYY-MM-DD'),
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'pendiente',
        notas: ''
      });
      setIsEditing(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error saving reservation:', error);
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la reserva`);
    }
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setNewReservation({
      articulo_id: reservation.articulo_id,
      cliente_id: reservation.cliente_id,
      fecha_reserva: reservation.fecha_reserva,
      fecha_inicio: reservation.fecha_inicio,
      fecha_fin: reservation.fecha_fin,
      estado: reservation.estado,
      notas: reservation.notas
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3006/api/reservas/${selectedReservation.id}`);
      setOpenDeleteDialog(false);
      setSelectedReservation(null);
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setError('Error al eliminar la reserva');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsEditing(false);
            setNewReservation({
              articulo_id: '',
              cliente_id: '',
              fecha_reserva: dayjs().format('YYYY-MM-DD'),
              fecha_inicio: '',
              fecha_fin: '',
              estado: 'pendiente',
              notas: ''
            });
            setOpenDialog(true);
          }}
        >
          Nueva Reserva
        </Button>

        <TextField
          placeholder="Buscar reserva..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' }}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Editar Reserva' : 'Nueva Reserva'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            name="cliente_id"
            label="Cliente"
            value={newReservation.cliente_id}
            onChange={(e) => setNewReservation({ ...newReservation, cliente_id: e.target.value })}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {`${client.nombre} ${client.apellido}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            name="articulo_id"
            label="Equipo"
            value={newReservation.articulo_id}
            onChange={(e) => setNewReservation({ ...newReservation, articulo_id: e.target.value })}
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
            value={newReservation.fecha_inicio}
            onChange={(e) => setNewReservation({ ...newReservation, fecha_inicio: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="fecha_fin"
            label="Fecha Fin"
            type="date"
            value={newReservation.fecha_fin}
            onChange={(e) => setNewReservation({ ...newReservation, fecha_fin: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="notas"
            label="Notas"
            multiline
            rows={4}
            value={newReservation.notas}
            onChange={(e) => setNewReservation({ ...newReservation, notas: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar la reserva?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Equipo</TableCell>
              <TableCell>Fecha Reserva</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.cliente_nombre}</TableCell>
                  <TableCell>{reservation.articulo_nombre}</TableCell>
                  <TableCell>{new Date(reservation.fecha_reserva).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(reservation.fecha_inicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(reservation.fecha_fin).toLocaleDateString()}</TableCell>
                  <TableCell>{reservation.estado}</TableCell>
                  <TableCell>{reservation.notas}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(reservation)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setOpenDeleteDialog(true);
                      }} 
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReservations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Reservas por página:"
        />
      </TableContainer>
    </Box>
  );
}

export default Reservations;