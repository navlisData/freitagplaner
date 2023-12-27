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
  <v-card width="100%">
    <v-card-title :class="['text-h6', `bg-red`]">
      {{ name }}
    </v-card-title>
    <v-card-text class="bg-white text--primary">
      <p>{{formatDate}}</p>
      <v-tooltip
          v-if="notes != ''"
          activator="parent"
          location="top"
      >{{ notes }}</v-tooltip>
      <v-icon icon="mdi-information-slab-circle-outline" v-if="notes != ''"/>
    </v-card-text>
  </v-card>
</template>
