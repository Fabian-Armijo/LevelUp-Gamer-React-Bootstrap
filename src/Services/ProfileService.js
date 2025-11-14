import api from './api'; // ¡Importa el interceptor!

const BASE_URL = 'http://localhost:8081/api/profile';

class ProfileService {

    /**
     * Llama a: GET /api/profile/me
     * (Obtiene los datos del usuario logueado)
     */
    getMyProfile() {
        return api.get(`${BASE_URL}/me`);
    }

    /**
     * Llama a: PUT /api/profile/me
     * (Actualiza datos de texto como username, email, etc.)
     */
    updateMyProfile(profileData) {
        // profileData es un objeto: { username: "...", email: "...", ... }
        return api.put(`${BASE_URL}/me`, profileData);
    }

    /**
     * Llama a: POST /api/profile/change-password
     * (Cambia la contraseña)
     */
    changePassword(passwordData) {
        // passwordData es un objeto: { oldPassword: "...", newPassword: "..." }
        return api.post(`${BASE_URL}/change-password`, passwordData);
    }

    /**
     * ¡NUEVO! Llama a: POST /api/profile/picture
     * (Sube el archivo de la foto de perfil)
     */
    uploadProfilePicture(file) {
        // 1. Crea un objeto FormData para enviar el archivo
        const formData = new FormData();
        
        // 2. Añade el archivo. La clave "file" DEBE coincidir
        //    con el @RequestParam("file") de tu ProfileController.
        formData.append('file', file);

        // 3. Envía la petición con el formData
        return api.post(`${BASE_URL}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Axios suele hacer esto, pero no está de más
            }
        });
    }
}

// Exportamos una instancia del servicio
export default new ProfileService();