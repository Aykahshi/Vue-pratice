import axios from 'axios';
const Authorization = 'CWA-2977C9FC-E45A-47BA-A5EA-966C0BE1136C'
const instance = axios.create({
	baseURL: import.meta.env.VITE_BASE_API
});

instance.interceptors.request.use(
	async function (config) {
		config.params.Authorization = Authorization
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