import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    const goToRegister = () => {
        navigate('/registro');
    };


    const handleFaceRecognition = async () => {
        setIsCameraOn(true);
    
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      };

    return (
        <div className="login-container">
            <h1>MedicSync</h1>
            <div className="login-box">
                {/* Sección horizontal */}
                <div className="login-sections-horizontal">
                    {/* Formulario de Iniciar Sesión */}
                    <div className="login-section">
                        <h2>Iniciar Sesión</h2>

                        <div className="input-field">
                            <label htmlFor="email">Correo Electrónico</label>
                            <InputText id="email" placeholder="Correo Electrónico" />
                        </div>

                        <div className="input-field" style={{ marginTop: '1rem' }}>
                            <label htmlFor="password">Contraseña</label>
                            <Password id="password" placeholder="Contraseña" feedback={false} toggleMask />
                        </div>

                        <Button label="Iniciar Sesión" className="p-button-rounded p-button-block" style={{ marginTop: '2rem' }} />
                        
                        {/* Botón para redirigir al registro */}
                        <Button label="Registrarse" className="p-button-rounded p-button-block" style={{ marginTop: '1rem' }} onClick={goToRegister} />
                    </div>

                    <Divider layout="vertical" />

                    {/* Reconocimiento Facial */}
                    <div className="login-section">
                        <h2>Reconocimiento Facial</h2>
                        <Button label="Iniciar con Cámara" icon="pi pi-camera" className="p-button-rounded p-button-block" onClick={handleFaceRecognition} />
                        {isCameraOn && (
                            <div className="camera-container">
                                <video ref={videoRef} autoPlay className="camera-video" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
