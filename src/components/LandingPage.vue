<script>
import { dataFetch } from '@/data-fetch.js';
import { cache } from '@/cache.js';

import MonthTimeLine from "./landingpage/MonthTimeLine.vue";
import ImageHeader from "@/components/global/ImageHeader.vue";
import FederalStateSelect from "@/components/global/FederalStateSelect.vue";

export default {
  name: 'App',

  components: {
    ImageHeader,
    MonthTimeLine,
    FederalStateSelect
  },

  data() {
    return {
      holidayData: null,
    }
  },

  mounted() {
    this.fetchJson(cache.selectedState); //for initialisation
  },

  methods: {
    async fetchJson(stateAbbrv) {
      try {
        this.holidayData = await dataFetch.fetchApi(this.getYearToDisplay, stateAbbrv);
        console.log("data fetched")
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    }
  },

  computed: {
    getYearToDisplay() {
      const date = new Date();
      return date.getMonth() >= 8 ? date.getFullYear()+1 : date.getFullYear();
    },
  },
}
</script>

<template>
  <ImageHeader header="Dein Chef überhäuft Dich schon wieder mit viel zu viel Arbeit und dein Körper schreit nach Urlaub?">
    <template #subcomponent> <!-- With help of CGPT -->
      <v-btn variant="outlined" class="ma-6 v-btn&#45;&#45;size-x-large" color="white">
        <router-link class="router-link calc-btn"  to="/calculate">Jetzt Urlaub optimieren</router-link>
      </v-btn>
    </template>
  </ImageHeader>

  <v-row  justify="center" class="mt-2">
    <v-col md="4" sm="5" cols="8" >
      <v-row no-gutters="" justify="center" ><h2>Das sind die Feiertage für das Jahr {{getYearToDisplay}}</h2></v-row>
      <v-row><FederalStateSelect class="mt-2" @update:value="fetchJson($event)"/></v-row>
      <v-row justify="center" >
        <MonthTimeLine :holidays="holidayData"/>
      </v-row>
    </v-col>
  </v-row>

</template>

<style>
  .calc-btn {
    color: white !important;
  }
</style>


