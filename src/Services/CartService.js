// src/Services/CartService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/cart';

// Función de ayuda para obtener el Token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

class CartService {
 
    getCart() {
        return axios.get(BASE_URL, { headers: getAuthHeaders() });
    }

 // Body: { productId: ID, quantity: QTY }
    addItem(itemData) {
        return axios.post(`${BASE_URL}/items`, itemData, { headers: getAuthHeaders() });
    }

    updateItem(productId, quantity) {
        return axios.put(`${BASE_URL}/items/${productId}`, { quantity }, { headers: getAuthHeaders() });
    }

    removeItem(productId) {
        return axios.delete(`${BASE_URL}/items/${productId}`, { headers: getAuthHeaders() });
    }
 
    clearCart() {
        return axios.delete(BASE_URL, { headers: getAuthHeaders() });
    }
}

export default new CartService();