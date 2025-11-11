import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegistrationPage from '../Components/pages/RegistrationPage';
import RegistrationForm from '../Components/organisms/RegistrationForm/RegistrationForm';

beforeAll(() => {
  window.alert = jest.fn();
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>, 
}));

jest.mock('../organisms/RegistrationForm/RegistrationForm', () => {
  return jest.fn(({ onRegistrationSuccess }) => (
    <button onClick={onRegistrationSuccess}>Mock Register</button>
  ));
});

describe('RegistrationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<RegistrationPage />);
  });

  test('muestra el título y el slogan', () => {
    expect(screen.getByText('Únete a la Comunidad')).toBeInTheDocument();
    expect(screen.getByText('Crea tu cuenta y empieza la aventura.')).toBeInTheDocument();
  });

  test('renderiza el RegistrationForm', () => {
    expect(screen.getByText('Mock Register')).toBeInTheDocument();
  });

  test('llama a navigate("/login") al registrarse exitosamente', () => {
    const button = screen.getByText('Mock Register');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('el link "Inicia sesión" apunta a /login', () => {
    const link = screen.getByText('Inicia sesión');
    expect(link.getAttribute('href')).toBe('/login');
  });
});
