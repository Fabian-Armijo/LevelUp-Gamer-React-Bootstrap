import api from './api';

const BASE_URL = 'http://localhost:8081/api/orders';

class OrderService {

    /**
     * Realiza la compra (Checkout)
     * POST /api/orders/checkout
     */
    checkout() {
        return api.post(`${BASE_URL}/checkout`);
    }

    /**
     * Obtiene el historial de pedidos del usuario logueado
     * GET /api/orders/my-orders
     */
    getMyOrders() {
        return api.get(`${BASE_URL}/my-orders`);
    }
}

export default new OrderService();