<script>

  import MonthTile from './MonthTile.vue'

  export default {
    name: 'App', // Optional: Name der Root-Komponente

    props: ['holidays'],

    components: {
      MonthTile
    },

    methods: {
      getMonthMetaData(stringDate) {
        const items = [
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
        ];

        let dateObj = new Date(stringDate);
        let monthIndex = dateObj.getMonth();

        if (monthIndex >= 0 && monthIndex < items.length) {
          return items[monthIndex];
        } else {
          return 'Invalid month index';
        }
    }
  },
}
</script>

<template>
  <v-timeline side="end">
    <v-timeline-item
        v-for="(holiday, name) in holidays"
        :key="name"
        :dot-color="getMonthMetaData(holiday.datum).color"
        :icon="getMonthMetaData(holiday.datum).icon"
    >
      <template v-slot:opposite>
        <span>{{ getMonthMetaData(holiday.datum).month}}</span>
      </template>
      <MonthTile :date="new Date(holiday.datum)" :name="name" :notes="holiday.hinweis"/>
    </v-timeline-item>

  </v-timeline>
</template>