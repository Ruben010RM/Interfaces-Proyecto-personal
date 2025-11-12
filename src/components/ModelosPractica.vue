<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <!-- Título principal -->
    <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
      <i class="bi bi-person-gear me-2"></i>Lista de Coches
    </h4>

    <!-- Formulario -->
    <form
      @submit.prevent="guardarModelo"
      class="p-3 bg-light rounded-3 border shadow-sm"
    >
      <!-- Matrícula con botón lupa a la derecha -->
      <div class="row g-3 mb-3 align-items-center">
        <div class="col-md-2">
          <label for="matricula" class="form-label fw-medium">Matrícula</label>
          <input
            type="text"
            id="matricula"
            class="form-control form-control-sm shadow-none"
            placeholder="Ej: 1234ABC"
            pattern="[0-9]{4}[A-Za-z]{3}"
            :disabled="editando"
            @blur="allMayus('matricula')"
            v-model="nuevoModelo.matricula"
            required
          />
        </div>
        <div class="col-md-1 d-flex align-items-end mt-5">
          <button
            type="button"
            class="btn btn-outline-primary btn-sm shadow-sm"
            @click="buscarModeloPorMatricula(nuevoModelo.matricula)"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
        <!-- Botón limpiar arriba derecha -->
        <div class="col-md-9 justify-content-end d-flex">
          <button
            type="button"
            class="btn btn-outline-primary shadow-sm"
            @click="limpiarPagina"
            title="Limpiar formulario"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>

      <!-- Resto campos en filas -->
      <div class="row g-3">
        <div class="col-md-6">
          <label for="nombre" class="form-label fw-medium">Nombre</label>
          <input
            type="text"
            id="nombre"
            class="form-control form-control-sm shadow-none"
            @blur="capitalizarTexto('nombre')"
            v-model="nuevoModelo.nombre"
            required
          />
        </div>

        <div class="col-md-6">
          <label for="dueno" class="form-label fw-medium">Dueño</label>
          <input
            type="text"
            id="dueno"
            class="form-control form-control-sm shadow-none"
            @blur="capitalizarTexto('dueno')"
            v-model="nuevoModelo.dueno"
            required
          />
        </div>
      </div>

      <div class="row g-3 mt-2">
        <div class="col-md-6">
          <label for="tipo" class="form-label fw-medium">Tipo</label>
          <select
            id="tipo"
            v-model="nuevoModelo.tipo"
            class="form-select form-select-sm shadow-none"
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

        <div class="col-md-6">
          <label for="marca" class="form-label fw-medium">Marca</label>
          <select
            id="marca"
            v-model="nuevoModelo.marca"
            class="form-select form-select-sm shadow-none"
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

      <div class="row mt-3 g-3 align-items-center">
        <!-- Columna izquierda: radio buttons centrados -->
        <div class="col-md-6 d-flex justify-content-center gap-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              value="Diesel"
              v-model="nuevoModelo.combustible"
              id="diesel"
            />
            <label class="form-check-label" for="diesel">Diesel</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              value="Gasolina"
              v-model="nuevoModelo.combustible"
              id="gasolina"
            />
            <label class="form-check-label" for="gasolina">Gasolina</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              value="Eléctrico"
              v-model="nuevoModelo.combustible"
              id="electrico"
            />
            <label class="form-check-label" for="electrico">Eléctrico</label>
          </div>
        </div>

        <!-- Columna derecha: checkbox ITV at right -->
        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <div class="form-check">
            <input
              type="checkbox"
              id="itv"
              v-model="nuevoModelo.itv"
              class="form-check-input"
            />
            <label for="itv" class="form-check-label">ITV</label>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center mt-3">
        <div class="form-check form-switch">
          <input
            type="checkbox"
            id="roto"
            v-model="mostrarRoto"
            class="form-check-input"
            @change="cargarModelos"
          />
          <label for="roto" class="form-check-label">Rotos</label>
        </div>
      </div>

      <div class="d-flex justify-content-center mt-4">
        <button type="submit" class="btn btn-primary px-4 shadow-sm">
          {{ editando ? "Modificar" : "Añadir" }}
        </button>
      </div>
    </form>

    <!-- Tabla -->
    <div class="table-responsive mt-4">
      <table
        class="table table-hover table-bordered align-middle text-center table-striped"
      >
        <thead class="table-primary">
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
            <td>
              <button
                class="btn btn-sm btn-danger me-2 shadow-none"
                @click="borrarModelo(modelo.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
              <button
                class="btn btn-sm btn-warning me-2 shadow-none"
                @click="editarModelo(modelo.id)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                v-if="modelo.roto"
                class="btn btn-sm btn-secondary shadow-none"
                @click="rotoModelo(modelo)"
                title="Activar cliente"
              >
                <i class="bi bi-tools"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
  getModeloPorMatricula,
} from "../api/modelosPractica";

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

const mostrarRoto = ref(false);

async function cargarModelos() {
  try {
    Swal.fire({
      icon: "success",
      title: "Listando Modelos...",
      showConfirmButton: false,
      timer: 1500,
    });
    modelos.value = await getModelo(mostrarRoto.value);
  } catch (error) {
    console.error("Fallo al cargar los datos de la bbdd", error);
  }
}
const opcionesMarca = ["Citroen", "Mazda", "Nissan", "Toyota", "Renault"];
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
  // Validar duplicados solo si estás creando (no si editando)
  if (!editando.value) {
    const duplicado = modelos.value.find(
      (modelo) =>
        modelo.matricula.toUpperCase() ===
        nuevoModelo.value.matricula.toUpperCase()
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "Matrícula duplicada",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
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
      id: String(
        // Si hay elementos en el array modelos...
        modelos.value.length > 0
          ? // Reducimos el array para encontrar el mayor id numérico existente
            modelos.value.reduce(
              // Función reductora: compara el acumulador 'max' con el id actual convertido a número y devuelve el mayor
              (max, modelo) => Math.max(max, Number(modelo.id)),
              0 // Valor inicial para el máximo es 0 (si el array está vacío)
            ) +
              // Sumamos 1 al máximo para obtener el nuevo id único
              1
          : // Si el array está vacío, el primer id será 1
            1
      ),
      nombre: nuevoModelo.value.nombre,
      matricula: nuevoModelo.value.matricula.toUpperCase(),
      dueno: nuevoModelo.value.dueno,
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

const allMayus = (propiedad) => {
  if (!nuevoModelo.value[propiedad]) return;
  nuevoModelo.value[propiedad] = nuevoModelo.value[propiedad].toUpperCase();
};

const buscarModeloPorMatricula = async (matricula) => {
  if (!matricula || matricula.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Debe introducir una matricula antes de buscar.",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  try {
    const modelo = await getModeloPorMatricula(matricula.trim().toUpperCase());
    console.log(modelo.value);
    if (!modelo) {
      Swal.fire({
        icon: "info",
        title: "Cliente no encontrado",
        text: "No existe ningún cliente con ese DNI.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // ✅ Cargar los datos en el formulario
    nuevoModelo.value = { ...modelo };
    editando.value = true;
    modeloEditandoId.value = modelo.id;

    Swal.fire({
      icon: "success",
      title: "Modelo encontrado y cargado",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error buscando cliente por DNI:", error);
    Swal.fire({
      icon: "error",
      title: "Error al buscar cliente",
      text: "Verifique la conexión o contacte con el administrador.",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};
</script>
<style scoped>
.container-fluid {
  height: 84.7vh;
}
</style>
