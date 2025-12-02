import api from './api';

const BASE_URL = 'http://localhost:8081/api/admin';

class AdminService {
 
    getStats() {
        return api.get(`${BASE_URL}/stats`);
    }

    deleteReview(reviewId) {
        return api.delete(`${BASE_URL}/reviews/${reviewId}`);
    }

    getAllUsers() {
        return api.get(`${BASE_URL}/users`);
    }

    toggleUserBan(userId) {
        return api.put(`${BASE_URL}/users/${userId}/ban`);
    }
}

export default new AdminService();