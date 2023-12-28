<script>
import ImageHeader from "@/components/global/ImageHeader.vue";
import FederalStateSelect from "@/components/global/FederalStateSelect.vue";
import {de} from "vuetify/locale";
import HolidayCard from "@/components/calculator/VacationCard.vue";
import VacationCard from "@/components/calculator/VacationCard.vue";
import {dataFetch} from "@/data-fetch.js";
import {cache} from "@/cache.js";

export default {
  name: "Calculator",
  components: {
    VacationCard,
    HolidayCard,
    ImageHeader,
    FederalStateSelect
  },

  data() {
    return {
      formValidated: null,
      loading: false,
      // rules: [value => vm.checkApi(value)],
      timeout: null,

      //Day field
      days: '30',
      daysRule: [
        value => {
          if (value === '' || value == null) return 'Field cannot be empty';
          if (/^[0-9]+$/.test(value)) return true;
          return 'Input has to be a number';
        },
      ],

      //State select
      stateSelectRules: [
        value => {
          if (value) return true
          return 'Please select your federal state'
        },
      ],

      //Year select
      selectedYear: null, //init value set in created()
      years: [], //values set in created()

      //Exlude-Month-Select
      selectedMonths: [2,3,4,5,6,7,8],
      monthList: [
        {title: 'Januar', id: 0},
        {title: 'Februar', id: 1},
        {title: 'März', id: 2},
        {title: 'April', id: 3},
        {title: 'Mai', id: 4},
        {title: 'Juni', id: 5},
        {title: 'Juli', id: 6},
        {title: 'August', id: 7},
        {title: 'September', id: 8},
        {title: 'Oktober', id: 9},
        {title: 'November', id: 10},
        {title: 'Dezember', id: 11},
      ],
      monthSelectRule: [
        value => {
          if(Array.isArray(value) && value.length > 0) return true
          return 'Select at least one month'
        }
      ],

      //Max. vacation days
      sliderValues: [3, 7],

      //Show details
      detailsVisible: false
    }
  },

  created() { //As soon component is created, set values
    this.selectedYear = this.getInitYear();
    this.years = this.calculateYears();
  },

  methods: {
    async submit() {
      this.loading = true;

      if(this.formValidated !== null) {
        if (this.formValidated) {
          console.log("submitted");

          const calculateProfile = {
            yearProf: this.selectedYear,
            stateProf: cache.selectedState,
            daysProf: this.days,
            selectedMonthsProf: this.selectedMonths,
            minDaysProf: this.sliderValues[0],
            maxDaysProf: this.sliderValues[1]
          };

          const tokenOutput = await dataFetch.createTokenResult(calculateProfile);
          console.log(tokenOutput)
        } else {
          console.log("Form has errors!");
          //TODO: Show snackbar with error message
        }
      }

      this.loading = false;
    },

    calculateYears() {
      let initYear = new Date().getFullYear();
      let values = [];
      for(let year = initYear; year < initYear+10; year++) {
        values.push(year);
      }
      return values;
    },

    getInitYear() {
      const date = new Date();
      return date.getMonth() >= 8 ? date.getFullYear()+1 : date.getFullYear();
    },

    getDummyHolidayArray(count) {
      let holidayArray = [];
      for(let i = 0; i < count; i++) {
        holidayArray.push(new Date())
      }
      return holidayArray;
    },

    getDummyDateRange() {
      var currentDate = new Date();
      var newDate = new Date(currentDate);

      newDate.setDate(currentDate.getDate() + 8);

      console.log("Current date: ", currentDate);
      console.log("Added date: ", newDate);

      return [currentDate, newDate];
    }
  },
}
</script>

<template>
  <v-container fluid>
    <ImageHeader header="Mehr entspannen mit unserem Rechner">
      <template #subcomponent> <!-- With help of CGPT -->
        <h3 class="text-center text-white mt-2">Ermittle jetzt die perfekten Tage, deinen Urlaub zu planen, um mithilfe der Feiertage das Meiste herauszuholen.</h3>
      </template>
    </ImageHeader>

    <v-row justify="center" class="d-flex">
      <v-col md="4" sm="7" xs="10">
        <h2 align="center">Berechne jetzt Deinen Urlaub!</h2>
          <v-form fast-fail validate-on="blur" @submit.prevent="submit" v-model="formValidated">
            <!-- Basic configuration row -->
            <div class="d-flex flex-row ga-4">
              <FederalStateSelect
                  :rules="stateSelectRules"
                  style="flex: 1 1 60%; min-height: 55px"
              />

              <div class="d-flex ga-4" style="flex: 1 1 40%">
                <v-text-field
                    v-model="days"
                    label="Urlaubstage"
                    :rules="daysRule"
                    variant="outlined"
                    style="flex: 1 0 120px; min-height: 55px"
                ></v-text-field>

                <v-select
                    v-model="selectedYear"
                    :items="years"
                    density="comfortable"
                    variant="outlined"
                    label="Jahr"
                    style="flex: 1 0 120px; min-height: 55px"
                />
              </div>
            </div>

            <!-- Detailed configuration row -->
            <div v-if="detailsVisible">
              <span>Erweiterte Einstellungen</span>
              <div class="flex-row d-flex ga-4 my-3" >
                <v-select
                    v-model="selectedMonths"
                    :items="monthList"
                    item-title="title"
                    item-value="id"
                    :rules="monthSelectRule"
                    label="Ausgewählte Monate"
                    multiple
                    hint="Wähle alle zu berücksichtigten Monate aus"
                    persistent-hint
                    variant="outlined"
                    style="flex: 1 1 60%"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 3">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span
                      v-if="index === 3"
                      class="text-grey text-caption align-self-center"
                    >
                    (+{{ selectedMonths.length - 3 }} weitere)
                  </span>
                  </template>
                </v-select>

                <div style="flex: 1 1 40%">
                  <v-range-slider
                      v-model="sliderValues"
                      step="1"
                      :min="1"
                      :max="days"
                      strict
                      thumb-label="always"
                  ></v-range-slider>
                </div>

              </div>
            </div>

            <v-btn
                :loading="loading"
                type="submit"
                class="d-flex mx-auto text-none"
                color="#4f545c"
                prepend-icon="mdi-cogs"
                variant="flat"
            >Berechnen</v-btn>

            <v-btn
                class="d-flex mx-auto text-none"
                :ripple="false"
                density="comfortable"
                :prepend-icon="detailsVisible ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                variant="plain"
                @click="detailsVisible = !detailsVisible"
            >Details {{detailsVisible ? "ausblenden" : "einblenden"}}</v-btn>

          </v-form>

      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <VacationCard :holiday-days="getDummyHolidayArray(3)" :date-range="getDummyDateRange()"/>
      </v-col>
    </v-row>

  </v-container>
</template>
