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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    const goToRegister = () => {
        navigate('/registro');
    };

    const handleLogin = async () => {
        if (!email || !password) {
          alert("Por favor, complete todos los campos");
          return;
        }
    
        const loginData = {
          correo: email,
          contrasena: password,
        };
    
        try {
          const response = await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
            }
          );
    
          if (response.ok) {
            alert("Inicio de sesión exitoso");
          } else {
            alert("Error en el inicio de sesión");
          }
        } catch (error) {
          alert("Error en la petición: " + error);
        }
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
                <div className="login-sections-horizontal">
                    <div className="login-section">
                        <h2>Iniciar Sesión</h2>
                        
                        <div className="input-field">
                            <label htmlFor="email">Correo Electrónico</label>
                            <InputText 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo Electrónico" />
                        </div>

                        <div className="input-field" style={{ marginTop: '1rem' }}>
                            <label htmlFor="password">Contraseña</label>
                            <Password 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña" 
                                feedback={false} 
                                toggleMask />
                        </div>

                        <Button 
                            label="Iniciar Sesión" 
                            onClick={handleLogin}
                            className="p-button-rounded p-button-block" 
                            style={{ marginTop: '2rem' }} 
                            />
                        
                        {/* Botón para redirigir al registro */}
                        <Button 
                            label="Registrarse" 
                            className="p-button-rounded p-button-block" 
                            style={{ marginTop: '1rem' }} 
                            onClick={goToRegister} />
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
}

export default Login;
