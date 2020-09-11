<template>
	<view class="main">
		<view class="swiper">
			<swiper class="swiper-list" indicator-dots indicator-color="#eee" indicator-active-color="#fa436a" interval="5000"
			 :autoplay="autoplay" :duration="duration" @change="swiperChange">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<view class="swiper-item">
						<view class="swiper-item-img">
							<image :src="item.url" mode="aspectFill"></image>
						</view>
					</view>
				</swiper-item>
			</swiper>

			<view class="jumpover" @tap="pageTo" v-if="swiperCurrent+1 == swiperLength">
				<text style="margin-right: 5px;">{{ txt }}</text>
				{{ jumpover }}
			</view>
			<!-- <view class="experience" @tap="launchFlag()" v-if="swiperCurrent+1 == swiperLength">{{ experience }}</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				swiperList: [],
				autoplay: false,
				duration: 500,
				jumpover: '跳过',
				experience: '立即体验',
				txt: 5,
			};
		},
		onLoad() {
			// this.titleNViewBackground = this.swiperList[0].bgColor;
			this.getImgList() 
			this.start()
			
		},
		methods: {
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.swiperLength = this.swiperList.length;
				// this.titleNViewBackground = this.swiperList[index].bgColor;
			},
			start() {
				var timer = null;
				var count = 5;
				var that = this
				timer = setInterval(function() {
					count--;
					that.txt = count
					if (count <= 0) {
						clearInterval(timer);
						// that.launchFlag()
						uni.switchTab({
							url:'./tabbar-3',
							success: () => {
								that.launchFlag()
							}
						})
					}
				}, 1000);
			},
			// 获取启动图
			async getImgList() {
				await this.$u.get('/api/app/getappaction').then(res => {
					if (res) this.swiperList = res
					this.swiperLength = this.swiperList.length;
				})
			},
			pageTo() {
				uni.switchTab({
					url: './tabbar-3'
				})
			},
			launchFlag() {
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				// uni.setStorage({
				// 	key: 'launchFlag',
				// 	data: true
				// });
				const platform = uni.getSystemInfoSync().platform;
				const pushMsg = uni.getStorageSync('pushMsg')
				// uni.switchTab({
				// 	url: '/pages/tabbar/home/tabbar-3',
				// 	success: () => {
						if (pushMsg) {
							if (platform == "android") {
								// let msg = pushMsg
								// msg = JSON.parse(msg)
								console.log(pushMsg)
								if (pushMsg.module_type == 'image_text') {
										uni.navigateTo({
											url: '../../news/index?id=' + pushMsg.cid,
											success: () => {
												uni.removeStorageSync('pushMsg')
											}
										})
									} else if (pushMsg.module_type == 'video') {
										uni.navigateTo({
											url: '../../Videotopics/index?id=' + pushMsg.cid,
											success: () => {
												uni.removeStorageSync('pushMsg')
											}
										})
									} else if (pushMsg.module_type == 'live') {
										uni.navigateTo({
											url: '../../Videotopics/index?id=' + pushMsg.cid + '&category=live',
											success: () => {
												uni.removeStorageSync('pushMsg')
											}
										})
									}
							} else {
								console.log(pushMsg)
								setTimeout(function () {
									if (pushMsg.module_type == 'image_text') {
											uni.navigateTo({
												url: '../../news/index?id=' + pushMsg.cid,
												success: () => {
													uni.removeStorageSync('pushMsg')
												}
											})
										} else if (pushMsg.module_type == 'video') {
											uni.navigateTo({
												url: '../../Videotopics/index?id=' + pushMsg.cid,
												success: () => {
													uni.removeStorageSync('pushMsg')
												}
											})
										} else if (pushMsg.module_type == 'live') {
											uni.navigateTo({
												url: '../../Videotopics/index?id=' + pushMsg.cid + '&category=live',
												success: () => {
													uni.removeStorageSync('pushMsg')
												}
											})
										}
								}, 10)
							}
							
						} 
				// 	}
				// });
			}
		}
	};
</script>
<style>
	page,
	.main {
		width: 100%;
		height: 100%;
		padding: 0;
		background-size: 100% auto;
	}

	.swiper {
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.swiper-list {
		width: 100%;
		height: 100%;
	}

	.swiper-item {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		text-align: center;
	}

	.swiper-item-img {
		justify-content: center;
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}

	.swiper-item-img image {
		width: 100%;
		height: 100%;
	}

	.jumpover,
	.experience {
		position: absolute;
		z-index: 999;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 30rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		border: 2rpx solid #000000;
		border-radius: 30rpx;

	}

	.jumpover {
		right: 30rpx;
		top: 90rpx;
		background-color: rgba(0, 0, 0, .8);
	}

	.experience {
		right: 50%;
		bottom: 140rpx;
		margin-right: -116rpx;
	}
</style>
