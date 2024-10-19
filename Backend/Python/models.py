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

    def add_cita(self, id_paciente, id_medico, fecha_cita, motivo_cita):
        self.connect()
        cursor = self.db.cursor()
        cursor.execute("INSERT INTO citas (id_paciente, id_medico, fecha_cita, motivo_cita) VALUES (%s, %s, %s, %s)",
                       (id_paciente, id_medico, fecha_cita, motivo_cita))
        self.db.commit()
        cursor.close()

    def get_citas(self):
        self.connect()
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM citas")
        citas = cursor.fetchall()
        cursor.close()
        return citas
