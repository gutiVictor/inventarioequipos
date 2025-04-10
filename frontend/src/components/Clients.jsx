import { useState, useEffect } from 'react';
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton, 
  TablePagination, InputAdornment 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function Clients() {
  // Estados principales
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Estados para edición/creación
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estado para el formulario
  const [newClient, setNewClient] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',    
    direccion: '',
    fecha_registro: ''
  });

  // Obtener clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        Object.values(client).some(
          value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredClients(filtered);
    }
    setPage(0); // Resetear a la primera página al filtrar
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/clientes');
      const sortedClients = response.data.sort((a, b) => 
        new Date(b.fecha_registro) - new Date(a.fecha_registro)
      );
      setClients(sortedClients);
      setFilteredClients(sortedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejadores del formulario
  const handleNewClientChange = (event) => {
    setNewClient({
      ...newClient,
      [event.target.name]: event.target.value
    });
  };

  // Manejadores de edición
  const handleEdit = (client) => {
    setSelectedClient(client);
    setNewClient({
      nombre: client.nombre,
      apellido: client.apellido,
      cedula: client.cedula,
      telefono: client.telefono,
      email: client.email,
      direccion: client.direccion,
      fecha_registro: client.fecha_registro
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Manejadores de eliminación
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3006/api/clientes/${selectedClient.id}`);
      setOpenDeleteDialog(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleOpenDeleteDialog = (client) => {
    setSelectedClient(client);
    setOpenDeleteDialog(true);
  };

  // Manejador de envío del formulario
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3006/api/clientes/${selectedClient.id}`, newClient);
      } else {
        await axios.post('http://localhost:3006/api/clientes', newClient);
      }
      setOpenDialog(false);
      fetchClients();
      setNewClient({
        nombre: '',
        apellido: '',
        cedula: '',
        telefono: '',
        email: '',    
        direccion: '',
        fecha_registro: ''
      });
      setIsEditing(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra de acciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsEditing(false);
            setNewClient({
              nombre: '',
              apellido: '',
              cedula: '',
              telefono: '',
              email: '',    
              direccion: '',
              fecha_registro: ''
            });
            setOpenDialog(true);
          }}
        >
          Nuevo Cliente
        </Button>

        <TextField
          placeholder="Buscar cliente..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' }}
        />
      </Box>

      {/* Diálogo de formulario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="nombre"
            label="Nombre"
            value={newClient.nombre}
            onChange={handleNewClientChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="apellido"
            label="Apellido"            
            value={newClient.apellido}
            onChange={handleNewClientChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="cedula"
            label="Cédula"            
            value={newClient.cedula}
            onChange={handleNewClientChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="telefono"
            label="Teléfono"
            value={newClient.telefono}
            onChange={handleNewClientChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            type="email"
            value={newClient.email}
            onChange={handleNewClientChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="direccion"
            label="Dirección"
            multiline
            rows={2}
            value={newClient.direccion}
            onChange={handleNewClientChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="fecha_registro"
            label="Fecha Registro"
            type="date"
            value={newClient.fecha_registro}
            onChange={handleNewClientChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar el cliente "{selectedClient?.nombre}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabla de clientes */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>              
              <TableCell>Dirección</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.nombre}</TableCell>
                  <TableCell>{client.apellido}</TableCell>
                  <TableCell>{client.cedula}</TableCell>
                  <TableCell>{client.telefono}</TableCell>
                  <TableCell>{client.email}</TableCell>                
                  <TableCell>{client.direccion}</TableCell>
                  <TableCell>{client.fecha_registro}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(client)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(client)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Clientes por página:"
        />
      </TableContainer>
    </Box>
  );
}

export default Clients;