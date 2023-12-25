<script>

  export default {
    name: 'App',

    data: () => ({
      items: [
        { fullName: 'Baden-Württemberg', abbrv: 'BW' },
        { fullName: 'Bayern', abbrv: 'BY' },
        { fullName: 'Berlin', abbrv: 'BE' },
        { fullName: 'Brandenburg', abbrv: 'BB' },
        { fullName: 'Bremen', abbrv: 'HB' }, // HB for Hansestadt Bremen
        { fullName: 'Hamburg', abbrv: 'HH' }, // HH for Hansestadt Hamburg
        { fullName: 'Hessen', abbrv: 'HE' },
        { fullName: 'Mecklenburg-Vorpommern', abbrv: 'MV' },
        { fullName: 'Niedersachsen', abbrv: 'NI' },
        { fullName: 'Nordrhein-Westfalen', abbrv: 'NW' },
        { fullName: 'Rheinland-Pfalz', abbrv: 'RP' },
        { fullName: 'Saarland', abbrv: 'SL' },
        { fullName: 'Sachsen', abbrv: 'SN' },
        { fullName: 'Sachsen-Anhalt', abbrv: 'ST' },
        { fullName: 'Schleswig-Holstein', abbrv: 'SH' },
        { fullName: 'Thüringen', abbrv: 'TH' }
        ],

    }),
  }
</script>

<!--<template>-->
<!--  <v-select-->
<!--      :items="items"-->
<!--      item-text="fullName"-->
<!--      item-value="abbrv"-->
<!--      model-value="Baden-Württemberg"-->
<!--      density="comfortable"-->
<!--      variant="outlined"-->
<!--      label="Bundesland"-->
<!--  />-->
<!--</template>-->
<template>
  <v-select
      :items="items"
      item-title="fullName"
      item-value="abbrv"
      density="comfortable"
      variant="outlined"
      label="Bundesland"
  />
</template>
