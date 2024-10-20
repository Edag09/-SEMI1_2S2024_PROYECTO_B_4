import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './Ruser.css'

function Ruser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena || !telefono || !direccion || !fotoPerfil) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try{

      // Tiene que ir primero la subida de imagen a la ec2 para poder obtener la url de la imagen

      const RegistroData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        contrasena: contrasena,
        telefono: telefono,
        direccion: direccion,
        fotoPerfil: fotoPerfil,
        create_at: new Date()
      };
  
      const response = await fetch('http://localhost:5000/crear_usuario', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(RegistroData),
          }
      );
  
      if (response.ok){
        alert('Usuario creado correctamente.');
        navigate('/');
      }
      else {
        alert('Error al crear el usuario.');
      }

    }catch(error){
      console.error('Error en el registro:', error);
      alert('Error al registrar el usuario. Por favor, intenta de nuevo.');
    }
  };

  // Función para manejar la carga de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFotoPerfil(file);

    // Crear previsualización
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registro de Usuario</h2>

        {/* Sección Izquierda */}
        <div className="register-section">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText 
              id="name" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ingresa tu nombre" 
            />
          </div>

          <div className="p-field">
            <label htmlFor="apellido">Apellido</label>
            <InputText 
              id="apellido" 
              value={apellido} 
              onChange={(e) => setApellido(e.target.value)} 
              placeholder="Ingresa tu apellido" 
            />
          </div>

          <div className="p-field">
            <label htmlFor="email">Correo Electrónico</label>
            <InputText 
              id="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              placeholder="Ingresa tu correo electrónico" 
            />
          </div>

          <div className="p-field">
            <label htmlFor="telefono">Teléfono</label>
            <InputText 
              id="telefono" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              placeholder="Ingresa tu teléfono" 
            />
          </div>

          <div className="p-field">
            <label htmlFor="profilePicture">Foto de Perfil</label>
            <input type="file" id="profilePicture" onChange={handleFileChange} />
            <label htmlFor="profilePicture" className="p-button-outlined">Subir Foto</label>
            {fotoPreview && (
              <div className="foto-preview">
                <img src={fotoPreview} alt="Previsualización de Foto" className="preview-image" />
              </div>
            )}
          </div>
        </div>

        {/* Sección Derecha */}
        <div className="register-section">
          <div className="p-field">
            <label htmlFor="password">Contraseña</label>
            <Password 
              id="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              className="custom-password" 
              placeholder="Ingresa tu contraseña" 
              feedback={false} 
            />
          </div>

          <div className="p-field">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <Password 
              id="confirmPassword" 
              value={confirmarContrasena} 
              onChange={(e) => setConfirmarContrasena(e.target.value)} 
              className="custom-password" 
              placeholder="Confirma tu contraseña" 
              feedback={false} 
            />
          </div>

          <div className="p-field">
            <label htmlFor="direccion">Dirección</label>
            <InputText 
              id="direccion" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              placeholder="Ingresa tu dirección" 
            />
          </div>
        </div>

        <div className="register-section-button">
          <Button 
            label="Listo!" 
            className="p-button-success" 
            onClick={handleRegister} 
          />
          <Button 
            label="Cancelar" 
            className="p-button-secondary" 
            onClick={() => navigate('/')} 
          />
        </div>
      </div>
    </div>
  );
}

export default Ruser;
