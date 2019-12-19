import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import vuetify from './utility/vuetify/vuetify';
import router from './router/router.js';
import VueSessionStorage from 'vue-sessionstorage';
import VueLocalStorage from 'vue-localstorage'
import "regenerator-runtime/runtime";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'bulma/css/bulma.css';

Vue.config.productionTip = false;

Vue.use(VueSessionStorage)
Vue.use(VueLocalStorage)

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
