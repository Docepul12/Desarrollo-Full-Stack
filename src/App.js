import React, { useEffect, useState } from 'react'; // Importamos React y los hooks useEffect y useState
import iAX from './axiosConfig'; // Importamos la configuración de Axios
import './App.css'; // Importamos los estilos para la aplicación

// Definimos el componente principal de la aplicación
function App() {
  // Estados del componente para manejar datos y control de flujo
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario creado
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error
  const [loading, setLoading] = useState(false); // Estado para manejar si el componente está "cargando"
  const [userCreated, setUserCreated] = useState(false); // Estado para indicar si el usuario fue creado con éxito

  // useEffect: Efecto secundario que se ejecuta al montar el componente o cuando cambia userCreated
  useEffect(() => {
    // Paso 1: Obtener el token si el usuario aún no ha sido creado
    if (!userCreated) {
      // Función para obtener el token
      const obtenerToken = async () => {
        setLoading(true); // Activamos el indicador de carga mientras se realiza la solicitud
        try {
          // Hacemos una solicitud POST para obtener el token con las credenciales proporcionadas
          const response = await iAX.post('/login', {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka',
          });
          const token = response.data.token; // Obtenemos el token de la respuesta

          // Almacenar el token en el almacenamiento local del navegador para usarlo más adelante
          localStorage.setItem('token', token);

          // Paso 2: Crear un usuario con el token obtenido
          await crearUsuario();
        } catch (error) {
          // Si hay un error al obtener el token, lo registramos y actualizamos el estado de error
          setError('Error al obtener el token');
          console.error('Error al obtener el token:', error);
        } finally {
          // Desactivamos el indicador de carga cuando termina la solicitud (ya sea con éxito o error)
          setLoading(false);
        }
      };

      // Función para crear un usuario
      const crearUsuario = async () => {
        setLoading(true); // Activamos el indicador de carga mientras se realiza la solicitud
        try {
          // Hacemos una solicitud POST para crear un usuario
          await iAX.post('/users', {
            name: 'RAGAR', // Nombre del usuario que estamos creando
            job: 'FS-G262', // Trabajo del usuario
          });

          // Paso 3: Consultar la información del usuario creado
          await consultarUsuario(5); // Usamos un ID fijo (por ejemplo, 5) para evitar errores de "usuario no encontrado"
        } catch (error) {
          // Si hay un error al crear el usuario, lo registramos y actualizamos el estado de error
          setError('Error al crear usuario');
          console.error('Error al crear usuario:', error);
        } finally {
          // Desactivamos el indicador de carga
          setLoading(false);
        }
      };

      // Función para consultar la información del usuario creado
      const consultarUsuario = async (userId) => {
        setLoading(true); // Activamos el indicador de carga
        try {
          // Hacemos una solicitud GET para obtener la información del usuario usando el ID proporcionado
          const response = await iAX.get(`/users/${userId}`);
          // Guardamos los datos del usuario en el estado para mostrarlos más adelante en la interfaz
          setUser({
            id: response.data.data.id,
            name: response.data.data.first_name + ' ' + response.data.data.last_name, // Nombre completo
            email: response.data.data.email, // Email del usuario
            avatar: response.data.data.avatar, // URL del avatar del usuario
            job: 'FS-G262', // Se asume el mismo trabajo que se usó al crear el usuario
            createdAt: new Date().toISOString(), // Fecha actual como fecha de creación
          });
          setUserCreated(true); // Indicamos que el usuario fue creado exitosamente
        } catch (error) {
          // Si hay un error al consultar el usuario, lo registramos y actualizamos el estado de error
          setError('Error al consultar usuario');
          console.error('Error al consultar usuario:', error);
        } finally {
          // Desactivamos el indicador de carga
          setLoading(false);
        }
      };

      // Llamamos a la función para obtener el token al cargar el componente
      obtenerToken();
    }
  }, [userCreated]); // El efecto se ejecuta cuando cambia el estado userCreated

  // Renderizamos la interfaz del usuario
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ejercicio Interceptores - Axios en React</h1>
        {loading && <p>Cargando...</p>} {/* Si está cargando, mostramos un mensaje */}
        {error && <p className="error">{error}</p>} {/* Si hay un error, lo mostramos */}
        {user && ( // Si el usuario existe, mostramos su información
          <div className="user-card">
            <h2>Usuario Creado</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Job:</strong> {user.job}</p>
            <p><strong>Creado en:</strong> {user.createdAt}</p>
            <img src={user.avatar} alt="Avatar" /> {/* Mostramos el avatar del usuario */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
















