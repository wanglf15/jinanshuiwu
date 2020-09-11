import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 引入uView
import uView from "uview-ui"
Vue.use(uView)

import store from './store'  
Vue.prototype.$store = store  
// 配置全局变量/方法
Vue.prototype.$shareUrl = 'https://www.jnwater.com.cn'
Vue.prototype.$Url = 'https://www.jnwater.com.cn'
Vue.prototype.$formatDateTime = function(timeStamp) {
	// 日期格式化
	var date = new Date();
	date.setTime(timeStamp * 1000);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
};

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})

import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

app.$mount()
