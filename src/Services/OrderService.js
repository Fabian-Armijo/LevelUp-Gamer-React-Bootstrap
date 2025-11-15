import api from './api'; // ¡Importa el interceptor con token!

const BASE_URL = 'http://localhost:8081/api/orders';

class OrderService {

    /**
     * Llama al endpoint de checkout
     * Petición: POST /api/orders/checkout
     */
    checkout() {
        // No necesita body, el backend saca el usuario del token
        return api.post(`${BASE_URL}/checkout`);
    }

    // (Aquí podrías añadir un 'getOrderHistory' en el futuro)
}

export default new OrderService();