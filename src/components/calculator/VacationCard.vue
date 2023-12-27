<script>
export default {

  props: {
    //Range of the possible vacation time
    //(size=2 -> start and end date)
    dateRange: {
      type: Array,
      required: true
    },
    //Array of date objects of the holiday days
    holidayDays: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>

  <v-card
      class="mx-auto"
      max-width="344"
      color="red"
      variant="tonal"
  >
    <v-card-item>
      <div>
        <div class="text-overline mb-1">
          Tonal
        </div>
        <div class="text-h6 mb-1">
          Headline
        </div>
        <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn>
        Button
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

