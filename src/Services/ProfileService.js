import api from './api'; // ¡Importa el interceptor!

const BASE_URL = 'http://localhost:8081/api/profile';

class UserService {

    // Llama a: GET /api/profile/me
    getMyProfile() {
        return api.get(`${BASE_URL}/me`);
    }

    // Llama a: PUT /api/profile/me
    updateMyProfile(profileData) {
        // profileData es un objeto: { username: "...", email: "...", receiveNotifications: true }
        return api.put(`${BASE_URL}/me`, profileData);
    }

    // Llama a: POST /api/profile/change-password
    changePassword(passwordData) {
        // ...
        return api.post(`${BASE_URL}/change-password`, passwordData); // <-- CORREGIDO
    }
}

export default new UserService();