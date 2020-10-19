// 封装axios
import axios from 'axios'

export function request(config) {
	const instance = axios.create({
		baseURL: 'http://127.0.0.1:8888/api/private/v1/',
		timeout: 5000
	})
	return instance(config)
}

// export function requestt(config) {
// 	const instance = axios.create({
// 		baseURL: 'http://localhost:999/',
// 		timeout: 5000
// 	})

// 	return instance(config)
// }
