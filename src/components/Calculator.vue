<script>
import ImageHeader from "@/components/global/ImageHeader.vue";

export default {
  name: "Calculator",
  components: {
    ImageHeader
  }
}
</script>

<template>
  <v-container fluid>
    <ImageHeader header="Mehr entspannen mit unserem Rechner">
      <template #subcomponent> <!-- With help of CGPT -->
        <h3 class="text-center text-white mt-2">Ermittle jetzt die perfekten Tage, deinen Urlaub zu planen, um mithilfe der Feiertage das Meiste herauszuholen.</h3>
      </template>
    </ImageHeader>


  </v-container>
</template>
