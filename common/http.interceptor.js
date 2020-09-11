const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://www.jnwater.com.cn',
		showLoading: true,
		loadingText: '努力加载中···',
		loadingTime: 800,
		// originalData: true
		header: {
			'sign': 'jbS1QOOpQXxJcKZK3SrCtJIaVeGYVshu'
		},
	});
}

export default {
	install
}