const express = require('express');
const mysql = require('mysql2/promise'); // Cliente MySQL con soporte async/await
const path = require('path');
const os = require('os');

const app = express();
const port = 80;
const serverName = os.hostname();

// Configuración de la conexión a MySQL (RDS)
const dbConfig = {
    host: 'mascoteriadb.cztu0ubrlis0.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'W18lmy301AZEB9d2TEWH',
    database: 'MascoteriaDB'
};

// Middleware para parsear JSON
app.use(express.json());

let connection;

// Conectar a la base de datos
async function connectToDatabase() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexión a MySQL establecida correctamente.');
    } catch (err) {
        console.error('Error al conectar a MySQL:', err.message);
        process.exit(1);
    }
}

connectToDatabase();

// --- Rutas de la API ---

// GET: Obtener todas las mascotas
app.get('/api/pets', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM Mascotas ORDER BY Id');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener mascotas:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener mascotas.', error: err.message });
    }
});

// POST: Añadir una nueva mascota
app.post('/api/pets', async (req, res) => {
    const { Nombre, Tipo, Edad, Raza } = req.body;

    if (!Nombre || !Tipo || typeof Edad === 'undefined') {
        return res.status(400).json({ message: 'Los campos Nombre, Tipo y Edad son obligatorios.' });
    }

    try {
        const [result] = await connection.execute(
            'INSERT INTO Mascotas (Nombre, Tipo, Edad, Raza) VALUES (?, ?, ?, ?)',
            [Nombre, Tipo, Edad, Raza || null]
        );

        res.status(201).json({ id: result.insertId, Nombre, Tipo, Edad, Raza, message: 'Mascota añadida con éxito.' });
    } catch (err) {
        console.error('Error al añadir mascota:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al añadir mascota.', error: err.message });
    }
});

// GET: Obtener el nombre o la IP del servidor
app.get('/api/server-info', (req, res) => {
    res.json({
        serverName: serverName,
        message: `¡Hola desde el servidor ${serverName}!`
    });
});

// --- Servir frontend estático ---
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor de Mascotería escuchando en http://localhost:${port}`);
});

// Cerrar conexión al finalizar
process.on('SIGINT', async () => {
    if (connection) {
        await connection.end();
        console.log('Conexión a MySQL cerrada. Saliendo de la aplicación.');
    }
    process.exit(0);
});
