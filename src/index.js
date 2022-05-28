import Vue from 'vue';
import VueClipboard from 'vue-clipboard2'
import App from './pages/App.vue';
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard)
console.log("app started.");
var app = new Vue({
  el: '#app',
  render: h => h(App)
})