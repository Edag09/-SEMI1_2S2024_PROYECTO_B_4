from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import users
import json
import boto3
import os

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return "Hello World"

@app.route('/register', methods=['POST'])
def register():
    user = request.json
    try:
        users.register_user(user)
        return jsonify({'message': 'User created successfully'})
    except Exception as e:
        return jsonify({'message': 'Error creating user', 'error': str(e)})

if __name__ == '__main__':
    app.run( host='0.0.0.0' , port=5000, debug=True)