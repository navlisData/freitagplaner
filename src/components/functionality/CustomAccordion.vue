<script>
export default {
  name: "CustomAccordion",

  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
  },
}
</script>

<template>
  <v-expansion-panels flat class="mt-2">
    <v-expansion-panel bg-color="transparent">
      <v-expansion-panel-title class="custom-panel" expand-icon="mdi-plus" collapse-icon="mdi-minus">
        <v-icon size="small" class="px-4">mdi-information-slab-circle-outline</v-icon>
        {{ title }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <p class="pb-1">{{subtitle}}</p>
        <code ><slot name="content"/></code>
        <div  class="pt-2"><slot name="subcontent"/></div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style>
  .v-expansion-panel__shadow {
    box-shadow: none !important;
  }

  .v-expansion-panel-title.custom-panel {
    padding: 0 !important;
    padding-right: 5px !important;
    min-height: 30px !important;
  }
</style>