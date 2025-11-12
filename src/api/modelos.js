import axios from "axios";

let API_URL = "http://localhost:3000/modelos";

export async function getModelo(mostrarRoto) {
  let url = API_URL;
  if (!mostrarRoto) {
    url += `?roto=false`;
  }
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error al conseguir los datos", error);
  }
}
export async function addModelo(modelo) {
  try {
    await axios.post(API_URL, modelo);
  } catch (error) {
    console.error("Error al añadir los datos", error);
  }
}
export async function deleteModelo(id) {
  try {
    await axios.delete(API_URL + `/${id}`);
  } catch (error) {
    console.error("Error al borrar el coche", error);
  }
}

export async function updateModelo(id, modelo) {
  try {
    await axios.put(API_URL + `/${id}`, modelo);
  } catch (error) {
    console.error("Error al actualizar el coche", error);
  }
}

export async function getModeloPorMatricula(matricula) {
  try {
    // Si tu API permite filtrar por DNI (ej. JSON-Server), puedes hacer:
    const response = await axios.get(`${API_URL}?matricula=${matricula}`);
    // Si devuelve un array, retornamos el primer resultado o null si no hay ninguno
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("Error buscando modelo por matricula:", error);
    throw error;
  }
}
