import api from './api'; // ¡Importa el interceptor!

const BASE_URL = 'http://localhost:8081/api/profile';

class ProfileService {

    /**
     * Llama a: GET /api/profile/me
     */
    getMyProfile() {
        return api.get(`${BASE_URL}/me`);
    }

    /**
     * Llama a: PUT /api/profile/me
     * (Actualiza datos de texto como username, email, etc.)
     */
    updateMyProfile(profileData) {
        return api.put(`${BASE_URL}/me`, profileData);
    }

    /**
     * Llama a: POST /api/profile/change-password
     */
    changePassword(passwordData) {
        return api.post(`${BASE_URL}/change-password`, passwordData);
    }

    /**
     * Llama a: POST /api/profile/picture
     * (Sube el archivo de la foto de perfil)
     */
    uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('file', file);

        return api.post(`${BASE_URL}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

// Exportamos una instancia del servicio
export default new ProfileService();