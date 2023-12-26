<script>
  export default {

    props: {
      month: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      }
    }
  }
</script>

<template>
  <v-card>
    <v-card-title :class="['text-h6', `bg-${color}`]">
      {{ month }}
    </v-card-title>
    <v-card-text class="bg-white text--primary">
      <p>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.</p>
      <v-btn
          :color="color"
          variant="outlined"
      >
        Button
      </v-btn>
    </v-card-text>
  </v-card>
</template>
