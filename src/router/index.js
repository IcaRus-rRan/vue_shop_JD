import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome"*/ 'components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome"*/ 'components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome"*/ 'components/Welcome')

const Users = () => import(/* webpackChunkName: "user_role_right"*/ 'components/users/Users')
const Roles = () => import(/* webpackChunkName: "user_role_right"*/ 'components/rights/Roles')
const Rights = () => import(/* webpackChunkName: "user_role_right"*/ 'components/rights/Rights')

const Goods = () => import(/* webpackChunkName: "good_param_category"*/ 'components/categories/Goods')
const Params = () => import(/* webpackChunkName: "good_param_category"*/ 'components/categories/Params')
const Categories = () => import(/* webpackChunkName: "good_param_category"*/ 'components/categories/Categories')

const Orders = () => import(/* webpackChunkName: "order_report"*/ 'components/orders/Orders')
const Reports = () => import(/* webpackChunkName: "order_report"*/ 'components/reports/Reports')

Vue.use(VueRouter)

const routes = [
	{ path: '/', redirect: '/home' },
	{ path: '/login', component: Login, meta: { title: '登录' } },
	{
		path: '/home', component: Home, redirect: '/welcome', meta: { title: '后台管理系统' },
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
