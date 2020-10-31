// 封装axios
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function request(config) {
	const instance = axios.create({
		baseURL: 'http://127.0.0.1:8888/api/private/v1/',
		timeout: 5000
	})

	instance.interceptors.request.use(configg => {
		// console.log(configg);
		// request拦截器 显示进度条
		NProgress.start();
		configg.headers.Authorization = window.sessionStorage.getItem('token');
		return configg
	}, err => {
		console.log(err);
		return err
	})

	instance.interceptors.response.use(config => {
		//response拦截器 隐藏进度条
		NProgress.done()
		return config
	})

	return instance(config)
}
