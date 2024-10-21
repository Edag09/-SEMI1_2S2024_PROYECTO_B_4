const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// Configuración de Cognito
const USER_POOL_ID = 'us-east-1_zipDlsJ76';
const CLIENT_ID = '4sekgbkn1k7meuh6fh1nfgujrf';
const REGION = 'us-east-1';  // Ejemplo: 'us-east-1'

// Crear cliente Cognito
const cognito = new AWS.CognitoIdentityServiceProvider({ region: REGION });

async function registrarUsuarioCognito(username, password, name) {
    const params = {
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: [
            {
                Name: 'name',
                Value: name
            }
        ]
    };

    try {
        // Crear usuario en Cognito
        const response = await cognito.signUp(params).promise();
        console.log('Usuario registrado en Cognito:', response);
        return response.UserSub;
    } catch (error) {
        console.error('Error al registrar usuario en Cognito:', error);
        return null;
    }
}

async function autenticarUsuarioCognito(username, password) {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password
        },
        ClientId: CLIENT_ID
    };

    try {
        // Iniciar sesión en Cognito
        const response = await cognito.initiateAuth(params).promise();
        console.log('Usuario autenticado en Cognito.');
        // Regresar el Access Token
        return response.AuthenticationResult.AccessToken;
    } catch (error) {
        // Manejo de excepciones detallado
        const errorCode = error.code;
        if (errorCode === 'NotAuthorizedException') {
            console.error('Usuario o contraseña incorrectos.');
        } else if (errorCode === 'UserNotFoundException') {
            console.error('El usuario no existe.');
        } else if (errorCode === 'UserNotConfirmedException') {
            console.error('El usuario no ha confirmado su cuenta.');
        } else {
            console.error('Error de autenticación en Cognito:', error);
        }
        return null;
    }
}

module.exports = { registrarUsuarioCognito, autenticarUsuarioCognito };