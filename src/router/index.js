import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login')
const Home = () => import('components/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
		component: Login,
		meta: {
			title: '登录'
		}
  },
	{
    path: '/home',
    component: Home,
		meta: {
			title: '主页' 
		}
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
	document.title = to.matched[0].meta.title;
	if (to.path === '/login') return next();
	const tokenStr = window.sessionStorage.token;
	if (!tokenStr) {
		return	next('/login');
	}
	next();
})

export default router
