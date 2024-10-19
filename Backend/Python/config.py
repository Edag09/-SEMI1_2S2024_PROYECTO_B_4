import os

class Config:
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'admin')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '*Semi1_Practica1*')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'mediSync')
    MYSQL_CURSORCLASS = 'DictCursor'
