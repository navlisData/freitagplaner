<script>
import ImageHeader from "@/components/global/ImageHeader.vue";
import FederalStateSelect from "@/components/global/FederalStateSelect.vue";

export default {
  name: "Calculator",
  components: {
    ImageHeader,
    FederalStateSelect
  },
  data: vm => ({
    loading: false,
    rules: [value => vm.checkApi(value)],
    timeout: null,

    //Day field
    days: '30',
    daysRule: [
      value => {
        if (/^[0-9]+$/.test(value)) return true;
        return 'Input has to be a number';
      },
    ],

    //State select
    stateSelect: '', //TODO: Use state used on the landingpage
    stateSelectRules: [
      value => {
        if (value) return true

        return 'Please select your federal state'
      },
    ],

    //Year select
    selectedYear: null, //init with null value
    years: [], //and empty array

    //Exlude-Month-Select
    selectedMonths: ['März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September'],
    monthList: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],

    //Max. vacation days
    sliderValues: [3, 7]
  }),

  created() { //As soon component is created, set values
    this.selectedYear = this.getInitYear();
    this.years = this.calculateYears();
  },

  //https://vuetifyjs.com/en/components/forms/#rules
  methods: {
    async submit (event) {
      this.loading = true

      const results = await event

      this.loading = false

      alert(JSON.stringify(results, null, 2))
    },

    async checkApi (userName) {
      return new Promise(resolve => {
        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
          if (!userName) return resolve('Please enter a user name.')
          if (userName === 'johnleider') return resolve('User name already taken. Please try another one.')

          return resolve(true)
        }, 1000)
      })
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

    <v-row justify="center">
      <v-col  md="4" sm="7" xs="10" >

<!--        <v-sheet  class="mx-auto">-->
          <v-form fast-fail validate-on="submit lazy" @submit.prevent="submit">

            <div class="flex-row d-flex ga-4">
              <FederalStateSelect
                  v-model="stateSelect"
                  :rules="stateSelectRules"
                  style="flex: 1 1 100%; min-height: 55px"
              />

              <v-text-field
                  v-model="days"
                  label="Urlaubstage"
                  :rules="daysRule"
                  variant="outlined"
                  style="flex: 1 0 120px; min-height: 55px"
              ></v-text-field>

              <v-select
                  :items="years"
                  :model-value="selectedYear"
                  density="comfortable"
                  variant="outlined"
                  label="Jahr"
                  style="flex: 1 0 120px; min-height: 55px"
              />
            </div>

            <div class="flex-row d-flex ga-4">
              <v-select
                  v-model="selectedMonths"
                  :model-value="selectedMonths"
                  :items="monthList"
                  label="Ausgewählte Monate"
                  multiple
                  hint="Wähle alle zuberücksichtigten Monate aus"
                  persistent-hint
                  variant="outlined"
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

              <v-range-slider
                  v-model="sliderValues"
                  step="1"
                  :min="1"
                  :max="days"
                  thumb-label="always"
              ></v-range-slider>

            </div>

            <v-btn
                :loading="loading"
                type="submit"
                block
                class="mt-2"
                text="Submit"
            >Berechnen</v-btn>
          </v-form>
<!--        </v-sheet>-->


      </v-col>
    </v-row>

  </v-container>
</template>
