CREATE DATABASE IF NOT EXISTS incidentesdb;
USE incidentesdb;

-- Tabla de Técnicos
CREATE TABLE IF NOT EXISTS tecnicos (
    rut VARCHAR(20) NOT NULL, 
    nombre TEXT, 
    disponibilidad TINYINT(1), 
    clave VARCHAR(255) NOT NULL,
    PRIMARY KEY (rut)
);

INSERT IGNORE INTO tecnicos (rut, nombre, disponibilidad, clave) VALUES
('14856536-8', 'Juan Perez', 0, 'clave123'),
('12463595-0', 'Maria Lopez', 1, 'password456'),
('18066508-0', 'Carlos Gonzalez', 1, 'tecnico789'),
('19537462-7', 'Ana Torres', 1, 'clave456'),
('16876745-5', 'Luis Ramirez', 0, 'tecnico123'),
('14724848-2', 'Leonardo Sánchez', 0, 'clave123'),
('21740255-7', 'Gloria Torres', 1, 'password456'),
('22423038-9', 'Tomás Pizarro', 1, 'tecnico789'),
('18246428-7', 'María Gonzalez', 1, 'clave456'),
('20954773-2', 'Luis Castillo', 1, 'tecnico123');

-- Tabla de Supervisores
CREATE TABLE IF NOT EXISTS supervisores (
    rut VARCHAR(20) NOT NULL,
    nombre TEXT,
    firma TEXT, 
    clave VARCHAR(255) NOT NULL,
    PRIMARY KEY (rut)
);

INSERT IGNORE INTO supervisores (rut, nombre, firma, clave) VALUES
('12345677-9', 'Margarita Rodriguez', 'firma1', 'clave123'),
('98765433-1', 'Valentina Gonzalez', 'firma2', 'password456'),
('11223345-5', 'Nicolás Navarro', 'firma3', 'tecnico789'),
('55667789-0', 'Benjamín Soto', 'firma4', 'clave456'),
('99887767-4', 'Benjamín Castro', 'firma5', 'tecnico123');

-- Tabla de Jefes de Turno
CREATE TABLE IF NOT EXISTS jefes_turno (
    rut VARCHAR(20) NOT NULL,
    nombre TEXT NOT NULL,
    clave VARCHAR(255) NOT NULL,
    PRIMARY KEY (rut)
);

INSERT IGNORE INTO jefes_turno (rut, nombre, clave) VALUES
('11111111-1', 'Lucas Castro', 'clave123'),
('22222222-2', 'Bastián Gonzalez', 'password456'),
('33333333-3', 'Carlos Castillo', 'tecnico789');

-- Tabla de Robots
CREATE TABLE IF NOT EXISTS robots (
    id_robot BIGINT NOT NULL,
    lugar_trabajo TEXT NOT NULL,
    estado TEXT NOT NULL,
    PRIMARY KEY (id_robot)
);

INSERT IGNORE INTO robots (id_robot, lugar_trabajo, estado) VALUES
(1, 'Bodega Norte', 'fuera de servicio'),
(2, 'Pasillo 1', 'fuera de servicio'),
(3, 'Pasillo 2', 'fuera de servicio'),
(4, 'Zona de Carga', 'fuera de servicio'),
(5, 'Zona de Descarga', 'fuera de servicio'),
(6, 'Pasillo Norte', 'fuera de servicio'),
(7, 'Bodega Sur', 'operativo'),
(8, 'Pasillo 3', 'en reparación'),
(9, 'Pasillo 4', 'operativo'),
(10, 'Zona de Descarga', 'operativo'),
(11, 'Zona de Carga', 'operativo'),
(12, 'Pasillo Sur', 'operativo'),
(13, 'Pasillo Sur', 'en reparación'),
-- Robot nuevo para pruebas:
(1001, 'Pasillo 8', 'en reparación');

-- Tabla de Incidentes
CREATE TABLE IF NOT EXISTS incidentes (
    id_incidentes BIGINT NOT NULL AUTO_INCREMENT,
    supervisor_asignado VARCHAR(20),
    lugar TEXT,
    estado TEXT,
    prioridad INT,
    gravedad TEXT,
    fecha_creado TIMESTAMP,
    firmado TINYINT(1),
    descripcion LONGTEXT,
    fecha_tecnico_asignado TIMESTAMP,
    fecha_espera_aprovacion TIMESTAMP,
    fecha_resuelto TIMESTAMP,
    PRIMARY KEY (id_incidentes),
    FOREIGN KEY (supervisor_asignado) REFERENCES supervisores(rut)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tabla de relación entre incidentes, robots y técnicos
CREATE TABLE IF NOT EXISTS incidentes_robots_tecnicos (
    id_robot BIGINT NOT NULL,
    id_incidente BIGINT NOT NULL,
    rut_tecnico VARCHAR(20),
    fecha_asignacion TIMESTAMP,
    descripcion TEXT,
    PRIMARY KEY (id_robot, id_incidente),
    FOREIGN KEY (id_robot) REFERENCES robots(id_robot)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_incidente) REFERENCES incidentes(id_incidentes)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (rut_tecnico) REFERENCES tecnicos(rut)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Datos Iniciales para Incidentes
INSERT IGNORE INTO incidentes (
    id_incidentes, supervisor_asignado, lugar, estado, prioridad, gravedad, fecha_creado, firmado, descripcion, fecha_tecnico_asignado
) VALUES
(1, NULL, 'Pasillo 1', 'Técnico asignado', 2, 'alta', '2023-10-01 10:00:00', 0, 'Robot atascado en el pasillo.', '2023-10-02 09:30:00'),
(2, NULL, 'Bodega', 'Técnico asignado', 1, 'media', '2023-10-02 11:00:00', 0, 'Fuga de agua en la bodega.', '2023-10-03 10:51:00'),
(3, NULL, 'Zona de Carga', 'Técnico asignado', 3, 'baja', '2023-10-03 12:00:00', 0, 'Robot no responde.', '2023-10-04 11:11:00'),
(4, NULL, 'Zona de Descarga', 'Creado', NULL, NULL, '2023-10-04 13:00:00', 0, 'Problema de conexión con el robot.', NULL),
(5, NULL, 'Pasillo 2', 'Creado', NULL, NULL, '2023-10-05 14:00:00', 0, 'Robot en mantenimiento.', NULL),
-- Incidente nuevo para técnico de prueba:
(100, NULL, 'Pasillo 8', 'Técnico asignado', 2, 'media', NOW(), 0, 'Robot no se mueve', NOW());

-- Datos Iniciales de relaciones
INSERT IGNORE INTO incidentes_robots_tecnicos (id_robot, id_incidente, rut_tecnico, fecha_asignacion, descripcion) VALUES
(1, 1, "12463595-0", '2023-10-02 09:30:00', NULL),
(2, 1, '14724848-2', '2023-10-02 09:30:00', NULL),
(3, 2, "14856536-8", '2023-10-03 10:51:00', NULL),
(4, 3, "16876745-5", "2023-10-04 11:11:00", NULL),
(5, 4, NULL, NULL, NULL),
(6, 5, NULL, NULL, NULL),
-- Relación nueva para técnico de prueba
(1001, 100, '12463595-0', NOW(), NULL);
