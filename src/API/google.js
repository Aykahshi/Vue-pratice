import axios from 'axios';
const key = 'AIzaSyCWTc7iwkuoBCNS-YnKlUsYLyGEx-HJI00'
const instance = axios.create({
	baseURL: import.meta.env.VITE_BASE_API_2
});

instance.interceptors.request.use(
	async function (config) {
		config.params.key = key
		return config;
	},
	function (error) {
		console.log(error);
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	function (response) {
		console.log(response.data);
		return response;
	},
	function (error) {
		// alert('發生未預期錯誤');
		console.log(error)
		return Promise.reject(error);
	}
);

export default instance;