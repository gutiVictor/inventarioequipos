// components/Reports.jsx
import { useState } from 'react';
import { 
  Box, Tabs, Tab, Paper, Typography, 
  TextField, Button, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Print, PictureAsPdf, GridOn } from '@mui/icons-material';

const reportTypes = [
  { label: 'Financieros', value: 'financial' },
  { label: 'Operaciones', value: 'operations' },
  { label: 'Mantenimiento', value: 'maintenance' },
  { label: 'Clientes', value: 'clients' },
  { label: 'Inventario', value: 'inventory' }
];

const financialReports = [
  { id: 1, name: 'Ingresos por período', description: 'Ingresos generados por alquileres' },
  { id: 2, name: 'Depósitos vs multas', description: 'Comparación entre depósitos y multas' },
  { id: 3, name: 'Pagos pendientes', description: 'Clientes con saldos por pagar' }
];

function Reports() {
  const [activeTab, setActiveTab] = useState('financial');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedReport(null);
  };

  const generateReport = () => {
    // Lógica para generar el reporte
    console.log('Generando reporte:', selectedReport, startDate, endDate);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reportes del Sistema
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {reportTypes.map((report) => (
            <Tab key={report.value} label={report.label} value={report.value} />
          ))}
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Seleccionar Reporte
            </Typography>
            
            {activeTab === 'financial' && (
              <Box>
                {financialReports.map((report) => (
                  <Paper 
                    key={report.id} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      cursor: 'pointer',
                      backgroundColor: selectedReport?.id === report.id ? '#f5f5f5' : 'inherit'
                    }}
                    onClick={() => setSelectedReport(report)}
                  >
                    <Typography variant="subtitle1">{report.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
            
            {/* Agregar otras categorías de reportes aquí */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {selectedReport ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedReport.name}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <DatePicker
                    label="Fecha inicial"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  
                  <DatePicker
                    label="Fecha final"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<GridOn />}
                    onClick={generateReport}
                  >
                    Generar Reporte
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<PictureAsPdf />}
                    disabled={!selectedReport}
                  >
                    Exportar PDF
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<Print />}
                    disabled={!selectedReport}
                  >
                    Imprimir
                  </Button>
                </Box>
                
                {/* Aquí iría la visualización del reporte */}
                <Paper sx={{ p: 2, minHeight: '300px' }}>
                  <Typography>Vista previa del reporte seleccionado</Typography>
                  
                  {/* Ejemplo de tabla de reporte */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Artículo</TableCell>
                          <TableCell align="right">Alquileres</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Taladro Industrial</TableCell>
                          <TableCell align="right">5</TableCell>
                          <TableCell align="right">$250,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            ) : (
              <Typography>Seleccione un reporte de la lista</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;