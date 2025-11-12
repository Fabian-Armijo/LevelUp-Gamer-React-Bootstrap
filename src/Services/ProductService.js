import api from './api';

const BASE_URL = 'http://localhost:8081/api/products';

class ProductService {

    getAllProducts() {
        return api.get(BASE_URL);
    }

    getProductById(productId) {
        return api.get(`${BASE_URL}/${productId}`);
    }

    createProduct(productData) {
        return api.post(BASE_URL, productData);
    }

    updateProduct(productId, productData) {
        return api.put(`${BASE_URL}/${productId}`, productData);
    }

    deleteProduct(productId) {
        return api.delete(`${BASE_URL}/${productId}`);
    }

    
    /**
     * Añade una nueva reseña a un producto específico.
     * @param {number} productId - El ID del producto (ej: 1)
     * @param {object} reviewData - El objeto de la reseña (ej: { author: "Ana", rating: 5, comment: "..." })
     * @returns 
     */
    addReviewToProduct(productId, reviewData) {
        return api.post(`${BASE_URL}/${productId}/reviews`, reviewData);
    }

}

export default new ProductService();