import { Box, Grid, Paper, Typography, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    availableEquipment: 0,
    rentedEquipment: 0,
    todayRentals: 0,
    todayReturns: 0,
    pendingReservations: 0,
    maintenanceAlerts: 0
  });

  const [upcomingReturns, setUpcomingReturns] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener todos los equipos primero
        const equipmentResponse = await axios.get('http://localhost:3006/api/articulos');
        setEquipments(equipmentResponse.data);

        // 2. Calcular estadísticas básicas
        const availableEquipment = equipmentResponse.data.filter(item => item.estado === 'disponible').length;
        const rentedEquipment = equipmentResponse.data.filter(item => item.estado === 'alquilado').length;

        // 3. Obtener alquileres
        const rentalsResponse = await axios.get('http://localhost:3006/api/alquileres');
        const today = new Date().toISOString().split('T')[0];
        const todayRentals = rentalsResponse.data.filter(rental => 
          rental.fecha_inicio.split('T')[0] === today && rental.estado === 'activo'
        ).length;
        const todayReturns = rentalsResponse.data.filter(rental =>
          rental.fecha_fin.split('T')[0] === today && rental.estado === 'activo'
        ).length;

        // 4. Obtener reservas pendientes
        const reservationsResponse = await axios.get('http://localhost:3006/api/reservas');
        const pendingReservations = reservationsResponse.data.filter(reservation =>
          reservation.estado === 'pendiente'
        ).length;

        // 5. Obtener mantenimientos
        const maintenanceResponse = await axios.get('http://localhost:3006/api/mantenimientos');
        const maintenanceAlerts = maintenanceResponse.data.filter(item => 
          item.estado === 'pendiente'
        ).length;

        // 6. Procesar próximas devoluciones (próximos 3 días)
        const upcoming = rentalsResponse.data.filter(rental => {
          const returnDate = new Date(rental.fecha_fin);
          const today = new Date();
          const diffTime = returnDate - today;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 3 && diffDays >= 0 && rental.estado === 'activo';
        });

        // Enriquecer devoluciones con nombres de clientes
        const clientsResponse = await axios.get('http://localhost:3006/api/clientes');
        const enrichedReturns = upcoming.map(returnItem => {
          const client = clientsResponse.data.find(c => c.id === returnItem.cliente_id);
          const equipment = equipmentResponse.data.find(e => e.id === returnItem.articulo_id);
          return {
            ...returnItem,
            clientName: client ? `${client.nombre} ${client.apellido || ''}` : 'Cliente desconocido',
            equipmentName: equipment ? equipment.nombre : 'Equipo desconocido'
          };
        });

        // 7. Procesar mantenimientos activos
        const activeMaintenance = maintenanceResponse.data.filter(item => 
          item.estado === 'en proceso' || item.estado === 'pendiente'
        );

        // Enriquecer mantenimientos con nombres de equipos
        const enrichedMaintenance = activeMaintenance.map(maint => {
          const equipment = equipmentResponse.data.find(e => e.id === maint.articulo_id);
          return {
            ...maint,
            equipmentName: equipment ? equipment.nombre : 'Equipo desconocido',
            equipmentCategory: equipment ? 
              (equipment.categoria_id === 1 ? 'Máquina verde' : 
               equipment.categoria_id === 3 ? 'Máquina ensamble roja' : 
               equipment.categoria_id === 5 ? 'Andamios' : 'Otra categoría') : 'Sin categoría'
          };
        });

        // Actualizar todos los estados
        setStats({
          availableEquipment,
          rentedEquipment,
          todayRentals,
          todayReturns,
          pendingReservations,
          maintenanceAlerts
        });
        setUpcomingReturns(enrichedReturns);
        setMaintenanceList(enrichedMaintenance);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Actualizar cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  const kpiData = [
    { 
      title: "Equipos Disponibles", 
      value: stats.availableEquipment,
      color: "#e3f2fd",
      icon: "🛠️",
      tooltip: "Equipos disponibles para alquilar"
    },
    { 
      title: "Equipos Alquilados", 
      value: stats.rentedEquipment,
      color: "#fff3e0",
      icon: "📊",
      tooltip: "Equipos actualmente alquilados"
    },
    { 
      title: "Alquileres Hoy", 
      value: stats.todayRentals,
      color: "#f3e5f5",
      icon: "📅",
      tooltip: "Alquileres registrados hoy"
    },
    { 
      title: "Devoluciones Hoy", 
      value: stats.todayReturns,
      color: "#e8f5e9",
      icon: "⏱️",
      tooltip: "Equipos que deben devolverse hoy"
    },
    { 
      title: "Reservas Pendientes", 
      value: stats.pendingReservations,
      color: "#fce4ec",
      icon: "📌",
      tooltip: "Reservaciones pendientes de confirmación"
    },
    { 
      title: "Alertas Mantenimiento", 
      value: stats.maintenanceAlerts,
      color: "#ffebee",
      icon: "⚠️",
      tooltip: "Equipos que requieren mantenimiento"
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando datos del dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Panel de Control - Sistema de Alquiler
      </Typography>
      
      <Grid container spacing={3}>
        {/* KPIs principales */}
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tooltip title={kpi.tooltip}>
              <Paper sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: kpi.color,
                minHeight: '150px',
                justifyContent: 'center',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {kpi.icon} {kpi.title}
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                  {kpi.value}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
        
        {/* Sección de Próximas Devoluciones */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Próximas Devoluciones (3 días)
            </Typography>
            {upcomingReturns.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {upcomingReturns.map((item, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <Typography>
                      <strong>Equipo:</strong> {item.equipmentName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Cliente:</strong> {item.clientName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Devuelve:</strong> {new Date(item.fecha_fin).toLocaleDateString()}
                    </Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay devoluciones próximas en los próximos 3 días
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Sección de Mantenimientos Activos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Mantenimientos Activos
            </Typography>
            {maintenanceList.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {maintenanceList.map((item, index) => (
                  <li key={index} style={{ marginBottom: '15px' }}>
                    <Typography>
                      <strong>Equipo:</strong> {item.equipmentName} ({item.equipmentCategory})
                    </Typography>
                    <Typography variant="body2">
                      <strong>Estado:</strong> {item.estado} | 
                      <strong> Finaliza:</strong> {item.fecha_fin ? new Date(item.fecha_fin).toLocaleDateString() : 'Sin fecha'}
                    </Typography>
                    {item.descripcion && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Descripción:</strong> {item.descripcion}
                      </Typography>
                    )}
                    {item.tecnico && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Técnico:</strong> {item.tecnico}
                      </Typography>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No hay mantenimientos activos
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;