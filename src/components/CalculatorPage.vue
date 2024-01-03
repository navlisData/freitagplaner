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
      //Form
      formValidated: null,
      loading: false,

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
      sliderValues: [7, 14],

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
      selectedMonths: [0,11],
      monthSelectRule: [
        value => {
          if(value[1] > value[0]) return true
          return 'Select at least two months'
        }
      ],

      //Scan next months
      correctDate: true,

      //Show details
      detailsVisible: false,

      //Infinite-scroller
      displayedItems: [],
      optimizedPeriods: [],
      loadIndex: 0,

      //Snackbar
      snackbar: false,
      snackbarcontent: ''
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
      this.reset();
      this.loading = true;

      if(this.formValidated !== null) {
        if (this.formValidated) {

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

          const optimizedPeriods = await dataFetch.getOptimizedPeriods(calculateProfile);

          if(optimizedPeriods.length === 0) {
            this.snackbarcontent = 'Unter diesen Einstellungen wurden keine Zeiträume gefunden';
            this.snackbar = true;
          } else {
            this.optimizedPeriods = await dataFetch.getOptimizedPeriods(calculateProfile);
          }
        } else {
          this.snackbarcontent = 'Bitte überprüfe die Felder';
          this.snackbar = true;
        }
      }

      this.loading = false;
    },

    reset() {
      this.displayedItems = [];
      this.optimizedPeriods = [];
      this.loadIndex = 0;
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

    load ({ done }) {
      setTimeout(() => {
        const remaining = this.optimizedPeriods.length - this.loadIndex;
        const count = Math.min(5, remaining);
        const nextItems = this.optimizedPeriods.slice(this.loadIndex, this.loadIndex + count);
        this.displayedItems = [...this.displayedItems, ...nextItems];
        this.loadIndex += count;
        remaining === 0 ? done('empty') : done('ok')
      }, 200);
    },
  },
}
</script>

<template>
  <ImageHeader header="Mehr entspannen mit unserem Rechner">
    <template #subcomponent> <!-- With help of CGPT -->
      <h3 class="text-center text-white mt-2">Ermittle jetzt die perfekten Tage, deinen Urlaub zu planen, um mithilfe der Feiertage das Meiste herauszuholen.</h3>
    </template>
  </ImageHeader>

  <v-row no-gutters="" justify="center" class="mt-2">
    <v-col md="5" sm="7" cols="10">
      <v-row no-gutters="" class="align-center ga-2" justify="center">
        <h2 >Berechne jetzt Deinen Urlaub!</h2>
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" icon="mdi-help-circle-outline"/>
          </template>
          1) Wähle Dein Bundesland aus<br>2) Gebe Deine Anzahl von Urlaubstagen und das Jahr an<br>
          3) Wenn Du möchtest, kannst du noch Monate und eine gewünschte Zeitspanne festlegen<br>4) Klicke auf 'Berechnen'
        </v-tooltip>

      </v-row>
      <v-row no-gutters="">
        <v-form class="w-100" fast-fail validate-on="blur" @submit.prevent="submit" v-model="formValidated">
          <!-- Basic configuration row -->
          <v-row no-gutters="" class="ga-4">
            <FederalStateSelect
                :rules="stateSelectRules"
                style="flex: 1 1 60%; min-height: 55px;"
            />

            <v-row no-gutters="" class="ga-4" style="flex-wrap: nowrap">
              <v-text-field
                  v-model="days"
                  label="Urlaubstage"
                  :rules="daysRule"
                  variant="outlined"
                  style="flex: 1 1 120px; min-height: 55px"
              />

              <v-select
                  v-model="selectedYear"
                  :items="years"
                  density="comfortable"
                  variant="outlined"
                  label="Jahr"
                  style="flex: 1 1 120px; min-height: 55px"
              />
            </v-row>
          </v-row>

          <!-- Detailed configuration row -->
          <v-col v-if="detailsVisible" class="pa-0">
            <h3 class="mb-3 text-decoration-underline font-weight-bold">Erweiterte Einstellungen:</h3>
            <div class="px-0 d-flex" :style="this.$vuetify.display.mdAndDown ? 'flex-direction: row' : 'flex-direction: column'">
              <v-col class="pt-8 px-0 w-100">
                <v-range-slider
                    v-model="selectedMonths"
                    :ticks="monthValues"
                    :rules="monthSelectRule"
                    :direction="this.$vuetify.display.mdAndDown ? 'vertical' : 'horizontal'"
                    min="0"
                    max="11"
                    step="1"
                    show-ticks="always"
                    thumb-label="always"
                    tick-size="4"
                    strict
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    <v-icon theme="dark" :icon="modelValue === this.selectedMonths[0] ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
                  </template>
                  <template v-slot:prepend>
                    <div class="d-flex align-center ga-1" :style="this.$vuetify.display.mdAndDown ? 'flex-direction: column' : 'flex-direction: row'">
                      <v-icon color="#3949AB" size="small" icon="mdi-information-slab-circle-outline"/>
                      <v-tooltip activator="parent" location="top">
                        In welchem Zeitraum möchtest du Urlaub nehmen?
                      </v-tooltip>
                      Zeitraum
                    </div>
                  </template>
                </v-range-slider>
              </v-col>

              <v-col class="pt-8 px-0 w-100">
                <v-range-slider
                    v-model="sliderValues"
                    step="1"
                    min="1"
                    :max="days ? days : 0"
                    :direction="this.$vuetify.display.mdAndDown ? 'vertical' : 'horizontal'"
                    strict
                    thumb-label="always"
                >
                  <template v-slot:prepend>
                    <div class="d-flex align-center ga-1" :style="this.$vuetify.display.mdAndDown ? 'flex-direction: column' : 'flex-direction: row'">
                      <v-icon color="#3949AB" size="small" icon="mdi-information-slab-circle-outline"/>
                      <v-tooltip activator="parent" location="top">
                        Nach welcher Länge an freien Tagen sollen wir suchen?
                      </v-tooltip>
                      Länge
                    </div>
                  </template>
                </v-range-slider>
              </v-col>
            </div>

            <v-col class="pa-2">
              <v-switch
                  v-if="!(selectedMonths[0] === 0 && selectedMonths[1] === 11)"
                  color="indigo-darken-3"
                  v-model="correctDate"
              >
                <template v-slot:label="">
                  <span>{{generateSwitchLabel}}</span>
                </template>
              </v-switch>
            </v-col>
          </v-col>

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
      </v-row>
    </v-col>
  </v-row>

  <!--Calculated periods-->
  <v-row justify="center" class="pb-5" v-if="optimizedPeriods.length > 0">
    <v-col md="6" sm="8" cols="10">
      <div class="d-flex flex-row w-100 justify-center">
        <h3 class="text-decoration-underline font-weight-bold"> Folgende Zeiträume wurden gefunden: </h3>
      </div>
      <v-infinite-scroll class="px-10 ma-3" :height="450" :onLoad="load">
        <template v-for="(periodData, index) in displayedItems" :key="index">
          <VacationCard :periodData="periodData"/>
        </template>
        <template v-slot:empty>
          <v-alert type="warning">Keine weiteren Vorschläge</v-alert>
        </template>
      </v-infinite-scroll>
    </v-col>
  </v-row>


  <v-snackbar
      v-model="snackbar"
      timeout="1200"
      location="top"
      color="warning"
  >{{snackbarcontent}}</v-snackbar>
</template>
