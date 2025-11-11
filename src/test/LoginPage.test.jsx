import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../Components/pages/LoginPage';

beforeAll(() => {
  window.alert = jest.fn(); 
});
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock('../organisms/LoginForm/LoginForm', () => {
  return ({ onLoginSuccess }) => (
    <div data-testid="mock-login-form">
      <button onClick={onLoginSuccess}>Simular login</button>
    </div>
  );
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería renderizar el título y el eslogan correctamente', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Bienvenido de Nuevo')).toBeInTheDocument();
    expect(screen.getByText('Tu portal al futuro digital.')).toBeInTheDocument();
  });

  test('debería mostrar el enlace de registro y apuntar a /registro', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /regístrate/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/registro');
  });

  test('debería navegar al inicio cuando el login es exitoso', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const botonSimularLogin = screen.getByText('Simular login');
    fireEvent.click(botonSimularLogin);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
