<template>
	<view class="container" v-if="finsh">
		<view class="recharge-card">
			<view class="card-detail">
				<image src="../../static/img/img/wx_thumb.png" mode=""></image>
				<view class="GSnum">
					<text>{{ code }}</text>
					<!-- <u-icon name="arrow-down-fill"></u-icon> -->
					<view>{{ address }}</view>
				</view>
			</view>
			<view class="card-body">
				<view class="">
					<text>用水价格：</text><text>{{ unitPrice }} 元/升</text>
				</view>
				<view class="">
					<text>当前余量：</text><text>{{ marginAmount }} 升</text>
				</view>
				<view class="">
					<text>总用水量：</text><text>{{ cumulantAmount }} 升</text>
				</view>
			</view>
		</view>
		<view class="choice-content">
			<view class="choice">
				<text>请选择购水量</text>
			</view>
			<view class="choice-item" v-for="(item, index) in choiceList" :key="index" @click="handlerClick(index)" :class="current == index ? 'active' : ''">
				<text>{{ item.buyNum }}升</text><text>{{ item.buyNum*unitPrice }}.00元</text>
			</view>
		</view>
		<view class="input-content">
			<view class="inp">
				<text>输入购水量</text>
				<view class="number-box">
					<text @click="reduce">-</text>
					<input v-model="consumption" @focus="inpfocu" @blur="inpchange" type="number" value="" />
					<text @click="plus">+</text>
				</view>
				<text style="margin-left: 20rpx;">升</text>
			</view>
			<view class="price">
				<text>充值金额</text>
				<input type="number" v-model="amount" value="" />
				<text style="margin-right: 0;">元</text>
			</view>
			<button type="default" @click="show = true">立即充值</button>
		</view>
		<u-popup v-model="show" mode="bottom" height="40%" :safe-area-inset-bottom="true">
			<view class="paytitle">
				<text>选择支付方式</text>
			</view>
			<view class="paybody">
				<view class="wxpay" @click="wxPay">
					<image src="../../static/img/img/weixinzhifu.png" mode=""></image>
					<view class="">
						<text style="display: block; font-weight: 700; font-size: 36rpx;">微信支付</text>
						<text style="font-size: 24rpx; color: #999999;">微信安全支付</text>
					</view>
					<view class="rightIcon">
						<u-icon name="arrow-right" color="#cccccc" size="36"></u-icon>
					</view>
				</view>
				<view class="alipay" @click="aliPay">
					<image src="../../static/img/img/zhifubao.png" mode=""></image>
					<view class="">
						<text style="display: block; font-weight: 700; font-size: 36rpx;">支付宝支付</text>
						<text style="font-size: 24rpx; color: #999999;">支付宝安全支付</text>
					</view>
					<view class="rightIcon">
						<u-icon name="arrow-right" color="#cccccc" size="36"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				choiceList: [{
						buyNum: 500,
						price: 150,
					},
					{
						buyNum: 1000,
						price: 300,
					},
					{
						buyNum: 2000,
						price: 600,
					},
					{
						buyNum: 3000,
						price: 900,
					},
					{
						buyNum: 5000,
						price: 1500,
					},
					{
						buyNum: 6000,
						price: 1800,
					}
				],
				consumption: 500,
				unitPrice: "",
				amount: 150,
				code: "",
				address: "",
				cumulantAmount: "",
				marginAmount: "",
				show: false,
				finsh: false
			};
		},
		onLoad(option) {
			this.getNumDetail(option.code)
		},
		methods: {
			// 微信支付
			wxPay() {
				const wx = plus.runtime.isApplicationExist({pname:'com.tencent.mm',action:'weixin://'})
				if (!wx) {
					uni.showToast({
						title: '检测到您未安装微信',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '检测支付环境...'
				})
				const info = uni.getStorageSync('isLogin')
				// 获取订单信息
				this.$u.post('/api/zys/payOrder?token=' + info.token, {
					code: this.code,
					amount: this.consumption,
					payType: 'wechat'
				}).then(res => {
					let that = this
					if (res.code == 1) {
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: JSON.stringify(res.data.sign), //微信、支付宝订单数据
							success: function(res) {
								if (res.channel) {
									that.show = false
									that.$refs.uToast.show({
										title: '支付成功',
										type: 'success'
									})
								}
							},
							fail: function(err) {
								if (err) {
									that.show = false
									that.$refs.uToast.show({
										title: '支付失败',
										type: 'warning'
									})
								}
							}
						});
					} else {
						uni.showModal({
						    title: '提示',
						    content: res.msg,
						    success: function (res) {
						        if (res.confirm) {
						            that.show = false
						        } else if (res.cancel) {
						            that.show = false
						        }
						    }
						});
					}
					
				})
				
			},
			// 支付宝支付
			aliPay() {
				const ali = plus.runtime.isApplicationExist({pname:'com.eg.android.AlipayGphone',action:'alipay://'})
				if (!ali) {
					uni.showToast({
						title: '检测到您未安装支付宝',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '检测支付环境...'
				})
				const info = uni.getStorageSync('isLogin')
				this.$u.post('/api/zys/payOrder?token=' + info.token, {
					code: this.code,
					amount: this.consumption,
					payType: 'alipay'
				}).then(res => {
					let that = this
					if(res.code == 1) {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: res.data.sign, //微信、支付宝订单数据
							success: function(res) {
								// console.log(res);
								if (res.channel) {
									that.show = false
									that.$refs.uToast.show({
										title: '支付成功',
										type: 'success'
									})
								}
							},
							fail: function(err) {
								if (err) {
									that.show = false
									that.$refs.uToast.show({
										title: '支付失败',
										type: 'warning'
									})
								}
							}
						});
					} else {
						uni.showModal({
						    title: '提示',
						    content: res.msg,
						    success: function (res) {
						        if (res.confirm) {
						            that.show = false
						        } else if (res.cancel) {
						            that.show = false
						        }
						    }
						});
					}
					
				})
			},
			// 获取水号详情
			async getNumDetail(code) {
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/getCodeInfo', {
					token: info.token,
					code: code,
					type: 'detail'
				}).then(res => {
					if (res.code == 1) {
						this.finsh = true
						this.unitPrice = res.data.price
						this.code = res.data.code
						this.address = res.data.address
						this.marginAmount = res.data.marginAmount
						this.cumulantAmount = res.data.cumulantAmount
					} else {
						this.$refs.uToast.show({
							title: '获取数据失败',
							type: 'error',
						})
					}
					
				})
			},
			plus() {
				this.current = null
				this.consumption += 500
				this.amount = this.consumption * this.unitPrice
			},
			reduce() {
				this.current = null
				if (this.consumption <= 500) {
					uni.showToast({
						title: '最低购水量为500升',
						icon: 'none'
					})
					return
				}
				this.consumption -= 500
				this.amount = this.consumption * this.unitPrice
			},
			handlerClick(index) {
				this.current = index
				this.consumption = this.choiceList[index].buyNum
				this.amount = this.choiceList[index].buyNum * this.unitPrice
			},
			inpfocu() {
				this.current = null
			},
			inpchange(e) {
				if (e.detail.value % 500 !== 0) {
					this.consumption = 500
					this.current = 0
					uni.showToast({
						title: '必须为500的倍数',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 0 30rpx;
		padding-bottom: 50rpx;
	}
	.paytitle {
		width: 100%;
		text-align: center;
		padding: 20rpx 0;
		font-size: 32rpx;
		border-bottom: 1px solid #EEEEEE;
	}
	.paybody {
		width: 100%;
		height: 100%;
		.wxpay,
		.alipay {
			position: relative;
			width: 100%;
			height: 150rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			// font-size: 36rpx;
			padding: 20rpx 40rpx;
			// margin-bottom: 50rpx;
			border-bottom: 1px solid #EEEEEE;
			image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}
			.rightIcon {
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translate(0, -50%);
			}
		}
	}

	.recharge-card {
		width: 100%;
		background-color: $mytheme-color;
		margin: 0 auto;
		padding: 50rpx 30rpx;
		margin-top: 30rpx;
		border-radius: 15rpx;

		.card-detail {
			display: flex;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.GSnum {
				// margin-top: 8rpx;
				color: #FFFFFF;

				text {
					font-size: 36rpx;
					margin-right: 20rpx;
					vertical-align: middle;
				}
			}
		}

		.card-body {
			padding: 20rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 50rpx;
			margin-top: 20rpx;
		}
	}

	.choice-content {
		.choice {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 36rpx;
		}

		.choice-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 100rpx;
			background-color: #f4f4f4;
			border: 1px solid #CCCCCC;
			padding-left: 60rpx;
			padding-right: 150rpx;
			font-size: 36rpx;
			color: $mytheme-color;
			margin-bottom: 20rpx;
		}

		.active {
			position: relative;
			background-color: $mytheme-color;
			color: #FFFFFF;

			&::after {
				content: '';
				position: absolute;
				right: 50rpx;
				top: 50%;
				width: 20rpx;
				height: 40rpx;
				transform: translate(0, -75%) rotate(45deg);
				border-right: 10rpx solid #FFFFFF;
				border-bottom: 10rpx solid #FFFFFF;
			}
		}
	}

	.input-content {
		width: 100%;
		padding-left: 20rpx;

		.inp {
			display: flex;
			margin-top: 50rpx;

			.number-box {
				display: flex;
				justify-content: center;
				align-items: center;

				text {
					display: inline-block;
					width: 70rpx;
					height: 70rpx;
					line-height: 60rpx;
					padding: 0;
					border-radius: 5rpx;
					font-size: 50rpx;
					vertical-align: middle;
					margin: 0;
					text-align: center;
					background-color: #00919f;
					color: #FFFFFF;
				}

				input {
					display: inline-block;
					width: 150rpx;
					height: 70rpx;
					border: 1px solid #CCCCCC;
					vertical-align: middle;
					margin: 0 10rpx;
					text-align: center;
				}
			}

			text {
				font-size: 36rpx;
				vertical-align: middle;
				margin-right: 50rpx;
				line-height: 70rpx;
			}
		}

		.price {
			display: flex;
			font-size: 36rpx;
			margin-top: 40rpx;

			text {
				line-height: 70rpx;
				margin-right: 80rpx;
			}

			input {
				display: block;
				width: 320rpx;
				height: 70rpx;
				border: 1px solid #CCCCCC;
				margin-right: 20rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
			}
		}

		button {
			width: 300rpx;
			margin-top: 50rpx;
			background-color: #00919f;
			color: #FFFFFF;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 32rpx;
		}
	}
</style>
