<template>
  <div class="container-fluid my-1 p-3 border rounded-3 shadow-sm bg-light">
    <!-- Título principal -->
    <h4
      class="text-center mx-2 my-1 bg-`primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-person-gear me-2"></i>Lista de Coches
    </h4>

    <!-- Botón para limpiar formulario -->
    <div class="d-flex justify-content-end">
      <button
        type="button"
        class="btn border border-primary border-2 rounded-0 text-primary shadow-none mt-2 me-2"
        style="--bs-btn-hover-bg: var(--bs-primary-bg-subtle)"
        @click="limpiarPagina"
        title="Limpiar formulario"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
    </div>

    <!-- Formulario para añadir o modificar modelo -->
    <form @submit.prevent="guardarModelo" class="mb-4">
      <div class="row g-3 align-items-end">
        <!-- Campo de nombre -->
        <div class="col-md-4">
          <label for="nombre" class="form-label">Nombre</label>
          <input
            type="text"
            class="form-control"
            id="nombre"
            @blur="capitalizarTexto('nombre')"
            v-model="nuevoModelo.nombre"
            required
          />
        </div>

        <!-- Campo de matricula -->
        <div class="col-md-4">
          <label for="matricula" class="form-label">Matricula: </label>
          <input
            type="text"
            class="form-control"
            id="matricula"
            pattern="[0-9]{4}[A-Za-z]{3}"
            v-model="nuevoModelo.matricula"
            required
          />
        </div>
      </div>
      <div class="row g-3 align-items-end">
        <!-- Campo de Dueño -->
        <div class="col-md-4">
          <label for="dueno" class="form-label">Dueño</label>
          <input
            type="text"
            class="form-control"
            id="dueno"
            @blur="capitalizarTexto('dueno')"
            v-model="nuevoModelo.dueno"
            required
          />
        </div>

        <div class="col-md-4">
          <label for="tipo" class="form-label">Tipo</label>
          <select
            id="tipo"
            v-model="nuevoModelo.tipo"
            class="form-select"
            required
          >
            <option disabled value="">Seleccione un tipo</option>
            <option
              v-for="opcion in opcionesTipo"
              :key="opcion"
              :value="opcion"
            >
              {{ opcion }}
            </option>
          </select>
        </div>
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label for="marca" class="form-label">Marca</label>
            <select
              id="marca"
              v-model="nuevoModelo.marca"
              class="form-select"
              required
            >
              <option disabled value="">Seleccione una marca</option>
              <option
                v-for="opcion in opcionesMarca"
                :key="opcion"
                :value="opcion"
              >
                {{ opcion }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="d-flex justify-content-center align-items-center mt-2 me-2 gap-5"
      >
        <label for="combustible1"
          >Diesel:
          <input
            type="radio"
            v-model="nuevoModelo.combustible"
            value="Diesel"
            class="form-input"
        /></label>
        <label for="combustible2"
          >Gasolina:
          <input
            type="radio"
            v-model="nuevoModelo.combustible"
            value="Gasolina"
            class="form-input"
        /></label>
        <label for="combustible3"
          >Eléctrico:
          <input
            type="radio"
            v-model="nuevoModelo.combustible"
            value="Eléctrico"
            class="form-input"
        /></label>
      </div>
      <div
        class="form-check d-flex justify-content-center align-items-center mt-2 me-2"
      >
        <label for="ITV"
          >ITV
          <input
            type="checkbox"
            v-model="nuevoModelo.itv"
            class="form-check-input"
        /></label>
      </div>
      <!-- Botón de acción: Añadir o Modificar -->
      <button type="submit" class="btn btn-primary mt-3">
        {{ editando ? "Modificar" : "Añadir" }}
      </button>
    </form>

    <!-- Tabla que muestra la lista de empleados cargados -->
    <table
      class="table table-bordered table-striped table-hover table-sm align-middle table-responsive"
    >
      <thead class="thead-dark table-primary text-center">
        <tr>
          <th>Nombre</th>
          <th>Matrícula</th>
          <th>Dueño</th>
          <th>Tipo</th>
          <th>Marca</th>
          <th>Combustible</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="modelo in modelos" :key="modelo.id">
          <td>{{ modelo.nombre }}</td>
          <td>{{ modelo.matricula }}</td>
          <td>{{ modelo.dueno }}</td>
          <td>{{ modelo.tipo }}</td>
          <td>{{ modelo.marca }}</td>
          <td>{{ modelo.combustible }}</td>
          <td class="align-middle text-center">
            <!-- Botón para eliminar un modelo -->
            <button
              class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0"
              @click="borrarModelo(modelo.id)"
            >
              <i class="bi bi-trash"></i>
            </button>

            <!-- Botón para editar un modelo -->
            <button
              class="btn btn-warning btn-sm shadow-none rounded-0"
              @click="editarModelo(modelo.id)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              v-if="modelo.roto === true"
              @click="rotoModelo(modelo)"
              class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
              title="Activar cliente"
            >
              <i class="bi bi-unlock"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getModelo,
  addModelo,
  deleteModelo,
  updateModelo,
} from "../api/modelos";

const modelos = ref([]);
const nuevoModelo = ref({
  nombre: "",
  matricula: "",
  tipo: "",
  dueno: "",
  marca: "",
  combustible: "",
  roto: false,
  itv: false,
});

async function cargarModelos() {
  try {
    Swal.fire({
      icon: "success",
      title: "Listando Modelos...",
      showConfirmButton: false,
      timer: 1500,
    });
    modelos.value = await getModelo();
  } catch (error) {
    console.error("Fallo al cargar los datos de la bbdd", error);
  }
}
const opcionesMarca = ["Citroen", "Mazda", "Nissan", "Toyota"];
const opcionesTipo = ["Deportivo", "Turismo", "Todoterreno", "Camión"];
const editando = ref(false);
const modeloEditandoId = ref("");

onMounted(async () => {
  await cargarModelos();
});

async function guardarModelo() {
  if (
    !nuevoModelo.value.nombre.trim() ||
    !nuevoModelo.value.matricula.trim() ||
    !nuevoModelo.value.tipo.trim()
  ) {
    alert("Por favor rellena los campos solicitados");
    return;
  }

  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este modelo?"
      : "¿Desea añadir este modelo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Añadir",
    cancelButtonText: "Cancelar",
  });
  if (!result.isConfirmed) {
    return;
  }

  if (editando.value) {
    const index = modelos.value.findIndex(
      (modelo) => modelo.id === modeloEditandoId.value
    );
    if (index !== -1) {
      modelos.value[index] = { ...nuevoModelo.value };
    }
    try {
      await updateModelo(modeloEditandoId.value, nuevoModelo.value);
      Swal.fire({
        icon: "success",
        title: "Modelo modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al actualizar moodelo", error);
      Swal.fire({
        icon: "error",
        title: "Error al modificar modelo",
        text: "Inténtelo de nuevo o contacte con el administrador.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } else {
    const modeloNuevo = {
      id: String(modelos.value.length > 0 ? modelos.value.length + 1 : 1),
      nombre: nuevoModelo.value.nombre,
      matricula: nuevoModelo.value.matricula.toUpperCase(),
      dueno: nuevoModelo.value.matricula,
      tipo: nuevoModelo.value.tipo,
      marca: nuevoModelo.value.marca,
      combustible: nuevoModelo.value.combustible,
      roto: nuevoModelo.value.roto,
      itv: nuevoModelo.value.itv,
    };
    try {
      await addModelo(modeloNuevo);
      modelos.value.push(modeloNuevo);
      Swal.fire({
        icon: "success",
        title: "Modelo agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Fallo al añadir el nuevo modelo a la BBDD", error);
      Swal.fire({
        icon: "error",
        title: "Error al añadir modelo",
        text: "Inténtelo de nuevo o contacte con el administrador.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  limpiarPagina();
}

async function borrarModelo(id) {
  try {
    const result = await Swal.fire({
      title: `¿Eliminar el modelo?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    await deleteModelo(id);
    modelos.value = modelos.value.filter((modelo) => modelo.id !== id);
    Swal.fire({
      icon: "success",
      title: "Cliente eliminado",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error a la hora de eliminar el modelo", error);
    Swal.fire({
      icon: "error",
      title: "Error al eliminar modelo",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

async function editarModelo(id) {
  editando.value = true;
  nuevoModelo.value = { ...modelos.value.find((modelo) => modelo.id == id) };
  modeloEditandoId.value = id;
}

function limpiarPagina() {
  nuevoModelo.value.nombre = "";
  nuevoModelo.value.matricula = "";
  nuevoModelo.value.dueno = "";
  nuevoModelo.value.tipo = "";
  nuevoModelo.value.marca = "";
  nuevoModelo.value.combustible = "";
  nuevoModelo.value.roto = false;
  nuevoModelo.value.itv = false;
  editando.value = false;
}

const capitalizarTexto = (propiedad) => {
  if (!nuevoModelo.value[propiedad]) return;
  nuevoModelo.value[propiedad] = nuevoModelo.value[propiedad]
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
};
</script>
<style scoped></style>
