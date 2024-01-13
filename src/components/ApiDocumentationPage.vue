<script>

import CustomAccordion from "@/components/functionality/CustomAccordion.vue";
import FunctionalityStep from "@/components/functionality/FunctionalityStep.vue";

export default {
  name: 'App',

  components: {
    FunctionalityStep, CustomAccordion
  },

}
</script>

<template>

  <v-col class="my-11 mx-6 pt-11">
    <v-col >
      <v-row no-gutters=""><h1>API Dokumentation</h1></v-row>
      <v-row no-gutters="">
        <div class="d-flex flex-row ga-2">
          <h2>mehr Informationen auf Github</h2>
          <a class="usual-anchor" href="https://github.com/navlisData/freitagplaner_backend" target="_blank"><v-icon size="x-large">mdi-github</v-icon></a>
        </div>
      </v-row>
    </v-col>

    <v-col>
      <v-row no-gutters="">
        <code>
          <span class="text-break">https://freitagplaner.de/api?<b>year</b>=2024&<b>state</b>=BW&<b>days</b>=30&<b>startmonth</b>=0&<b>endmonth</b>=11&<b>mindays</b>=7&<b>maxdays</b>=30&<b>correctdates</b>=false&<b>saturdayaswd</b>=false</span>
        </code>
      </v-row>
    </v-col>

    <v-col md="6" sm="8" cols="10">
      <v-row no-gutters="">
        <span>Siehe Dir den Rechner an, um die Parameter genauer verstehen zu können</span>
      </v-row>
      <v-row no-gutters="" class="pl-5 ">
        <v-timeline class="my-4" side="end">
          <FunctionalityStep title="year">
            <template #content>
              <p> Muss im Format <code>yyyy</code> sein. Erlaubt sind Jahre ab 1991 </p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="state">
            <template #content>
              <p>Muss die Abkürzung eines der Bundesländer sein</p>
              <CustomAccordion title="Liste Bundesländer" subtitle="Erlaubte Abkürzungen der Bundesländer">
                <template #content>
                  <p>
                    <b>BW</b> (Baden-Württemberg)<br> <b>BY</b> (Bayern)<br> <b>BE</b> (Berlin)<br>
                    <b>BB</b> (Brandenburg)<br> <b>HB</b> (Bremen)<br> <b>HH</b> (Hamburg)<br>
                    <b>HE</b> (Hessen)<br> <b>MV</b> (Mecklenburg-Vorpommern)<br> <b>NI</b> (Niedersachsen)<br>
                    <b>NW</b> (Nordrhein-Westfalen)<br> <b>RP</b> (Rheinland-Pfalz)<br> <b>SL</b> (Saarland)<br>
                    <b>SN</b> (Sachsen)<br> <b>ST</b> (Sachsen-Anhalt)<br> <b>SH</b> (Schleswig-Holstein)<br> <b>TH</b> (Thüringen)<br>
                  </p>
                </template>
              </CustomAccordion>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="days">
            <template #content>
              <p>Die gesamte Anzahl von Urlaubstagen, die zur Verfügung stehen. Muss größer als 0 sein</p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="startmonth">
            <template #content>
              <p>
                Der Beginnmonat des Zeitraums, in welchem nach Urlaubsperioden gesucht werden soll.<br>
                Beginnend bei Monat 0 (Januar) bis Monat 11 (Dezember). Muss kleiner sein als <i>'endmonth'</i>
              </p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="endmonth">
            <template #content>
              <p>
                Der Endmonat des Zeitraums, in welchem nach Urlaubsperioden gesucht werden soll.<br>
                Beginnend bei Monat 0 (Januar) bis Monat 11 (Dezember). Muss größer als <i>'startmonth'</i> sein
              </p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="mindays">
            <template #content>
              <p>
                Die Mindestanzahl der Urlaubstage, die aufgebraucht werden sollen.<br>
                Muss mindestens genauso groß sein wie <i>'days'</i> und nicht größer als <i>'maxdays'</i>
              </p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="maxdays">
            <template #content>
              <p>
                Die Maximalanzahl der Urlaubstage, die aufgebraucht werden sollen.<br>
                Muss größer sein als <i>'mindays'</i>
              </p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="correctdates">
            <template #content>
              <p>
                Spezifiziere, ob in dem vorausgehenden bzw. nächsten Monat von <i>'startmonth'</i> und <i>'endmonth'</i> nach freien Tagen geschaut werden soll.<br>
                Muss entweder <i>'true'</i> oder <i>'false'</i> sein. Geht nur, wenn <i>'startmonth'</i> größer als 0 ist oder <i>'endmonth'</i> kleiner als 11
              </p>
            </template>
          </FunctionalityStep>

          <FunctionalityStep title="saturdayaswd">
            <template #content>
              <p>Gebe an, ob der Samstag als Arbeitstag betrachtet werden soll</p>
            </template>
          </FunctionalityStep>
        </v-timeline>

      </v-row>
    </v-col>
  </v-col>

</template>

<style>
.v-timeline-item__body {
  width: 100%;
}

a.usual-anchor {
  color: #00695C;
  text-decoration: none;
}

a.usual-anchor:visited {
  color: #00695C;
}

a.usual-anchor:hover {
  color: #004D40;
  text-decoration: underline;
}
</style>
