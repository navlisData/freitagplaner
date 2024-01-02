
<script>
  import NavBar from './components/global/NavBar.vue'

  export default {
    name: 'App',

    components: {
      NavBar,
    },
  }
</script>

<template>
  <main>

    <v-app style="font-family: 'Nunito', cursive; ">
      <NavBar />

      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </v-app>

  </main>
</template>

<style>
  /* Gestaltung der Scrollbar für alle Elemente */
  * {
    scrollbar-width: thin;
    scrollbar-color: #3949AB #E8EAF6;
  }

  /* Gestaltung der Scrollbar für Webkit-Browser */
  *::-webkit-scrollbar {
    width: 8px; /* Breite der Scrollbar */
  }

  *::-webkit-scrollbar-track {
    background: #E8EAF6; /* Hintergrund der Scrollbahn */
  }

  *::-webkit-scrollbar-thumb {
    background-color: #3949AB; /* Farbe der Scrollbar selbst */
    border-radius: 20px; /* Runde Ecken der Scrollbar */
    /*border: 3px solid orange;  Rand der Scrollbar */
  }

  .active {
    color: white !important;
    border: 1px solid white;
    padding: 6px 10px;
    font-weight: bold;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .router-link {
    text-decoration: none;
    color: #CFD8DC;
  }
</style>
