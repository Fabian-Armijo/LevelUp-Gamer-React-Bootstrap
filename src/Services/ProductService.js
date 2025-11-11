import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/products';

class ProductService {

    getAllProducts() {
        return axios.get(BASE_URL);
    }

    getProductById(productId) {
        return axios.get(`${BASE_URL}/${productId}`);
    }

    createProduct(productData) {
        return axios.post(BASE_URL, productData);
    }

    updateProduct(productId, productData) {
        return axios.put(`${BASE_URL}/${productId}`, productData);
    }

    deleteProduct(productId) {
        return axios.delete(`${BASE_URL}/${productId}`);
    }

    
    /**
     * Añade una nueva reseña a un producto específico.
     * @param {number} productId - El ID del producto (ej: 1)
     * @param {object} reviewData - El objeto de la reseña (ej: { author: "Ana", rating: 5, comment: "..." })
     * @returns 
     */
    addReviewToProduct(productId, reviewData) {
        return axios.post(`${BASE_URL}/${productId}/reviews`, reviewData);
    }

}

export default new ProductService();