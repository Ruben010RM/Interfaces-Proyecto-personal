<template>
  <div class="container-fluid my-3">
    <h4
      class="text-center mb-4 my-2 bg-primary-subtle py-1 border bg-primary bg-opacity-25 text-primary p-3 rounded"
    >
      <i class="bi bi-newspaper me-2"></i>Noticias motor
    </h4>

    <!-- Formulario para agregar noticia -->
    <div class="card mb-5 shadow-sm">
      <div class="card-body">
        <h5 class="card-title mb-3">Agregar nueva noticia</h5>
        <form @submit.prevent="agregarNoticia">
          <div class="mb-3">
            <label class="form-label">Título (máx. 128 caracteres)</label>
            <input
              v-model="nuevaNoticia.titulo"
              type="text"
              class="form-control"
              placeholder="Máximo 128 caracteres"
              maxlength="128"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Contenido (máx. 256 caracteres)</label>
            <textarea
              v-model="nuevaNoticia.contenido"
              class="form-control"
              rows="3"
              placeholder="Máximo 256 caracteres"
              maxlength="256"
              required
            ></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">
              Publicar noticia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Lista de noticias -->
    <div class="row g-4 flex-column">
      <div class="col-12" v-for="noticia in noticias" :key="noticia.id">
        <div
          class="card shadow-sm h-100"
          :class="{ 'border-primary': noticiaExpandida === noticia.id }"
        >
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title flex-grow-1">{{ noticia.titulo }}</h5>

                <div class="d-flex flex-column align-items-end ms-3">
                  <small class="text-muted texto-fecha">{{
                    formatearFecha(noticia.fecha)
                  }}</small>

                  <button
                    class="btn btn-outline-danger btn-sm mt-2"
                    @click="eliminarNoticia(noticia.id)"
                    title="Eliminar noticia"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <p class="card-text text-muted mt-2">
                {{
                  noticiaExpandida === noticia.id
                    ? contenidoLimitado(noticia.contenido)
                    : resumen(noticia.contenido)
                }}
              </p>
            </div>

            <div class="text-end mt-2">
              <button
                class="btn btn-outline-primary btn-sm"
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
  overflow: hidden;
  background-color: rgba(161, 192, 209, 0.137);
}
.texto-fecha {
  min-width: 80px;
  text-align: right;
}
</style>
