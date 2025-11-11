<template>
  <div class="container">
    <h1>Concesionario Teis</h1>
    <transition name="fade" mode="out-in">
      <img
        v-if="imagenes[indice]"
        :key="imagenes[indice]"
        :src="imagenes[indice]"
      />
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import coche1 from "../assets/coche1.png";
import coche2 from "../assets/coche2.png";
import coche3 from "../assets/coche3.png";

let intervalo;

onMounted(() => {
  intervalo = setInterval(() => {
    indice.value = (indice.value + 1) % imagenes.length;
  }, 3000);
});

onUnmounted(() => {
  clearInterval(intervalo);
});

const imagenes = [coche1, coche2, coche3];
const indice = ref(0);

const email = ref("");
const password = ref("");

const login = () => {
  alert(
    `Iniciando sesión con:\nEmail: ${email.value}\nPassword: ${password.value}`
  );
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 89.4vh; /* ocupa todo el alto visible */
  width: 100%;
  overflow: hidden;
}

.container img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
h1 {
  color: rgba(255, 255, 255, 0.952);
  text-shadow: 0 0 2px white;
  z-index: 1;
  text-decoration: underline;
  padding-bottom: 10px;
  text-decoration-thickness: 2px;
}
body {
  margin: 0;
}
</style>
