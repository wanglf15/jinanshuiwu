<template>
	<view class="container">
		<view class="collect">
			<view class="collect-item" v-for="(item, index) in collectList" :key="index">
				<view class="item">
					<view class="title" @click="pageToDetail(item.cid, item.type, item.image)">{{ item.title}}</view>
					<view class="item-time">
						<view class="">
							<uni-icons type="flag-filled" size="14" color="#bbb"></uni-icons>
							<text>收藏时间：{{ item.create_time }}</text>
						</view>
						<view class="removeLike" @click="removeLike(item.cid, item.type)">取消收藏</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isshow" style="width: 100%; height: 80rpx; line-height: 80rpx; text-align: center;">
			<u-loading mode="circle"></u-loading><text style="margin-left: 10rpx; vertical-align: middle;">加载中</text>
		</view>
		<u-divider v-show="isbottom" color="#00919f" height="120" margin-bottom="50">没有更多了</u-divider>
		<u-empty :show="show" text="暂无收藏" mode="favor"></u-empty>
	</view>
</template>

<script>
	const isLogin = uni.getStorageSync('isLogin')
	export default {
		data() {
			return {
				show: false,
				collectList: [],
				isbottom: false,
				pageNum: 1,
				isshow: false
			};
		},
		onLoad() {
			this.getCollectList()

		},
		onReachBottom() {
			if (this.isbottom) return
			this.isshow = true
			this.getmoreCollect();
		},
		methods: {
			async getCollectList() {
				await this.$u.get('/api/collection/lists', {
					token: isLogin.token,
					index: this.pageNum,
					length: 8
				}).then(res => {
					if(res.result.length == 0) {
						this.show = true
						// return
					}
					this.collectList = res.result
				})
			},
			// 加载更多
			getmoreCollect() {
				this.pageNum++
				this.$u.get('/api/collection/lists', {
					token: isLogin.token,
					index: this.pageNum,
					length: 8,
				}).then(res => {
					
					if (res.result.length < 8 && res.result.length > 0) {
						setTimeout(() => {
							this.isshow = false
							this.collectList.push(...res.result)
							this.isbottom = true
						}, 500)
					} else if(res.result.length == 0){
						this.isshow = false
						this.isbottom = true
						
					} else {
						this.collectList.push(...res.result)
					}
					
					
				})
			},
			// 取消收藏
			async removeLike(cid, type) {
				await this.$u.get('/api/collection/remove', {
					cid,
					token: isLogin.token,
					type
				}).then(res => {
					this.pageNum = 1
					this.getCollectList()
				})
			},
			pageToDetail(cid, type, url) {
				if (type === 'imagetext') {
					uni.navigateTo({
						url: '../../../news/index?id=' + cid
					})
				} else if (type === 'video') {
					uni.navigateTo({
						url: '../../../Videotopics/index?id=' + cid + '&src=' + url
					})
				} else if (type === 'live') {
					uni.navigateTo({
						url: '../../../Videotopics/index?id=' + cid + '&src=' + url + '&category=' + type
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.container {
		width: 100%;
	}

	.collect {
		width: 100%;
		padding: 0 40rpx;
		padding-bottom: 20rpx;

		.collect-item {
			width: 100%;
			border-radius: 8rpx;
			background-color: #FFFFFF;
			padding: 20rpx 0;
			border-bottom: 1px solid #EEEEEE;

			.item {
				.title {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 36rpx;
					margin-bottom: 20rpx;
				}

				.item-time {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;

					text {
						width: 100%;
						color: #bbb;
						padding-right: 10rpx;
						font-size: 24rpx;
					}

					.removeLike {
						display: flex;
						justify-content: center;
						align-items: center;
						// width: 50rpx;
						padding: 0 10rpx;
						height: 50rpx;
						border: 1px solid #EEEEEE;
						border-radius: 10rpx;
						color: #ff0713;

						.uni-icons {
							margin: 0;
						}
					}
				}
			}

		}
	}

	.u-empty {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
