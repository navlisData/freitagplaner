<script>
export default {
  methods: {
    toggleDrawer() {
      // Logic to toggle side navigation
    },
  },
};
</script>

<template>

  <v-app-bar>
    <!-- Hamburger menu icon -->
    <v-app-bar-nav-icon @click="toggleDrawer" v-if="$vuetify.display.smAndDown">
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>

    <!-- Spacer to center items -->
    <v-spacer></v-spacer>

    <!-- Navigation Items -->
    <v-btn v-if="$vuetify.display.mdAndUp">Home</v-btn>
    <v-btn v-if="$vuetify.display.mdAndUp">Urlaub berechnen</v-btn>

    <!-- Spacer to center items -->
    <v-spacer></v-spacer>
  </v-app-bar>

</template>
