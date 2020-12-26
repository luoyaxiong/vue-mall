import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/right/Rights'
import Roles from '@/components/right/Roles'
import Reports from '@/components/report/Reports'
import Orders from '@/components/order/Orders'
import Goods from '@/components/good/Goods'
import Params from '@/components/param/Params'
import Categories from '@/components/category/Categories'

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
      name: 'welcome',
      component: Welcome
    },
    {
      path: 'users',
      name: 'users',
      component: Users
    },
    {
      path: 'rights',
      name: 'rights',
      component: Rights
    },
    {
      path: 'roles',
      name: 'roles',
      component: Roles
    },
    {
      path: 'orders',
      name: 'orders',
      component: Orders
    },
    {
      path: 'reports',
      name: 'reports',
      component: Reports
    },
    {
      path: 'goods',
      name: 'goods',
      component: Goods
    },
    {
      path: 'params',
      name: 'params',
      component: Params
    },
    {
      path: 'categories',
      name: 'categories',
      component: Categories
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
