from flask import Flask, jsonify, request
from models import Database
import boto3
import base64
import os
from botocore.exceptions import ClientError

from werkzeug.utils import secure_filename
app = Flask(__name__)

# Configuración de la base de datos
app.config.from_object('config.Config')
db = Database()
os.environ['AWS_ACCESS_KEY_ID'] = ''

s3 = boto3.client(
    's3',
    aws_access_key_id=app.config['S3_KEY'],
    aws_secret_access_key=app.config['S3_SECRET']
)

def upload_file(picture_path, nombre ):
   
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    try:
        image_data = base64.b64decode(picture_path)
        if not os.path.exists(image_data):
            raise Exception(f"El archivo {image_data} no existe")

        # Obtener el nombre del archivo
        filename = os.path.basename(image_data)
        
        print(image_data)
        with open(image_data, "rb") as file:
                   # Abrir el archivo en modo binario
        # Subir el archivo a S3
            s3.put_object(
                Bucket="practica2-semi1-b-2s2024-imageness-g4", 
                Body=file,
                Key=nombre,
                ContentType= 'image' # Permitir lectura pública si es necesario
            )
        # Decodificar los datos de la imagen base64
        # image_data = base64.b64decode(picturename.encode('utf-8'))
        # print("imagen_data",image_data)
        # # Subir la imagen a S3
        # s3 = boto3.client('s3')
        # try:
        #     s3.put_object(Bucket="practica2-semi1-b-2s2024-imageness-g4", 
        #                 Key=nombre, 
        #                 Body=image_data,
        #                 ContentType= 'image')
        return True
    except ClientError as e:
        print("Error al subir el archivo a S3:", e)
        return False
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
        usuario['contrasena'] = decode_password(usuario['contrasena'])
        return jsonify(usuario)
    return jsonify({"message": "Usuario no encontrado"}), 404


def encode_password(password):
    """
    Codifica la contraseña en Base64
    """
    encoded_password = base64.b64encode(password.encode('utf-8'))
    return encoded_password.decode('utf-8')

def decode_password(encoded_password):
    """
    Decodifica la contraseña de Base64
    """
    decoded_password = base64.b64decode(encoded_password.encode('utf-8'))
    return decoded_password.decode('utf-8')

# Crear un nuevo usuario
@app.route('/create_usuario', methods=['POST'])
def create_usuario():
    data = request.json
    image_file =  data['imagen_ruta']  # La imagen se envía en el request con el campo "imagen"
    split = image_file.split(".")
    nombre = split[0] + "." + split[1]
    nombre_foto = "Fotos_Perfil/"+data['nombre']  + data['apellido'] + str(data['id_rol'])+ "."+ split[1]
     # con el nombre de usuario, asignar nombre a la foto
    url_foto = "https://practica2-semi1-b-2s2024-imageness-g4.s3.amazonaws.com/" + "Fotos_Perfil/" + nombre_foto 
    print("url_foto",url_foto)
    # Subir al bucket S3
    upload_file(encode_password(image_file), nombre_foto)

    
    encoded_password = encode_password(data['contrasena'])
    # print(image_url)
    db.create_usuario(data['nombre'], data['apellido'], data['correo'], encoded_password, data.get('telefono'), data.get('direccion'), url_foto, data['id_rol'])
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

# Inicializar el cliente de Translate de AWS usando boto3
translate = boto3.client(
    'translate',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID_TRANSLATOR'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY_TRANSLATOR'),
    region_name=os.getenv('AWS_REGION_TRANSLATOR')
)

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()

    # Extraer los parámetros del cuerpo de la solicitud
    text = data.get('text')
    source_language = data.get('sourceLanguage')
    target_language = data.get('targetLanguage')

    # Validar si faltan parámetros
    if not text or not source_language or not target_language:
        return jsonify({'error': 'Faltan datos de entrada'}), 400

    # Parámetros para la llamada al servicio de AWS Translate
    params = {
        'Text': text,
        'SourceLanguageCode': source_language,
        'TargetLanguageCode': target_language
    }

    try:
        # Llamar a la función de traducción
        response = translate.translate_text(**params)
        return jsonify({'translatedText': response.get('TranslatedText')})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error en la traducción'}), 500

# Configuración de AWS Polly
polly = boto3.client('polly',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID_TRANSLATOR'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY_TRANSLATOR'),
    region_name=os.environ.get('AWS_REGION_TRANSLATOR')
)

@app.route('/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get('text')

    params = {
        'Text': text,
        'OutputFormat': 'mp3',
        'VoiceId': 'Mia'
    }

    try:
        response = polly.synthesize_speech(**params)
        audio_stream = response['AudioStream'].read()
        
        return Response(audio_stream, 
            mimetype='audio/mpeg', 
            headers={'Content-Disposition': 'attachment; filename="speech.mp3"'})
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'Error al generar el audio.'}), 500
