<script>

  import MonthTile from './MonthTile.vue'

  export default {
    name: 'App', // Optional: Name der Root-Komponente

    components: {
      MonthTile
    },

    data: () => ({
      items: [
        {
          month: 'Januar',
          color: 'blue-lighten-2',
          icon: 'mdi-snowflake',
        },
        {
          month: 'Februar',
          color: 'pink-lighten-2',
          icon: 'mdi-heart',
        },
        {
          month: 'März',
          color: 'green-lighten-2',
          icon: 'mdi-clover',
        },
        {
          month: 'April',
          color: 'purple-lighten-3',
          icon: 'mdi-egg',
        },
        {
          month: 'Mai',
          color: 'lime-lighten-3',
          icon: 'mdi-flower',
        },
        {
          month: 'Juni',
          color: 'light-blue-lighten-2',
          icon: 'mdi-beach',
        },
        {
          month: 'Juli',
          color: 'orange-lighten-2',
          icon: 'mdi-sunglasses',
        },
        {
          month: 'August',
          color: 'deep-orange-lighten-2',
          icon: 'mdi-umbrella',
        },
        {
          month: 'September',
          color: 'amber-lighten-2',
          icon: 'mdi-leaf-maple',
        },
        {
          month: 'Oktober',
          color: 'brown-lighten-2',
          icon: 'mdi-school',
        },
        {
          month: 'November',
          color: 'deep-purple-lighten-2',
          icon: 'mdi-hat-fedora',
        },
        {
          month: 'Dezember',
          color: 'blue-grey-lighten-2',
          icon: 'mdi-snowman',
        },
      ],
    }),
  }
</script>

<template>
  <v-timeline align="start">
    <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        :dot-color="item.color"
        :icon="item.icon"
    >
      <MonthTile :month="item.month" :color="item.color"/>
    </v-timeline-item>
  </v-timeline>
</template>