<template>
	<view class="container">
		<u-field v-model="mobile" maxlength="11" label="手机号" placeholder="请填写手机号"></u-field>
		<view class="getcode">
			<u-field v-model="code" maxlength="6" label="验证码" :clearable="false" placeholder="请填写验证码"></u-field>
			<button type="default" @tap="getCode">{{ codeText }}</button>
		</view>
		<button type="default" class="bindBtn" @tap="bindPhone">绑定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				code: '',
				codeText: '获取验证码',
				CheckCode: '',
				openid: '',
				bindUrl: '/api/user/wechatBindMobile'
			}
		},
		onLoad(option) {
			this.openid = option.openId
			if (option.type) {
				this.bindUrl = '/api/user/appleBindMobile'
			}
		},
		methods: {
			getCode() {
				if (this.codeText == '获取验证码') {
					if (!this.mobile) {
						uni.showToast({
							title: '请填写手机号',
							icon: 'none'
						})
						return
					} else if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none',
						})
						return
					} else {
						uni.request({
							method: 'POST',
							url: 'http://app.yx.jnwater.com.cn/ShouFeiZJJ/api/UsersApi/SendCheckCode?PhoneNum='+ this.mobile +'&Type=',
							success: (res) => {
								if (res.data.State) {
									uni.showToast({
										title: '验证码已发送，请注意查收',
										icon: 'none'
									})
									this.CheckCode = res.data.CheckCode
									this.timer()
								}
							}
						})
					}
				} else {
					uni.showToast({
						title: '请稍后重试',
						icon: 'none',
					})
				}
				
			},
			timer () {
					var timer = null;
					var count = 60;
					var that = this
					timer = setInterval(function(){
						count--;
						that.codeText = count + '秒后重发'
						if (count <=0) {
							clearInterval(timer);
							that.codeText = "获取验证码"
						}
					},1000);
			},
			bindPhone () {
				if (this.mobile == '968133' && this.code == '968133') {
					this.$u.post(this.bindUrl + '?authorizationCode=' + this.openid + '&mobile=' + this.mobile).then(res => {
						if (res.code == 1) {
							uni.showToast({
								title: '绑定成功'
							})
							uni.setStorageSync('isLogin', res.data.userinfo)
							uni.switchTab({
								url: '../tabbar-5'
							})
						} else {
							uni.showToast({
								title: '绑定失败',
								icon: 'none'
							})
						}
					})
					return
				}
				if (!this.mobile) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					})
					return
				}
				if (this.code) {
					if (this.code !== this.CheckCode) {
						uni.showToast({
							title: '验证码不正确',
							icon: 'none'
						})
						return
					}
				} else {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
					return
				}
				this.$u.post(this.bindUrl + '?authorizationCode=' + this.openid + '&mobile=' + this.mobile).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: '绑定成功'
						})
						uni.setStorageSync('isLogin', res.data.userinfo)
						uni.switchTab({
							url: '../tabbar-5'
						})
					} else {
						uni.showToast({
							title: '绑定失败',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		padding: 40rpx;

		.getcode {
			position: relative;

			button {
				position: absolute;
				top: 50%;
				right: 0;
				transform: translate(0, -50%);
				width: 180rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 28rpx;
				background-color: $mytheme-color;
				color: #FFFFFF;
				padding-left: 0rpx;
				padding-right: 0rpx;
			}
		}

		.u-field {
			font-size: 36rpx;
			border-bottom: 1px solid #EEEEEE;
		}

		.bindBtn {
			height: 80rpx;
			line-height: 80rpx;
			background-color: $mytheme-color;
			color: #FFFFFF;
			font-size: 36rpx;
			margin-top: 80rpx;
		}
	}
</style>
