<script>

  export default {
    name: 'App',

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
  <v-select
      :items="items"
      model-value="Baden-Württemberg"
      density="comfortable"
      variant="outlined"
      label="Bundesland"
  />
</template>
