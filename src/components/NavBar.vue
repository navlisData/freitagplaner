<template>
  <v-app-bar
      absolute="true"
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

    <!-- Navigation Items -->
    <v-btn v-if="$vuetify.display.mdAndUp">Home</v-btn>
    <v-btn v-if="$vuetify.display.mdAndUp">Urlaub berechnen</v-btn>

    <!-- Spacer to center items -->
    <v-spacer></v-spacer>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      :location="drawerLocation"
      temporary="true"
      v-if="$vuetify.display.smAndDown"
  >
    <v-list density="compact" nav="true">
      <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          value="Home"
      />

      <v-list-item
          prepend-icon="mdi-calendar-clock"
          title="Urlaub berechnen"
          value="calc-vacation"
      />
    </v-list>
  </v-navigation-drawer>

</template>


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