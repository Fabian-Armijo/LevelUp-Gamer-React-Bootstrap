import api from './api';

// Ajusta esto si tu api.js ya tiene baseURL. 
// Si api.js tiene 'http://localhost:8081/api', aquí la url base es correcta.
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
        // No enviamos body, la lógica está en la URL y el controlador
        return api.put(`${BASE_URL}/users/${userId}/ban`);
    }
}

export default new AdminService();