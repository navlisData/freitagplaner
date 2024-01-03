
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
          { month: 'Januar', color: 'blue-lighten-2', icon: 'mdi-snowflake' },
          { month: 'Februar', color: 'pink-lighten-2', icon: 'mdi-heart' },
          { month: 'März', color: 'green-lighten-2', icon: 'mdi-clover' },
          { month: 'April', color: 'purple-lighten-3', icon: 'mdi-egg' },
          { month: 'Mai', color: 'lime-lighten-3', icon: 'mdi-flower' },
          { month: 'Juni', color: 'light-blue-lighten-2', icon: 'mdi-beach' },
          { month: 'Juli', color: 'orange-lighten-2', icon: 'mdi-sunglasses' },
          { month: 'August', color: 'deep-orange-lighten-2', icon: 'mdi-umbrella' },
          { month: 'September', color: 'amber-lighten-2', icon: 'mdi-leaf-maple' },
          { month: 'Oktober', color: 'brown-lighten-2', icon: 'mdi-school' },
          { month: 'November', color: 'deep-purple-lighten-2', icon: 'mdi-hat-fedora' },
          { month: 'Dezember', color: 'blue-grey-lighten-2', icon: 'mdi-snowman' }
        ],
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
      class="mx-2"
      max-width="220"
      height="200"
      color="blue-grey-lighten-4"
      variant="outlined"
  >
    <v-card-title  :class="cardStyle">
      <v-icon size="large" :icon="getMonthMetaData().icon"></v-icon>
    </v-card-title>

    <v-card-text class="bg-white text--primary">
      <v-row no-gutters="" class="justify-center mt-2"><h2 class="font-weight-bold text-center">{{name}}</h2></v-row>
      <v-row no-gutters="" class="justify-center mt-2"><h3>{{getDayByDate()}}</h3></v-row>
      <v-row no-gutters="" class=" justify-center mt-5">
        <span class="text-subtitle-1 d-flex ga-2 align-center">{{formatDate}}</span>
      </v-row>
    </v-card-text>
  </v-card>
</template>
