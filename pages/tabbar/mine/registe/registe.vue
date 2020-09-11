<template>
	<view class="container">
		<view class="logo">
			<image src="../../../../static/img/img/zc_logo.png" mode=""></image>
		</view>
		<view class="reglist">
			<view class="item">
				<text>手机号：</text>
				<input v-model="form.phone" type="text" value="" placeholder="请输入手机号" @blur="checkPhone()"/>
			</view>
			<view class="item">
				<text>密码：</text>
				<input v-model="form.pass" type="password" value="" placeholder="请输入密码" @blur="checkPass()"/>
			</view>
			<view class="item">
				<text>确认密码：</text>
				<input v-model="form.repass" type="password" value="" placeholder="请确认密码" @blur="checkRepass()" />
			</view>
			<view class="item" style="border: 0;">
				<text>验证码：</text>
				<input v-model="form.checkCode" type="text" maxlength="6" value="" placeholder="请输入验证码" style="width: 280rpx;"/>
				<span @click="getCheckCode()" :style="isCode ? 'background-color: #00919f' : 'background-color: #ccc'">获取验证码</span>
			</view>
		</view>
		<view class="reg-btn">
			<u-button type="primary" @click="register()">注册</u-button>
		</view>
		<u-modal v-model="show" :content="content" confirm-text="去登陆" cancel-text="稍后再去" show-cancel-button confirm-color="#00919f" @confirm="goLogin()"></u-modal>
	</view>
</template>

<script>
export default {
	data () {
		return {
			form: {
				phone: '',
				pass: '',
				repass: '',
				checkCode: ''
			},
			isCode: false,
			show: false,
			content: ''
		}
	},
	methods: {
		// 密码验证
		checkPass() {
			if (!this.form.pass) {
				uni.showToast({
					title: '密码不能为空！',
					icon: 'none'
				})
				return
			} else if (this.form.pass.length < 6) {
				uni.showToast({
					title: '密码不能少于6位！',
					icon: 'none'
				})
			}
		},
		checkRepass () {
			if (!this.form.repass) {
				uni.showToast({
					title: '密码不能为空！',
					icon: 'none'
				})
				return
			} else if (this.form.repass !== this.form.pass) {
				uni.showToast({
					title: '两次输入的密码不一致！',
					icon: 'none'
				})
			} 
		},
		// 手机号验证
		checkPhone () {
			if (this.form.phone && (/^1[34578]\d{9}$/.test(this.form.phone))) {
				this.isCode = true
			} else {
				uni.showToast({
					title: '请输入正确的手机号！',
					icon: 'none',
					position: 'bottom'
				})
			}
		},
		// 获取验证码
		getCheckCode () {
			if (this.isCode == true) {
				uni.request({
					method: 'POST',
					url: 'http://app.yx.jnwater.com.cn/ShouFeiZJJ/api/UsersApi/SendCheckCode?PhoneNum=' + this.form.phone + '&Type=',
					success: (res) => {
						console.log(res)
						if (res.checkCode) {
							uni.showToast({
								title: '验证码已发送'
							})
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			} else {
				uni.showToast({
					title: '请输入正确的手机号！',
					icon: 'none',
					position: 'bottom'
				})
			}
		},
		// 注册
		register () {
			if (!this.form.phone) {
				uni.showToast({
					title: '请填写手机号',
					icon: 'none'
				})
			} else if (!this.form.pass) {
				uni.showToast({
					title: '请填写密码',
					icon: 'none'
				})
			} else if (!this.form.repass) {
				uni.showToast({
					title: '请确认密码',
					icon: 'none'
				})
			} else if (!this.form.checkCode) {
				uni.showToast({
					title: '请填写验证码',
					icon: 'none'
				})
			} else {
				const obj = { PhoneNum: this.form.phone, Contacts: '', UserName: '', Password: this.form.pass, MP: '' }
				uni.request({
					method: 'POST',
					url: 'http://app.yx.jnwater.com.cn/ShouFeiZJJ/api/UsersApi/ModifyBindUsersItem?CheckCode=' + this.form.checkCode + '&Replace=false&ReturnEntity=true',
					data: JSON.stringify(obj),
					success: (res) => {
						
						if (res.data.State) {
							this.show = true
							this.content = res.data.MessageText
							this.$u.post('/api/app/regyx', res.data).then(res => {
								console.log(res)
							})
						} else {
							uni.showToast({
								title: res.data.MessageText,
								icon: 'none'
							})
						}
					}
				})
			}
		},
		// 注册成功去登陆
		goLogin() {
			uni.switchTab({
				url: '../tabbar-5'
			})
		}
		
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	padding-top: 50rpx;
	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 40rpx 0;
		image {
			width: 50%;
			height: 100rpx;
		}
	}
	.reglist {
		width: 90%;
		border: 1px solid #eee;
		margin: 0 auto;
		border-radius: 10rpx;
		margin-top: 30rpx;
		.item {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 36rpx;
			border-bottom: 1px solid #EEEEEE;
			// padding: 0 20rpx;
			// box-sizing: border-box;
			text {
				width: 200rpx;
				color: #606266;
				text-align: right;
			}
			input {
				height: 100rpx;
				line-height: 100rpx;
				padding-left: 20rpx;
				font-size: 32rpx;
			}
			span {
				display: block;
				height: 70rpx;
				line-height: 70rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				// background-color: #00919f;
				text-align: center;
				border-radius: 10rpx;
				padding: 0 15rpx;
			}
		}
	}
	.reg-btn {
		width: 90%;
		margin: 0 auto;
		margin-top: 80rpx;
		
		.u-btn {
			background-color: $mytheme-color !important;
			font-size: 36rpx;
		}
	}
}
</style>
