import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: Login
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/home',
  name: 'home',
  component: Home
}
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  // Actually, we should valid whether the token is right
  if (!tokenstr) return next('/login')

  next()
})

export default router
