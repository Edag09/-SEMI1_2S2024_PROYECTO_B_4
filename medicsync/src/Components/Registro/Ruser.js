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
  const [telefono, setTelefono] = useState(''); // Cambiado de país a teléfono
  const [direccion, setDireccion] = useState(''); // Cambiado de género a dirección
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validación de campos vacíos
    if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena || !telefono || !direccion || !fotoPerfil) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Crear un objeto FormData para enviar los datos
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('apellido', apellido);
      formData.append('correo', correo);
      formData.append('contrasena', contrasena);
      formData.append('telefono', telefono);
      formData.append('direccion', direccion);
      formData.append('fotoPerfil', fotoPerfil);

      // Realizar la petición POST

      const response = await fetch('http://localhost:8000/registrar_usuarios', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }


      navigate('/'); // Redirigir al login después de registrarse
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error al conectar con el servidor.');
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
            <InputText id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingresa tu nombre" />
          </div>

          <div className="p-field">
            <label htmlFor="apellido">Apellido</label>
            <InputText id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ingresa tu apellido" />
          </div>

          <div className="p-field">
            <label htmlFor="email">Correo Electrónico</label>
            <InputText id="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Ingresa tu correo electrónico" />
          </div>

          <div className="p-field">
            <label htmlFor="telefono">Teléfono</label>
            <InputText id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ingresa tu teléfono" />
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
            <Password id="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="custom-password" placeholder="Ingresa tu contraseña" feedback={false} />
          </div>

          <div className="p-field">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <Password id="confirmPassword" value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)} className="custom-password" placeholder="Confirma tu contraseña" feedback={false} />
          </div>

          <div className="p-field">
            <label htmlFor="direccion">Dirección</label>
            <InputText id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ingresa tu dirección" />
          </div>
        </div>

        <div className="register-section-button">
          <Button label="Listo!" className="p-button-success" onClick={handleRegister} />
          <Button label="Cancelar" className="p-button-secondary" onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
}

export default Ruser;
