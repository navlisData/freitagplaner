
<script>
/*
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
*/

import NavBar from './components/NavBar.vue'

export default {
  // Options API-spezifische Konfiguration
  name: 'App', // Optional: Name der Root-Komponente

  components: {
    NavBar
  },

  // Andere Optionen wie data, methods, etc.
}
</script>

<template>
<!--  <header>-->

<!--  </header>-->

  <main>
    <v-app>
      <NavBar />
    </v-app>


  </main>
</template>

<style>

</style>
