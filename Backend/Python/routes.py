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

# Ver todos los usuarios
@app.route('/select_usuarios', methods=['GET'])
def get_usuarios():
    usuarios = db.get_all_usuarios()
    return jsonify(usuarios)

# Ver un usuario por ID
@app.route('/select_usuario/<int:id>', methods=['GET'])
def get_usuario(id):
    usuario = db.get_usuario_by_id(id)
    if usuario:
        return jsonify(usuario)
    return jsonify({"message": "Usuario no encontrado"}), 404

# Crear un nuevo usuario
@app.route('/create_usuario', methods=['POST'])
def create_usuario():
    data = request.json
    db.create_usuario(data['nombre'], data['apellido'], data['correo'], data['contrasena'], data.get('telefono'), data.get('direccion'), data.get('imagen_ruta'), data['id_rol'])
    return jsonify({"message": "Usuario creado exitosamente"}), 201

# Modificar un usuario
@app.route('/update_usuario/<int:id>', methods=['POST'])
def update_usuario(id):
    data = request.json
    db.update_usuario(id, data['nombre'], data['apellido'], data['correo'], data['telefono'], data['direccion'], data['imagen_ruta'], data['id_rol'])
    return jsonify({"message": "Usuario actualizado exitosamente"})

# Eliminar un usuario
@app.route('/delete_usuario/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    db.delete_usuario(id)
    return jsonify({"message": "Usuario eliminado exitosamente"})

# Ver todas las citas
@app.route('/select_citas', methods=['GET'])
def get_citas():
    citas = db.get_citas()
    return jsonify(citas)

# Ver una cita por ID
@app.route('/select_cita/<int:id>', methods=['GET'])
def get_cita(id):
    cita = db.get_cita_by_id(id)
    if cita:
        return jsonify(cita)
    return jsonify({"message": "Cita no encontrada"}), 404

# Crear una nueva cita
@app.route('/create_citas', methods=['POST'])
def create_cita():
    data = request.json
    db.create_cita(data['id_paciente'], data['id_medico'], data['fecha_cita'], data['motivo_cita'])
    return jsonify({"message": "Cita creada exitosamente"}), 201

# Modificar una cita
@app.route('/update_citas/<int:id>', methods=['POST'])
def update_cita(id):
    data = request.json
    db.update_cita(id, data['id_paciente'], data['id_medico'], data['fecha_cita'], data['motivo_cita'], data['estado'])
    return jsonify({"message": "Cita actualizada exitosamente"})

# Eliminar una cita
@app.route('/delete_citas/<int:id>', methods=['DELETE'])
def delete_cita(id):
    db.delete_cita(id)
    return jsonify({"message": "Cita eliminada exitosamente"})
