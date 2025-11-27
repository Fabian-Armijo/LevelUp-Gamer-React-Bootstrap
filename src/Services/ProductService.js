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
     * IMPORTANTE: 'productData' debe ser un objeto FormData, no un JSON.
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
     * IMPORTANTE: 'productData' debe ser un objeto FormData.
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
     * NOTA: Las reseñas NO llevan imagen en tu controlador actual, así que se envían como JSON normal.
     */
    addReviewToProduct(productId, reviewData) {
        return api.post(`${BASE_URL}/${productId}/reviews`, reviewData);
    }

}

export default new ProductService();