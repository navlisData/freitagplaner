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

    days: '30',
    daysRule: [
      value => {
        if (/^[0-9]+$/.test(value)) return true;
        return 'Input has to be a number';
      },
    ],

    stateSelect: '',
    stateSelectRules: [
      value => {
        if (value) return true

        return 'Please select your federal state'
      },
    ],
  }),

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
      <v-col  md="3" sm="7" xs="10" >

        <v-sheet width="300" class="mx-auto">
          <v-form fast-fail validate-on="submit lazy" @submit.prevent="submit">

            <div class="flex-row d-flex ga-4">
              <FederalStateSelect
                  v-model="stateSelect"
                  :rules="stateSelectRules"
              />

              <v-text-field
                  v-model="days"
                  label="Urlaubstage"
                  :rules="daysRule"
                  variant="outlined"
              ></v-text-field>
            </div>


            <v-btn
                :loading="loading"
                type="submit"
                block
                class="mt-2"
                text="Submit"
            >Berechnen</v-btn>
          </v-form>
        </v-sheet>



      </v-col>
    </v-row>

  </v-container>
</template>
