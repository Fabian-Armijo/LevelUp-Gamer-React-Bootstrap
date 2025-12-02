import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../organisms/LoginForm/LoginForm';
import miLogo from '../../assets/imagenes/logo/logo.png';
import './LoginPage.css';

const AuthPanel = ({ title, slogan }) => (
  <div className="auth-panel">
    <img src={miLogo} alt="Logo de la aplicación" className="auth-logo" />
    <h1>{title}</h1>
    <p>{slogan}</p>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <div className="login-page-container">
      <div className="auth-split-container">
        <AuthPanel
          title="Bienvenido de Nuevo"
          slogan="Tu portal al futuro digital."
        />
        <div className="form-wrapper">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          <p className="view-switcher">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;