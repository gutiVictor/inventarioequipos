-- Test INSERT statement for articulos table
INSERT INTO articulos (
    nombre,
    codigo_barras,
    categoria_id,
    sucursal_id,
    estado,
    costo_alquiler_dia,
    fecha_adquisicion,
    imagen_url,
    notas
) VALUES (
    'Taladro Percutor Industrial',
    'TLD2024001',
    1,  -- Asume que existe una categoría con ID 1
    1,  -- Asume que existe una sucursal con ID 1
    'disponible',
    75.50,
    '2024-01-25',
    'https://ejemplo.com/taladro.jpg',
    'Taladro profesional para uso industrial, incluye maletín y accesorios'
);

-- Verificar la inserción
SELECT * FROM articulos WHERE codigo_barras = 'TLD2024001';