
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

<!--      <transition name="fade">-->
<!--        <router-view/>-->
<!--      </transition>-->
    </v-app>

  </main>
</template>

<style>
  .active {
    color: white !important;
    border: 1px solid white;
    padding: 6px 10px;
    font-weight: bold;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1.5s ease;
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
