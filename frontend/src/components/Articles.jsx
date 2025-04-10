import { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newArticle, setNewArticle] = useState({
    nombre: '',
    codigo_barras: '',
    categoria_id: '',
    sucursal_id: '',
    estado: 'disponible',
    costo_alquiler_dia: '',
    fecha_adquisicion: '',
    imagen_url: '',
    notas: ''
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/articulos');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/categorias');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleNewArticleChange = (event) => {
    setNewArticle({
      ...newArticle,
      [event.target.name]: event.target.value
    });
  };

  // Add these new state variables inside the Articles function
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Add these new functions inside the Articles function
  const handleEdit = (article) => {
    setSelectedArticle(article);
    setNewArticle({
      nombre: article.nombre,
      codigo_barras: article.codigo_barras,
      categoria_id: article.categoria_id,
      sucursal_id: article.sucursal_id,
      estado: article.estado,
      costo_alquiler_dia: article.costo_alquiler_dia,
      fecha_adquisicion: article.fecha_adquisicion,
      imagen_url: article.imagen_url,
      notas: article.notas,
      descripcion: article.descripcion,
      precio_alquiler: article.precio_alquiler,
      stock: article.stock
    });
    setIsEditing(true);
    setOpenDialog(true);
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3006/api/articulos/${selectedArticle.id}`);
      setOpenDeleteDialog(false);
      setSelectedArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };
  
  const handleOpenDeleteDialog = (article) => {
    setSelectedArticle(article);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3006/api/articulos/${selectedArticle.id}`, newArticle);
      } else {
        await axios.post('http://localhost:3006/api/articulos', newArticle);
      }
      setOpenDialog(false);
      fetchArticles();
      setNewArticle({
        nombre: '',
        codigo_barras: '',
        categoria_id: '',
        sucursal_id: '',
        estado: 'disponible',
        costo_alquiler_dia: '',
        fecha_adquisicion: '',
        imagen_url: '',
        notas: '',
        descripcion: '',
        precio_alquiler: '',
        stock: ''
      });
      setIsEditing(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.categoria_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.codigo_barras.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar artículos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, categoría, estado o código de barras"
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Nuevo Artículo
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="nombre"
            label="Nombre"
            value={newArticle.nombre}
            onChange={handleNewArticleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="codigo_barras"
            label="Código de Barras"
            value={newArticle.codigo_barras}
            onChange={handleNewArticleChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="sucursal_id"
            label="Sucursal"
            value={newArticle.sucursal_id}
            onChange={handleNewArticleChange}
          >
            <MenuItem value="1">Sucursal Principal</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            name="costo_alquiler_dia"
            label="Costo de Alquiler por Día"
            type="number"
            value={newArticle.costo_alquiler_dia}
            onChange={handleNewArticleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="fecha_adquisicion"
            label="Fecha de Adquisición"
            type="date"
            value={newArticle.fecha_adquisicion}
            onChange={handleNewArticleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="imagen_url"
            label="URL de la Imagen"
            value={newArticle.imagen_url}
            onChange={handleNewArticleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="notas"
            label="Notas"
            multiline
            rows={4}
            value={newArticle.notas}
            onChange={handleNewArticleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="descripcion"
            label="Descripción"
            multiline
            rows={4}
            value={newArticle.descripcion}
            onChange={handleNewArticleChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="categoria_id"
            label="Categoría"
            value={newArticle.categoria_id}
            onChange={handleNewArticleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            name="precio_alquiler"
            label="Precio de Alquiler"
            type="number"
            value={newArticle.precio_alquiler}
            onChange={handleNewArticleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="stock"
            label="Stock"
            type="number"
            value={newArticle.stock}
            onChange={handleNewArticleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Código de Barras</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Costo Alquiler/Día</TableCell>
              <TableCell>Fecha Adquisición</TableCell>
              <TableCell>Imagen URL</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.nombre}</TableCell>
                <TableCell>{article.codigo_barras}</TableCell>
                <TableCell>{article.categoria_nombre}</TableCell>
                <TableCell>{article.sucursal_id}</TableCell>
                <TableCell>{article.estado}</TableCell>
                <TableCell>${article.costo_alquiler_dia}</TableCell>
                <TableCell>{article.fecha_adquisicion ? new Date(article.fecha_adquisicion).toLocaleDateString() : ''}</TableCell>
                <TableCell>{article.imagen_url}</TableCell>
                <TableCell>{article.notas}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(article)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(article)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar el artículo "{selectedArticle?.nombre}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Articles;