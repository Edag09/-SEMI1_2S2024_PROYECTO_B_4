import connection
from mysql.connector import Error

# funcion para registrar un usuario
def register_user(user):
    try:
        connect = connection.conectar()
        cursor = connect.cursor()
        cursor.execute(""" INSERT INTO usuarios (id_rol, nombre, apellido, correo, contrasena, telefono, direccion, fecha_creacion) VALUES (
        (SELECT id FROM roles WHERE nombre_rol = %s), %s, %s, %s, %s, %s, %s, NOW())""",
        (user['nombre_rol'], user['nombre'], user['apellido'], user['correo'], user['contrasena'], user['telefono'], user['direccion']))
        connect.commit()
        return True
    except Error as e:
        print("Error al registrar usuario: ", e)
        return False
    finally:
        connect.close()