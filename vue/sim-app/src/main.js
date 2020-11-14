import Vue from 'vue';
import x5GMaps from 'x5-gmaps';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

console.log('process.env.VUE_APP_API_KEY: ', process.env.VUE_APP_API_KEY);
Vue.use(x5GMaps, process.env.VUE_APP_API_KEY);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
