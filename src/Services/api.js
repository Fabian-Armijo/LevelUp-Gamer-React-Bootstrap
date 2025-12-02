import axios from 'axios';

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log("Interceptor activado para:", config.url);
    console.log("Token recuperado del storage:", token);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("Header Authorization agregado exitosamente.");
    } else {
      console.warn("¡ALERTA! No se encontró token en localStorage bajo la clave 'token'.");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;