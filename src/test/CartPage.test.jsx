import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '../Components/pages/CartPage';
import '@testing-library/jest-dom';

// MOCK de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// MOCK de Header para no renderizar cosas externas
jest.mock('../Components/organisms/Header/Header', () => () => <div>Header Mock</div>);

// MOCK de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Datos de prueba
const mockCart = [
  {
    id: 1,
    name: 'Catan',
    price: '29990',
    quantity: 2,
    image: 'test-file-stub',
  },
  {
    id: 2,
    name: 'PS5',
    price: '549990',
    quantity: 1,
    image: 'test-file-stub',
  },
];

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.setItem('cart', JSON.stringify(mockCart));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('muestra los productos en el carrito', () => {
    render(<CartPage />);
    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('PS5')).toBeInTheDocument();
  });

  test('muestra el total correctamente', () => {
    render(<CartPage />);
    const total = 29990 * 2 + 549990 * 1; // 609970
    expect(screen.getByText(/Total:/)).toHaveTextContent(
      new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)
    );
  });

  test('aumenta y disminuye la cantidad', () => {
    render(<CartPage />);
    const increaseButtons = screen.getAllByText('+');
    const decreaseButtons = screen.getAllByText('-');

    // Aumentar cantidad del primer producto
    fireEvent.click(increaseButtons[0]);
    expect(screen.getByText('3')).toBeInTheDocument();

    // Disminuir cantidad del primer producto
    fireEvent.click(decreaseButtons[0]);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('elimina un producto del carrito', () => {
    render(<CartPage />);
    const removeButtons = screen.getAllByText('Eliminar');
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByText('Catan')).not.toBeInTheDocument();
  });

  test('vacía el carrito al hacer checkout', () => {
    render(<CartPage />);
    const checkoutButton = screen.getByText('Finalizar Compra');
    fireEvent.click(checkoutButton);

    expect(screen.getByText('Tu carrito está vacío. ¡Agrega productos desde el catálogo!')).toBeInTheDocument();
    expect(localStorage.getItem('cart')).toBe(JSON.stringify([]));
  });
});
