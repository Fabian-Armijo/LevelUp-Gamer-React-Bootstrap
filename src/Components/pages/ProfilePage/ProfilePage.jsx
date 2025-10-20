import React, { useState } from 'react';
import Header from '../../organisms/Header/Header';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './ProfilePage.css';

const mockUserData = {
  fullName: 'Alex Rojas',
  username: 'AlexGamerPro',
  email: 'alex.rojas@email.com',
  preferences: {
    receiveOffers: true,
  },
};

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    ...mockUserData,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setUserInfo({
        ...userInfo,
        preferences: { ...userInfo.preferences, [name]: checked },
      });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (userInfo.fullName.trim() === '') {
      newErrors.fullName = 'El nombre no puede estar vacío.';
    }
    if (userInfo.username.length < 4) {
      newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
    }
    if (!emailRegex.test(userInfo.email)) {
      newErrors.email = 'Por favor, introduce un correo válido.';
    }

    if (userInfo.newPassword || userInfo.confirmPassword) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Datos actualizados:', userInfo);
      setIsEditing(false);
      alert('¡Perfil actualizado con éxito!');
    }
  };

  return (
    <div>
      <Header />
      <main className="profile-page-container">
        <h1 className="profile-title">Mi Perfil</h1>
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <section className="profile-section">
            <h2>Información Personal</h2>
            <FormField
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={userInfo.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.fullName}
            />
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
              <label htmlFor="receiveOffers">
                <input
                  type="checkbox"
                  id="receiveOffers"
                  name="receiveOffers"
                  checked={userInfo.preferences.receiveOffers}
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
                <Button type="submit">Guardar Cambios</Button>
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancelar</button>
              </>
            ) : (
              <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>Editar Perfil</button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;