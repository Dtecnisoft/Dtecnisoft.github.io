const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let usuarios = {}; // Simulando una base de datos

// Endpoint para registrar usuarios
app.post('/registrar', (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (usuarios[username]) {
        return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    }
    usuarios[username] = { password, email };
    res.status(201).json({ message: 'Usuario registrado con éxito.' });
});

// Endpoint para iniciar sesión
app.post('/iniciar-sesion', (req, res) => {
    const { username, password } = req.body;
    if (!usuarios[username] || usuarios[username].password !== password) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso.', username });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

const cors = require('cors');
app.use(cors({ origin: '*' }));

