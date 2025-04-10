-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-04-2025 a las 19:58:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_alquiler_maquinaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alquileres`
--

CREATE TABLE `alquileres` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL COMMENT 'empleado que registró el alquiler',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` varchar(20) NOT NULL COMMENT 'activo, finalizado, cancelado',
  `total` decimal(10,2) NOT NULL,
  `deposito` decimal(10,2) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alquileres`
--

INSERT INTO `alquileres` (`id`, `cliente_id`, `usuario_id`, `fecha_inicio`, `fecha_fin`, `estado`, `total`, `deposito`, `notas`, `fecha_registro`) VALUES
(1, 5, 1, '2025-04-01', '2025-04-04', 'activo', 250000.00, 15555.00, 'saldo 5500', '2025-04-04 13:00:48'),
(2, 5, 1, '2025-04-01', '2025-04-04', 'activo', 44450000.00, 44415555.00, 'saldo 445500', '2025-04-04 14:08:38'),
(3, 5, 1, '2025-04-01', '2025-04-04', 'activo', 880.00, 8855.00, 'saldo 4800', '2025-04-04 14:10:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alquiler_detalles`
--

CREATE TABLE `alquiler_detalles` (
  `id` int(11) NOT NULL,
  `alquiler_id` int(11) NOT NULL,
  `articulo_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL,
  `devuelto` tinyint(1) DEFAULT 0,
  `fecha_devolucion` date DEFAULT NULL,
  `multa` decimal(10,2) DEFAULT 0.00,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alquiler_detalles`
--

INSERT INTO `alquiler_detalles` (`id`, `alquiler_id`, `articulo_id`, `cantidad`, `precio_unitario`, `devuelto`, `fecha_devolucion`, `multa`, `observaciones`) VALUES
(1, 1, 2, 1, 77700.00, 1, '2025-04-06', 100.00, 'esntrega a tiempo'),
(2, 2, 2, 1, 66600.00, 1, '2025-04-06', 55500.00, 'esntrega a tiempo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos`
--

CREATE TABLE `articulos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo_barras` varchar(50) DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `sucursal_id` int(11) DEFAULT NULL,
  `estado` varchar(20) NOT NULL COMMENT 'disponible, alquilado, mantenimiento, dañado',
  `costo_alquiler_dia` decimal(10,2) NOT NULL,
  `fecha_adquisicion` date DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `articulos`
--

INSERT INTO `articulos` (`id`, `nombre`, `codigo_barras`, `categoria_id`, `sucursal_id`, `estado`, `costo_alquiler_dia`, `fecha_adquisicion`, `imagen_url`, `notas`) VALUES
(1, 'taladro', '77777', 1, 2, 'Bueno', 12000.00, NULL, NULL, 'entrga lunes'),
(2, 'Taladro Industrial', 'zzzzzz', 1, 1, 'disponible', 25.50, '2024-01-20', ' https://ejemplo.com/imagen.jpg ', 'Taladro en excelente estado'),
(3, 'Taladro Industrial', 'yyyyy', 1, 1, 'disponible', 25.50, '2024-01-20', ' https://ejemplo.com/imagen.jpg ', 'Taladro en excelente estado'),
(4, 'pulidora', '896541', 3, 1, 'pendiente', 456897.00, '2025-04-01', NULL, 'excelemte maquina');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL COMMENT 'Excavadoras, Andamios, Herramientas Eléctricas',
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'maquina verde', 'maquinaria pesada para trabajo en arenales'),
(3, 'maquina emsanble roja', 'maquinaria libiana pequeña'),
(5, 'Andamios', 'en metal varios cuerpos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `cedula` int(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `apellido`, `cedula`, `telefono`, `email`, `direccion`, `fecha_registro`) VALUES
(4, 'Andres', 'Gutierrez', 1025551055, '32058978', 'andr@gmail.com', 'B/Colombia', '2025-04-02 00:45:11'),
(5, 'Allisson', 'Gutierrez cardenas', 10556987, '36987452', 'alli@gmail.com', 'Amenis Quindio b/ universal manzana 9 casa 4', '2025-04-02 12:58:17'),
(8, 'Aura Maria ', 'Cardenas Bustos', 41961730, '3102668747', 'aura@mail.com', 'vichada', '2025-04-02 14:23:12'),
(9, 'Victor', NULL, NULL, '3218907254', 'gutierrezsanabria@gmail.com', 'B/ UNIVERSAL\nMANZANA 9 CASA 4', '2025-04-08 17:41:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historico_estados`
--

CREATE TABLE `historico_estados` (
  `id` int(11) NOT NULL,
  `articulo_id` int(11) NOT NULL,
  `estado_anterior` varchar(20) DEFAULT NULL,
  `estado_nuevo` varchar(20) NOT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) DEFAULT NULL COMMENT 'quien realizó el cambio',
  `motivo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historico_estados`
--

INSERT INTO `historico_estados` (`id`, `articulo_id`, `estado_anterior`, `estado_nuevo`, `fecha_cambio`, `usuario_id`, `motivo`) VALUES
(1, 2, 'Activo', 'Inactivo', '2025-04-07 14:21:32', 1, 'entrega fuera de tiempo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mantenimientos`
--

CREATE TABLE `mantenimientos` (
  `id` int(11) NOT NULL,
  `articulo_id` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `tecnico` varchar(100) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL COMMENT 'pendiente, en_proceso, completado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mantenimientos`
--

INSERT INTO `mantenimientos` (`id`, `articulo_id`, `fecha_inicio`, `fecha_fin`, `costo`, `descripcion`, `tecnico`, `estado`) VALUES
(1, 2, '2025-04-01', '2025-04-09', 25000.00, 'mantenimiento preventivo y correctivo', 'Audaviall', 'en proceso'),
(2, 2, '2025-04-01', '2025-04-09', 25000.00, 'mantenimiento preventivo y correctivo', 'Audaviall', 'en ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `alquiler_id` int(11) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL COMMENT 'efectivo, tarjeta, transferencia',
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `articulo_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `fecha_reserva` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` varchar(20) NOT NULL COMMENT 'pendiente, confirmada, cancelada',
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `articulo_id`, `cliente_id`, `fecha_reserva`, `fecha_inicio`, `fecha_fin`, `estado`, `notas`) VALUES
(1, 2, 4, '2025-04-07 13:09:52', '2025-04-09', '2025-04-09', 'pendiente', 'para alquiler'),
(2, 1, 8, '2025-04-06 13:11:28', '2025-04-09', '2025-04-17', 'cancelada', 'para despacho'),
(3, 4, 4, '2025-04-08 13:33:02', '2025-04-08', '2025-04-10', 'pendiente', 'maquinas para prestamo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id`, `nombre`, `direccion`, `telefono`, `email`) VALUES
(1, 'Barranquilla', 'calle la soledad', '321879564', 'barra@gmail.com'),
(2, 'lilia', 'colombina', '456789123', 'colo@gmail.com'),
(3, 'Cardenasguti', NULL, NULL, 'guti@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL COMMENT 'admin, almacen, ventas',
  `sucursal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password_hash`, `rol`, `sucursal_id`) VALUES
(1, 'lilia Sofia', 'lilia@gmail.com', '123', 'admin', 1),
(2, 'lilia Sofiaas sanabria', 'lilsdsareetergia@gmail.com', '123', 'admin', NULL),
(3, 'sanabria', 'etergia@gmail.com', '$2b$10$D1/nZnIsLca34fB1qOlrp.FFLg8fMYvgTelD4hJy5mNeK1590jjL2', 'admin', NULL),
(4, 'Cardenas', 'cardenas@gmail.com', '$2b$10$VPvsU5q6XiMyY.5g3YtIw.4KGpLX4h.S/gu.8VHwLy/q4KN9MQEGa', 'admin', NULL),
(5, 'Cardenasguti', 'guti@gmail.com', '$2b$10$kziYTuHrxKXd3Ec2s47YhehcqdshrhSHlji1ohAtCAaEFYqLYL35G', 'admin', NULL),
(6, 'Caridenasguti', 'gutii@gmail.com', '$2b$10$TCx989bCD30TOj7IkvlHwuM4BLVmSj.Pm6v4eik.g250wDqm9zRVW', 'admin', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alquileres`
--
ALTER TABLE `alquileres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `alquiler_detalles`
--
ALTER TABLE `alquiler_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alquiler_id` (`alquiler_id`),
  ADD KEY `articulo_id` (`articulo_id`);

--
-- Indices de la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_barras` (`codigo_barras`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `sucursal_id` (`sucursal_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historico_estados`
--
ALTER TABLE `historico_estados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `articulo_id` (`articulo_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `articulo_id` (`articulo_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alquiler_id` (`alquiler_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `articulo_id` (`articulo_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuario_sucursal` (`sucursal_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alquileres`
--
ALTER TABLE `alquileres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `alquiler_detalles`
--
ALTER TABLE `alquiler_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `historico_estados`
--
ALTER TABLE `historico_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alquileres`
--
ALTER TABLE `alquileres`
  ADD CONSTRAINT `alquileres_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `alquileres_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `alquiler_detalles`
--
ALTER TABLE `alquiler_detalles`
  ADD CONSTRAINT `alquiler_detalles_ibfk_1` FOREIGN KEY (`alquiler_id`) REFERENCES `alquileres` (`id`),
  ADD CONSTRAINT `alquiler_detalles_ibfk_2` FOREIGN KEY (`articulo_id`) REFERENCES `articulos` (`id`);

--
-- Filtros para la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD CONSTRAINT `articulos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `articulos_ibfk_2` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `historico_estados`
--
ALTER TABLE `historico_estados`
  ADD CONSTRAINT `historico_estados_ibfk_1` FOREIGN KEY (`articulo_id`) REFERENCES `articulos` (`id`),
  ADD CONSTRAINT `historico_estados_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  ADD CONSTRAINT `mantenimientos_ibfk_1` FOREIGN KEY (`articulo_id`) REFERENCES `articulos` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`alquiler_id`) REFERENCES `alquileres` (`id`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`articulo_id`) REFERENCES `articulos` (`id`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`),
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
