
<template>

  <v-app-bar>
    <!-- Hamburger menu icon -->
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="$vuetify.display.smAndDown">
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

  <v-navigation-drawer
      v-model="drawer"
      :location="drawerLocation"
      temporary="true"
      v-if="$vuetify.display.smAndDown"
  >
    <v-list
        :items="items"
    ></v-list>
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
    items: [
      {
        title: 'Home',
        value: 'Home',
      },
      {
        title: 'Urlaub berechnen',
        value: 'Urlaub berechnen',
      },
    ],
  }),

};
</script>