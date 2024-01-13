<script>
import {cache} from '@/cache.js';
import ImageHeader from "@/components/global/ImageHeader.vue";
import FederalStateSelect from "@/components/global/FederalStateSelect.vue";
import VacationCard from "@/components/calculator/VacationCard.vue";
import HolidayTile from "@/components/landingpage/HolidayTile.vue";

export default {
  name: 'App',

  components: {
    HolidayTile,
    VacationCard,
    ImageHeader,
    FederalStateSelect
  },

  data() {
    return {
      holidayData: [],

      snackbar: false,
    }
  },

  mounted() {
    this.fetchJson(cache.selectedState); //for initialisation
  },

  methods: {
    async fetchJson(stateAbbrv) {
      try {
        const response = await fetch("https://feiertage-api.de/api/?jahr=" + this.getYearToDisplay + "&nur_land=" + stateAbbrv);
        if(response.ok) {
          const apiData = await response.json();

          this.holidayData = Object.keys(apiData).map(key => {
            return {
              name: key,
              date: new Date(apiData[key].datum),
              notes: apiData[key].hinweis
            };
          });
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        this.snackbar = true;
        console.error("Failed to fetch holidays:", error);
      }
    },
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
  <div>
    <ImageHeader header="Dein Chef überhäuft Dich schon wieder mit viel zu viel Arbeit und dein Körper schreit nach Urlaub?">
      <template #subcomponent> <!-- With help of CGPT -->
        <v-btn variant="outlined" class="ma-6" :size="this.$vuetify.display.smAndDown ? 'large' : 'x-large'" color="white">
          <router-link class="router-link calc-btn"  to="/calculate">Jetzt Urlaub optimieren</router-link>
        </v-btn>
      </template>
    </ImageHeader>

    <v-row no-gutters="" justify="center">
      <v-col md="4" sm="5" cols="8" >
        <v-row no-gutters="" class="justify-center mt-2" ><h2 class="text-center">Übersicht der Feiertage für das Jahr {{getYearToDisplay}}</h2></v-row>
        <v-row no-gutters="" >
          <FederalStateSelect class="mt-2" @update:value="fetchJson($event)"/>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters="" justify="center" class="mb-5">
      <v-col md="9" sm="10" cols="11" >
        <v-slide-group show-arrows>
          <v-slide-group-item
              v-for="(day, index) in holidayData"
              :key="index"
          >
            <HolidayTile :date="day.date" :name="day.name" :notes="day.notes"/>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

  </div>

  <v-snackbar
      v-model="snackbar"
      timeout="2000"
      location="top"
      color="error"
  >Fehler beim Laden der Feiertage</v-snackbar>
</template>

<style>
.calc-btn {
  color: white !important;
}
</style>


