
<script>

  import MonthTile from './HolidayTile.vue'

  export default {
    name: 'App', // Optional: Name der Root-Komponente

    props: ['holidays'],

    components: {
      MonthTile
    },

    methods: {

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