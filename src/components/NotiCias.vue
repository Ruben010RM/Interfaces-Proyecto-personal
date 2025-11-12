<template>
  <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
    <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2">
      <i class="bi bi-newspaper me-2"></i>Noticias del Motor
    </h4>

    <!-- Formulario para agregar noticia -->
    <div class="card mb-5 border-0 shadow-sm bg-light-subtle rounded-3">
      <div class="card-body">
        <h5 class="card-title text-primary fw-semibold mb-3">
          Agregar nueva noticia
        </h5>
        <form
          @submit.prevent="agregarNoticia"
          class="p-4 bg-light rounded-3 border shadow-sm mb-4"
        >
          <div class="mb-3">
            <label class="form-label fw-medium"
              >Título (máx. 128 caracteres)</label
            >
            <input
              v-model="nuevaNoticia.titulo"
              type="text"
              class="form-control form-control-sm shadow-none"
              placeholder="Máximo 128 caracteres"
              maxlength="128"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label fw-medium"
              >Contenido (máx. 256 caracteres)</label
            >
            <textarea
              v-model="nuevaNoticia.contenido"
              class="form-control form-control-sm shadow-none"
              rows="3"
              placeholder="Máximo 256 caracteres"
              maxlength="256"
              required
            ></textarea>
          </div>
          <div class="text-center mt-3">
            <button type="submit" class="btn btn-primary px-4 shadow-sm">
              <i class="bi bi-send me-1"></i> Publicar noticia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Lista de noticias -->
    <div class="row g-4 flex-column">
      <div class="col-12" v-for="noticia in noticias" :key="noticia.id">
        <div
          class="card border-0 shadow-sm rounded-3 h-100 bg-body-tertiary"
          :class="{
            'border border-2 border-primary': noticiaExpandida === noticia.id,
          }"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <h5 class="card-title text-dark fw-semibold mb-0 flex-grow-1">
                  {{ noticia.titulo }}
                </h5>
                <div class="d-flex flex-column text-end ms-3">
                  <small class="text-muted texto-fecha">
                    {{ formatearFecha(noticia.fecha) }}
                  </small>
                  <button
                    class="btn btn-outline-danger btn-sm mt-2 shadow-none"
                    @click="eliminarNoticia(noticia.id)"
                    title="Eliminar noticia"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <p class="card-text text-secondary lh-sm mt-2">
                {{
                  noticiaExpandida === noticia.id
                    ? contenidoLimitado(noticia.contenido)
                    : resumen(noticia.contenido)
                }}
              </p>
            </div>

            <div class="text-end mt-2">
              <button
                class="btn btn-outline-primary btn-sm shadow-none"
                @click="toggleExpand(noticia.id)"
              >
                {{
                  noticiaExpandida === noticia.id ? "Leer menos" : "Leer más"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Datos principales
const noticias = ref([]);
const noticiaExpandida = ref(null);

// Datos del formulario
const nuevaNoticia = ref({
  titulo: "",
  contenido: "",
});

// Cargar las noticias desde el JSON
onMounted(async () => {
  const res = await fetch("http://localhost:3000/noticias");
  const data = await res.json();
  // Ordenar las noticias por fecha descendente
  noticias.value = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

function resumen(texto) {
  return texto.length > 126 ? texto.slice(0, 126) + "…" : texto;
}

function contenidoLimitado(texto) {
  return texto.length > 256 ? texto.slice(0, 256) + "…" : texto;
}

function toggleExpand(id) {
  noticiaExpandida.value = noticiaExpandida.value === id ? null : id;
}
function formatearFecha(fecha) {
  const date = new Date(fecha);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
// Agregar nueva noticia
function agregarNoticia() {
  if (!nuevaNoticia.value.titulo || !nuevaNoticia.value.contenido) return;
  const ahora = new Date();
  const idNum =
    noticias.value.length > 0
      ? Math.max(...noticias.value.map((n) => n.id)) + 1
      : 1;
  const nueva = {
    id: idNum.toString(),
    titulo: nuevaNoticia.value.titulo.trim(),
    contenido: nuevaNoticia.value.contenido.trim(),
    fecha: ahora.toISOString().trim(),
  };

  noticias.value.unshift(nueva);
  try {
    axios.post("http://localhost:3000/noticias", nueva).then((res) => res.data);
  } catch (error) {
    console.error("Fallo al añadir la nueva noticia a la bbdd", error);
    throw error;
  }

  // Limpiar formulario
  nuevaNoticia.value.titulo = "";
  nuevaNoticia.value.contenido = "";
}

// Eliminar noticia
async function eliminarNoticia(id) {
  noticias.value = noticias.value.filter((n) => n.id !== id);
  try {
    await axios.delete(`http://localhost:3000/noticias/${id}`);
  } catch (error) {
    console.error("No se pudo eliminar la noticia de la BBDD", error);
  }
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
  background-color: rgba(240, 248, 255, 0.35);
}
.texto-fecha {
  min-width: 90px;
  text-align: right;
  font-size: 0.85rem;
}
</style>
