<script>


  import MonthTimeLine from "./MonthTimeLine.vue";

  export default {
    name: 'App', // Optional: Name der Root-Komponente

    components: {
      MonthTimeLine
    },

    data: () => ({
      items: [
        'Baden-Württemberg',
        'Bayern',
        'Berlin',
        'Brandenburg',
        'Bremen',
        'Hamburg',
        'Hessen',
        'Mecklenburg-Vorpommern',
        'Niedersachsen',
        'Nordrhein-Westfalen',
        'Rheinland-Pfalz',
        'Saarland',
        'Sachsen',
        'Sachsen-Anhalt',
        'Schleswig-Holstein',
        'Thüringen'
      ],

    }),
  }
</script>

<template>
  <v-main class="d-flex justify-center">

    <v-container fluid>
      <v-row>
        <v-img
            src="https://cdn.pixabay.com/photo/2014/11/21/03/26/neist-point-540119_1280.jpg"
            max-height="350"
            cover="true"
        >
          <v-row class="fill-height" align="center" justify="center" >
            <v-col md="5" sm="7" xs="11" class="rounded-lg" style="background-color: rgba(255,255,255, 0.25);">
              <h2 class="display-3 text-white text-center">Dein Chef überhäuft Dich schon wieder mit viel zu viel Arbeit und dein Körper schreit nach Urlaub?</h2>
              <v-row justify="center">
                <v-btn variant="outlined" class="ma-6 v-btn--size-x-large" color="white">Jetzt Urlaub optimieren</v-btn>
              </v-row>
            </v-col>
          </v-row>

        </v-img>
      </v-row>

      <v-row justify="center" >
        <v-col  md="6" sm="8" xs="10" >
          <h2 align="center">Das sind die Feiertage für das Jahr 2024</h2>
          <v-select
              :items="items"
              model-value="Baden-Württemberg"
              density="comfortable"
              label="Bundesland"
          />
        </v-col>
      </v-row>

      <v-row justify="center" >
        <v-col  md="8" sm="10" xs="11" >
          <MonthTimeLine/>
        </v-col>
      </v-row>



    </v-container>



  </v-main>
</template>
