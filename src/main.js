import { createApp } from 'vue'
import App from './App.vue'
//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
//Router
import {createRouter, createWebHistory} from "vue-router";
import LandingPage from "@/components/LandingPage.vue";
import CalculatorPage from "@/components/CalculatorPage.vue";
import FunctionalityPage from "@/components/FunctionalityPage.vue";
import ApiDocumentationPage from "@/components/ApiDocumentationPage.vue";

const vuetify = createVuetify({
    components,
    directives,
})
//end vuetify

//Begin router (With help of: //https://www.youtube.com/watch?v=o62BwRSaEHo)
const app = createApp(App)

const routes = [
    { path: "/", component: LandingPage },
    { path: "/calculate", component: CalculatorPage },
    { path: "/functionality", component: FunctionalityPage },
    { path: "/api-documentation", component: ApiDocumentationPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    linkActiveClass: "active"
})
//End router

app.use(vuetify).use(router)
app.mount('#app')