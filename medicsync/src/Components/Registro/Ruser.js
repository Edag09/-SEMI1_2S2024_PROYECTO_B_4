import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown'; // Cambiado de ListBox a Dropdown
import { Calendar } from 'primereact/calendar';
import './Ruser.css'

function Ruser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [pais, setPais] = useState('');
  const [genero, setGenero] = useState(null);
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [edad, setEdad] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const navigate = useNavigate();

  const genderOptions = [
    { label: 'Hombre', value: 'Hombre' },
    { label: 'Mujer', value: 'Mujer' },
    { label: 'Otro', value: 'Otro' },  // Puedes agregar más opciones si lo deseas
  ];

  const handleRegister = async () => {
    // Validación de campos vacíos
    if (!nombre || !apellido || !correo || !contrasena || !confirmarContrasena || !pais || !genero || !fechaNacimiento || !edad || !fotoPerfil) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
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
            <label htmlFor="pais">País o Ciudad</label>
            <InputText id="pais" value={pais} onChange={(e) => setPais(e.target.value)} placeholder="Ingresa el país o ciudad" />
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
            <label htmlFor="gender">Género</label>
            <Dropdown value={genero} options={genderOptions} onChange={(e) => setGenero(e.value)} placeholder="Selecciona tu género" />
          </div>

          <div className="p-field">
            <label htmlFor="birthdate">Fecha de Nacimiento</label>
            <Calendar id="birthdate" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.value)} showIcon />
          </div>

          <div className="p-field">
            <label htmlFor="age">Edad</label>
            <InputText id="age" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ingresa tu edad" />
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
