
<script>
export default {
  computed: {
    drawerLocation() {
      return this.$vuetify.display.xs ? 'bottom' : 'left';
    },
  },

  data: () => ({
    drawer: false
  }),

};
</script>

<template>
  <v-app-bar
      :color="this.$route.path === '/functionality' || this.$route.path === '/api-documentation' ? 'teal-lighten-1' : 'transparent'"
      dense
      flat
      absolute
  >
    <!-- Hamburger menu icon -->
    <v-app-bar-nav-icon color="white" @click="drawer = !drawer" v-if="$vuetify.display.smAndDown"/>

    <v-app-bar-title class="text-white">
      <div class="d-flex ga-2">
        <img :width="24" :height="24" src="@/assets/images/logo.png" alt="Logo" />
        FreiTagPlaner
      </div>
    </v-app-bar-title>

    <div class="ga-3 d-flex flex-row" v-if="$vuetify.display.mdAndUp">
      <v-btn variant="text" >
        <router-link class="router-link text-uppercase" to="/">Home</router-link>
      </v-btn>

      <v-btn variant="text">
        <router-link class="router-link text-uppercase" to="/calculate">Urlaub berechnen</router-link>
      </v-btn>

      <v-btn variant="text">
        <router-link class="router-link text-uppercase" to="/functionality">Funktionsweise</router-link>
      </v-btn>

      <v-btn variant="text">
        <router-link class="router-link text-uppercase" to="/api-documentation">API</router-link>
      </v-btn>
    </div>

    <!-- Spacer to center items -->
    <v-spacer></v-spacer>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      :location="drawerLocation"
      temporary
      v-if="$vuetify.display.smAndDown"
  >
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" value="Home">
        <router-link class="router-link" to="/">Home</router-link>
      </v-list-item>

      <v-list-item prepend-icon="mdi-calendar-clock" value="calc-vacation">
        <router-link  class="router-link" to="/calculate">Urlaub berechnen</router-link>
      </v-list-item>

      <v-list-item prepend-icon="mdi-code-braces" value="functionality">
        <router-link class="router-link" to="/functionality">Funktionsweise</router-link>
      </v-list-item>

      <v-list-item prepend-icon="mdi-link-variant" value="api-documentation">
        <router-link class="router-link" to="/api-documentation">API</router-link>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>



