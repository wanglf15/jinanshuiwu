<template>
	<view class="container">
		<view class="zan_list">
			<view class="item" v-for="(item, index) in zanList" :key="index">
				<view class="item-detail" @click="pageToDetail(item.cid, item.type, item.image)">{{ item.title }}</view>
				<view class="item-time">
					<view class="">
						<uni-icons type="hand-thumbsup-filled" size="14" color="#bbb"></uni-icons>
						<text>点赞时间：{{ item.create_time }}</text>
					</view>
					<view class="removeLike" @click="removeLike(item.cid, item.type)">取消点赞</view>
				</view>
			</view>
		</view>
		<view v-if="isshow" style="width: 100%; height: 80rpx; line-height: 80rpx; text-align: center;">
			<u-loading mode="circle"></u-loading><text style="margin-left: 10rpx; vertical-align: middle;">加载中</text>
		</view>
		<u-divider v-show="isbottom" color="#00919f" height="120" margin-bottom="50">没有更多了</u-divider>
		<u-empty text="暂无点赞" mode="list" :show="show"></u-empty>
	</view>
</template>

<script>
	const isLogin = uni.getStorageSync('isLogin')
	export default {
		data() {
			return {
				show: false,
				isshow: false,
				isbottom: false,
				zanList: [],
				pageNum: 1
			};
		},
		onLoad() {
			this.getZanList()
		},
		onReachBottom() {
			if (this.isbottom) return
			this.isshow = true
			this.getMoreZan();
		},
		methods: {
			// 获取点赞列表
			async getZanList() {
				await this.$u.get('/api/like/lists', {token: isLogin.token, index: this.pageNum, length: 8}).then(res => {
					if (res.result.length === 0) {
						this.show = true
					}
					this.zanList = res.result
				})
			},
			//  加载更多
			async getMoreZan () {
				this.pageNum++
				await this.$u.get('/api/like/lists', {token: isLogin.token, index: this.pageNum, length: 8}).then(res => {
					if (res.result.length < 8 && res.result.length > 0) {
						setTimeout(() => {
							this.isshow = false
							this.zanList.push(...res.result)
							this.isbottom = true
						}, 500)
					} else if(res.result.length == 0){
						this.isshow = false
						this.isbottom = true
						
					} else {
						this.zanList.push(...res.result)
					}
				})
			},
			// 取消点赞
			async removeLike(cid, type) {
				await this.$u.get('/api/like/remove', { cid, token: isLogin.token, type }).then(res => {
					this.pageNum = 1;
					this.getZanList()
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

<style lang="less" scoped>
.zan_list {
	width: 100%;
	padding: 0 30rpx;
	padding-bottom: 20rpx;
	box-sizing: border-box;
	.item {
		padding: 20rpx 0;
		border-bottom: 1px solid #EEEEEE;
		.item-detail {
			margin-bottom: 20rpx;
			font-size: 36rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.item-time {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			text {
				margin-left: 10rpx;
				color: #B9B9B9;
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
.u-empty {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%); 
}
</style>
