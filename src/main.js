import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import vuetify from './utility/vuetify/vuetify';
import router from './router/router.js';
import VueIntro from 'vue-introjs'
import "regenerator-runtime/runtime";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'bulma/css/bulma.css';

Vue.config.productionTip = false;

// Vue.use(VueIntro)
new Vue({
  vuetify,
  store,
  router,
  VueIntro,
  render: h => h(App)
}).$mount('#app')
