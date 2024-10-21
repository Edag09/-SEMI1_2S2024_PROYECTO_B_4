import boto3
from botocore.exceptions import ClientError

# Configuración de Cognito
USER_POOL_ID = 'us-east-1_zipDlsJ76'
CLIENT_ID = '4sekgbkn1k7meuh6fh1nfgujrf'
REGION = 'us-east-1'  # Ejemplo: 'us-east-1'

# Crear cliente Cognito
cognito_client = boto3.client('cognito-idp', region_name=REGION)

def registrar_usuario_cognito(username, password, name):
    try:
        # Crear usuario en Cognito
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'name',
                    'Value': name
                }
            ]
        )
        print('Usuario registrado en Cognito:', response)
        return response['UserSub']
    except ClientError as e:
        print(f"Error al registrar usuario en Cognito: {e}")
        return None

def autenticar_usuario_cognito(username, password):
    try:
        # Iniciar sesión en Cognito
        response = cognito_client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            },
            ClientId=CLIENT_ID
        )
        print('Usuario autenticado en Cognito.')
        # Regresar el Access Token
        return response['AuthenticationResult']['AccessToken']
    except ClientError as e:
        # Manejo de excepciones detallado
        error_code = e.response['Error']['Code']
        if error_code == 'NotAuthorizedException':
            print("Usuario o contraseña incorrectos.")
        elif error_code == 'UserNotFoundException':
            print("El usuario no existe.")
        elif error_code == 'UserNotConfirmedException':
            print("El usuario no ha confirmado su cuenta.")
        else:
            print(f"Error de autenticación en Cognito: {e}")
        return None