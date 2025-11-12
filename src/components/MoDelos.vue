<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <h4
      class="text-center mb-4 fw-semibold text-primary border-bottom pb-2 mt-2"
    >
      <i class="bi bi-car-front me-2"></i>Registro de Vehículos
    </h4>

    <form
      @submit.prevent="guardarVehiculo"
      class="p-4 bg-light rounded-3 border shadow-sm mb-4"
    >
      <!-- FILA: Tipo, Marca, Modelo -->
      <div class="row g-3 align-items-center mt-1">
        <div class="col-12 col-md-4 d-flex align-items-center">
          <label class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Tipo:</label
          >
          <div class="d-flex align-items-center">
            <div
              class="form-check form-check-inline"
              v-for="tipo in tiposVehiculo"
            >
              <input
                class="form-check-input text"
                type="radio"
                id="tipo-coche"
                :value="tipo"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label" for="tipo-coche">{{
                tipo
              }}</label>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label
            for="matricula"
            class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Matricula:</label
          >
          <input
            type="text"
            id="matricula"
            v-model="vehiculo.matricula"
            class="form-control rounded shadow-none border"
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="marca" class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Marca:</label
          >
          <input
            type="text"
            id="marca"
            v-model="vehiculo.marca"
            class="form-control rounded shadow-none border"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="modelo" class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Modelo:</label
          >
          <input
            type="text"
            id="modelo"
            v-model="vehiculo.modelo"
            class="form-control rounded shadow-none border"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="anio" class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Año:</label
          >
          <input
            type="text"
            id="anio"
            v-model="vehiculo.anio"
            class="form-control rounded shadow-none border"
            required
          />
        </div>
      </div>

      <!-- FILA: Kilómetros, Precio, Combustible, Transmisión -->
      <div class="row g-3 align-items-center mt-2">
        <div class="col-12 col-md-3 d-flex align-items-center">
          <label
            for="kilometros"
            class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Kilómetros:</label
          >
          <input
            type="number"
            id="kilometros"
            v-model="vehiculo.kilometros"
            class="form-control rounded shadow-none border text-end"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label for="precio" class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Precio (€):</label
          >
          <input
            type="number"
            id="precio"
            v-model="vehiculo.precio"
            class="form-control rounded shadow-none border text-end"
            required
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label
            for="combustible"
            class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Combustible:</label
          >
          <select
            id="combustible"
            v-model="vehiculo.combustible"
            class="form-select rounded shadow-none border"
          >
            <option disabled value="">Seleccione</option>
            <option
              v-for="combustible in tiposCombustible"
              :value="combustible"
            >
              {{ combustible }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-3 d-flex align-items-center">
          <label
            for="transmision"
            class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Transmisión:</label
          >
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="transmision-manual"
              value="manual"
              v-model="vehiculo.transmision"
            />
            <label class="form-check-label" for="transmision-manual"
              >Manual</label
            >
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="transmision-automatica"
              value="automatica"
              v-model="vehiculo.transmision"
            />
            <label class="form-check-label" for="transmision-automatica"
              >Automática</label
            >
          </div>
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label
            for="potencia"
            class="form-label mb-0 me-3 text-nowrap fw-medium"
            >Potencia (CV):</label
          >
          <input
            type="text"
            id="potencia"
            v-model="vehiculo.potencia_cv"
            class="form-control rounded shadow-none border"
          />
        </div>

        <div class="col-12 col-md-2 d-flex align-items-center">
          <label class="orm-label mb-0 me-3 text-nowrap fw-medium"
            >Estado:</label
          >
          <select
            v-model="vehiculo.estado"
            class="form-select d-inline-block w-auto rounded shadow-none border"
          >
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="reservado">Reservado</option>
          </select>
        </div>
      </div>

      <!-- FILA: Descripción -->
      <div class="row g-2 mt-3">
        <div class="col">
          <label for="descripcion" class="form-label fw-medium"
            >Descripción:</label
          >
          <textarea
            id="descripcion"
            v-model="vehiculo.descripcion"
            rows="3"
            class="form-control rounded shadow-none border mb-2"
            placeholder="Describe el estado, revisiones, etc."
          ></textarea>
        </div>
      </div>
      <h6 class="text-center bg-primary-subtle py-1 fw-semibold rounded">
        <i class="bi bi-person me-2"></i>Cliente Ubicación
      </h6>
      <!-- FILA: Ubicación -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="provincia" class="form-label fw-medium">Provincia:</label>
          <select
            id="provincia"
            v-model="vehiculo.ubicacion.provincia"
            class="form-select rounded shadow-none border"
            @change="filtrarCiudades"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for="ciudad" class="form-label fw-medium">Ciudad:</label>
          <select
            id="ciudad"
            v-model="vehiculo.ubicacion.ciudad"
            class="form-select rounded shadow-none border"
          >
            <option disabled value="">Seleccione ciudad</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun.id"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>

        <div class="col-12 col-md-4">
          <label for="fecha_publicacion" class="form-label fw-medium"
            >Fecha Publicación:</label
          >
          <input
            type="date"
            id="fecha_publicacion"
            v-model="vehiculo.fecha_publicacion"
            class="form-control rounded shadow-none border"
          />
        </div>
      </div>

      <!-- FILA: Contacto -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 col-md-4">
          <label for="contacto_nombre " class="form-label fw-medium"
            >Nombre Contacto:</label
          >
          <input
            type="text"
            id="contacto_nombre"
            v-model="vehiculo.contacto.nombre"
            class="form-control rounded shadow-none border"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_telefono" class="form-label fw-medium"
            >Teléfono:</label
          >
          <input
            type="tel"
            id="contacto_telefono"
            v-model="vehiculo.contacto.telefono"
            class="form-control rounded shadow-none border"
          />
        </div>
        <div class="col-12 col-md-4">
          <label for="contacto_email" class="form-label fw-medium"
            >Email:</label
          >
          <input
            type="email"
            id="contacto_email"
            v-model="vehiculo.contacto.email"
            class="form-control rounded shadow-none border"
          />
        </div>
      </div>

      <!-- FILA: Estado y botón -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-12 d-flex align-items-center justify-content-center m">
          <div>
            <button
              type="submit"
              class="btn btn-primary rounded border shadow-none px-4 py-2"
            >
              {{ editando ? "Modificar" : "Guardar" }}
            </button>
            <button
              type="submit"
              class="btn btn-outline-danger rounded border-danger shadow-none px-4 py-2 ms-2"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const vehiculo = ref({
  tipo: "",
  marca: "",
  modelo: "",
  anio: "",
  kilometros: "",
  precio: "",
  matricula: "",
  combustible: "",
  transmision: "",
  puertas: "",
  potencia_cv: "",
  descripcion: "",
  ubicacion: {
    provincia: "",
    ciudad: "",
  },
  contacto: {
    nombre: "",
    telefono: "",
    email: "",
  },
  fecha_publicacion: "",
  estado: "disponible",
});

const tiposVehiculo = ref(["Coche", "Moto", "Furgoneta", "Camión"]);
const tiposCombustible = ref(["Gasolina", "Diésel", "Híbrido", "Eléctrico"]);

const provincias = ref([
  { id: 1, nm: "A Coruña" },
  { id: 2, nm: "Lugo" },
  { id: 3, nm: "Ourense" },
  { id: 4, nm: "Pontevedra" },
]);

const municipios = ref([
  { id: 1, nm: "Santiago de Compostela", prov: "A Coruña" },
  { id: 2, nm: "Ferrol", prov: "A Coruña" },
  { id: 3, nm: "Lugo", prov: "Lugo" },
  { id: 4, nm: "Monforte de Lemos", prov: "Lugo" },
  { id: 5, nm: "Ourense", prov: "Ourense" },
  { id: 6, nm: "Vigo", prov: "Pontevedra" },
  { id: 7, nm: "Pontevedra", prov: "Pontevedra" },
]);

const municipiosFiltrados = computed(() =>
  municipios.value.filter((m) => m.prov === vehiculo.value.ubicacion.provincia)
);
</script>
<style scoped>
.container-fluid {
  height: 84.59vh;
}
</style>
