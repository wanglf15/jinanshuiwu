<template>
	<view class="shuihao">
		<view class="bar">
			<u-navbar back-text="返回" :is-fixed="true" title="绑定水号" :title-size="40" :background="background" title-color="#fff" back-icon-color="#fff" :back-text-style="textColor"></u-navbar>
		</view>
		
		<view class="uni-form-item uni-column">
			<input class="uni-input" maxlength="11" v-model="reqForm.tel" placeholder="请输入要绑定到APP的水号" disabled/>
		</view>
		<view class="uni-form-item uni-column">
			<input class="uni-input" v-model="reqForm.GS" placeholder="请输入给水号" />
		</view>
		<!-- <view class="uni-form-item uni-column">
			<input class="uni-input" maxlength="10" placeholder="请输入验证码" />
			<text class="getCode" v-model="reqForm.code" @tap="getCode">{{ txt }}</text>
		</view> -->
		<view class="btn">
			<button type="default" @click="bindGS">绑定用水账号</button>
		</view>
		<view style="margin-bottom: 40rpx; font-size: 28rpx; margin-top: 40rpx;">
			<view class="" style="width: 100%; box-shadow: 0 0 5px 2px #EEEEEE; padding: 20rpx 40rpx; line-height: 50rpx; color: #999999; border-radius: 20rpx;">
				<view style="text-align: center; font-size: 32rpx; color: #333333;">温馨提示</view>
				<view class="">
					1. 任何单位或个人未经产权人许可，不得绑定他人水号，因此造成的损失与法律责任将由绑定者承担；</br> 
					2. 查询历史用水信息，需要验证用水人信息，请提供办理用水业务时预留手机才可以查询；</br>
					3. 修改业务预留手机请准备相关证明材料到"便民服务"页面或者就近的营业厅办理；</br>
					4. 如您对以上提示有疑问，请拨打小白热线0531-968133咨询。</br>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#00919f',
				},
				textColor: {
					color: '#fff'
				},
				reqForm: {
					tel: '',
					GS: ''
				},
			}
		},
		onLoad() {
			const mobile = uni.getStorageSync('isLogin').mobile
			this.reqForm.tel = mobile + '（APP账号）'
		},
		methods: {
			back () {
				uni.navigateBack({
					delta: 1
				})
			},
			bindGS () {
				if (!this.reqForm.GS) {
					uni.showToast({
					  title: '请输入给水号',
					  icon: 'none',
					  position: 'bottom'
					})
					return false
				} else {
					const token = uni.getStorageSync('isLogin').token
					const mobile = uni.getStorageSync('isLogin').mobile
					this.$u.post('/api/gs/add?token=' + token, {
						mobile: mobile,
						gsh: this.reqForm.GS
					}).then(res => {
						uni.showToast({
							title: res.msg
						})
						if (res.code === 1) {
							uni.navigateTo({
								url: '../payment/payment'
							})
						}
						
					})
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.shuihao {
		position: absolute;
		width: 100%;
		padding: 40rpx;
		box-sizing: border-box;
		// margin-top: 170rpx;
	}

	.uni-column {
		position: relative;
		
		input {
			display: inline-block;
			width: 100%;
			height: 100rpx;
			padding-left: 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			border-bottom: 1px solid #ccc;
			vertical-align: middle;
		}

		.getCode {
			position: absolute;
			top: 30%;
			right: 0;
			font-size: 28rpx;
			color: #03a9f4;
		}
	}
	.warn {
		width: 100%;
		margin-top: 30rpx;
		text {
			font-size: 32rpx;
		}
	}
	.btn {
		width: 100%;
		margin-top: 70rpx;
		button {
			height: 80rpx;
			line-height: 80rpx;
			background-color: $mytheme-color;
			color: #FFFFFF;
			font-size: 36rpx;
		}
	}
</style>
