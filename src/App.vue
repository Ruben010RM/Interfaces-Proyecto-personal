<template>
  <!-- Contenedor padre al 80% centrado -->
  <div id="app">
    <NavBar />
    <!-- Fija arriba dentro del 80% -->
    <main class="flex-grow-l overflow-auto">
      <router-view />
    </main>
    <FooTer class="mt-auto" />
    <!-- Fija abafo dentro del 80% -->
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import FooTer from "./components/FooTer.vue";
</script>

<style scoped>
#app {
  max-width: 80%;
  margin: 0 auto; /* centra horizontalmente */
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
