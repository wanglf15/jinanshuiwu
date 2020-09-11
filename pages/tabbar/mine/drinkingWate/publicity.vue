<template>
	<view class="container">
		<view style="position: relative;">
			<view class="myselect" @click="show = !show">
				<text>{{ home }}</text>
				<u-icon name="arrow-down-fill" color="#666"></u-icon>
			</view>
			<view class="select-content" v-if="show">
				<view class="select-item" v-for="(item, index) in selectList" :key="index" @click="handleClick(item.code, item.address)">
					<text>{{ item.code + '-' + item.address.slice(0,4) }}</text>
				</view>
			</view>
		</view>
		
		<view class="my-swiper">
			<swiper class="swiper" circular 
				:indicator-dots="indicatorDots" 
				:autoplay="autoplay" 
				:interval="interval" 
				:duration="duration"
				indicator-active-color="#fff"
				indicator-color="rgba(255,255,255, .3)"
			>
				<swiper-item v-if="swiperList.length == 0">
					<view class="swiper-item">
						<u-image src="../../../../static/img/img/video-wapper.jpg" width="100%" height="450" mode=""></u-image>
					</view>
				</swiper-item>
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<view class="swiper-item" >
						<u-image :src="item.imgUrl" width="100%" height="450" mode=""></u-image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<u-table border-color="transparent" padding="20rpx" font-size="32">
			<u-tr>
				<u-th style="background-color: #00919F; color: #FFFFFF; font-size: 32rpx;">监测项目</u-th>
				<u-th style="background-color: #00919F; color: #FFFFFF; font-size: 32rpx;">国家标准</u-th>
				<u-th style="background-color: #00919F; color: #FFFFFF; font-size: 32rpx;">当前数值</u-th>
			</u-tr>
			<u-tr style="background-color: #f4f4f4;" v-for="(item,index) in tableList" :key="index">
				<u-td>{{ item.name }}</u-td>
				<u-td>{{ item.standard }}</u-td>
				<u-td>{{ item.valCurrent }}</u-td>
			</u-tr>
			<u-tr style="background-color: #f4f4f4;" v-if="tableList.length == 0">
				<u-td>暂无数据!</u-td>
			</u-tr>
		</u-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: false,
				autoplay: true,
				interval: 5000,
				duration: 500,
				show: false,
				selectList: [],
				home: '',
				value: '',
				swiperList: [],
				tableList: []
			}
		},
		onLoad() {
			this.getNumlist()
			
		},
		methods: {
			// 获取水质公示
			async getpublicity (code) {
				const token = uni.getStorageSync('isLogin').token
				await this.$u.get('/api/zys/waterQualityQuery', {
					token,
					code
				}).then(res => {
					if (res.code == 1) {
						const imgs = res.data.urls.split(",");
						imgs.map((el,index) => {
							this.swiperList.push({imgUrl: el})
						})
						this.tableList = res.data.monitors
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.tableList = []
						this.swiperList = []
					}
				})
			},
			// 获取水号列表
			async getNumlist() {
				const token = uni.getStorageSync('isLogin').token
				await this.$u.get('/api/zys/bindListBasic', {
					token: token,
					index: 1,
					length: 15
				}).then(res => {
					this.selectList = res.data
					this.home = this.selectList[0].code + '-' + this.selectList[0].address.slice(0,4)
					this.getpublicity(res.data[0].code)
				})
			},
			handleClick(code,address) {
				this.show = false
				this.home = code + '-' + address.slice(0,4)
				this.value = code
				this.getpublicity(code)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 30rpx;

		.myselect {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 20rpx 30rpx;
			border: 1px solid #CCCCCC;
			font-size: 32rpx;
			text {
				display: block;
				width: 90%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.my-swiper {
			margin: 30rpx 0;

			.swiper {
				height: 450rpx;
			}

			image {
				width: 100%;
				height: 450rpx;
			}
		}
		.select-content {
			position: absolute;
			top: 90rpx;
			left: 0;
			width: 100%;
			padding: 20rpx 30rpx;
			border: 1px solid #EEEEEE;
			background-color: #FFFFFF;
			z-index: 99999;
			.select-item {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 20rpx 0;
			}
		}
	}
</style>
