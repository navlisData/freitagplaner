<script>
import {toRaw} from "vue";

export default {

  props: {
    periodData: {
      type: Object, //proxy array
      required: true
    },
  },

  data() {
    return {
      dialog: false,
      selected: false,
      days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      rawData: toRaw(this.periodData)
    }
  },

  methods: {
    toRaw,
    formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      return this.days[date.getDay()] + ". " + day + "." + month + "." + year;
    },

    changeSelection() {
      this.selected = !this.selected;
      this.$emit('update:selection', this.selected);
    }
  },

  computed: {
    buildDateRange() {
      return this.formatDate(this.rawData.period[0].date) +
      ' - ' +
      this.formatDate(this.rawData.period[this.rawData.period.length-1].date);
    },

    getVacationDescription() {
      return this.rawData.workingdays + (this.rawData.workingdays === 1 ? ' Urlaubstag' : ' Urlaubstage') + ' benötigt'
    },

  }
}
</script>

<template>
  <v-dialog v-model="dialog" width="300px">
    <v-card>
      <v-card-text>
        <h4 class="pb-2">Alle Tage im Zeitraum:</h4>
        <v-list lines="one" max-height="400">
          <v-list-item
              v-for="(period, index) in this.rawData.period"
              :key="index"
              :title="period.holidayname === null ? period.daytype : period.holidayname"
              :subtitle="formatDate(period.date)"
          ></v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-hover v-slot="{ isHovering, props }">
    <div style="position: relative;"  v-bind="props">
      <v-card
          class="mx-auto ma-3"
          color="indigo"
          variant="outlined"
          style="position: relative; z-index: 1;"
      >
        <v-card-item>
          <div>
            <div class="d-flex flex-row">
              <div class="text-overline mb-1">
                {{buildDateRange}}
              </div>

              <div class="ml-auto">
                <v-chip
                    class="ma-2"
                    color="indigo"
                    size="small"
                    prepend-icon="mdi-poll"
                >
                  {{ parseFloat(this.rawData.score.toFixed(2)) }}
<!--                  {{ parseFloat((this.rawData.nonworkingdays / this.rawData.workingdays).toFixed(2)) }}-->
                  <v-tooltip activator="parent" location="top">
                    Dieser Score errechnet sich aus dem Verhältnis der freien Tage und den Arbeitstagen in diesem Zeitraum. <br/>
                    Umso größer, umso besser ist das Verhältnis, in diesem Zeitraum Urlaub zu nehmen
                  </v-tooltip>
                </v-chip>
              </div>
            </div>

            <div class="text-h6 mb-1">
              Ermöglicht {{ this.rawData.period.length }} freie Tage
            </div>
            <div class="text-caption d-flex flex-column">
              <span class="font-weight-bold">{{getVacationDescription}}</span>
              <span>{{this.rawData.nonworkingdays}} Wochenend - und Feiertage enthalten</span>
            </div>
          </div>
        </v-card-item>
      </v-card>

      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-btn
              v-if="isHovering || selected"
              density="default"
              icon
              color="indigo-lighten-1"
              v-bind="props"
              style="position: absolute; right: -25px; top: 40%; transform: translateY(-50%); z-index: 2;"
              @click="changeSelection"
          >
            <v-icon color="" :icon="selected ? 'mdi-star' : 'mdi-star-outline'"/>
          </v-btn>
        </template>
        <span>Markiere Dir diesen Zeitraum</span>
      </v-tooltip>

      <v-tooltip location="top" >
        <template v-slot:activator="{ props }">
          <v-btn
              v-if="isHovering"
              density="default"
              icon
              color="indigo-darken-2"
              v-bind="props"
              style="position: absolute; right: -25px; top: 80%; transform: translateY(-50%); z-index: 2;"
              @click="dialog = true"
          >
            <v-icon color="" icon="mdi-folder-information"/>
          </v-btn>
        </template>
        <span>Zeige Dir alle enthaltenen Tage an</span>
      </v-tooltip>
    </div>

  </v-hover>
</template>

