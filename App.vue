<script>
	import APPUpdate , { getCurrentNo } from "@/js_sdk/zhouWei-APPUpdate/APPUpdate";
	export default {
		onLaunch: function() {
			uni.onTabBarMidButtonTap((e) => {
				uni.navigateTo({
					url: "/pages/tabbar/customer/tabbar-2"
				})
			});
			// #ifdef APP-PLUS
			APPUpdate();
			const first = uni.getStorageInfoSync('first')
			if (!first) {
				// 获取设备型号
				let model = null; 
				uni.getSystemInfo({
					success: function(res) {
						model = res.model
					}
				});
				// 获取设备uuid
				plus.device.getInfo({
					success: (e) => {
						// 获取版本号
						plus.runtime.getProperty(plus.runtime.appid, (res) => {
							this.$u.post('/api/app/addDownRecord?uuid=' + e.uuid + '&type=' + model + '&ver=' + res.version).then(res => {
								if (res.code == 1) {
									uni.setStorage({
										key: 'first',
										data: true
									})
								}
							})
						})
					}
				});
			}
			// var info = plus.push.getClientInfo();
			// console.log(info);
			// 获取系统信息
			const platform = uni.getSystemInfoSync().platform;

			const _handlePush = function(msg) {
				// TODO  
				let data;
				console.log(msg)
				if (platform == "android") {
					data = JSON.parse(msg.payload)
				}
				if (platform == "ios") {
					data = msg.payload
				}
				uni.setStorage({
					key: "pushMsg",
					data: data.payload,
					success: () => {
						plus.push.clear();
					}
				})
			};
			// plus.push.addEventListener('click', _handlePush, false);
			// plus.push.addEventListener('receive', _handlePush, false);


			//收到透传消息  
			//只有APP在线时，才会触发receive事件，透传消息不会触发系统消息,需要创建本地消息  
			plus.push.addEventListener("receive", function(msg) {
				console.log("(receive):" + JSON.stringify(msg));
				if (platform == "ios") { //如果是IOS  
					var payload = msg.payload;
					//【APP离线】收到消息，但没有提醒（发生在一次收到多个离线消息时，只有一个有提醒，但其他的没有提醒）  
					//【APP在线】收到消息，不会触发系统消息,需要创建本地消息，但不能重复创建。必须加msg.type验证去除死循环
					if (msg.aps == null && msg.type == "receive") {
						var messageTitle = msg.title;
						var messageContent = msg.content;
						//创建本地消息,发送的本地消息也会被receive方法接收到，但没有type属性，且aps是null  
						// plus.push.createMessage(messageContent, JSON.stringify(payload), {
						// 	title: messageTitle
						// });
					}
				}
				if (platform == "android") { //如果是Android，当APP在线时，收到透传消息不会进入系统消息，需要发送本地提醒。  
					var payload = JSON.parse(msg.payload);
					console.log(payload)
					var messageTitle = payload.messageTitle;
					var messageContent = payload.messageContent;
					// plus.push.createMessage(messageContent, msg.payload, {
					// 	title: messageTitle
					// });
				}
			}, false);

			plus.push.addEventListener('click', _handlePush, false);
			// //消息点击事件  
			// //【APP在线】，收到透传消息通过，不会提醒至通知栏目，需要发送本地消息，再进行点击触发的点击事件。  
			// //【APP离线】，收到离线透传消息，必须通过Java后台的Intent字符串携带payload，且符合格式才能触发click事件，格式不符合不会触发。  
			// plus.push.addEventListener("click", function(msg) {
			// 	plus.nativeUI.toast('push receive');
			// 	console.log("(click):" + msg);
			// 	console.log(platform)
			// 	if (platform == "ios") { //如果是IOS  
			// 		var payload;
			// 		if (msg.type == "click") { //APP离线点击包含click属性，这时payload是JSON对象  
			// 			payload = msg.payload;
			// 		} else { //APP在线，收到消息不会包含type属性,这时的payload是JSON字符串，需要转为JSON对象  
			// 			payload = JSON.parse(msg.payload);
			// 		}
			// 		uni.navigateTo({
			// 			url: './pages/news/index?id=' + payload.cid
			// 		})
			// 	}
			// 	if (platform == "android") { //如果是Android，收到playload均是是JSON字符串，需要转为JSON对象  
			// 		console.log(msg)
			// 		var payload = JSON.parse(msg.payload);


			// 			uni.navigateTo({
			// 				url: './pages/news/index?id=' + payload.payload.cid
			// 			})	
			// 		console.log(payloadpayload.cid)
			// 			// uni.setStorage({
			// 			// 	key: "pushMsg",
			// 			// 	data: payload.payload,
			// 			// 	success: () => {
			// 			// 		plus.push.clear();
			// 			// 	}
			// 			// })
			// 		// if (payload != null || payload != undefined) {
			// 		// 	var messageType = payload.messageType;
			// 			// messageClick(messageType, payload);
			// 			// uni.navigateTo({
			// 			// 	url: './pages/news/index?id=' + payload.payload.cid
			// 			// })
			// 		// } 
			// 		// console.log(111)
			// 	}
			// }, false);

			// #endif
		},
		onShow: function() {
			console.log('App Show');
			// #ifdef APP-PLUS
			plus.push.addEventListener('click', function(msg) {
				uni.navigateTo({
					url: 'pages/news/index?id=5413'
				})
			}, false);
			// #endif
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	@import "static/font/iconfont.css";
	/* #endif */
	@import "static/style/index.scss";
</style>
