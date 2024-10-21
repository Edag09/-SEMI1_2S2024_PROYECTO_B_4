import os

class Config:
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'admin')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '*Semi1_Practica1*')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'mediSync')
    MYSQL_CURSORCLASS = 'DictCursor'
    
    # Configuración para S3
    S3_BUCKET = os.environ.get('S3_BUCKET', 'arn:aws:s3:::practica2-semi1-b-2s2024-imageness-g4')
    S3_KEY = os.environ.get('AWS_ACCESS_KEY_ID', 'AKIAZMBSHQXGVXKNFOXA')
    S3_SECRET = os.environ.get('AWS_SECRET_ACCESS_KEY')