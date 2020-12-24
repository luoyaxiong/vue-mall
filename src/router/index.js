import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'

Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: '/login'
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/home',
  name: 'home',
  component: Home,
  redirect: '/home/welcome',
  children: [
    {
      path: 'welcome',
      component: Welcome
    },
    {
      path: 'users',
      component: Users
    }
  ]
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
