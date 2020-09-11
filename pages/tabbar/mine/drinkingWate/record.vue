<template>
	<view class="container">
		<view class="card" v-for="(item, index) in recodeList" :key="index">
			<view class="card-bottom">
				<text>缴费日期: {{ item.timePay }}</text>
			</view>
			<view class="card-top">
				<view class="card-left">
					<view>充值水量：<text style="color: #0081FF;">{{ item.amount }}</text>（升）</view>
					<!-- <view>充值金额：0m</view> -->
					<view>充值账号：<text style="color: #999999;">{{ item.accountThird || '暂无' }}</text></view>
				</view>
				<view class="card-right">
					<view>充值金额</view>
					<view><text style="color: #18B566;">￥{{ item.money }}</text></view>
				</view>
			</view>
		</view>
		<view class="empty" v-if="isEmpty">
			<u-empty text="未查询到充值记录" mode="order" font-size="32"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return { 
				recodeList: [],
				code: "",
				isEmpty: false
			};
		},
		onshow() {
			
		},
		onLoad(option) {
			this.code = option.code
			this.getRecord(option.code)
		},
		methods: {
			// 获取充值记录
			async getRecord (code) {
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/payRecordQuery', {
					token: info.token,
					code: code
				}).then(res => {
					if (res.data.records.length == 0) {
						this.isEmpty = true
						return
					}
					this.recodeList = res.data.records
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		padding-top: 0 40rpx;
	}
	.card {
		width: 91%;
		box-shadow: 0 0 5px 2px #EEEEEE;
		box-sizing: border-box;
		border-radius: 10rpx;
		margin: 0 auto;
		margin-bottom: 40rpx;
		.card-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 50rpx;
			padding: 0 40rpx;
			padding-bottom: 30rpx;
			margin-top: 40rpx;
			.card-left, .card-right{
				width: 70%;
				text-align: left;
				font-size: 32rpx;
			}
			.card-right {
				width: 30%;
				text-align: center;
				font-weight: 700; 
			}
		}
		.card-bottom {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			border-top: 1px solid #EEEEEE;
			margin-top: 40rpx;
			font-size: 32rpx;
			background-color: $mytheme-color;
			padding: 0 40rpx;
			color: #FFFFFF;
			border-radius: 10rpx 10rpx 0 0;
		}
	}
	.empty {
		width: 100%;
		margin-top: 200rpx;	
	}
</style>
