<template>
	<view class="yingye">
		 <view class="container">
			 <view class="map">
			 	<image :src="url" mode=""></image>
				<view class="openMap" @click="openMap">
					<text>{{ title }}</text>
					<uni-icons type="location-filled" size="24"></uni-icons>
				</view>
			 </view>
			<view class="adress">
				<view class="top">
					<uni-icons type="phone-filled"></uni-icons><text>{{ tel }}</text>
				</view>
				<uni-icons type="location-filled"></uni-icons><text>{{ adress }}</text>
			</view>
			<view class="yewu">
				{{ products }}
			</view>
			<view class="bus">
				{{bus}}
			</view>
		 </view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				bus: '',
				products: '',
				tel: '',
				adress: '',
				url: '',
				title: '',
				lat: '',
				lon: ''
			}
		},
		onLoad(option) {
			this.getDetail(option.id)
		},
		methods: {
			// 获取详情
			async getDetail(id) {
				await this.$u.get('/api/work/getWorkDetail', { id }).then(res => {
					this.bus = res[0].guide
					this.adress = res[0].address
					this.tel = res[0].tel
					this.products = res[0].range
					this.url = this.$Url+ res[0].thumb
					this.title = res[0].title
					this.lat= res[0].lat
					this.lon = res[0].lon
				})
				
			},
			// 打开地图
			openMap() {
				uni.navigateTo({
					url: './map?lat='+ this.lat + '&lon=' + this.lon + '&title=' + this.title + '&address=' + this.adress
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.yingye {
		width: 100%;
		background-color: #e9e9e9;
		.container {
			width: 100%;
			font-size: 32rpx;
			// margin-top: 70rpx;
			.adress {
				width: 100%;
				padding: 30rpx;
				box-sizing: border-box;
				background-color: #fff;
				.top {
					margin-bottom: 20rpx;
				}
				.uni-icons {
					margin-right: 20rpx;
					color: #00919f !important;
				}
			}
			.yewu {
				padding: 30rpx;
				background-color: #fff;
				margin-top: 20rpx;
				box-sizing: border-box;
				
			}
			.bus {
				padding: 30rpx;
				background-color: #fff;
				margin-top: 20rpx;
				box-sizing: border-box;
			}
			.map {
				position: relative;
				width: 100%;
				height: 500rpx;
				image {
					width: 100%;
					height: 500rpx;
				}
				.openMap {
					display: flex;
					justify-content: space-between;
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					background-color: rgba(0, 0, 0, .7);
					padding: 0 30rpx;
					box-sizing: border-box;
					color: #FFFFFF;
					.uni-icons {
						color: #FFFFFF !important;
					}
				}
			}
			
		}
	}
</style>
