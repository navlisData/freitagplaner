<script>
import { cache } from '@/cache.js';

export default {
    name: 'App',

    data() {
      return {
        selectedValue: cache.state.selectedState,

        items: [
          { fullName: 'Baden-Württemberg', abbrv: 'BW' },
          { fullName: 'Bayern', abbrv: 'BY' },
          { fullName: 'Berlin', abbrv: 'BE' },
          { fullName: 'Brandenburg', abbrv: 'BB' },
          { fullName: 'Bremen', abbrv: 'HB' }, // HB for Hansestadt Bremen
          { fullName: 'Hamburg', abbrv: 'HH' }, // HH for Hansestadt Hamburg
          { fullName: 'Hessen', abbrv: 'HE' },
          { fullName: 'Mecklenburg-Vorpommern', abbrv: 'MV' },
          { fullName: 'Niedersachsen', abbrv: 'NI' },
          { fullName: 'Nordrhein-Westfalen', abbrv: 'NW' },
          { fullName: 'Rheinland-Pfalz', abbrv: 'RP' },
          { fullName: 'Saarland', abbrv: 'SL' },
          { fullName: 'Sachsen', abbrv: 'SN' },
          { fullName: 'Sachsen-Anhalt', abbrv: 'ST' },
          { fullName: 'Schleswig-Holstein', abbrv: 'SH' },
          { fullName: 'Thüringen', abbrv: 'TH' }
        ],
      }
    },

    methods: {
      updateGlobalState(value) {
        cache.setSelectedState(value);
        this.selectedValue = value;
      },
    },

    watch: {
      selectedValue(newValue) {
        this.updateGlobalState(newValue)
      }
    }
  }
</script>

<template>
  <v-select
      v-model="selectedValue"
      :items="items"
      item-title="fullName"
      item-value="abbrv"
      density="comfortable"
      variant="outlined"
      label="Bundesland"
  />
</template>
