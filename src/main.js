import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        'en': require('./i18n/en.json'),
        'en-uk': require('./i18n/en.json'),
        'en-us': require('./i18n/en.json')
    }
  })

  
createApp(App).use(router).use(i18n).mount('#app')
