import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
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
  const [rol, setRol] = useState(null); // Nuevo estado para el rol
  const navigate = useNavigate();

  const roleOptions = [
    { label: 'Médico', value: 1 },
    { label: 'Paciente', value: 2 },
    { label: 'Laborista', value: 3 },
  ];

  const handleRegister = async () => {
    if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena || !telefono || !direccion || !fotoPerfil || !rol) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try{

      const formData = {
        nombre: nombre,
        apellido: apellido,
        imagen_ruta: fotoPerfil,
      }

      const uploadResponse  = await fetch('http://localhost:4000/subir_perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const uploadResult = await uploadResponse.json();
      const fotoUrl = uploadResult.url; // URL de la imagen en S3


      const RegistroData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        contrasena: contrasena,
        telefono: telefono,
        direccion: direccion,
        imagen_ruta: fotoUrl,
        id_rol: rol,
      };
  
      const response = await fetch('http://localhost:4000/create_usuario', {
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
          <div className="p-field">
            <label htmlFor="role">Tipo de Rol</label>
            <Dropdown 
              id="role" 
              value={rol} 
              options={roleOptions} 
              onChange={(e) => setRol(e.value)} 
              placeholder="Selecciona tu rol" 
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
