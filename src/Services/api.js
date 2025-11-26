import axios from 'axios';

// Creamos una instancia de Axios
const api = axios.create();

// ¡LA MAGIA! Esto se ejecuta ANTES de CUALQUIER petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // AGREGA ESTO PARA VERIFICAR EN CONSOLA
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
    // Si hay un error, rechaza la promesa
    return Promise.reject(error);
  }
);

export default api;