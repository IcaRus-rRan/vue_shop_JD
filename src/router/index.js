import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login')
const Home = () => import('components/Home')
const Welcome = () => import('components/Welcome')
const Users = () => import('components/users/Users')
const Roles = () => import('components/rights/Roles')
const Rights = () => import('components/rights/Rights')
const Goods = () => import('components/categories/Goods')
const Params = () => import('components/categories/Params')
const Orders = () => import('components/orders/Orders')
const Reports = () => import('components/reports/Reports')
const Categories = () => import('components/categories/Categories')

Vue.use(VueRouter)

const routes = [
	{ path: '/', redirect: '/home' },
	{ path: '/login', component: Login, meta: { title: '登录' } },
	{
		path: '/home', component: Home, redirect: '/welcome', meta: { title: '主页' },
		children: [
			{ path: '/welcome', component: Welcome },
			{ path: '/users', component: Users },
			{ path: '/roles', component: Roles },
			{ path: '/rights', component: Rights },
			{ path: '/Goods', component: Goods },
			{ path: '/Params', component: Params },
			{ path: '/Categories', component: Categories },
			{ path: '/Reports', component: Reports },
			{ path: '/Orders', component: Orders },
		]
	}
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	document.title = to.matched[0].meta.title;
	if (to.path === '/login') return next();

	const tokenStr = window.sessionStorage.token;
	if (!tokenStr) return next('/login');
	next();
})

export default router
