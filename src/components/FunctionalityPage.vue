<script>
import ImageHeader from "@/components/global/ImageHeader.vue";
import FunctionalityStep from "@/components/functionality/FunctionalityStep.vue";

export default {
  name: 'App',

  components: {
    ImageHeader,
    FunctionalityStep,
  },

  computed: {
    codeStyle() {
      return 'py-1 px-2 font-italic';
    }
  }


}
</script>

<template>
  <v-row no-gutters="" class="pl-11 pt-11">
    <v-col md="6" sm="8" cols="10">
      <v-timeline class="py-8" side="end">
        <FunctionalityStep title="#1 API Fetch">
          <template #content>
            <p>
              Die Feiertags REST API (<a href="https://github.com/bundesAPI/feiertage-api" target="_blank">Github</a>) gibt unter der Berücksichtigung des Jahres und
              einem Bundesland im Json Format die Namen, Daten sowie teilweise weitere Informationen zurück.
            </p>
            <code :class="codeStyle">https://feiertage-api.de/api/?jahr={{new Date().getFullYear()}}&nur_land=BW</code>
            <p>Feiertage, die nicht in den ausgewählten Monaten liegen, werden für die weitere Verarbeitung direkt verworfen, um Daten zu reduzieren.</p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#2 Zeitraumberechnung">
          <template #content>
            <p>Ist gewünscht, dass in den vorausgehenden und nachfolgenden Monaten geschaut werden soll, ob diese jeweils mit freien Tagen enden oder beginnen, wird das Start- und Enddatum bei entsprechendem Fall jeweils erweitert.</p>
            <p class="pt-1">Nun wird der gesamte Zeitraum unter Berücksichtigung des Json Objektes durchlaufen, um herauszufinden, ob die jeweilige Tage Feiertage, normale Wochentage, oder Wochenendtage sind.</p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#3 Perioden Erstellung">
          <template #content>
            <p>Der Gesamtzeitraum wird nun in Perioden unterteilt, wobei jede Periode (außer das Start- bzw. Enddatum ist kein Feier- oder Wochenendtag) mit einem freien Tag beginnt sowie endet und dazwischen seine Arbeitstage hat.</p>
            <p class="pt-1">Von jeder dieser Perioden werden nun die Arbeits- sowie freien Tage gezählt</p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#4 Alle Kombinationen berechnen">
          <template #content>
            <p>
              Der Reihenfolge nach wird jede Periode betrachtet und die (falls vorhanden) davor sowie danach liegende(n) Periode(n) darangehangen. Dies geschieht mithilfe eines rekursiven Backtrack Algorithmus so lange,
              bis alle möglichen Kombinationen erstellt wurden, welche in dem gegebenen Zeitraum von der Mindest- und Maximalanzahl der Tage liegen.
            </p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#5 Perioden gewichten und optimieren">
          <template #content>
            <p>
              Jede Periode (aus <b>Schritt #3</b>) besitzt nun also eine Liste mit jeweils vielen möglichen Perioden-Kombinationen. Um herauszufinden, welche einzelne Perioden-Kombination für jeder Periode nun die wertvollste ist,
              werden von jeder dieser Perioden-Kombination die freien- sowie Arbeitstage zusammengezählt.
            </p>
            <p class="pt-1">Mithilfe dieser wird für jede Perioden-Kombination (jeder Periode) ein Score erstellt, der sich aus dem Verhältnis von freien Tagen und Arbeitstagen errechnet. Die Perioden-Kombination mit dem höchsten Score gewinnt für die entsprechende Periode.</p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#6 Perioden-Kombinationen aussortieren">
          <template #content>
            <p>
              Viele Perioden besitzen trotz der Optimierung nur Perioden-Kombinationen, die aus mehreren <i>normalen</i> Wochen bestehen. Also Wochen die mit zwei Wochenendtagen (Samstag/Sonntag) beginnen, worauf fünf Arbeitstage folgen und mit zwei Wochenendtagen enden.
            </p>
            <p class="pt-1">Zu solch einem Muster kann es nur kommen, wenn um eine Periode herum (in der Vergangenheit und Zukunft) keine Feiertage vorhanden sind. Diese Perioden-Kombinationen sind nicht weiter interessant und werden deshalb aussortiert.</p>
            <p class="pt-1">Hierzu wird der Mittelwert sowie die Standardabweichung des Scores aller Perioden-Kombinationen berechnet. Eine hohe Standardabweichung bedeutet, dass die Scores sehr verstreut sind, während eine niedrige Standardabweichung darauf hinweist, dass sie nah am Durchschnitt liegen.</p>
            <p class="pt-1">Anschließend wird ein Schwellenwert definiert:</p>
            <code :class="codeStyle">Threshold = Durchschnittswert - (0.3 * Standardabweichung)</code>
            <p>Alle Perioden-Kombinationen, deren Score unter dem Schwellenwert liegt, werden verworfen. Die übriggebliebenen bilden jeweils die idealen Zeiträume ab, mit wenig Arbeitstagen einen langen Urlaub zu erreichen.</p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#7 Sortieren der Kombinationen>">
          <template #content>
            <p> Um das Ergebnis am Schluss auch übersichtlich darstellen zu können, werden nun in einem Zwischenschritt alle Perioden-Kombinationen nach ihrem Score absteigend sortiert.</p>
          </template>
        </FunctionalityStep>

        <FunctionalityStep title="#8 Perioden-Kombinationen zusammenfügen">
          <template #content>
            <p>
              Übrig bleibt eine Liste von <i>Perioden-Einträgen</i> mit den jeweils zusammengehörenden Perioden-Kombinationen, welche es gilt, zusammenzufügen. Zu diesem Zeitpunkt besteht in der Regel ein einzelner dieser <i>Perioden-Einträge</i> (sofern eine entsprechende Länge an Tagen ausgewählt wurde) noch aus mehreren einzelnen Perioden,
              die in der Regel mit freien Tagen beginnen sowie enden.
            </p>
            <p class="pt-1">Im Falle dessen, dass der Eintrag tatsächlich aus mehr als einer Perioden-Kombination besteht, überschneiden sich außerdem die freien Tage dieser. Aus diesem Grund werden die entsprechend freien Tage zu Beginn ab der zweiten Periode aus den Perioden entfernt.</p>
            <p class="pt-1">Jede einzelne Perioden-Kombination aus der Liste der <i>Perioden-Einträge</i> werden nun zu einer endgültigen Periode zusammengefügt.</p>
            <p class="pt-1">So erhalten wir am Schluss eine Liste von Zeiträumen, die in der Regel wieder mit freien Tagen beginnen sowie enden und bei entsprechend ausgewählter Zeitraumlänge mehrere der ursprünglichen Perioden aus <b>Schritt #3</b> umfassen.</p>
          </template>
        </FunctionalityStep>
      </v-timeline>
    </v-col>

  </v-row>
</template>

<style>
  .v-timeline-item__body {
    width: 100%;
  }

</style>
