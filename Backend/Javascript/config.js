// Cargar las variables de entorno desde el archivo .env
require("dotenv").config();

class Config {
  static MYSQL_HOST =
    process.env.MYSQL_HOST ||
    "bdpractica1.cp842gwg2jsl.us-east-1.rds.amazonaws.com";
  static MYSQL_USER = process.env.MYSQL_USER || "admin";
  static MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "*Semi1_Practica1*";
  static MYSQL_DB = process.env.MYSQL_DB || "mediSync";

  // Configuración para S3
  static S3_BUCKET =
    process.env.S3_BUCKET || "practica2-semi1-b-2s2024-imageness-g4";
  static S3_KEY = process.env.AWS_ACCESS_KEY_ID;

  static S3_REGION = process.env.AWS_REGION || "us-east-1";
}

module.exports = Config;
