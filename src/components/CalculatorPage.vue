<script>
import ImageHeader from "@/components/global/ImageHeader.vue";
import FederalStateSelect from "@/components/global/FederalStateSelect.vue";
import {de} from "vuetify/locale";
import HolidayCard from "@/components/calculator/VacationCard.vue";
import VacationCard from "@/components/calculator/VacationCard.vue";
import {dataFetch} from "@/data-fetch.js";
import {cache} from "@/cache.js";
import {markRaw, ref, toRaw} from "vue";

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
      optimizedPeriods: null,
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

      //Max. vacation days
      sliderValues: [6, 21],

      //Month selection
      monthValues: {
        0: 'Jan', 1: 'Feb', 2: 'Mär',
        3: 'Apr', 4: 'Mai', 5: 'Jun',
        6: 'Jul', 7: 'Aug', 8: 'Sep',
        9: 'Okt', 10: 'Nov', 11: 'Dez',
      },

      monthFullNames: [
        'Januar', 'Februar', 'März',
        'April', 'Mai', 'Juni',
        'Juli', 'August', 'September',
        'Oktober', 'November', 'Dezember',
      ],
      selectedMonths: [3,8],
      monthSelectRule: [
        value => {
          if(value[1] > value[0]) return true
          return 'Select at least two months'
        }
      ],

      //Scan next months
      correctDate: true,

      //Show details
      detailsVisible: false
    }
  },

  created() { //As soon component is created, set values
    this.selectedYear = this.getInitYear();
    this.years = this.calculateYears();
  },

  computed: {
    generateSwitchLabel() {
      if(this.selectedMonths[0] === 0 && this.selectedMonths[1] !== 11) {
        return 'Überprüfen, ob Anfang ' + this.monthFullNames[this.selectedMonths[1]+1] + ' noch freie Tage sind';
      } else if(this.selectedMonths[0] !== 0 && this.selectedMonths[1] === 11) {
        return 'Überprüfen, ob Ende ' + this.monthFullNames[this.selectedMonths[0]-1] + ' noch freie Tage sind';
      } else if(this.selectedMonths[0] !== 0 && this.selectedMonths[1] !== 11) {
        return 'Überprüfen, ob Ende ' + this.monthFullNames[this.selectedMonths[0]-1] + ' und  Anfang ' + this.monthFullNames[this.selectedMonths[1]+1] + ' noch freie Tage sind';
      }
    },
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
            startMonthProf: toRaw(this.selectedMonths[0]), //Returns the raw, original object of a Vue-created proxy.
            endMonthProf: toRaw(this.selectedMonths[1]), //Returns the raw, original object of a Vue-created proxy.
            minDaysProf: this.sliderValues[0],
            maxDaysProf: this.sliderValues[1],
            correctDatesProf: (this.selectedMonths[0] !== 0 || this.selectedMonths[1] !== 11) && this.correctDate
          };

          // this.optimizedPeriods = );
          // console.log("OP: ", toRaw(await dataFetch.getOptimizedPeriods(calculateProfile)));
          this.optimizedPeriods = (await dataFetch.getOptimizedPeriods(calculateProfile));
          console.log(toRaw(this.optimizedPeriods));
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
      <v-col md="5" sm="7" xs="10">
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
                <v-row>
                  <v-col class="pa-12">
                    <v-range-slider
                        v-model="selectedMonths"
                        :ticks="monthValues"
                        :rules="monthSelectRule"
                        min="0"
                        max="11"
                        :step="1"
                        show-ticks="always"
                        thumb-label="always"
                        tick-size="4"
                        strict
                    >
                      <template v-slot:thumb-label="{ modelValue }">
                        <v-icon theme="dark" :icon="modelValue === this.selectedMonths[0] ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
                      </template>
                    </v-range-slider>
                  </v-col>
                </v-row>

              <v-col class="pa-6">
                <v-range-slider
                    v-model="sliderValues"
                    step="1"
                    :min="1"
                    :max="days"
                    strict
                    thumb-label="always"
                ></v-range-slider>
              </v-col>

              <v-col class="pa-2">
                <v-switch
                    v-if="!(selectedMonths[0] === 0 && selectedMonths[1] === 11)"
                    color="primary"
                    v-model="correctDate"
                >
                  <template v-slot:label="">
                    <span>{{generateSwitchLabel}}</span>
                  </template>
                </v-switch>
              </v-col>

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

    <v-row justify="center" class="d-flex">
      <v-col md="5" sm="7" xs="10">
        <VacationCard
            v-for="(periodData, index) in optimizedPeriods"
            :key="index"
            :periodData="periodData"/>
      </v-col>
    </v-row>

  </v-container>
</template>
