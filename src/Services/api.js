import axios from 'axios';

// Creamos una instancia de Axios
const api = axios.create();

// ¡LA MAGIA! Esto se ejecuta ANTES de CUALQUIER petición
api.interceptors.request.use(
  (config) => {
    // 1. Busca el token en el almacenamiento local
    const token = localStorage.getItem('token');
    
    // 2. Si el token existe, lo pone en la cabecera 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config; // Deja que la petición continúe
  },
  (error) => {
    // Si hay un error, rechaza la promesa
    return Promise.reject(error);
  }
);

export default api;