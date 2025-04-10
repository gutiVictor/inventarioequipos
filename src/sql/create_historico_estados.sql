CREATE TABLE IF NOT EXISTS historico_estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    articulo_id INT NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    motivo TEXT,
    FOREIGN KEY (articulo_id) REFERENCES articulos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);