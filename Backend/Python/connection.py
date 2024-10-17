import mysql.connector
from mysql.connector import Error

def conectar():
    try:
        connect = mysql.connector.connect(
        user='admin', 
        password='*Semi1_Practica1*', 
        host='bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com', 
        database='mediSync', 
        port='3306'
        )
        if connect.is_connected():
            db_Info = connect.get_server_info()
            print("Conectado al servidor MySQL versión ", db_Info)
            cursor = connect.cursor()
            cursor.execute("select database();")
            record = cursor.fetchone()
            print("Conectado a la base de datos ", record)
            return connect
    except Error as e:
        print("Error al conectar a MySQL", e)
    finally:
        print("Conexión exitosa")