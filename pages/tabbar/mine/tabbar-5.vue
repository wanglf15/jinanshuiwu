<template>
	<view class="mine">
		<view class="bar">
			<u-navbar :is-back="false" :is-fixed="true" title="我的用水" title-size="36" :background="background" title-color="#fff"></u-navbar>
		</view>
		<view class="noLogin" v-if="!isLogin">
			<image src="../../../static/img/img/zc_logo.png" mode=""></image>
			<view class="uni-form-item uni-column">
				<input class="uni-input" v-model="reqForm.tel" type="number" :adjust-position="false" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="uni-form-item uni-column">
				<input class="uni-input" v-model="reqForm.code" type="number" :adjust-position="false" maxlength="6" placeholder="请输入验证码" />
				<text @click="getCode">{{ txt }}</text>
			</view>
			<view class="" style="width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 50rpx;">
				<u-checkbox-group>
					<u-checkbox v-model="checked" active-color="#00919f" style="width: 50rpx;"></u-checkbox>
				</u-checkbox-group>
				<navigator url="agreement/agreement?type=1" style="color: #00919f; text-decoration: underline;">服务协议</navigator>
				<text style="margin: 0 10rpx;">|</text>
				<navigator url="agreement/agreement?type=2" style="color: #00919f; text-decoration: underline;">隐私政策</navigator>
			</view>
			<button type="primary" @click="login(reqForm.tel)">手机登录</button>
			<button type="primary" class="appleBtn" @click="appleLogin" v-if="system >= 13 && platform=='ios'">
				<u-icon name="apple-fill" size="40"></u-icon>通过Apple登录
			</button>
			<view class="other">
				<!-- <view class="line">
					<text>其他登录方式</text>
				</view> -->
				<view class="wx-login">
					<view style="margin: 0 40rpx;" @click="wxlogin" v-if="isUpdateWX">
						<image src="../../../static/img/img/wx-icon.png" mode=""></image>
						<text>微信</text>
					</view>
				</view>
			</view>

		</view>
		<view class="login" v-else>
			<view class="users" @click="editInfo">
				<view class="Usernick">
					<image :src="userInfo.userSrc" mode="aspectFill" v-if="userInfo.userSrc"></image>
					<image src="../../../static/img/img/wx_thumb.png" mode="" v-else></image>
					<view>
						<text>{{ userInfo.nickname }}</text>
					</view>
				</view>
				<u-icon name="arrow-right" color="#ffffff" size="28"></u-icon>
			</view>
			<view class="myItem">
				<view class="my-water" v-if="isSuper">
					<view class="water-title" @click="openNewsSetting">
						<image src="../../../static/img/img/xinwenguanli1-copy.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
						 mode=""></image>
						<text>新闻管理</text>
						<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
					</view>
					<view style="width: 100%; height: 10rpx; background-color: #EEEEEE;"></view>
				</view>
				
				<view class="my-water">
					<view class="water-title" @click="openPayment">
						<image src="../../../static/img/img/shui.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
						 mode=""></image>
						<text>我的自来水</text>
						<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
					</view>
				</view>
				<view style="width: 100%; height: 10rpx; background-color: #EEEEEE;"></view>
				<view class="my-water" style="padding: 0 40rpx;" @click="goDrink">
					<image src="../../../static/img/img/shuibei.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
					 mode=""></image>
					<text>我的直饮水</text>
					<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
				</view>
				<view style="width: 100%; height: 10rpx; background-color: #EEEEEE;"></view>
				<view class="my-like">
					<view class="like-items">
						<view class="like-item" @click="openCollect">
							<image src="../../../static/img/img/favorite.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
							 mode=""></image>
							<!-- <uni-icons type="star" color="#ff9e00" size="20"></uni-icons> -->
							<text>我的收藏</text>
							<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
						</view>
						<view class="like-item" @click="openZan">
							<image src="../../../static/img/img/dianzan.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
							 mode=""></image>
							<!-- <uni-icons type="hand-thumbsup" color="#00a8e6" size="20"></uni-icons> -->
							<text>我的点赞</text>
							<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
						</view>
						<view class="like-item" @click="openComment">
							<image src="../../../static/img/img/wodepinglun.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
							 mode=""></image>
							<!-- <uni-icons type="chatboxes" color="#00a8e6" size="20"></uni-icons> -->
							<text>我的评论</text>
							<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
						</view>
					</view>
				</view>
				<view style="width: 100%; height: 8rpx; background-color: #EEEEEE;"></view>
				<view class="changeNum" style="height: 100rpx; line-height: 100rpx; padding: 0 40rpx;" @click="checkNewVersion">
					<image src="../../../static/img/img/gengxin.png" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin-right: 20rpx;"
					 mode=""></image>
					<!-- <uni-icons type="loop" color="#999999" size="20"></uni-icons> -->
					<text>检查新版本</text>
					<text style="margin-left: 320rpx; color: #CCCCCC;">{{ version }}</text>
					<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
				</view>
				<view style="width: 100%; height: 10rpx; background-color: #EEEEEE;"></view>
				<view class="changeNum" @tap="logout" style="padding: 0 40rpx;">
					<image src="../../../static/img/img/tuichu.png" style="width: 50rpx; height: 50rpx; vertical-align: middle; margin-right: 20rpx;"
					 mode=""></image>
					<!-- <uni-icons type="close" color="#999999" size="20"></uni-icons> -->
					<text>退出登录</text>
					<uni-icons class="forward" type="forward" size="20" color="#eeeeee"></uni-icons>
				</view>
				<view style="width: 100%; height: 10rpx; background-color: #EEEEEE;"></view>
			</view>
			<u-modal v-model="show" content="是否确认退出?" :show-title="false" show-cancel-button zoom @confirm="confirm"></u-modal>
		</view>
	</view>
</template>

<script>
	import APPUpdate, {
		getCurrentNo
	} from "@/js_sdk/zhouWei-APPUpdate/APPUpdate";
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#00919f',
				},
				reqForm: {
					tel: '',
					code: ''
				},
				txt: '获取验证码',
				isLogin: false,
				show: false,
				userInfo: {
					nickname: '',
					userSrc: '',
				},
				CheckCode: '',
				checked: true,
				version: "",
				system: '',
				platform: '',
				isSuper: false,
				isUpdateWX: true
			}
		},
		onLoad(option) {
			// #ifdef APP-PLUS
			getCurrentNo(res => {
				// 进页面获取当前APP版本号（用于页面显示）
				this.version = 'v' + res.versionName;
			});
			// #endif
			try {
				const islog = uni.getStorageSync('isLogin');
				if (islog) {
					this.isLogin = true
					if (islog.group_id >= 3) {
						this.isSuper = true
					}
					this.userInfo.nickname = this.geTel(islog.mobile)
					this.userInfo.userSrc = islog.avatarUrl
				} else {
					this.isLogin = false
					this.reqForm.tel = ''
					this.reqForm.code = ''
				}
			} catch (e) {
				// console.log(e)
			};
			this.IsshowAppleLogin()
		},
		onShow() {
			// #ifdef APP-PLUS
			const wx = plus.runtime.isApplicationExist({pname:'com.tencent.mm',action:'weixin://'})
			if(!wx) {
				this.isUpdateWX = false
			} else {
				this.isUpdateWX = true
			}
			// #endif
			try {
				const islog = uni.getStorageSync('isLogin');
				if (islog) {
					this.isLogin = true
					if (islog.group_id >= 3) {
						this.isSuper = true
					}
					this.userInfo.nickname = this.geTel(islog.mobile)
					this.userInfo.userSrc = islog.avatarUrl
				} else {
					this.isLogin = false
				}
			} catch (e) {
				// console.log(e)
			}
		},
		methods: {
			// 苹果登录
			appleLogin () {
				var that = this;
				uni.login({  
				    provider: 'apple',  
				    success: function (loginRes) {
				        // 登录成功
				        uni.getUserInfo({
				            provider: 'apple',  
				            success(res) { 
				                // 获取用户信息成功 
								 that.$u.post('/api/user/appleLogin?openid=' + res.userInfo.openId + 
								 '&fullname=' + res.userInfo.fullName.familyName + res.userInfo.fullName.giveName + 
								 '&email=' + res.userInfo.email + '&authorizationCode=' + res.userInfo.authorizationCode + 
								 '&identityToken=' + res.userInfo.identityToken + '&realUserStatus=' + res.userInfo.realUserStatus
								 ).then(res => {
									 // 直接登录成功
									 if (res.code == 2) {
										uni.showToast({
											title: res.msg
										})
										that.isLogin = true
										that.userInfo.nickname = that.geTel(res.data.userinfo.mobile)
										that.userInfo.userSrc = res.data.userinfo.avatarUrl
										uni.setStorageSync('isLogin', res.data.userinfo)
										if (res.data.userinfo.group_id && res.data.userinfo.group_id >= 3) {
											that.isSuper = true
										}
									 } else if (res.code == 0) {
									 	// 获取用户信息失败      
									 	uni.showToast({
									 		title: res.msg,
									 		icon: 'none'
									 	})
									 } else if (res.code == 1) {
									 	// 未绑定手机号
									 	uni.navigateTo({
									 		url: 'bindPhone/bindPhone?openId=' + res.data.authorizationCode + '&type=apple'
									 	})
									 }
									 
								 }).catch(err => {
									 console.log(err)
								 })
				            }  
				        })  
				    },  
				    fail: function (err) {  
				        // 登录失败  
				    }  
				});  
			},
			// 请求接口控制苹果登录按钮与微信登录的显示
			async IsshowAppleLogin() {
				await this.$u.get('/api/app/getAppInfo').then(res => {
					// #ifdef APP-PLUS
					const wx = plus.runtime.isApplicationExist({pname:'com.tencent.mm',action:'weixin://'})
					// #endif
					// 是否显示微信登录
					if (res.wxlogin != 1) {
						this.isUpdateWX = false
					} else if (res.wxlogin == 1 && wx) {
						this.isUpdateWX = true
					}
					
					if (res.applelogin != 1) {
						// 不显示
						this.system = 12
					} else {
						// 再判断 系统版本控制苹果登录按钮的显示
						uni.getSystemInfo({
						    success: (res) => {
						        this.system = res.system.slice(0,2)
						        this.platform = res.platform
						    },fail: (err) => {
								
						    },complete: () => {
								
						    }
						})
					}
				})
			},
			checkNewVersion() {
				APPUpdate(true);
			},
			// 新闻管理
			openNewsSetting() {
				uni.navigateTo({
					url: 'newsSetting/index'
				})
			},
			// 去注册
			regNum() {
				uni.navigateTo({
					url: './registe/registe'
				})
			},
			// 我的直饮水
			goDrink() {
				uni.navigateTo({
					url: 'drinkingWate/drinkingWate'
				})
			},
			// 我的点赞
			openZan() {
				uni.navigateTo({
					url: 'zan/zan'
				})
			},
			// 我的评论
			openComment() {
				uni.navigateTo({
					url: 'comment/comment'
				})
			},
			// 我的收藏
			openCollect() {
				uni.navigateTo({
					url: 'Collect/Collect'
				})
			},
			openPay() {
				uni.navigateTo({
					url: './pay/pay'
				})
			},
			openPayment() {
				uni.navigateTo({
					url: './payment/payment'
				})
			},
			pagetoRecode() {
				uni.navigateTo({
					url: './recode/recode'
				})
			},
			geTel(tel) {
				var reg = /^(\d{3})\d{4}(\d{4})$/;
				return tel.replace(reg, "$1****$2");
			},
			// 退出登录
			logout() {
				this.show = true
			},
			// 确定退出
			confirm() {
				const isLog = uni.getStorageSync('isLogin');
				this.$u.post('/api/user/logout?token=' + isLog.token).then(res => {
					this.isLogin = false
					this.reqForm.tel = ''
					this.reqForm.code = ''
					uni.clearStorageSync()
				})
			},
			// 微信登录
			wxlogin() {
				var that = this
				uni.login({
					provider: 'weixin',
					scopes: 'auth_user',
					success: function(loginRes) {
						uni.showLoading({
							title: '正在登录···'
						})
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								that.$u.post('/api/user/wechatLogin?openid=' + infoRes.userInfo.openId +
									'&nickname=' + infoRes.userInfo.nickName +
									'&headimgurl=' + infoRes.userInfo.avatarUrl +
									'&unionid=' + infoRes.userInfo.unionId +
									'&city=' + infoRes.userInfo.city +
									'&province=' + infoRes.userInfo.province +
									'&country=' + infoRes.userInfo.country
								).then(res => {
									// 直接登录成功
									if (res.code == 2) {
										uni.showToast({
											title: res.msg
										})
										that.isLogin = true
										that.userInfo.nickname = that.geTel(res.data.userinfo.mobile)
										that.userInfo.userSrc = res.data.userinfo.avatarUrl
										uni.setStorageSync('isLogin', res.data.userinfo)
										if (res.data.userinfo.group_id && res.data.userinfo.group_id >= 3) {
											that.isSuper = true
										}
									} else if (res.code == 0) {
										// 获取用户信息失败
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									} else if (res.code == 1) {
										// 未绑定手机号
										uni.navigateTo({
											url: 'bindPhone/bindPhone?openId=' + res.data.openid
										})
									}
									console.log(res.data)
									
								}).catch(err => {
									console.log(err)
								})
							},
							fail: function(err) {
								uni.showToast({
									title: '获取用户信息失败'
								})
							}
						});
					}
				})
			},
			// 获取验证码
			getCode() {

				if (this.txt == '获取验证码') {
					if (this.reqForm.tel == '') {
						uni.showToast({
							title: '手机号有误, 请重新输入',
							icon: 'none'
						})
						return false
					} else if (!(/^1[34578]\d{9}$/.test(this.reqForm.tel))) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none',
							position: 'bottom'
						})
						return false
					}
					uni.request({
						method: 'POST',
						url: 'http://app.yx.jnwater.com.cn/ShouFeiZJJ/api/UsersApi/SendCheckCode?PhoneNum=' + this.reqForm.tel +
							'&Type=',
						success: (res) => {
							if (res.data.State) {
								uni.showToast({
									title: '验证码已发送，请注意查收',
									icon: 'none'
								})
								this.CheckCode = res.data.CheckCode
							}
						}
					})
					this.timer()
				} else {
					uni.showToast({
						title: '请稍后重试',
						icon: 'none',
					})
					return
				}
			},
			timer() {
				var timer = null;
				var count = 60;
				var that = this
				timer = setInterval(function() {
					count--;
					that.txt = count + '秒后重发'
					if (count <= 0) {
						clearInterval(timer);
						that.txt = "获取验证码"
					}
				}, 1000);
			},
			// 跳转编辑页面
			editInfo() {
				uni.navigateTo({
					url: './editInfo/index'
				})
			},
			// 手机号登录
			login(val) {
				if (!this.checked) {
					uni.showToast({
						title: '请勾选服务协议与隐私政策',
						icon: 'none'
					})
					return
				}
				// 测试账号968133
				if (this.reqForm.tel == '968133' && this.reqForm.code == '968133') {
					this.$u.post('api/app/regyx', {
						mobile: this.reqForm.tel
					}).then(res => {
						// 将登录状态存储到本地
						uni.setStorage({
							key: 'isLogin',
							data: res.data.userinfo,
							success: () => {
								var that = this
								setTimeout(function() {
									that.isLogin = true
									// uni.hideLoading()
									that.reqForm.tel = '',
										that.reqForm.code = '',
										that.txt = '获取验证码'
									that.userInfo.nickname = that.geTel(res.data.userinfo.mobile)
									that.userInfo.userSrc = res.data.userinfo.avatarUrl
								}, 800)
							}
						})
					})
					return
				}
				if (!this.reqForm.tel) {
					uni.showToast({
						title: "请输入手机号",
						icon: 'none',
						position: 'bottom'
					})
					return
				} else if (!this.reqForm.code) {
					uni.showToast({
						title: "请输入验证码",
						icon: 'none',
						position: 'bottom'
					})
					return
				} else if (!(/^1[34578]\d{9}$/.test(val))) {
					uni.showToast({
						title: '手机号码有误，请重新输入',
						icon: 'none',
						position: 'bottom'
					})
					return false
				} else {
					uni.showLoading({
						title: '登录中···'
					})
					// 发请求
					if (this.CheckCode === this.reqForm.code) {
						this.$u.post('api/app/regyx', {
							mobile: this.reqForm.tel
						}).then(res => {
							
							// 将登录状态存储到本地
							uni.setStorage({
								key: 'isLogin',
								data: res.data.userinfo,
								success: () => {
									var that = this
									setTimeout(function() {
										uni.showToast({
											title: '登录成功'
										})
										that.isLogin = true
										// uni.hideLoading()
										that.reqForm.tel = '',
										that.reqForm.code = '',
										that.txt = '获取验证码'
										that.userInfo.nickname = that.geTel(res.data.userinfo.mobile)
										that.userInfo.userSrc = res.data.userinfo.avatarUrl
									}, 800)
								}
							})
							if (res.data.userinfo.group_id && res.data.userinfo.group_id >= 3) {
								this.isSuper = true
							}
						})
					} else {
						uni.showToast({
							title: '验证码错误',
							icon: 'none'
						})
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #FFFFFF;
	}

	.noLogin {
		position: absolute;
		width: 100%;

		image {
			display: block;
			width: 50%;
			height: 100rpx;
			margin: 100rpx auto;
		}

		button {
			width: 90%;
			margin-top: 50rpx;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 36rpx;
			background-color: $mytheme-color;
		}
		.appleBtn {
			background-color: #FFFFFF;
			color: #000;
			border: 1px solid #000;
			.u-icon {
				margin-right: 20rpx;
			}
		}
		.uni-input-placeholder {
			overflow: visible;
		}

		.uni-form-item {
			position: relative;
			width: 90%;
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 1px solid #CCCCCC;
			margin: 0 auto;

			input {
				height: 100%;
				font-size: 32rpx;
				line-height: 30rpx;
			}

			text {
				position: absolute;
				right: 0;
				top: 0;
				font-size: 32rpx;
				color: #03a9f4;
			}
		}

		.other {
			width: 100%;
			text-align: center;
			margin-bottom: 50rpx;
			.line {
				position: relative;
				width: 90%;
				height: 100rpx;
				border-bottom: 1px solid #EEEEEE;
				margin: 0 auto;

				text {
					display: block;
					width: 35%;
					position: absolute;
					bottom: -20rpx;
					left: 50%;
					transform: translate(-50%);
					background-color: #FFFFFF;
					color: #999999;
				}
			}

			.wx-login {
				display: flex;
				justify-content: center;
				align-items: center;

				text {
					font-size: 32rpx;
				}
			}

			image {
				width: 100rpx;
				height: 100rpx;
				margin-bottom: 20rpx;
			}
		}
	}

	.login {
		width: 100%;

		.users {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: $mytheme-color;
			padding: 20rpx 50rpx;
			box-sizing: border-box;

			.Usernick {
				display: flex;
				align-items: center;
			}

			image {
				width: 120rpx;
				height: 120rpx;
				vertical-align: middle;
				border-radius: 10rpx;
			}

			text {
				margin-left: 40rpx;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}

		.myItem {
			width: 100%;

			.my-water,
			.changeNum {
				position: relative;
				width: 100%;
				// height: 100rpx;
				line-height: 100rpx;

				text {
					display: inline-block;
					vertical-align: middle;
					font-size: 32rpx;
				}

				.uni-icons {
					vertical-align: middle;
					margin-right: 20rpx;
				}

				.forward {
					position: absolute;
					right: 0;
				}

				.items {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 40rpx;
				}

				.water-item {
					// width: 33%;
					text-align: center;
					// padding: 0 40rpx; 
					// border-bottom: 1px solid #EEEEEE;
				}

				.water-title {
					// border-bottom: 1px solid #EEEEEE;
					padding: 0 40rpx;
					font-size: 32rpx;
					// font-weight: 700;
				}

			}

			.my-like {
				width: 100%;

				.like-item {
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					border-bottom: 1rpx solid #EEEEEE;
					padding: 0 40rpx;

					text {
						font-size: 32rpx;
						vertical-align: middle;
					}

					.uni-icons {
						vertical-align: middle;
						margin-right: 20rpx;
					}

					.forward {
						position: absolute;
						right: 0;
					}
				}
			}
		}

	}
</style>
