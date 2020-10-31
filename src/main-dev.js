import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
 