import Vue from 'vue'
import App from './App.vue'
import VueBus from 'vue-bus'
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false
Vue.use(VueBus)

new Vue({
  render: h => h(App),
}).$mount('#app')
