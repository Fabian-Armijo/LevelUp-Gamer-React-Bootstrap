import api from './api';

const BASE_URL = 'http://localhost:8081/api/products';

class ProductService {

    getAllProducts() {
        return api.get(BASE_URL);
    }

    getProductById(productId) {
        return api.get(`${BASE_URL}/${productId}`);
    }

    /**
     * Crea un producto nuevo.
     */
    createProduct(productData) {
        return api.post(BASE_URL, productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    /**
     * Actualiza un producto existente.
     */
    updateProduct(productId, productData) {
        return api.put(`${BASE_URL}/${productId}`, productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    deleteProduct(productId) {
        return api.delete(`${BASE_URL}/${productId}`);
    }

    /**
     * Añade una nueva reseña a un producto específico.
     * @param {number} productId - El ID del producto
     * @param {object} reviewData - Objeto JSON simple { rating: 5, comment: "..." }
     */
    addReviewToProduct(productId, reviewData) {
        return api.post(`${BASE_URL}/${productId}/reviews`, reviewData);
    }

}

export default new ProductService();