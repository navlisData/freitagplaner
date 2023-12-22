import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

//Begin vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})
//end vuetify


createApp(App).use(vuetify).mount('#app')
