import axios from 'axios';

// 1. CAMBIAMOS LA URL BASE
// Apunta a tu backend (puerto 8081) y a tu endpoint (/api/products)
const BASE_URL = 'http://localhost:8081/api/products';

class ProductService {

    // Método para OBTENER TODOS los productos (para tu catálogo)
    getAllProducts() {
        return axios.get(BASE_URL);
    }

    // Método para OBTENER UN producto por ID (para tu pág. de detalles)
    getProductById(productId) {
        return axios.get(`${BASE_URL}/${productId}`);
    }

    // Método para CREAR un producto (para tus pruebas de Postman, o un futuro admin)
    createProduct(productData) {
        return axios.post(BASE_URL, productData);
    }

    // Método para ACTUALIZAR un producto (aún no lo hemos creado en el backend)
    updateProduct(productId, productData) {
        return axios.put(`${BASE_URL}/${productId}`, productData);
    }

    // Método para BORRAR un producto (aún no lo hemos creado en el backend)
    deleteProduct(productId) {
        return axios.delete(`${BASE_URL}/${productId}`);
    }

    // --- ¡AQUÍ VIENE EL MÉTODO ESPECIAL PARA LAS RESEÑAS! ---
    
    /**
     * Añade una nueva reseña a un producto específico.
     * @param {number} productId - El ID del producto (ej: 1)
     * @param {object} reviewData - El objeto de la reseña (ej: { author: "Ana", rating: 5, comment: "..." })
     * @returns 
     */
    addReviewToProduct(productId, reviewData) {
        // Apunta a la URL: http://localhost:8081/api/products/1/reviews
        return axios.post(`${BASE_URL}/${productId}/reviews`, reviewData);
    }

}

// Exportamos una instancia de la clase, igual que en el ejemplo
export default new ProductService();