<template>
  <div class="container my-4 p-4 border rounded-4 shadow-lg bg-white">
    <h4
      class="text-center mb-4 fw-semibold text-primary border-bottom pb-2 mt-2"
    >
      <i class="bi bi-car-front me-2"></i>Venta de Coches
    </h4>

    <div class="row">
      <div
        class="col-sm-6 col-md-4 mb-4"
        v-for="coche in cochesPaginados"
        :key="coche.id"
      >
        <div class="card h-100 shadow-sm">
          <img
            :src="coche.imagen"
            class="card-img-top"
            :alt="coche.modelo"
            style="height: 180px; object-fit: cover"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ coche.modelo }}</h5>
            <p class="card-text text-muted mb-2">{{ coche.descripcion }}</p>
            <p class="card-text fw-bold mt-auto">
              € {{ coche.precio.toLocaleString() }}
            </p>
            <button class="btn btn-primary mt-3 w-100" :disabled="!coche.stock">
              {{ coche.stock ? "Comprar" : "Fuera de Stock" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center align-items-center my-3">
      <button
        class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none me-2"
        @click="beforePagina"
        :disabled="currentPage <= 1"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="text-muted mx-3">Página {{ currentPage }}</span>
      <button
        class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none"
        @click="nextPagina"
        :disabled="currentPage >= totalPages"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { getCoches } from "../api/coches";

const coches = ref([]);
const cochesPorPage = 6;
const currentPage = ref(1);
const numCoches = ref(0);

onMounted(async () => {
  coches.value = await getCoches();
  currentPage.value = 1;
  numCoches.value = coches.value.length;
});

const nextPagina = () => {
  const totalPages = Math.ceil(numCoches.value / cochesPorPage); //redondear hacia arriba para mostrar la última página aunque no esté completa
  if (currentPage.value < totalPages) {
    currentPage.value++;
  }
};

const beforePagina = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Propiedad computada para obtener los coches de la página actual
// computed crea una propiedad que se actualiza automáticamente
//cuando cambian las dependencias (Currentcoches)
// es decir paso pagina o vuelvo atrás cargando los coches de esa página
//slice extrae una sección del array coches
//start es el índice inicial y end el índice final (no incluido)
const cochesPaginados = computed(() => {
  const start = (currentPage.value - 1) * cochesPorPage;
  const end = start + cochesPorPage;
  return coches.value.slice(start, end);
});
</script>
<style scoped></style>
