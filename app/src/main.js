import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueResource from 'vue-resource'
import VueSession from 'vue-session'

Vue.use(VueResource)
Vue.use(VueSession)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
