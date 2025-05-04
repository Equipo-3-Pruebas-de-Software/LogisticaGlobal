-- Base de datos
CREATE DATABASE IF NOT EXISTS incidentesdb;
USE incidentesdb;

-- Tabla de Técnicos
CREATE TABLE IF NOT EXISTS tecnicos (
    rut VARCHAR(20) NOT NULL, 
    nombre TEXT, 
    disponibilidad TINYINT(1), 
    clave VARCHAR(255) NOT NULL, -- Campo para la contraseña
    PRIMARY KEY (rut)
);

INSERT IGNORE INTO tecnicos (rut, nombre, disponibilidad, clave) VALUES
('12345678-9', 'Juan Perez', 1, 'clave123'),
('98765432-1', 'Maria Lopez', 0, 'password456'),
('11223344-5', 'Carlos Gonzalez', 1, 'tecnico789'),
('55667788-0', 'Ana Torres', 1, 'clave456'),
('99887766-4', 'Luis Ramirez', 0, 'tecnico123');

-- Tabla de Supervisores
CREATE TABLE IF NOT EXISTS supervisores (
    rut VARCHAR(20) NOT NULL,
    nombre TEXT,
    firma TEXT, 
    clave VARCHAR(255) NOT NULL, -- Campo para la contraseña
    PRIMARY KEY (rut)
);

INSERT IGNORE INTO supervisores (rut, nombre, firma, clave) VALUES
('12345677-9', 'Juan Perez', 'firma1', 'clave123'),
('98765433-1', 'Maria Lopez', 'firma2', 'password456'),
('11223345-5', 'Carlos Gonzalez', 'firma3', 'tecnico789'),
('55667789-0', 'Ana Torres', 'firma4', 'clave456'),
('99887767-4', 'Luis Ramirez', 'firma5', 'tecnico123');

-- Tabla de Jefes de Turno
CREATE TABLE IF NOT EXISTS jefes_turno (
    rut VARCHAR(20) NOT NULL,
    nombre TEXT NOT NULL,
    clave VARCHAR(255) NOT NULL, -- Campo para la contraseña
    PRIMARY KEY (rut)
);

INSERT IGNORE INTO jefes_turno (rut, nombre, clave) VALUES
('11111111-1', 'Juan Perez', 'clave123'),
('22222222-2', 'Maria Lopez', 'password456'),
('33333333-3', 'Carlos Gonzalez','tecnico789');

-- Tabla de Robots
CREATE TABLE IF NOT EXISTS robots (
    id_robot BIGINT NOT NULL,
    lugar_trabajo TEXT NOT NULL,
    estado TEXT NOT NULL,
    PRIMARY KEY (id_robot)
);

-- Insertar robots si no existen
INSERT IGNORE INTO robots (id_robot, lugar_trabajo, estado) VALUES
(1, 'Bodega', 'Operativo'),
(2, 'Pasillo 1', 'En Reperación'),
(3, 'Pasillo 2', 'Operativo'),
(4, 'Zona de Carga', 'Operativo'),
(5, 'Zona de Descarga', 'Fuera de Servicio'),
(6, 'Pasillo Norte', 'Fuera de Servicio');

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
INSERT IGNORE INTO incidentes (id_incidentes, supervisor_asignado, lugar, estado, prioridad, gravedad, fecha_creado, firmado, descripcion, fecha_tecnico_asignado, fecha_espera_aprovacion, fecha_resuelto) VALUES
(1, NULL, 'Pasillo 1', 'Creado', NULL, NULL, '2023-10-01 10:00:00', 0, 'Robot atascado en el pasillo.', NULL, NULL, NULL),
(2, NULL, 'Bodega', 'Creado', NULL, NULL, '2023-10-02 11:00:00', 1, 'Fuga de agua en la bodega.', NULL, NULL, NULL),
(3, NULL, 'Zona de Carga', 'Creado', NULL, NULL, '2023-10-03 12:00:00', 0, 'Robot no responde.', NULL, NULL, NULL),
(4, NULL, 'Zona de Descarga', 'Creado', NULL, NULL, '2023-10-04 13:00:00', 0, 'Problema de conexión con el robot.', NULL, NULL, NULL),
(5, NULL, 'Pasillo 2', 'Creado', NULL, NULL, '2023-10-05 14:00:00', 1, 'Robot en mantenimiento.', NULL, NULL, NULL);

-- Datos Iniciales para Relación entre Incidentes, Robots y Técnicos
INSERT IGNORE INTO incidentes_robots_tecnicos (id_robot, id_incidente, rut_tecnico, fecha_asignacion, descripcion) VALUES
(1, 1, '12345678-9', '2023-10-01 10:30:00', NULL),
(2, 1, '12345678-9', '2023-10-01 10:30:00', NULL),
(3, 2, '98765432-1', '2023-10-02 11:30:00', NULL),
(4, 3, '11223344-5', '2023-10-03 12:30:00', NULL),
(5, 4, '55667788-0', '2023-10-04 13:30:00', NULL),
(6, 5, '55667788-0', '2023-10-05 13:30:00', NULL);
