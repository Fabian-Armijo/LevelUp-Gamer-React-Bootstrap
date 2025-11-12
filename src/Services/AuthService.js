import api from './api';

const BASE_URL = 'http://localhost:8081/api/auth';

class AuthService {

    /**
     * Llama al endpoint /api/auth/register
     * @param {object} userData - El objeto con (username, email, password, dateOfBirth)
     */
    register(userData) {
        return api.post(`${BASE_URL}/register`, userData);
    }

    /**
     * Llama al endpoint /api/auth/login
     * @param {object} credentials - El objeto con (username, password)
     */
    login(credentials) {
      return api.post(`${BASE_URL}/login`, credentials);
    }

}

export default new AuthService();