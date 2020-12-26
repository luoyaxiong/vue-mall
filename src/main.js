import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from './network'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang)

// 注册
Vue.filter('getDate', function (oldVal) {
  // 返回处理后的值
  const dt = new Date(oldVal)
  const YY = dt.getFullYear()
  const MM = (dt.getMonth() + 1 + '').padStart(2, '0')
  const DD = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${YY}-${MM}-${DD}:${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
