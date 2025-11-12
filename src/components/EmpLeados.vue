<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <!-- Título principal -->
    <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
      <i class="bi bi-person-gear me-2"></i>Lista de Empleados
    </h4>

    <!-- Formulario -->
    <form
      @submit.prevent="agregarEmpleado"
      class="p-4 bg-light rounded-3 border shadow-sm mb-4"
    >
      <!-- Contenedor flex para botón arriba a la derecha -->
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-outline-primary border-2 shadow-sm"
          @click="limpiarPagina"
          title="Limpiar formulario"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>

      <!-- Resto campos formulario -->
      <div class="row g-3 align-items-end gap-3">
        <div class="col-md-3">
          <label for="nombre" class="form-label fw-medium">Nombre</label>
          <input
            type="text"
            id="nombre"
            class="form-control form-control-sm shadow-none"
            @blur="capitalizarTexto('nombre')"
            v-model="nuevoEmpleado.nombre"
            required
          />
        </div>

        <div class="col-md-3">
          <label for="puesto" class="form-label fw-medium">Puesto</label>
          <select
            id="puesto"
            v-model="nuevoEmpleado.puesto"
            class="form-select form-select-sm shadow-none"
            required
          >
            <option disabled value="">Seleccione un puesto</option>
            <option
              v-for="opcion in opcionesPuesto"
              :key="opcion"
              :value="opcion"
            >
              {{ opcion }}
            </option>
          </select>
        </div>

        <div class="col-md-4">
          <label for="email" class="form-label fw-medium">Email</label>
          <input
            type="email"
            id="email"
            v-model="nuevoEmpleado.email"
            class="form-control form-control-sm shadow-none"
            required
          />
        </div>
      </div>

      <div
        class="form-switch form-check d-flex justify-content-between align-items-center mt-3"
      >
        <div>
          <input
            type="checkbox"
            id="historico"
            v-model="mostrarHistorico"
            class="form-check-input"
            @change="cargarEmpleados"
          />
          <label for="historico" class="form-check-label">Histórico</label>
        </div>

        <button
          type="submit"
          class="btn btn-primary px-4 shadow-sm"
          :disabled="botonDeshabilitado"
        >
          {{ editando ? "Modificar" : "Añadir" }}
        </button>
      </div>
    </form>

    <!-- Tabla -->
    <div class="table-responsive mt-4">
      <table
        class="table table-bordered table-striped table-hover align-middle text-center shadow-sm"
      >
        <thead class="table-primary">
          <tr>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="empleado in empleados" :key="empleado.id">
            <td>{{ empleado.nombre }}</td>
            <td>{{ empleado.puesto }}</td>
            <td>{{ empleado.email }}</td>
            <td class="align-middle">
              <button
                class="btn btn-sm btn-danger me-2 shadow-sm"
                @click="borrarEmpleado(empleado.id)"
                title="Eliminar empleado"
              >
                <i class="bi bi-trash"></i>
              </button>

              <button
                class="btn btn-sm btn-warning text-white me-2 shadow-sm"
                @click="editarEmpleado(empleado.id)"
                title="Editar empleado"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button
                v-if="empleado.historico === true"
                class="btn btn-sm btn-secondary shadow-sm"
                @click="activarEmpleado(empleado)"
                title="Activar empleado"
              >
                <i class="bi bi-unlock"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
/* Importaciones de Vue y librerías externas */
import { ref, onMounted, computed } from "vue";
import {
  getEmpleados,
  guardarEmpleados,
  deleteEmpleado,
  updateEmpleado,
} from "../api/empleados"; // Funciones CRUD de API externa
import Swal from "sweetalert2"; // Librería para mostrar alertas bonitas

/* Lista de opciones disponibles para el puesto */
const opcionesPuesto = [
  "Desarrollador/a",
  "Diseñador/a",
  "Marketing",
  "Gerente",
  "Analista",
  "Soporte",
];

/* Variables reactivas */
const empleados = ref([]); // Lista de empleados
const nuevoEmpleado = ref({ nombre: "", email: "", puesto: "" }); // Datos del formulario
const editando = ref(false); // Indica si estamos modificando un empleado
const empleadoEditando = ref(""); // ID del empleado que se edita actualmente
const mostrarHistorico = ref(false);
/* Deshabilita el botón si faltan campos por completar */
const botonDeshabilitado = computed(() => {
  return (
    !nuevoEmpleado.value.nombre.trim() ||
    !nuevoEmpleado.value.puesto.trim() ||
    !nuevoEmpleado.value.email.trim()
  );
});

/* Carga la lista de empleados desde la API */
async function cargarEmpleados() {
  Swal.fire({
    icon: "success",
    title: "Listando Empleados...",
    showConfirmButton: false,
    timer: 1500,
  });
  empleados.value = await getEmpleados(mostrarHistorico.value);
}

/* Ejecutar carga inicial al montar el componente */
onMounted(() => {
  cargarEmpleados();
});

/* Añadir o modificar un empleado existente */
async function agregarEmpleado() {
  // Validación de campos vacíos
  if (
    !nuevoEmpleado.value.nombre.trim() ||
    !nuevoEmpleado.value.puesto.trim() ||
    !nuevoEmpleado.value.email.trim()
  ) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Pregunta de confirmación
  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este empleado?"
      : "¿Desea añadir este empleado?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Añadir",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  // Si estamos en modo edición, actualizamos datos
  if (editando.value == true) {
    const index = empleados.value.findIndex(
      (e) => e.id === empleadoEditando.value
    );
    if (index !== -1) {
      empleados.value[index] = { ...nuevoEmpleado.value };
      //Esto es para modificar el array local despues de confirmar ya que
      //si no se verian los cambios en tiempo real y no querermos eso
    }
    try {
      // Llamada API para actualizar en servidor(necesita ID y el valor del objeto)
      await updateEmpleado(
        empleadoEditando.value,
        nuevoEmpleado.value
      ); /*Como los datos se cargaron en el formulario, 
      simplemente cambimos lo q queremos y ya se ve reflejado en el nuevoEmpleado.value al estar asociado con 
      v-models y ser un elemento reactivo*/
      Swal.fire({
        icon: "success",
        title: "Empleado modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      // Manejo de error al actualizar
      console.error("Error al actualizar empleado", error);
      Swal.fire({
        icon: "error",
        title: "Error al modificar empleado",
        text: "Inténtelo de nuevo o contacte con el administrador.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } else {
    // Si es un nuevo empleado, se guarda y añade al listado
    const nuevo = {
      id: String(empleados.value.length + 1),
      nombre: nuevoEmpleado.value.nombre,
      email: nuevoEmpleado.value.email,
      puesto: nuevoEmpleado.value.puesto,
    };
    try {
      // Llamada API para guardar empleado nuevo
      await guardarEmpleados(nuevo);
      empleados.value.push(nuevo); // Añade nuevo empleado a la lista reactiva
      Swal.fire({
        icon: "success",
        title: "Empleado agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      // Manejo de error al guardar nuevo empleado
      console.error("Fallo al agregar el nuevo empleado", error);
      Swal.fire({
        icon: "error",
        title: "Error al añadir empleado",
        text: "Inténtelo de nuevo o contacte con el administrador.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  limpiarPagina(); // Limpia el formulario después de la acción
}

/* Eliminar un empleado con confirmación,
la funcion deleteEmpleado viene de empleados.js
y como es async, tenemos q volver tambien asyn aquella que 
lo envuelve*/
async function borrarEmpleado(id) {
  try {
    const result = await Swal.fire({
      title: `¿Eliminar al empleado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // Eliminar empleado por id usando API y filtrar del array local para actualizar UI
    await deleteEmpleado(id);
    empleados.value = empleados.value.filter((e) => e.id !== id);
    Swal.fire({
      icon: "success",
      title: "Cliente eliminado",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    // Manejo de posibles errores de eliminación
    console.error("Error a la hora de eliminar el empleado", error);
  }
}

/* Función para preparar el formulario para edición, cargando datos del empleado seleccionado */
async function editarEmpleado(id) {
  editando.value = true; // Cambia el modo a edición
  nuevoEmpleado.value = { ...empleados.value.find((e) => e.id == id) };
  // Clona los datos del empleado a nuevoEmpleado para editar sin modificar la lista aún(no le pasamos los datos como tal, solo una copia)

  //Necesitamos esta vraiable para poder mandarle al axios despues el id de alguna manera
  //Y tambien para acceder al indice de empleados del objeto q queremos actualizar
  //para que los cambios no se ven hasta que aceptemos
  empleadoEditando.value = id;
}

/* Limpia los campos del formulario y reinicia los estados */
function limpiarPagina() {
  nuevoEmpleado.value.email = "";
  nuevoEmpleado.value.nombre = "";
  nuevoEmpleado.value.puesto = "";
  editando.value = false;
  empleadoEditando.value = "";
}

/* Capitaliza automáticamente el texto de entrada en base al id (nombre) */
const capitalizarTexto = (propiedad) => {
  if (!nuevoEmpleado.value[propiedad]) return;
  nuevoEmpleado.value[propiedad] = nuevoEmpleado.value[propiedad]
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
};

///////////////Función para activar cliente (poner historico en true)
const activarEmpleado = async (empleado) => {
  const confirmacion = await Swal.fire({
    title: `¿Activar empleado ${empleado.nombre}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Activar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmacion.isConfirmed) return;

  try {
    // Crear una copia del cliente con historico en true
    const empleadoActivado = { ...empleado, historico: false };

    // Llamar a la API para actualizar
    const actualizado = await updateEmpleado(empleado.id, empleadoActivado);

    // Actualizar la lista local (opcional, también puedes volver a cargar todo)
    const index = empleados.value.findIndex((e) => e.id === empleado.id);
    if (index !== -1) {
      empleados.value[index] = actualizado;
    }

    Swal.fire({
      icon: "success",
      title: "Empleado reactivado",
      showConfirmButton: false,
      timer: 1500,
    });

    // Recargar lista actualizada
    await cargarEmpleados();
  } catch (error) {
    console.error("Error al reactivar empleado:", error);
    Swal.fire({
      icon: "error",
      title: "Error al activar cliente",
      text: "Por favor, intenta de nuevo.",
      timer: 1500,
    });
  }
};
</script>

<style scoped>
.container-fluid {
  height: 84.59vh;
}
</style>
