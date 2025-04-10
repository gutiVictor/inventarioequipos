-- SQL Insert statement for 'articulos' table
-- Fields:
-- id: int(11) AUTO_INCREMENT
-- nombre: varchar(100) NOT NULL
-- codigo_barras: varchar(50) NULL
-- categoria_id: int(11) NULL
-- sucursal_id: int(11) NULL
-- estado: varchar(20) NOT NULL (disponible, alquilado, mantenimiento, dañado)
-- costo_alquiler_dia: decimal(10,2) NOT NULL
-- fecha_adquisicion: date NULL
-- imagen_url: varchar(255) NULL
-- notas: text NULL

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
    'Ejemplo Artículo',
    '123456789',
    1,
    1,
    'disponible',
    50.00,
    '2024-01-20',
    'https://ejemplo.com/imagen.jpg',
    'Notas de ejemplo para el artículo'
);