import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import vuetify from './utility/vuetify/vuetify';
import router from './router/router.js'
import "regenerator-runtime/runtime";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
