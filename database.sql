-- Script para crear la base de datos y la tabla de mascotas
-- Ejecuta este script en tu servidor MySQL (local, Docker o RDS)
-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS MascoteriaDB;
USE MascoteriaDB;
-- 2. Crear la tabla Mascotas si no existe
CREATE TABLE IF NOT EXISTS Mascotas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    -- ID auto-incrementable
    Nombre VARCHAR(50) NOT NULL,
    -- Nombre de la mascota
    Tipo VARCHAR(30) NOT NULL,
    -- Tipo de mascota (perro, gato, etc.)
    Edad INT,
    -- Edad en años
    Raza VARCHAR(50),
    -- Raza de la mascota
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del registro
);
-- 3. Insertar algunos datos de ejemplo para pruebas
INSERT INTO Mascotas (Nombre, Tipo, Edad, Raza)
VALUES ('Fido', 'Perro', 3, 'Labrador'),
    ('Mimi', 'Gato', 2, 'Siamés'),
    ('Rex', 'Perro', 5, 'Pastor Alemán');
SELECT *
FROM Mascotas;