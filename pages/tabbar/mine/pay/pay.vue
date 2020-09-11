<template>
	<view class="container" v-show="isSuccess">
		<view class="pay-card" v-if="payInfo.QFJE === 0">
			<view class="card-title" style="">
				<text>给水号: {{ payInfo.gsh }}</text>
				<text>{{ payInfo.R1 }}月</text>
			</view>
			<view class="card-content">
				<view style="display: flex; justify-content:center; color: #18B566; font-size: 36rpx; text-align: center; font-size: 70rpx; font-weight: 700; padding: 40rpx 0;">
					<view class="" style="line-height: 100rpx;">￥{{ payInfo.QFJE }}</view>
					<!-- <input type="text" :value="payInfo.QFJE" style="border-bottom: 1px solid #eee; font-size: 70rpx; width: 200rpx; border-radius: 10rpx;" /> -->
				</view>
				<view style="color: #18B566; font-size: 36rpx; text-align: center; margin-bottom: 20rpx;">
					暂未查询到欠费
				</view>
				<view>
					<text>当前余额</text>{{ payInfo.YuE }} 元
				</view>
				<view>
					<text>违约金</text>{{ payInfo.WYJ }} 元
				</view>
				<view>
					<text>户主姓名</text>{{ payInfo.HM }}
				</view>
				<view>
					<text>人口基数</text>{{ payInfo.SLJS }}
				</view>
				<view class="">
					<text>用水地址</text>{{ payInfo.MP }}
				</view>
			</view>
		</view>
		<view class="pay-card" v-if="payInfo.QFJE > 0">
			<view class="card-title">
				<text>给水号: {{ payInfo.gsh }}</text>
				<text>{{ payInfo.R1 }}月</text>
			</view>
			<view class="card-content">
				<view style="color: #f00; font-size: 65rpx; font-weight: 700; padding: 40rpx 0; text-align: center;">
					<!-- {{ payInfo.QFJE }} -->
					<span>￥</span>
					<u-count-to ref="uCountTo" font-size="65" bold color="#f00" :end-val="payInfo.QFJE" :autoplay="true" :decimals="2"></u-count-to>
				</view>
				
				<view style="color: #f00; font-size: 36rpx; text-align: center; margin-bottom: 20rpx;">
					当前应交水费
				</view>
				<view>
					<text>当前余额</text>{{ payInfo.YuE }} 元
				</view>
				<view>
					<text>违约金</text>{{ payInfo.WYJ }} 元
				</view>
				<view>
					<text>户主姓名</text>{{ payInfo.HM }}
				</view>
				<view>
					<text>人口基数</text>{{ payInfo.SLJS }}
				</view>
				<view class="">
					<text>用水地址</text>{{ payInfo.MP }}
				</view>
			</view>
		</view>
		<button type="default" ripple-bg-color="#909399" :ripple="true" @click="launchMiniProgram" v-if="payInfo.QFJE !== 0">
			<view class="" v-if="isupdateWX">
				<image src="../../../../static/img/img/weixinzhifu.png" mode=""></image>
				<text>去微信交费</text>
			</view>
			<view class="" v-else>
				<text>检测到您未安装微信</text>
			</view>
		</button>
		<a :href="urlZFB" class="alipay">
			<view class="" v-if="isupdateAli">
				<image src="../../../../static/img/img/tubiao-.png" mode=""></image>
				<text>去支付宝{{ payInfo.QFJE == 0 ? '预存' : '交费' }}</text>
			</view>
			<view class="" v-else>
				<text>检测到您未安装支付宝</text>
			</view>
		</a>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				show1: false,
				payInfo: [],
				GS: '',
				urlZFB: '',
				sweixin: '',
				isSuccess: false,
				isupdateWX: true,
				isupdateAli: true
			};
		},
		onLoad(option) {
			this.GS = option.GS
			this.getQFnum(option.GS)
			
			// #ifdef APP-PLUS
			const wx = plus.runtime.isApplicationExist({pname:'com.tencent.mm',action:'weixin://'})
			const ali = plus.runtime.isApplicationExist({pname:'com.eg.android.AlipayGphone',action:'alipay://'})
			if(!wx) {
				this.isupdateWX = false
			} 
			if (!ali) {
				this.isupdateAli = false
				this.urlZFB = 'javascript:;'
			} else {
				this.urlZFB =
					`alipays://platformapi/startapp?appId=20000193&url=/www/eBill.htm?instId=JNSWJT4558%26subBizType=WATER%26billKey=${this.GS}`
			}
			// #endif
		},
		methods: {
			// 获取欠费水号
			getQFnum(GS) {
				const token = uni.getStorageSync('isLogin').token
				this.$u.get('/api/gs/detail?token=' + token, {
					gsh: GS
				}).then(res => {
					if (res.code == 1) {
						res.data.R1 = res.data.R1.replace('-', '年')
						this.payInfo = res.data
						this.isSuccess = true
					}else {
						uni.showModal({
							title: '温馨提示',
							content: res.msg,
							confirmText: '去绑定',
							success: function (res) {
							        if (res.confirm) {
							            uni.navigateTo({
							            	url: '../payment/payment'
							            })
							        } else if (res.cancel) {
							            uni.navigateBack({
							            	delta: 1
							            })
							        }
							    }
						})
					}
					
				})
			},
			launchMiniProgram() {
				if (!this.isupdateWX) {
					return
				}
				uni.navigateTo({
					url: './wxpay?GSH=' + this.GS
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		padding: 40rpx;

		.pay-card {
			width: 100%;
			box-shadow: 0 0 5px 2px #EEEEEE;
			// padding: 40rpx;
			margin-bottom: 40rpx;
			border-radius: 20rpx;
			margin-bottom: 100rpx;
			.card-title {
				display: flex;
				justify-content: space-between;
				font-size: 32rpx;
				padding: 30rpx;
				background-color: $mytheme-color;
				border-radius: 10rpx 10rpx 0 0;
				color: #FFFFFF;
			}

			.card-content {
				width: 100%;
				padding: 20rpx 30rpx;
				line-height: 50rpx;
				font-size: 30rpx;

				text {
					position: relative;
					display: inline-block;
					width: 120rpx;
					text-align-last: justify;
					text-align: justify;
					text-justify: distribute-all-lines;
					margin-right: 30rpx;

					&:after {
						position: absolute;
						content: ':';
					}
				}
			}

			.other {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 30rpx;
				background-color: #EEEEEE;
				border-radius: 0 0 10rpx 10rpx;

				text {
					color: #333333;
				}
			}
		}

		button {
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			background-color: #19be6b;
			color: #FFFFFF;
			margin-top: 100rpx;
			image {
				width: 60rpx;
				height: 60rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}
			text {
				vertical-align: middle;
			}
		}

		.yue {
			display: flex;
			justify-content: space-between;
		}

		.pop-title {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 32rpx;
		}

		.pay-method {
			display: flex;
			// flex-direction: column;
			justify-content: space-around;
			align-items: center;
			margin-top: 30rpx;

			text {
				display: inline-block;
				height: 100rpx;
				line-height: 100rpx;
				vertical-align: middle;
				font-size: 32rpx;
			}

			image {
				width: 60rpx;
				height: 60rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}
		}

		.alipay {
			text-decoration: none;
			display: block;
			width: 100%;
			height: 100rpx;
			background-color: #00bbee;
			text-align: center;
			line-height: 100rpx;
			color: #FFFFFF;
			margin-top: 40rpx;
			border-radius: 10rpx;
			font-size: 32rpx;
			image {
				width: 50rpx;
				height: 50rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}
			text {
				vertical-align: middle;
			}
		}
	}
</style>
