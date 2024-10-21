const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const cognito = require("./cognito");

// Configuración de la base de datos
const Database = require("./models");
const db = new Database(); // Asegúrate de crear una instancia

const router = express.Router();
router.use(bodyParser.json());

// Configuración de AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});
const s3 = new AWS.S3();

// Función para subir un archivo a S3
const uploadFileToS3 = (filePath, nombre) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: "practica2-semi1-b-2s2024-imageness-g4",
    Key: nombre,
    Body: fileContent,
    ContentType: "image",
  };

  return s3
    .upload(params)
    .promise()
    .then((data) => {
      console.log("File uploaded successfully:", data.Location);
      return data.Location;
    })
    .catch((err) => {
      console.error("Error uploading file to S3:", err);
      throw err;
    });
};

// Funciones para manejar contraseñas (en lugar de Base64 usamos bcrypt)
const encodePassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const decodePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Definir rutas en lugar de escuchar el puerto

// Endpoint raíz
router.get("/", (req, res) => {
  res.json({ message: "Servidor JS" });
});

// Ver todos los usuarios
router.get("/select_usuarios", async (req, res) => {
  try {
    const usuarios = await db.getAllUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error fetching usuarios", error: err });
  }
});

// Ver un usuario por ID
router.get("/select_usuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await db.getUsuarioById(id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching usuario", error: err });
  }
});

// Crear un nuevo usuario
router.post("/create_usuario", async (req, res) => {
  const {
    nombre,
    apellido,
    correo,
    contrasena,
    telefono,
    direccion,
    imagen_ruta,
    id_rol,
  } = req.body;

  const imageFilePath = path.resolve(imagen_ruta); // Asegúrate de que esta ruta sea válida

  // Codifica la contraseña
  try {
    const hashedPassword = await encodePassword(contrasena);

    // Subir archivo a S3
    const split = path.basename(imagen_ruta).split(".");
    const nombre_foto = `Fotos_Perfil/${nombre}${apellido}${id_rol}.${split[1]}`;
    const url_foto = await uploadFileToS3(imageFilePath, nombre_foto);

    cognito.registrarUsuarioCognito(correo, contrasena, nombre);

    // Crear el usuario en la base de datos
    await db.createUsuario(
      nombre,
      apellido,
      correo,
      hashedPassword,
      telefono,
      direccion,
      url_foto,
      id_rol
    );

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    console.log(res.body);
    console.error(err);
    res.status(500).json({ message: "Error creando usuario", error: err });
  }
});

// Modificar un usuario
router.post("/update_usuario/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, telefono, direccion, imagen_ruta, id_rol } =
    req;
  try {
    await db.updateUsuario(
      id,
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      imagen_ruta,
      id_rol
    );
    res.json({ message: "Usuario actualizado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando usuario", error: err });
  }
});

// Eliminar un usuario
router.delete("/delete_usuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.deleteUsuario(id);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando usuario", error: err });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const usuario = await db.login(correo, contrasena);

    var result = cognito.autenticarUsuarioCognito(correo, contrasena);

    if (result == null) {
      res.status(406).json({ message: "Usuario no confirmado" });
    }

    if (usuario) {
      const match = await decodePassword(contrasena, usuario.contrasena);
      if (match) {
        res.json({ message: "Login exitoso" });
      } else {
        res.status(401).json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error en login", error: err });
  }
});

// Ver todas las citas
router.get("/select_citas", async (req, res) => {
  try {
    const citas = await db.getCitas();
    res.json(citas);
  } catch (err) {
    res.status(500).json({ message: "Error fetching citas", error: err });
  }
});

// Ver una cita por ID
router.get("/select_cita/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cita = await db.getCitaById(id);
    if (cita) {
      res.json(cita);
    } else {
      res.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching cita", error: err });
  }
});

// Crear una nueva cita
router.post("/create_citas", async (req, res) => {
  const { id_paciente, id_medico, fecha_cita, motivo_cita } = req.body;
  try {
    await db.createCita(id_paciente, id_medico, fecha_cita, motivo_cita);
    res.status(201).json({ message: "Cita creada exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error creando cita", error: err });
  }
});

// Modificar una cita
router.post("/update_citas/:id", async (req, res) => {
  const { id } = req.params;
  const { id_paciente, id_medico, fecha_cita, motivo_cita, estado } = req.body;
  try {
    await db.updateCita(
      id,
      id_paciente,
      id_medico,
      fecha_cita,
      motivo_cita,
      estado
    );
    res.json({ message: "Cita actualizada exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando cita", error: err });
  }
});

// Eliminar una cita
router.delete("/delete_citas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.deleteCita(id);
    res.json({ message: "Cita eliminada exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando cita", error: err });
  }
});

// Traductor
const translate = new AWS.Translate({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_TRANSLATOR,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TRANSLATOR,
  region: process.env.AWS_REGION_TRANSLATOR
});

router.post("/translate", async (req, res) => {
  const { text, sourceLanguage, targetLanguage } = req.body;

  if (!text || !sourceLanguage || !targetLanguage) {
    return res.status(400).json({ error: 'Faltan datos de entrada' });
  }

  const params = {
    Text: text,
    SourceLanguageCode: sourceLanguage,
    TargetLanguageCode: targetLanguage
  };

  try {
    const data = await translate.translateText(params).promise();
    return res.json({ translatedText: data.TranslatedText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error en la traducción' });
  }
});

const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_TRANSLATOR,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TRANSLATOR,
  region: process.env.AWS_REGION_TRANSLATOR
});

router.post('/speak', async (req, res) => {
  const { text } = req.body;

  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Mia',
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();
    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Length', data.AudioStream.length);
    res.send(data.AudioStream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el audio.' });
  }
});

module.exports = router;
