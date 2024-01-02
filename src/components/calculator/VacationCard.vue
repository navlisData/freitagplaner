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
      days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    }
  },

  methods: {
    toRaw,
    formatDate(date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      return this.days[date.getDay()] + ". " + day + "." + month + "." + year;
    }
  },

  computed: {
    buildDateRange() {
      return this.formatDate(toRaw(this.periodData.period[0].date)) +
      ' - ' +
      this.formatDate(toRaw(this.periodData.period[toRaw(this.periodData.period.length-1)].date));
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      width="300px"
  >
    <v-card>
      <v-card-text>
        <v-list lines="one">
          <v-list-item
              v-for="(period, index) in toRaw(periodData.period)"
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
    <v-card
        class="mx-auto ma-3"
        color="indigo"
        variant="outlined"
        v-bind="props"
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
                {{ parseFloat(toRaw(periodData).score.toFixed(2)) }}
                <v-tooltip
                    activator="parent"
                    location="top"
                >Dieser Score errechnet sich aus dem Verhältnis der freien Tage und den Arbeitstagen in diesem Zeitraum. <br/>
                  Umso größer, umso besser ist das Verhältnis, in diesem Zeitraum Urlaub zu nehmen</v-tooltip>
              </v-chip>
            </div>
          </div>

          <div class="text-h6 mb-1">
            {{ toRaw(periodData).period.length }} Tage Urlaub
          </div>
          <div class="text-caption d-flex flex-column">
            <span>{{toRaw(periodData).workingdays}} Arbeitstage</span>
            <span>{{toRaw(periodData).nonworkingdays}} freie Tage</span>
          </div>
        </div>
      </v-card-item>

      <v-overlay
          :model-value="isHovering"
          contained
          scrim="indigo-lighten-5"
          class="align-center justify-center"
      >
        <v-btn
          variant="flat"
          color="indigo-lighten-1"
          @click="dialog = true"
        >
          Tage betrachten
        </v-btn>
      </v-overlay>
    </v-card>
  </v-hover>
</template>

