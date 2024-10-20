import mysql.connector
from flask import current_app

class Database:
    def __init__(self):
        self.db = None

    def connect(self):
        if self.db is None or not self.db.is_connected():
            self.db = mysql.connector.connect(
                host=current_app.config['MYSQL_HOST'],
                user=current_app.config['MYSQL_USER'],
                password=current_app.config['MYSQL_PASSWORD'],
                database=current_app.config['MYSQL_DB']
            )

    def get_all_usuarios(self):
        self.connect()
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios")
        usuarios = cursor.fetchall()
        cursor.close()
        return usuarios

    def get_usuario_by_id(self, id):
        self.connect()
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
        usuario = cursor.fetchone()
        cursor.close()
        return usuario

    def create_usuario(self, nombre, apellido, correo, contrasena, telefono, direccion, imagen_ruta, id_rol):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("""
            INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, direccion, imagen_ruta, id_rol)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (nombre, apellido, correo, contrasena, telefono, direccion, imagen_ruta, id_rol))
        self.db.commit()
        cursor.close()

    def update_usuario(self, id, nombre, apellido, correo, telefono, direccion, imagen_ruta, id_rol):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("""
            UPDATE usuarios 
            SET nombre=%s, apellido=%s, correo=%s, telefono=%s, direccion=%s, imagen_ruta=%s, id_rol=%s
            WHERE id=%s
        """, (nombre, apellido, correo, telefono, direccion, imagen_ruta, id_rol, id))
        self.db.commit()
        cursor.close()

    def delete_usuario(self, id):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
        self.db.commit()
        cursor.close()

    # =========================
    # Funciones para Citas
    # =========================

    def get_citas(self):
        self.connect()
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM citas")
        citas = cursor.fetchall()
        cursor.close()
        return citas

    def get_cita_by_id(self, id):
        self.connect()
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM citas WHERE id = %s", (id,))
        cita = cursor.fetchone()
        cursor.close()
        return cita

    def create_cita(self, id_paciente, id_medico, fecha_cita, motivo_cita):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("""
            INSERT INTO citas (id_paciente, id_medico, fecha_cita, motivo_cita) 
            VALUES (%s, %s, %s, %s)
        """, (id_paciente, id_medico, fecha_cita, motivo_cita))
        self.db.commit()
        cursor.close()

    def update_cita(self, id, id_paciente, id_medico, fecha_cita, motivo_cita, estado):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("""
            UPDATE citas 
            SET id_paciente=%s, id_medico=%s, fecha_cita=%s, motivo_cita=%s, estado=%s
            WHERE id=%s
        """, (id_paciente, id_medico, fecha_cita, motivo_cita, estado, id))
        self.db.commit()
        cursor.close()

    def delete_cita(self, id):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM citas WHERE id = %s", (id,))
        self.db.commit()
        cursor.close()