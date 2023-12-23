
<script>
  import NavBar from './components/NavBar.vue'

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
      <transition name="fade">
        <router-view/>
      </transition>
    </v-app>


  </main>
</template>

<style>
  .active {
    color: red;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
