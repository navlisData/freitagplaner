<script>
import {dataFetch} from '@/data-fetch.js';
import {cache} from '@/cache.js';
import ImageHeader from "@/components/global/ImageHeader.vue";
import FederalStateSelect from "@/components/global/FederalStateSelect.vue";
import VacationCard from "@/components/calculator/VacationCard.vue";
import MonthTile from "@/components/landingpage/HolidayTile.vue";

export default {
  name: 'App',

  components: {
    MonthTile,
    VacationCard,
    ImageHeader,
    FederalStateSelect
  },

  data() {
    return {
      holidayData: [],
    }
  },

  mounted() {
    this.fetchJson(cache.selectedState); //for initialisation
  },

  methods: {
    async fetchJson(stateAbbrv) {
      try {
        this.holidayData = await dataFetch.fetchApi(this.getYearToDisplay, stateAbbrv);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    },
  },

  computed: {
    getYearToDisplay() {
      const date = new Date();
      return date.getMonth() >= 8 ? date.getFullYear()+1 : date.getFullYear();
    },
    holidayDataArray(){
      let filteredHolidays = [];
      const jsonData = this.holidayData;
      Object.keys(jsonData).forEach(holidayName => {
        const holiday = jsonData[holidayName];
        const data = {
          name: holidayName,
          date: new Date(holiday.datum),
          notes: holiday.hinweis
        }
        filteredHolidays.push(data);
      });
      return filteredHolidays;
    }
  },
}
</script>

<template>
  <div>
    <ImageHeader header="Dein Chef überhäuft Dich schon wieder mit viel zu viel Arbeit und dein Körper schreit nach Urlaub?">
      <template #subcomponent> <!-- With help of CGPT -->
        <v-btn variant="outlined" class="ma-6 v-btn&#45;&#45;size-x-large" color="white">
          <router-link class="router-link calc-btn"  to="/calculate">Jetzt Urlaub optimieren</router-link>
        </v-btn>
      </template>
    </ImageHeader>

    <v-row no-gutters="" justify="center">
      <v-col md="4" sm="5" cols="8" >
        <v-row no-gutters="" class="justify-center mt-2" ><h2>Das sind die Feiertage für das Jahr {{getYearToDisplay}}</h2></v-row>
        <v-row no-gutters="" >
          <FederalStateSelect class="mt-2" @update:value="fetchJson($event)"/>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters="" justify="center">
      <v-col md="9" sm="10" cols="11" >
        <v-slide-group show-arrows>
          <v-slide-group-item
              v-for="(day, index) in holidayDataArray"
              :key="index"
          >
            <MonthTile :date="day.date" :name="day.name" :notes="day.notes"/>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

  </div>
</template>

<style>
.calc-btn {
  color: white !important;
}
</style>


