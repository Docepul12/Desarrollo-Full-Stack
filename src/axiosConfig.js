import axios from 'axios';

// Crear una instancia de Axios personalizada
const iAX = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para solicitudes (request interceptor)
iAX.interceptors.request.use(
  (config) => {
    // Obtener el token almacenado y agregarlo a las cabeceras si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas (manejo de errores)
iAX.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

export default iAX;

