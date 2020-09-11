<template>
	<view class="container">
		<view class="pay-card" v-for="(item, index) in GSList" :key="index">
			<view class="card-title">
				<text>给水号: {{ item.gsh }}</text>
				
			</view>
			<view class="card-content">
				<text>户主姓名：{{ item.HM }}</text>
				<!-- <view class="">
					预留电话：{{ item.mobile }}
				</view> -->
				<view class="">
					水表信息：{{ item.MI }}
				</view>
				<view class="">
					抄表编码：{{ item.BM }}
				</view>
				<view class="">
					客户代表：{{ item.KeHuDaiBiao }}
				</view>
				<view class="">
					<text>应交水费：{{ item.QFJE }} 元</text>
				</view>
				<!-- <view class="">
					用水地址：{{ item.MP }}
				</view> -->
			</view>
			<view class="other">
				<text @click="waterPay(item.gsh, item.QFJE)">水费缴纳</text>
				<text @click="checkWater(item.gsh)">水费查询</text>
				<text @click="monitor(item.gsh)">远传监测</text>
				<text @click="Unbundling(item.gsh)">解绑水号</text>
			</view>
			
		</view>
		<view class="no-shuihao" v-if="noContent">
			<u-empty text="您还没有绑定水号" mode="news"></u-empty>
		</view>
		<button type="default" ripple-bg-color="#909399" :ripple="true" @click="pageto">绑定给水号</button>
		<u-modal v-model="show" content="请确认是否解除绑定?" show-cancel-button @confirm="confirmUnbind()"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				GSList: [],
				noContent: false,
				show: false,
				gsh: '',
			};
		},
		onLoad() {
			this.getMywaterNum()
		},
		methods: {
			// 获取我的水号
			async getMywaterNum () {
				const token = uni.getStorageSync('isLogin').token
				await this.$u.get('/api/gs/myList', { token }).then(res => {
					// console.log(res)
					if (!res.result.length) {
						this.noContent = true
						uni.showToast({
							title: '您还没有绑定水号',
							icon: 'none'
						})
					} else {
						this.GSList = res.result
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 解除绑定
			Unbundling (GS) {
				this.show = true
				this.gsh = GS
			},
			// 确定解除
			confirmUnbind() {
				const token = uni.getStorageSync('isLogin').token
				this.$u.get('/api/gs/remove', {
					token: token,
					gsh: this.gsh
				}).then(res => {
					if(res.code === 1) {
						this.getMywaterNum()
						uni.showToast({
							title: '解绑成功'
						})
						
					}
				})
			},
			pageto () {
				uni.navigateTo({
					url: '../shuihao/index'
				})
			},
			checkWater (GS) {
				uni.navigateTo({
					url: '../inquiry/inquiry?GS=' + GS
				})
			},
			waterPay (GS, JE) {
				// if (JE <= 0) {
				// 	uni.showModal({
				// 		title: '温馨提示',
				// 		content: '您当前未欠费',
				// 		showCancel: false,
				// 		success: function (res) {
				// 		    if (res.confirm) {
				// 		        // uni.navigateTo({
				// 		        // 	url: '../pay/pay?GS=' + GS
				// 		        // })
				// 				console.log('用户点击确定');
				// 		    } else if (res.cancel) {
				// 		        console.log('用户点击取消');
				// 		    }
				// 		}
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url: '../pay/pay?GS=' + GS
				})
			},
			// 远传监测
			monitor(gsh) {
				uni.navigateTo({
					url: '../monitor/monitor?gsh=' + gsh
				})
			}
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
		border-radius: 20rpx;
		margin-bottom: 40rpx;
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
			// text {
			// 	letter-spacing: 8rpx;
			// }
		}
		.other {
			display: flex;
			justify-content: space-between;
			// margin-top: 75rpx;
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
		font-size: 36rpx;
		background-color: $mytheme-color;
		color: #FFFFFF;
		margin-top: 100rpx;
	}
}

</style>
