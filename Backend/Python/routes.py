from flask import Flask, jsonify, request
from models import Database

app = Flask(__name__)

# Configuración de la base de datos
app.config.from_object('config.Config')
db = Database()

# Endpoint raíz
@app.route('/')
def index():
    return jsonify({"message": "Server Python"}), 200

# Ruta para obtener todos los usuarios
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = db.get_all_usuarios()
    return jsonify(usuarios)

# Ruta para obtener un usuario por ID
@app.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    usuario = db.get_usuario_by_id(id)
    if usuario:
        return jsonify(usuario)
    return jsonify({"message": "Usuario no encontrado"}), 404

# Ruta para crear una cita
@app.route('/citas', methods=['POST'])
def create_cita():
    data = request.json
    db.add_cita(data['id_paciente'], data['id_medico'], data['fecha_cita'], data['motivo_cita'])
    return jsonify({"message": "Cita creada exitosamente"}), 201

# Ruta para obtener todas las citas
@app.route('/citas', methods=['GET'])
def get_citas():
    citas = db.get_citas()
    return jsonify(citas)

if __name__ == '__main__':
    app.run(debug=True)
