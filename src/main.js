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

//Begin router (Source: //https://www.youtube.com/watch?v=o62BwRSaEHo)
import {createRouter, createWebHashHistory} from "vue-router";
import LandingPage from "@/components/LandingPage.vue";
import Calculator from "@/components/Calculator.vue";

const app = createApp(App)

const routes = [
    { path: "/", component: LandingPage },
    { path: "/calculate", component: Calculator }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    linkActiveClass: "active"
})
//End router

app.use(vuetify).use(router)
app.mount('#app')