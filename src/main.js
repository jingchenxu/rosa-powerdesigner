import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import 'intro.js/introjs.css'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false

Vue.use(ViewUI)
Vue.use(VModal, { componentName: 'foo-modal' })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
