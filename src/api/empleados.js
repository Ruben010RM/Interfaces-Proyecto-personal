import axios from "axios";

export async function getEmpleados(mostrarHistorico) {
  let url = "http://localhost:3000/empleados?_sort=nombre&_order=asc";
  if (!mostrarHistorico) {
    // Solo clientes con histórico = true
    url += `&historico=false`;
  }
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error al hacer el get a la BBDD", error);
  }
}

export async function guardarEmpleados(empleado) {
  const res = await axios.post("http://localhost:3000/empleados", empleado);
  return res.data;
}
export async function deleteEmpleado(id) {
  const res = await axios.delete(`http://localhost:3000/empleados/${id}`);
  return res.data;
}

export const updateEmpleado = (id, nuevosDatos) => {
  return axios
    .put(`http://localhost:3000/empleados/${id}`, nuevosDatos)
    .then((res) => res.data);
};
