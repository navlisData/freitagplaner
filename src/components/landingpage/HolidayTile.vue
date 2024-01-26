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
      },
    },

    data() {
      return {
        days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        months: [
          { month: 'Januar', color: 'blue-grey-lighten-3', icon: 'mdi-pine-tree' },
          { month: 'Februar', color: 'purple-lighten-4', icon: 'mdi-flower-tulip' },
          { month: 'März', color: 'green-lighten-3', icon: 'mdi-weather-windy' },
          { month: 'April', color: 'blue-grey-lighten-1', icon: 'mdi-weather-rainy' },
          { month: 'Mai', color: 'yellow-lighten-1', icon: 'mdi-bird' },
          { month: 'Juni', color: 'orange-lighten-3', icon: 'mdi-sunglasses' },
          { month: 'Juli', color: 'light-blue-lighten-3', icon: 'mdi-ice-cream' },
          { month: 'August', color: 'amber-lighten-3', icon: 'mdi-beach' },
          { month: 'September', color: 'amber-lighten-2', icon: 'mdi-leaf' },
          { month: 'Oktober', color: 'orange-lighten-2', icon: 'mdi-halloween' },
          { month: 'November', color: 'blue-grey-lighten-2', icon: 'mdi-tea' },
          { month: 'Dezember', color: 'red-lighten-2', icon: 'mdi-gift' }
        ]

      }
    },

    methods: {
      getMonthMetaData() {
        const monthIndex = this.date.getMonth();
        if (monthIndex >= 0 && monthIndex < this.months.length) {
          return this.months[monthIndex];
        } else {
          return 'Invalid month index';
        }
      },

      getDayByDate() {
        return this.days[this.date.getDay()];
      }
    },

    computed: {
      formatDate() {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        return this.date.toLocaleDateString('de-DE', options);
      },

      cardStyle() {
        return 'bg-' + this.getMonthMetaData().color + ' d-flex justify-center';
      }
    }
  }
</script>

<template>
  <v-card
      class="mx-2 d-flex flex-column"
      max-width="220"
      height="200"
      color="blue-grey-lighten-4"
      variant="outlined"
  >
    <v-card-title :class="cardStyle">
      <v-icon size="large" :icon="getMonthMetaData().icon"></v-icon>
    </v-card-title>

    <v-card-text class="d-flex flex-column bg-white text--primary">
      <v-row no-gutters="" class="justify-center mt-2 mb-auto"><h2 class="font-weight-bold text-center">{{name}}</h2></v-row>
      <v-row no-gutters="" class="justify-center align-content-end"><h3>{{getDayByDate()}}</h3></v-row>
      <v-row no-gutters="" class="justify-center align-content-end">
        <span class="text-subtitle-1 d-flex ga-2 align-center">{{formatDate}}</span>
      </v-row>
    </v-card-text>
  </v-card>
</template>
