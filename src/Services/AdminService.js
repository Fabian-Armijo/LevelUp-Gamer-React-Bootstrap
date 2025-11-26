import api from './api';

const BASE_URL = 'http://localhost:8081/api/admin';

class AdminService {

    /**
     * Obtiene estadísticas de ventas y últimos pedidos.
     * GET /api/admin/stats
     */
    getStats() {
        return api.get(`${BASE_URL}/stats`);
    }

    /**
     * Elimina un comentario por ID (Moderación).
     * DELETE /api/admin/reviews/{reviewId}
     */
    deleteReview(reviewId) {
        return api.delete(`${BASE_URL}/reviews/${reviewId}`);
    }
}

export default new AdminService();