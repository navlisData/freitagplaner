<script>
import { dataFetch } from '@/data-fetch.js';

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

  methods: {
    displayApiJson(stateAbbrv) {
      console.log(dataFetch.fetchApi(this.getYearToDisplay, stateAbbrv));
    }
  },

  computed: {
    getYearToDisplay() {
      const date = new Date(); //https://www.w3schools.com/jsref/jsref_getmonth.asp
      return date.getMonth() >= 8 ? date.getFullYear()+1 : date.getFullYear();
    },
  },
}
</script>

<template>
    <v-container fluid>

      <ImageHeader header="Dein Chef überhäuft Dich schon wieder mit viel zu viel Arbeit und dein Körper schreit nach Urlaub?">
        <template #subcomponent> <!-- With help of CGPT -->
          <v-btn variant="outlined" class="ma-6 v-btn&#45;&#45;size-x-large" color="white">
            <router-link class="router-link calc-btn"  to="/calculate">Jetzt Urlaub optimieren</router-link>
          </v-btn>
        </template>
      </ImageHeader>

      <v-row justify="center" >
        <v-col  md="3" sm="7" xs="10" >
          <h2 align="center">Das sind die Feiertage für das Jahr {{getYearToDisplay}}</h2>
          <FederalStateSelect
              class="my-6"
              @update:value="displayApiJson($event)"
          />
        </v-col>
      </v-row>

      <v-row justify="center" >
        <v-col  md="8" sm="10" xs="11" >
          <MonthTimeLine/>
        </v-col>
      </v-row>

    </v-container>
</template>

<style>
  .calc-btn {
    color: white !important;
  }
</style>


