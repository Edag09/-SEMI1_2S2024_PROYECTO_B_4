from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import json
import boto3
import os

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return "Hello World"

if __name__ == '__main__':
    app.run( host='0.0.0.0' , port=5000, debug=True)