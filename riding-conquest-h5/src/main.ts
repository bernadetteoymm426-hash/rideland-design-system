import './assets/main.css'
import './styles/variables.css'
import './styles/tech-geo-theme.css'
import './styles/game-ux-animations.css'
import 'vant/lib/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
