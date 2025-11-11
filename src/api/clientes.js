import axios from "axios";
//  librería de JavaScript que actúa como un cliente HTTP
// para realizar solicitudes entre el navegador y el servidor,
// URL base de la "API". Si usas json-server local, asegúrate de la IP:
const API_URL = "http://localhost:3000/clientes";

// Función para obtener la lista de clientes desde la API

export const getClientes = (mostrarHistorico) => {
  let url = `${API_URL}?_sort=apellidos&_order=asc`;

  if (!mostrarHistorico) {
    // Solo clientes con histórico = true
    url += `&historico=true`;
  } else {
    // Todos los clientes, sin filtrar por histórico
    url += ``;
  }
  return axios.get(url).then((res) => res.data);
};

// Función para agregar cliente nuevo
export const addCliente = (nuevoCliente) => {
  return axios.post(API_URL, nuevoCliente).then((res) => res.data);
};

// Funcion para eliminar un cliente por su id pasando histórico a false
// Si quieres eliminarlo físicamente, usa axios.delete
export const deleteCliente = (id) => {
  return axios
    .patch(`${API_URL}/${id}`, { historico: false })
    .then((res) => res.data);
};

//Funcion actualizar un cliente por su id
export const updateCliente = (id, clienteActualizado) => {
  return axios
    .put(`${API_URL}/${id}`, clienteActualizado)
    .then((res) => res.data);
};

// 🔹 Buscar cliente por DNI
export const getClientePorDni = async (dni) => {
  try {
    // Si tu API permite filtrar por DNI (ej. JSON-Server), puedes hacer:
    const response = await axios.get(`${API_URL}?dni=${dni}`);
    // Si devuelve un array, retornamos el primer resultado o null si no hay ninguno
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("Error buscando cliente por DNI:", error);
    throw error;
  }
};

//export const deleteNoticia(id){
//  try{
//    return axios.delete('${API_URL}/${id}').then(res => res.data)
// }.catch(error){
//    console.error('Error al eliminar la noticia:', error)
//    throw error
//    }
//}

//Esto hace una llamada a la db.json manipulada por json-server, concretamente al array de clientes porque la url tiene clientes,
//y le hace un apeticion con axios para hacer delete en base a un id que pasamos por parametro
