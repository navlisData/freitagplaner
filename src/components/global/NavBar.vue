
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
      absolute
      color="transparent"
      dense
      flat
      app
  >
    <!-- Hamburger menu icon -->
    <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" v-if="$vuetify.display.smAndDown"/>

    <v-app-bar-title class="text-white">FreiTagPlaner</v-app-bar-title>

    <div class="ga-6 d-flex flex-row">
      <div v-if="$vuetify.display.mdAndUp">
        <router-link class="router-link text-uppercase" to="/">Home</router-link>
      </div>

      <div v-if="$vuetify.display.mdAndUp">
        <router-link class="router-link text-uppercase" to="/calculate">Urlaub berechnen</router-link>
      </div>
    </div>

    <!--    <v-btn v-if="$vuetify.display.mdAndUp">-->
    <!--      <router-link class="router-link" to="/">Home</router-link>-->
    <!--    </v-btn>-->

    <!--    <v-btn class="nav-btn" v-if="$vuetify.display.mdAndUp">-->
    <!--      <router-link class="router-link" to="/calculate">Urlaub berechnen</router-link>-->
    <!--    </v-btn>-->

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
        <router-link  class="router-link" to="/calculate">Urlaub berechnen</router-link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>



