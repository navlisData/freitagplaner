<script>
export default {
  props: {
    header: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <v-img
      src="https://cdn.pixabay.com/photo/2014/11/21/03/26/neist-point-540119_1280.jpg"
      max-height="380"
      cover
  >
    <v-row class="fill-height" align="center" justify="center" >
      <v-col md="5" sm="7" xs="11" class="rounded-lg ma-8 pa-4" style="background-color: rgba(255,255,255, 0.25);">
        <h2 class="display-3 text-white text-center">{{header}}</h2>
        <v-row justify="center">
          <slot name="subcomponent"/>
        </v-row>
      </v-col>
    </v-row>
  </v-img>
</template>
