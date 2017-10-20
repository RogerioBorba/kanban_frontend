// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify';
import App from './App';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage';
import {config} from './components/config';
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
axios.defaults.baseURL = 'http://127.0.0.1:8000/scrum-list/';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(Vuetify);
Vue.use(VueLocalStorage);
//Vue.localStorage.set('token', null);
config.localstore = Vue.localStorage;
axios.defaults.headers.common['Authorization'] = `Bearer ${config.localstore.get('token','')}`;
Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueRouter);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
