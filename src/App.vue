
<script>
  import NavBar from './components/NavBar.vue'
  import MainContent from './components/MainContent.vue'

  export default {
    name: 'App', // Optional: Name der Root-Komponente

    components: {
      NavBar,
      MainContent
    },
}
</script>

<template>
  <main>

    <v-app>
      <NavBar />
      <MainContent/>
    </v-app>


  </main>
</template>

