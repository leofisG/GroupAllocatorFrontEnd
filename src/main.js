import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import vuetify from './utility/vuetify/vuetify';
import router from './router/router.js';
import VueIntro from 'vue-introjs';
import VueSessionStorage from 'vue-sessionstorage';
import "regenerator-runtime/runtime";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'bulma/css/bulma.css';

Vue.config.productionTip = false;

Vue.use(VueSessionStorage)
Vue.use(VueIntro)

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
