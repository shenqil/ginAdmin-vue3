import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import naiveUI from './ui/naiveUI'

createApp(App)
    .use(router)
    .use(store)
    .use(naiveUI)
    .mount('#app');
