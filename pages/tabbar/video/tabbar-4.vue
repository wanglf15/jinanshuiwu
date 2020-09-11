<template>
	<view class="content">
		<view class="video-con">
			<u-sticky>
				<u-tabs style="width: 100%;" :list="list" :is-scroll="false" :current="TabCur" @change="change" font-size="32" height="80" bar-width="120" active-color="#00919f" bg-color="#f4f4f4"></u-tabs>		
			</u-sticky>
			<view class="lives" v-if="TabCur == 0">
				<scroll-view scroll-y :style="{height: platform == 'ios' ? '88vh' : '93vh'}" @scrolltolower="scrollBottom">
					<view class="items" v-for="(item,index) in Xuanchuang" :key="index">
						<view class="items_con" @click="openVideo(item.id, item.image, item.category)">
							<u-image :src="item.image" width="100%" height="460" mode="aspectFill"></u-image>
							<image src="../../../static/img/img/play-icon.png" mode=""></image>
						</view>
						<view class="items_title">{{ item.title }}</view>
						<view class="items_see">
							<u-icon name="eye-fill" size="40"></u-icon>
							<text>{{ item.views }}</text>
						</view>
					</view>
					<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" margin-bottom="50"/>
				</scroll-view> 
			</view>
			<view class="changshi" v-if="TabCur == 1">
				<scroll-view :scroll-y="true" :style="{height: platform == 'ios' ? '88vh' : '93vh'}" @scrolltolower="scrollBottom">
				<view class="items" v-for="(item,index) in WeiVideo" :key="index">
					<view class="items_con" @click="openVideo(item.id, item.img)">
						<u-image :src="item.img" mode="aspectFill" width="100%" height="460"></u-image>
						<image src="../../../static/img/img/play-icon.png" mode=""></image>
					</view>
					<view class="items_title">{{ item.title }}</view>
					<view class="items_see">
						<u-icon name="eye-fill" size="40"></u-icon><text>{{ item.views }}</text>
					</view>
				</view>
				<u-loadmore :status="status1" icon-type="iconType1" :load-text="loadText1" margin-bottom="50"/>
				</scroll-view> 
			</view>
			<view class="wenhua" v-if="TabCur == 2">
				<scroll-view scroll-y :style="{height: platform == 'ios' ? '88vh' : '93vh'}" @scrolltolower="scrollBottom">
				<view class="items" v-for="(item,index) in WeiLive" :key="index">
					<view class="items_con" @click="openVideo(item.id, item.img)">
						<u-image :src="item.img" mode="aspectFill" width="100%" height="460"></u-image>
						<image src="../../../static/img/img/play-icon.png" mode=""></image>
					</view>
					<view class="items_title">{{ item.title }}</view>
					<view class="items_see">
						<u-icon name="eye-fill" size="40"></u-icon><text>{{ item.views }}</text>
					</view>
				</view>
				<u-loadmore :status="status2" icon-type="iconType2" :load-text="loadText2" margin-bottom="50"/>
				</scroll-view> 
			</view>
			<!-- <u-tabs-swiper ref="uTabs" :list="list" :is-scroll="false" :current="TabCur" active-color="#00919f" bg-color="#f4f4f4"
			 @change="tabchange" font-size="32" height="80" bar-width="120"></u-tabs-swiper> -->
			<!-- <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" @change="swiperChange">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;" @scrolltolower="scrollBottom">
						<view class="items" v-for="(item,index) in Xuanchuang" :key="index">
							<view class="items_con" @click="openVideo(item.id, item.image, item.category)">
								<u-image :src="item.image" width="100%" height="460" mode="aspectFill" v-if="item.image != ''"></u-image>
								<image src="../../../static/img/img/wx_thumb.png" mode="" v-else></image>
								<image src="../../../static/img/img/play-icon.png" mode=""></image>
							</view>
							<view class="items_title">{{ item.title }}</view>
							<view class="items_see">
								<u-icon name="eye-fill" size="40"></u-icon>
								<text>{{ item.views }}</text>
							</view>
						</view>
						<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" margin-bottom="50"/>
					</scroll-view> 
					
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;" @scrolltolower="scrollBottom">
						<view class="items" v-for="(item,index) in WeiVideo" :key="index">
							<view class="items_con" @click="openVideo(item.id, item.img)">
								<u-image :src="item.img" mode="aspectFill" width="100%" height="460" v-if="item.img != ''"></u-image>
								<image src="../../../static/img/img/wx_thumb.png" mode="" v-else></image>
								<image src="../../../static/img/img/play-icon.png" mode=""></image>
							</view>
							<view class="items_title">{{ item.title }}</view>
							<view class="items_see">
								<u-icon name="eye-fill" size="40"></u-icon><text>{{ item.views }}</text>
							</view>
						</view>
						<u-loadmore :status="status1" icon-type="iconType1" :load-text="loadText1" margin-bottom="50"/>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;" @scrolltolower="scrollBottom">
						<view class="items" v-for="(item,index) in WeiLive" :key="index">
							<view class="items_con" @click="openVideo(item.id, item.img)">
								<u-image :src="item.img" mode="aspectFill" width="100%" height="460" v-if="item.thumb != ''"></u-image>
								<image src="../../../static/img/img/wx_thumb.png" mode="" v-else></image>
								<image src="../../../static/img/img/play-icon.png" mode=""></image>
							</view>
							<view class="items_title">{{ item.title }}</view>
							<view class="items_see">
								<u-icon name="eye-fill" size="40"></u-icon><text>{{ item.views }}</text>
							</view>
						</view>
						<u-loadmore :status="status2" icon-type="iconType2" :load-text="loadText2" margin-bottom="50"/>
					</scroll-view>
				</swiper-item>
			</swiper> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				TabCur: "0",
				swiperCurrent: 0,
				Xuanchuang: [],
				WeiVideo: [],
				WeiLive: [],
				pageIndex: 1,
				pageIndex1: 1,
				pageIndex2: 1,
				status: 'loading',
				status1: 'loading',
				status2: 'loading',
				iconType: 'flower',
				iconType1: 'flower',
				iconType2: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				loadText1: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				loadText2: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				platform: ''
			}
		},
		onLoad() {
			this.getXuanchuang()
			this.getTabsList()
			if (this.$u.os() == 'ios') {
				this.platform = 'ios'
			}
		},
		methods: {
			// 获取tab列表
			async getTabsList() {
				await this.$u.get('/api/app/getCategory?category_id=56').then(res => {
					this.list = res
				})
			},
			
			// 触底加载
			scrollBottom() {
				setTimeout(() => {
					if(this.TabCur == 0) {
						this.pageIndex++
						this.getMoreXuanchuang()
					} else if (this.TabCur == 1) {
						this.pageIndex1++
						this.getMoreWeiVideo()
					} else {
						this.pageIndex2++
						this.getMoreWeiLive()
					}
				}, 500)
			},
			// 打开视频
			openVideo(id, src, category) {
				if (category && category == 2) {
					uni.navigateTo({
						url: '../../Videotopics/index?id=' + id + '&src=' + src + '&category=' + category
					})
				} else if (!category) {
					uni.navigateTo({
						url: '../../Videotopics/index?id=' + id + '&src=' + src
					})
				} else {
					uni.navigateTo({
						url: '../../mudulive/index?id=' + id
					})
				}
				
			},
			// 获取水务直播列表
			async getXuanchuang() {
				await this.$u.get('/api/live/getLiveList', {index: 1, length: 5}).then(res => {
					const data = res.result
					data.map((el, index) => {
						data[index].image = this.$Url + el.image
					})
					if(res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.Xuanchuang = data
				})
			},
			// 水务直播加载更多
			async getMoreXuanchuang() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/live/getLiveList', {index: this.pageIndex, length: 5}).then(res => {
					const data = res.result
					data.map((el, index) => {
						data[index].image = this.$Url + el.image
					})
					if(res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.Xuanchuang.push(...data)
				})
			},
			//  获取用水常识列表
			async getWeiVideo() {
				await this.$u.get('/api/video/getyscsList', {index: 1, length: 5}).then(res => {
					const data = res.result
					data.map((el, index) => {
						if (el.img.startsWith('http')) {
							data[index].img = el.img
						} else {
							data[index].img = this.$Url + el.img
						}
					})
					if(res.result.length == 0) {
						this.status1 = 'nomore'
						return
					}
					this.WeiVideo = data
				})
			},
			// 用水常识加载更多
			async getMoreWeiVideo() {
				if (this.status1 == 'nomore') return
				await this.$u.get('/api/video/getyscsList', {index: this.pageIndex1, length: 5}).then(res => {
					const data = res.result
					data.map((el, index) => {
						if (el.img.startsWith('http')) {
							data[index].img = el.img
						} else {
							data[index].img = this.$Url + el.img
						}
					})
					if(res.result.length == 0) {
						this.status1 = 'nomore'
						return
					}
					this.WeiVideo.push(...data)
				})
			},
			// 获取品牌文化列表
			async getWeiLive() {
				await this.$u.get('/api/video/getppwhList', {index: 1, length: 5}).then(res => {
					const data = res.result
					data.map((el, index) => {
						if (el.img.startsWith('http')) {
							data[index].img = el.img
						} else {
							data[index].img = this.$Url + el.img
						}
					})
					if(res.result.length == 0) {
						this.status2 = 'nomore'
						return
					}
					this.WeiLive = data
				})
			},
			// 品牌文化加载更多
			async getMoreWeiLive() {
				if (this.status2 == 'nomore') return
				await this.$u.get('/api/video/getppwhList', {index: this.pageIndex2, length: 5}).then(res => {
					const data = res.result
					data.map((el, index) => {
						if (el.img.startsWith('http')) {
							data[index].img = el.img
						} else {
							data[index].img = this.$Url + el.img
						}
					})
					if(res.result.length == 0) {
						this.status2 = 'nomore'
						return
					}
					this.WeiLive.push(...data)
				})
			},
			// tab切换
			// tabchange(index) {
			// 	this.swiperCurrent = index;
			// },
			change (index) {
				if (index == 0) {
					this.pageIndex = 1
					this.getXuanchuang()
				}
				if (index == 1) {
					this.pageIndex1 = 1
					this.getWeiVideo()
				}
				if (index == 2) {
					this.pageIndex2 = 1
					this.getWeiLive()
				}
				this.TabCur = index;
			},
			// swiperChange(e) {
			// 	if (e.detail.current == 0) {
			// 		this.pageIndex = 1
			// 		this.getXuanchuang()
			// 	}
			// 	if (e.detail.current == 1) {
			// 		this.pageIndex1 = 1
			// 		this.getWeiVideo()
			// 	}
			// 	if (e.detail.current == 2) {
			// 		this.pageIndex2 = 1
			// 		this.getWeiLive()
			// 	}
			// },
			// transition(e) {
			// 	let dx = e.detail.dx;
			// 	this.$refs.uTabs.setDx(dx);
			// },
			// animationfinish(e) {
			// 	let current = e.detail.current;
			// 	this.$refs.uTabs.setFinishCurrent(current);
			// 	this.swiperCurrent = current;
			// 	this.TabCur = current;
			// },
		}
	} 
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;

		.video-con {
			width: 100%;
			// .u-tabs {
			// 	position: fixed; 
			// }
			// uni-swiper {
			// 	// position: fixed;
			// 	height: 100vh;
			// }
			.changshi, .wenhua, .lives {
				padding: 30rpx;
			}
			// .swiper-item {
			// 	width: 100%;
			// 	// height: 100% !important; 
			// 	padding: 0 30rpx;
			// 	padding-top: 110rpx ;
			// 	box-sizing: border-box;
				.items {
					width: 100%;
					padding-bottom: 20rpx;
					margin-bottom: 40rpx;
					border-bottom: 1px solid #CCCCCC;

					.items_con {
						position: relative;
						width: 100%;
						margin-bottom: 20rpx;

						image {
							display: block;
							&:nth-child(2) {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: 80rpx;
								height: 80rpx;
							}
						}
					}

					.items_title {
						font-size: 32rpx;
						margin-top: 40rpx;
					}

					.items_see {
						width: 100%;
						text-align: right;
						font-size: 24rpx;
						color: #999999;
						margin-top: 20rpx;

						.u-icon {
							margin-right: 10rpx;
							vertical-align: middle;
						}

						text {
							vertical-align: middle;
						}
					}
				}
			// }
		}

	}
</style>
