// Importa las dependencias necesarias
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2/promise');

// Configura la conexión con la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'login',
  password: 'K4NAEriol89720ryok4naeDSBAA4378monday'
});

// Middleware para interpretar los datos en formato JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a nuestro sistema de autenticación!');
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    // Verifica que ambos campos estén presentes
    if (!usuario || !clave) {
      return res.status(400).send('Debe proporcionar un usuario y una contraseña.');
    }

    // Inserta el nuevo usuario en la base de datos
    const [result] = await connection.query(
      'INSERT INTO usuarios (usuario, clave) VALUES (?, ?)',
      [usuario, clave]
    );

    res.status(201).send('Usuario registrado exitosamente.');
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).send('Error en el servidor al registrar el usuario.');
  }
});

// Ruta para el inicio de sesión
app.post('/login', async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    // Consulta para verificar usuario y clave en la base de datos
    const [results] = await connection.query(
      'SELECT * FROM usuarios WHERE usuario = ? AND clave = ?',
      [usuario, clave]
    );

    if (results.length > 0) {
      res.status(200).send('Inicio de sesión exitoso.');
    } else {
      res.status(401).send('Datos incorrectos. Intente de nuevo.');
    }
  } catch (err) {
    console.error('Error en el inicio de sesión:', err);
    res.status(500).send('Error en el servidor.');
  }
});

// Ruta para validar la sesión (puedes expandir esta funcionalidad)
app.get('/validar', (req, res) => {
  res.send('Sesión validada');
});

// Configuración del servidor para que escuche en el puerto especificado
app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});
