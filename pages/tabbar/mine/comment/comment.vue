<template>
	<view class="container">
		<view class="zan_list">
			<view class="item" v-for="(item, index) in commentList" :key="index">
				<view class="item-comment">{{ item.text }}</view>
				<view class="item-detail" @click="pageTodetail(item.cid, item.type, item.image)">{{ item.title }}</view>
				<view class="item-time">
					<view class="">
						<uni-icons type="chat" size="14" color="#bbb"></uni-icons>
						<text>评论时间：{{ item.create_time }}</text>
					</view>
					<view class="removeLike" @click="removeLike(item.id)">删除评论</view>
				</view>
			</view>
		</view>
		<view v-if="isshow" style="width: 100%; height: 80rpx; line-height: 80rpx; text-align: center;">
			<u-loading mode="circle"></u-loading><text style="margin-left: 10rpx; vertical-align: middle;">加载中</text>
		</view>
		<u-divider v-show="isbottom" color="#00919f" height="120" margin-bottom="50">没有更多了</u-divider>
		<u-empty :show="show" text="暂无评论" mode="data"></u-empty>
	</view>
</template>

<script>
	const isLogin = uni.getStorageSync('isLogin')
	export default {
		data() {
			return {
				show: false,
				isshow: false,
				commentList: [],
				isbottom: false,
				pageNum: 1
			};
		},
		onLoad() {
			this.getCommentList()
		},
		onReachBottom() {
			if (this.isbottom) return
			this.isshow = true
			this.getMoreComment();
		},
		methods: {
			async getCommentList () {
				await this.$u.get('/api/comment/myLists', {token: isLogin.token, index: this.pageNum, length: 8}).then(res => {
					if (res.result.length == 0) {
						this.show = true
					}
					this.commentList = res.result
				})
			},
			async getMoreComment() {
				this.pageNum++
				await this.$u.get('/api/comment/myLists', {token: isLogin.token, index: this.pageNum, length: 8}).then(res => {
					if (res.result.length < 8 && res.result.length > 0) {
						setTimeout(() => {
							this.isshow = false
							this.commentList.push(...res.result)
							this.isbottom = true
						}, 500)
					} else if(res.result.length == 0){
						this.isshow = false
						this.isbottom = true
					} else {
						this.commentList.push(...res.result)
					}
				})
			},
			async removeLike (id) {
				await this.$u.post('/api/comment/remove?token='+ isLogin.token, {id}).then(res => {
					this.pageNum = 1;
					this.getCommentList()
				})
			},
			pageTodetail(id, type, url) {
				if (type == 'live') {
					uni.navigateTo({
						url: '../../../Videotopics/index?id=' + id + '&category=' + type + '&src=' + url
					})
				} else if (type == 'video') {
					uni.navigateTo({
						url: '../../../Videotopics/index?id=' + id + '&src=' + url
					})
				} else if (type == 'imagetext') {
					uni.navigateTo({
						url: '../../../news/index?id=' + id
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
		.item-comment {
			margin-bottom: 20rpx;
			font-size: 36rpx;
		}
		.item-detail {
			margin-bottom: 20rpx;
			font-size: 32rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			border: 1px solid #eee;
			border-radius: 10rpx;
			padding: 10rpx 20rpx;
		}
		.item-time {
			display: flex;
			justify-content: space-between;
			align-items: center;
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

