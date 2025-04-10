import { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/categorias');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory({
      ...newCategory,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3006/api/categorias/${selectedCategory.id}`, newCategory);
      } else {
        await axios.post('http://localhost:3006/api/categorias', newCategory);
      }
      setOpenDialog(false);
      fetchCategories();
      setNewCategory({
        nombre: '',
        descripcion: ''
      });
      setIsEditing(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setNewCategory({
      nombre: category.nombre,
      descripcion: category.descripcion
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3006/api/categorias/${selectedCategory.id}`);
      setOpenDeleteDialog(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsEditing(false);
          setNewCategory({ nombre: '', descripcion: '' });
          setOpenDialog(true);
        }}
        sx={{ mb: 3 }}
      >
        Nueva Categoría
      </Button>

      <Dialog open={openDialog} onClose={() => {
        setOpenDialog(false);
        setIsEditing(false);
        setNewCategory({ nombre: '', descripcion: '' });
      }}>
        <DialogTitle>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="nombre"
            label="Nombre"
            value={newCategory.nombre}
            onChange={handleNewCategoryChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="descripcion"
            label="Descripción"
            multiline
            rows={4}
            value={newCategory.descripcion}
            onChange={handleNewCategoryChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setIsEditing(false);
            setNewCategory({ nombre: '', descripcion: '' });
          }}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar la categoría "{selectedCategory?.nombre}"?
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
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.nombre}</TableCell>
                <TableCell>{category.descripcion}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(category)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(category)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Categories;