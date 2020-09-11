<template>
	<view class="container">
		<view class="more-item">
			<u-sticky offset-top="20">
				<u-button @click="pagetoAdd">创建新闻</u-button>
			</u-sticky>
			<view class="more_list" v-for="(item, index) in newsflashList" :key="index">
				<view style="display: flex; justify-content: space-between;" @click="jumpNews(item.id)">
					<u-image :src="item.img_thumb" width="200" height="140" border-radius="10" mode=""></u-image>
					<view class="intro">
						<text class="list_title">{{ item.title }}</text>
						<span class="list_time">{{ item.update_time_text }}</span>
					</view>
				</view>
				<view class="operation">
					<view class="btns edit" @click="editNews(item.id)">
						<u-icon name="edit-pen"></u-icon><text>编辑</text>
					</view>
					<view class="btns del" @click="delNews(item.id)">
						<u-icon name="trash"></u-icon><text>删除</text>
					</view>
					<view class="btns set" @click="setNews(item.id)">
						<u-icon name="setting"></u-icon><text>设置</text>
					</view>
				</view>
			</view>
			
			<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
			<u-empty :show="isShow" text="空空如也" mode="history"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				newsflashList: [],
				isShow: false,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				pageIndex: 1
			}
		},
		onReachBottom() {
			this.pageIndex++;
			this.getMoreNews()
		},
		// onLoad() {
		// 	this.getNewsflash()
		// },
		onShow() {
			this.getNewsflash()
		},
		methods: {
			// 创建新闻
			pagetoAdd() {
				uni.navigateTo({
					url: './addNews'
				})
			},
			// 新闻编辑
			editNews (id) {
				uni.navigateTo({
					url: './addNews?id=' + id + '&type=edit'
				})
			},
			// 删除
			delNews (id) {
				let that = this;
				const token = uni.getStorageSync('isLogin').token;
				uni.showModal({
				    title: '删除提示',
				    content: '是否确定删除？',
				    success: function (res) {
				        if (res.confirm) {
				            that.$u.get('/api/user_news/del', {
								token: token,
								id: id
							}).then(response => {
								if (response.code == 1) {
									that.getNewsflash()
									uni.showToast({
										title: response.msg
									})
								}
							})
							
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			// 设置
			setNews(id) {
				uni.navigateTo({
					url: './setNews?id=' + id
				})
			},
			// 获取新闻列表
			async getNewsflash() {
				const token = uni.getStorageSync('isLogin').token;
				await this.$u.get('/api/user_news/lists', {
					token: token,
					index: 1,
					length: 10
				}).then(res => {
					if (res.result.length == 0) {
						this.isShow = true
					}
					res.result.map((el, index) => {
						if (res.result[index].img_thumb.indexOf('http') != '-1') {
							res.result[index].img_thumb = el.img_thumb
						} else {
							res.result[index].img_thumb = this.$Url + el.img_thumb
						}
						
					})
					this.newsflashList = res.result
				})
			},
			// 加载更多
			async getMoreNews() {
				const token = uni.getStorageSync('isLogin').token;
				await this.$u.get('/api/user_news/lists', {
					token: token,
					index: this.pageIndex,
					length: 10
				}).then(res => {
					res.result.map((el, index) => {
						res.result[index].img_thumb = this.$Url + el.img_thumb
					})
					if (res.result.length < 10) {
						this.status = 'nomore'
					}
					if (res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.newsflashList.push(...res.result)
				})
			},
			// 列表点击跳转
			jumpNews(id) {
				uni.navigateTo({
					url: '../../../news/index?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 20rpx 30rpx;
		.more-item {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			.more_list {
				// display: flex;
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
					width: 70%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					text {
						// position: absolute;
						// top: 30rpx;
						display: -webkit-box;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
		
					span {
						display: block;
						text-align: right;
					}
				}
		
				.u-image {
					// display: inline-block;
					// width: 200rpx;
					// height: 140rpx;
					margin-right: 14rpx;
				}
		
				.list_title {
					font-size: 32rpx;
					line-height: 40rpx;
		
				}
		
				.list_time {
					// position: absolute;
					// right: 0;
					// bottom: 20rpx;
					font-size: 28rpx;
					color: #CCCCCC;
				}
				.operation {
					width: 100%;
					display: flex;
					justify-content: space-between;
					margin-top: 20rpx;
					background-color: #f8f8f8;
					.btns {
						display: flex;
						align-items: center;
						padding: 10rpx 20rpx;
					}
					.edit {
						color: #2979ff;
					}
					.del {
						color: #fa3534;
					}
					.set {
						color: #18B566;
					}
				}
			}
		}
	}
</style>
