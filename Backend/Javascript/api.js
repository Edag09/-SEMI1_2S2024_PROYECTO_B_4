const express = require('express');
const cors = require('cors');
const app = express();

// Habilitar CORS
app.use(cors());

// Ruta GET para la página principal
app.get('/', (req, res) => {
    res.send("Hello World");
});

// Iniciar el servidor en el puerto 5000
const port = 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
