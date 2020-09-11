<template>
	<view class="container">
		<view class="card">
			<view class="card-bottom">
				<text>账期: 08/2020</text>
				<text>抄表日期：2020-08-15</text>
			</view>
			<view class="card-top">
				<view class="card-left">
					<view>单价：4.20</view>
					<view>水量：0m<sup>3</sup></view> 
					<view>止度：831</view>
				</view>
				<view class="card-right">
					<view>￥ 100</view>
					<view style="background-color: #EEEEEE; color: #000000;">未缴费</view>
				</view>
			</view>
		</view>
		<view class="card" v-for="(item, index) in recodeList" :key="index">
			<view class="card-bottom">
				<text>账期: {{ item.time }}</text>
				<text>抄表日期：{{ item.subTitle }}</text>
			</view>
			<view class="card-top">
				<view class="card-left">
					<view>单价：4.20</view>
					<view>水量：0m<sup>3</sup></view> 
					<view>止度：831</view>
				</view>
				<view class="card-right">
					<view>￥{{ item.price }}</view>
					<view style="background-color: #18B566;">已缴费</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return { 
				recodeList: [
					{
						time: '06/2020',
						subTitle: '2020-06-15',
						price: '99'
					},
					{
						time: '04/2020',
						subTitle: '2020-04-15',
						price: '199'
					},
					{
						time: '02/2020',
						subTitle: '2020-02-15',
						price: '299'
					},
					{
						time: '01/2020',
						subTitle: '2020-01-15',
						price: '399'
					},
				]
			};
		},
		onshow() {
			
		},
		onLoad() {
			
		},
		methods: {
			opendetail (index) {
				if (index == this.show) {
					this.show = null
				} else {
					this.show = index
				}
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
		height: 340rpx;
		box-shadow: 0 0 5px 2px #EEEEEE;
		// padding: 40rpx 0;
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
			margin-top: 40rpx;
			.card-left, .card-right{
				width: 50%;
				text-align: left;
				font-size: 32rpx;
			}
			.card-right {
				text-align: center;
				font-weight: 700; 
				view {
					font-size: 44rpx;
					line-height: 50rpx;
					&:last-child {
						font-size: 32rpx;
						font-weight: normal; 
						width: 180rpx;
						height: 60rpx;
						line-height: 60rpx;
						margin: 0 auto;
						margin-top: 30rpx;
						border-radius: 20rpx;
						color: #FFFFFF;
					}
				}
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
</style>
