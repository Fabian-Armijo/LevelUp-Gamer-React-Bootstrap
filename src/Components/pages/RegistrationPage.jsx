import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationForm from '../organisms/RegistrationForm/RegistrationForm';
import miLogo from '../../assets/imagenes/logo/logo.png';

const AuthPanel = ({ title, slogan }) => (
  <div className="auth-panel">
    <img src={miLogo} alt="Logo de la aplicación" className="auth-logo" />
    <h1>{title}</h1>
    <p>{slogan}</p>
  </div>
);

const RegistrationPage = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    navigate('/login'); 
  };

  return (
    <div className="auth-split-container">
      <AuthPanel
        title="Únete a la Comunidad"
        slogan="Crea tu cuenta y empieza la aventura."
      />
      <div className="form-wrapper">
        <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
        <p className="view-switcher">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;