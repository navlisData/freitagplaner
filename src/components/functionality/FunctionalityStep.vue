<script>
export default {
  name: 'App',

  props: {
    title: {
      type: String,
      required: true
    },
  },
}
</script>

<template>

  <v-timeline-item
      dot-color="teal-lighten-2"
      size="small"
      class="w-100"
  >
    <div class="bg-teal-lighten-5 w-100 pa-2 pl-5 rounded">
      <h3>{{ title }}</h3>
      <v-row no-gutters="" >
        <slot name="content"/>
      </v-row>
    </div>

  </v-timeline-item>


</template>

