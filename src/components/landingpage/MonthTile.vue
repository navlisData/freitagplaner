<script>
  export default {

    props: {
      date: {
        type: Date,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      notes: {
        type: String,
        required: true
      }
    },

    computed: {
      formatDate() {
        var options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };

        return this.date.toLocaleDateString('de-DE', options);
      }
    }
  }
</script>

<template>
  <v-card>
    <v-card-title class="bg-red">
      <span class="text-subtitle-1 d-flex ga-2 align-center">
        {{ name }}
        <v-icon size="small" icon="mdi-information-slab-circle-outline" v-if="notes !== ''"/>
      </span>

      <v-tooltip
          v-if="notes != ''"
          activator="parent"
          location="top"
      >{{ notes }}</v-tooltip>
    </v-card-title>
    <v-card-text class="bg-white text--primary">
      <span class="text-subtitle-1 d-flex ga-2 align-center">
        <v-icon size="x-small" icon="mdi-calendar-today"/>
        {{formatDate}}
      </span>
    </v-card-text>
  </v-card>
</template>
