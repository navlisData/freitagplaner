<script>
export default {
  computed: {
    drawerLocation() {
      return this.$vuetify.display.xs ? 'bottom' : 'left';
    },
  },

  data: () => ({
    drawer: false,
  }),

};
</script>

<template>
  <v-app-bar
      absolute
      color="transparent"
      shrink-on-scroll
      dense
      app
  >
    <!-- Hamburger menu icon -->
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="$vuetify.display.smAndDown">
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>

    <v-app-bar-title>FreiTagPlaner</v-app-bar-title>

    <v-btn v-if="$vuetify.display.mdAndUp">
      <router-link class="router-link" to="/">Home</router-link>
    </v-btn>

    <v-btn class="nav-btn" v-if="$vuetify.display.mdAndUp">
      <router-link class="router-link" to="/calculate">Urlaub berechnen</router-link>
    </v-btn>

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
      <v-list-item
          prepend-icon="mdi-home"
          value="Home"
      >
        <router-link class="router-link" to="/">Home</router-link>
      </v-list-item>

      <v-list-item
          prepend-icon="mdi-calendar-clock"
          value="calc-vacation"
      >
        <router-link class="router-link" to="/calculate">Urlaub berechnen</router-link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>

<style>
  .router-link {
    text-decoration: none;
  }
</style>

