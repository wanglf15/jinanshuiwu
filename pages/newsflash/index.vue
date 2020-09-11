<template>
	<view class="more">
		<u-sticky>
			<u-tabs :list="list" :is-scroll="isScroll" :current="current" @change="change" font-size="36" active-color="#00919f"
			 bar-width="80" bg-color="#eee">
			</u-tabs>
		</u-sticky>
		<view class="more-container">
			<!-- 企业快讯 -->
			<view class="more-item" v-if="current == 0">
				<view class="more_list" v-for="(item, index) in newsflashList" :key="index" @click="jumpNews(item.id, 0)">
					<u-image :src="item.img_thumb" width="200" height="140" border-radius="10" mode=""></u-image>
					<view class="intro" style="display: inline-block; width: 70%; height: 100%;">
						<text class="list_title">{{ item.title }}</text>
						<span class="list_time">{{ item.update_time_text }}</span>
					</view>
				</view>
				<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow1" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 员工风采 -->
			<view class="more-item" v-if="current == 1">
				<view class="staffItem" v-for="(item, index) in imgList" :key="index" @click="jumpstaff(item.id)">
					<image :src="item.img" mode=""></image>
					<view style="font-size: 32rpx; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
						<text>{{ item.title }}</text>
					</view>
					<view style="text-align: right; margin-top: 20rpx; color: #CCCCCC;">
						<text>{{ item.create_time_text }}</text>
					</view>
				</view>
				<u-empty :show="isShow3" text="空空如也" mode="history"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				JournalismList: [],
				newsflashList: [],
				imgList: [],
				pageIndex: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				list: [{
					name: '水务快讯'
				},{
					name: '员工风采'
				}],
				current: "0",
				isShow1: false,
				isShow2: false,
				isShow3: false,
				isScroll: false
			}
		},
		onLoad(option) {
			this.change(option.id)
		},
		onReachBottom() {
			this.pageIndex++;
			if (this.current == 0) {
				this.getMoreNews()
			}
		},
		methods: {
			change(index) {
				this.status = 'loading'
				this.current = index;
				this.pageIndex = 1;
				if (index == 0) {
					this.getNewsflash()
				} else if (index == 1) {
					this.getItems()
				} 
			},
			// 列表项点击跳转页面 
			jumpNews(id, p) {
				uni.navigateTo({
					url: '../news/index?id=' + id + '&act=' + p
				})
			},
			// 员工风采点击
			jumpstaff(id) {
				uni.navigateTo({
					url: '../staff/index?id=' + id
				})
			},
			// 获取企业快讯列表
			async getNewsflash() {
				await this.$u.get('/api/news/getNewsList', {
					index: this.pageIndex,
					length: 10
				}).then(res => {
					if (res.result.length == 0) {
						this.isShow1 = true
					}
					res.result.map((el, index) => {
						res.result[index].img_thumb = this.$Url + el.img_thumb
					})
					this.newsflashList = res.result
				})
			},
			// 加载更多企业快讯
			async getMoreNews() {
				if(this.status == 'nomore') return
				await this.$u.get('/api/news/getNewsList', {
					index: this.pageIndex,
					length: 10
				}).then(res => {
					res.result.map((el, index) => {
						res.result[index].img_thumb = this.$Url + el.img_thumb
					})
					if (res.result.length < 10) {
						this.status = 'nomore'
					}
					this.newsflashList.push(...res.result)
				})
			},
			// 获取员工风采
			async getItems() {
				await this.$u.get('/api/app/getygfc').then(res => {
					if (res.length == 0) {
						this.isShow3 = true
					}
					res.map((el, index) => {
						res[index].img = this.$Url + el.img
						res[index].create_time_text = (el.create_time_text).slice(0, 10)
					})
					this.imgList = res
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.more {
		width: 100%;
		height: 100%;

		.more-container {
			// margin-top: 170rpx;
		}

		.more-item {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			padding-left: 20rpx;
			box-sizing: border-box;

			.Journalism-title {
				display: -webkit-box;
				text-overflow: ellipsis;
				overflow: hidden;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				margin-bottom: 30rpx;
				font-size: 32rpx;
			}

			.Journalism-pub {
				display: flex;
				justify-content: space-between;
				color: #999999;
			}

			.more_list {
				position: relative;
				width: 98%;
				border-bottom: 1px solid #EEEEEE;
				padding: 30rpx 0;
				box-sizing: border-box;

				&:last-child {
					// border: 0;
					margin-bottom: 20rpx;
				}

				.intro {
					text {
						position: absolute;
						top: 30rpx;
						display: -webkit-box;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					span {
						display: block;
					}
				}

				.u-image {
					display: inline-block;
					// width: 200rpx;
					// height: 140rpx;
					margin-right: 14rpx;
				}

				.list_title {
					font-size: 32rpx;
					line-height: 40rpx;

				}

				.list_time {
					position: absolute;
					right: 0;
					bottom: 20rpx;
					font-size: 28rpx;
					color: #CCCCCC;
				}
			}

			.staffItem {
				width: 100%;
				padding-right: 20rpx;
				padding-top: 30rpx;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #EEEEEE;

				image {
					width: 100%;
					height: 380rpx;
					margin-bottom: 15rpx;
					border-radius: 10rpx;
				}
			}
		}

	}
</style>
