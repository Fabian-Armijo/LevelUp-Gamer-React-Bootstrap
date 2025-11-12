import React, { useState, useEffect } from 'react'; // --> 1. Importa useEffect
import Header from '../../organisms/Header/Header';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './ProfilePage.css';
import UserService from '../../../Services/ProfileService';

// --> 3. Borramos 'mockUserData'

const ProfilePage = () => {
  // --> 4. Inicializa el estado como vacío
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    receiveNotifications: false, // <-- Aplanado y renombrado
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  
  // --> 5. Nuevos estados para la carga y mensajes del servidor
  const [isLoading, setIsLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

  // --> 6. Carga los datos del perfil al montar el componente
  useEffect(() => {
    UserService.getMyProfile()
      .then(response => {
        const { username, email, receiveNotifications } = response.data;
        // Rellena el estado con los datos del backend
        setUserInfo(prevInfo => ({
          ...prevInfo,
          username,
          email,
          receiveNotifications,
        }));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar el perfil:", error);
        setIsLoading(false);
        setServerMessage({ type: 'error', text: 'Error al cargar tu perfil. ¿Estás logueado?' });
      });
  }, []); // El [] vacío asegura que se ejecute solo una vez

  // --> 7. 'handleChange' actualizado para el nuevo estado
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUserInfo(prevInfo => ({
      ...prevInfo,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  // --> 8. 'validateForm' actualizado
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // (Quitamos la validación de 'fullName')
    if (userInfo.username.length < 4) {
      newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
    }
    if (!emailRegex.test(userInfo.email)) {
      newErrors.email = 'Por favor, introduce un correo válido.';
    }

    // Lógica para el cambio de contraseña (solo si se está intentando)
    if (userInfo.newPassword || userInfo.confirmPassword) {
      if (!userInfo.currentPassword) {
        newErrors.currentPassword = 'Debes ingresar tu contraseña actual para cambiarla.';
      }
      if (userInfo.newPassword.length < 6) {
        newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres.';
      }
      if (userInfo.newPassword !== userInfo.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --> 9. 'handleSubmit' REESCRITO para llamar al backend
  const handleSubmit = async (e) => { // La hacemos 'async'
    e.preventDefault();
    setServerMessage({ type: '', text: '' }); // Limpia mensajes

    if (!validateForm()) {
      return; // Detiene si la validación del frontend falla
    }

    setIsLoading(true);

    // Separamos las tareas: 1. Actualizar Perfil, 2. Cambiar Contraseña
    const tasks = [];
    let passwordChangeRequested = userInfo.newPassword && userInfo.currentPassword;

    // Tarea 1: Actualizar datos del perfil
    const profileData = {
      username: userInfo.username,
      email: userInfo.email,
      receiveNotifications: userInfo.receiveNotifications,
    };
    tasks.push(UserService.updateMyProfile(profileData));

    // Tarea 2: Cambiar contraseña (si se pidió)
    if (passwordChangeRequested) {
      const passwordData = {
        oldPassword: userInfo.currentPassword,
        newPassword: userInfo.newPassword,
      };
      tasks.push(UserService.changePassword(passwordData));
    }

    try {
      // Ejecuta todas las tareas en paralelo
      await Promise.all(tasks);

      setServerMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
      setIsEditing(false);
      // Limpia los campos de contraseña
      setUserInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));

    } catch (error) {
      console.error('Error al actualizar:', error);
      // Muestra el error específico del backend (ej: "Email en uso")
      const errorMsg = error.response?.data || 'Error al guardar. Inténtalo de nuevo.';
      setServerMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // --> 10. Añadimos un estado de carga
  if (isLoading && !userInfo.username) {
    return (
      <div>
        <Header />
        <main className="profile-page-container">
          <h1 className="profile-title">Cargando perfil...</h1>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="profile-page-container">
        <h1 className="profile-title">Mi Perfil</h1>
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          
          {/* --> 11. Muestra mensajes del servidor */}
          {serverMessage.text && (
            <div className={`server-message ${serverMessage.type}`}>
              {serverMessage.text}
            </div>
          )}

          <section className="profile-section">
            <h2>Información Personal</h2>
            {/* --> 12. Quitamos el campo 'fullName' */}
            <FormField
              label="Nombre de Usuario"
              type="text"
              name="username"
              value={userInfo.username}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.username}
            />
            <FormField
              label="Correo Electrónico"
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.email}
            />
          </section>

          {isEditing && (
            <section className="profile-section">
              <h2>Cambiar Contraseña</h2>
              <p className="password-note">Deja los campos en blanco si no quieres cambiar tu contraseña.</p>
              <FormField
                label="Contraseña Actual"
                type="password"
                name="currentPassword"
                value={userInfo.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword} // Añadido
              />
              <FormField
                label="Nueva Contraseña"
                type="password"
                name="newPassword"
                value={userInfo.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
              />
              <FormField
                label="Confirmar Nueva Contraseña"
                type="password"
                name="confirmPassword"
                value={userInfo.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </section>
          )}

          <section className="profile-section">
            <h2>Preferencias</h2>
            <div className="checkbox-field">
              {/* --> 13. Campo de preferencias actualizado */}
              <label htmlFor="receiveNotifications">
                <input
                  type="checkbox"
                  id="receiveNotifications"
                  name="receiveNotifications"
                  checked={userInfo.receiveNotifications}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Quiero recibir ofertas y novedades en mi correo.
              </label>
            </div>
          </section>
          <div className="profile-actions">
            {isEditing ? (
              <>
                {/* --> 14. Botón deshabilitado mientras se guarda */}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading} // Deshabilitado mientras guarda
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;