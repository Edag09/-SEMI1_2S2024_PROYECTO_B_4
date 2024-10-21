const mysql = require("mysql2/promise"); // Usamos mysql2 con promesas para facilitar el uso de async/await

class Database {
  constructor() {
    this.db = null;
  }

  // Conectar a la base de datos MySQL
  async connect() {
    if (!this.db) {
      this.db = await mysql.createConnection({
        host: "bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "*Semi1_Practica1*",
        database: "mediSync",
      });
    }
  }

  // Obtener todos los usuarios
  async getAllUsuarios() {
    await this.connect();
    const [usuarios] = await this.db.query("SELECT * FROM usuarios");
    return usuarios;
  }

  // Obtener un usuario por ID
  async getUsuarioById(id) {
    await this.connect();
    const [usuario] = await this.db.query(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    return usuario[0];
  }

  // Crear un nuevo usuario
  async createUsuario(
    nombre,
    apellido,
    correo,
    contrasena,
    telefono,
    direccion,
    imagen_ruta,
    id_rol
  ) {
    await this.connect();
    console.log("nombre", nombre);
    const query = `
            INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, direccion, imagen_ruta, id_rol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    await this.db.execute(query, [
      nombre,
      apellido,
      correo,
      contrasena,
      telefono,
      direccion,
      imagen_ruta,
      id_rol,
    ]);
  }

  // Actualizar un usuario
  async updateUsuario(
    id,
    nombre,
    apellido,
    correo,
    telefono,
    direccion,
    imagen_ruta,
    id_rol
  ) {
    await this.connect();
    const query = `
            UPDATE usuarios 
            SET nombre=?, apellido=?, correo=?, telefono=?, direccion=?, imagen_ruta=?, id_rol=?
            WHERE id=?
        `;
    await this.db.execute(query, [
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      imagen_ruta,
      id_rol,
      id,
    ]);
  }

  // Eliminar un usuario
  async deleteUsuario(id) {
    await this.connect();
    await this.db.execute("DELETE FROM usuarios WHERE id = ?", [id]);
  }

  // Obtener todas las citas
  async getCitas() {
    await this.connect();
    const [citas] = await this.db.query("SELECT * FROM citas");
    return citas;
  }

  // Obtener una cita por ID
  async getCitaById(id) {
    await this.connect();
    const [cita] = await this.db.query("SELECT * FROM citas WHERE id = ?", [
      id,
    ]);
    return cita[0];
  }

  // Crear una nueva cita
  async createCita(id_paciente, id_medico, fecha_cita, motivo_cita) {
    await this.connect();
    const query = `
            INSERT INTO citas (id_paciente, id_medico, fecha_cita, motivo_cita)
            VALUES (?, ?, ?, ?)
        `;
    await this.db.execute(query, [
      id_paciente,
      id_medico,
      fecha_cita,
      motivo_cita,
    ]);
  }

  // Actualizar una cita
  async updateCita(
    id,
    id_paciente,
    id_medico,
    fecha_cita,
    motivo_cita,
    estado
  ) {
    await this.connect();
    const query = `
            UPDATE citas 
            SET id_paciente=?, id_medico=?, fecha_cita=?, motivo_cita=?, estado=?
            WHERE id=?
        `;
    await this.db.execute(query, [
      id_paciente,
      id_medico,
      fecha_cita,
      motivo_cita,
      estado,
      id,
    ]);
  }

  // Eliminar una cita
  async deleteCita(id) {
    await this.connect();
    await this.db.execute("DELETE FROM citas WHERE id = ?", [id]);
  }

  // Login de usuario
  async login(correo, contrasena) {
    await this.connect();
    const [usuario] = await this.db.query(
      "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
      [correo, contrasena]
    );
    return usuario[0];
  }
}

module.exports = Database;
