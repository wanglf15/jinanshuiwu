<template>
	<view class="more">
		<u-sticky>
			<u-tabs :list="list" :is-scroll="isScroll" :current="current" @change="change" font-size="36" active-color="#00919f"
			 bar-width="100" bg-color="#eee">
			</u-tabs>
		</u-sticky>
		<view class="more-container">
			<!-- 优化营商环境 -->
			<view class="more-item" v-if="current == 0">
				<view class="more_list" v-for="(item, index) in YSHJlist" :key="index" @click="jumpother(item.id)">
					<view class="list_title">
						<u-icon name="calendar" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 停水降压公告 -->
			<view class="more-item" v-if="current == 1">
				<view class="more_list" v-for="(item, index) in TSlist" :key="index" @click="jumpdetails(item.id)">
					<view class="list_title">
						<u-icon name="volume-up" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow1" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 水质水压公告 -->
			<view class="more-item" v-if="current == 2">
				<view class="more_list" v-for="(item, index) in SZlist" :key="index" @click="jumpdetails(item.id, item.category_id)">
					<view class="list_title">
						<u-icon name="volume-up" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow2" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 规章制度 -->
			<view class="more-item" v-if="current == 3">
				<view class="more_list" v-for="(item, index) in ZDlist" :key="index" @click="jumpother(item.id)">
					<view class="list_title">
						<u-icon name="order" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow3" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 用水节水 -->
			<view class="more-item" v-if="current == 4">
				<view class="more_list" v-for="(item, index) in YSJSlist" :key="index" @click="jumpother(item.id)">
					<view class="list_title">
						<u-icon name="question-circle" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow4" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 媒体关注 -->
			<view class="more-item" v-if="current == 5">
				<view class="more_list" v-for="(item, index) in MTGZlist" :key="index" @click="jumpother(item.id)">
					<view class="list_title">
						<u-icon name="camera" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow5" text="空空如也" mode="history"></u-empty>
			</view>
			<!-- 投诉监督 -->
			<view class="more-item" v-if="current == 6">
				<view class="more_list" v-for="(item, index) in TSJDlist" :key="index" @click="jumpother(item.id)">
					<view class="list_title">
						<u-icon name="warning" size="40" style="margin-right: 10rpx; color: #00919F;"></u-icon>
						<text>{{ item.title }}</text>
					</view>
					<span class="list_time">{{ item.update_time_text }}</span>
				</view>
				<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				<u-empty :show="isShow6" text="空空如也" mode="history"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SZlist: [],
				TSlist: [],
				ZDlist: [],
				YSJSlist: [],
				MTGZlist: [],
				TSJDlist: [],
				YSHJlist: [],
				pageIndex: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				list: [{
					name: '停水降压公告'
				}, {
					name: '水质水压公告'
				}, {
					name: '规章制度'
				}, {
					name: '用水节水'
				}, {
					name: '媒体关注'
				}, {
					name: '投诉监督'
				},{
					name: '优化营商环境'
				}],
				current: 0,
				isShow: false,
				isShow1: false,
				isShow2: false,
				isShow3: false,
				isShow4: false,
				isShow5: false,
				isShow6: false,
				isScroll: false
			}
		},
		onLoad(option) {
			this.getTabsList()
			this.$nextTick(() => {
				this.change(option.type)
			})
		},
		onReachBottom() {
			this.pageIndex++;
			if (this.current == 0) {
				this.getmoreYSHJlist()
			} else if (this.current == 1) {
				this.getMoreNews()
			} else if (this.current == 2) {
				this.getmoreSZlist()
			} else if (this.current == 3) {
				this.getmoreZDlist()
			} else if (this.current == 4) {
				this.getmoreYSJSlist()
			} else if (this.current == 5) {
				this.getmoreMTGZlist()
			} else if (this.current == 6) {
				this.getmoreTSJDlist()
			}
		},
		methods: {
			change(index) {
				this.current = index;
				this.status = 'loading'
				this.pageIndex = 1;
				if (index == 1) {
					this.getTSlist()
				} else if (index == 2) {
					this.getSZlist()
				} else if (index == 3) {
					this.getZDlist()
				} else if (index == 0) {
					this.getYSHJlist()
				} else if (index == 4) {
					this.getYSJSlist()
				} else if (index == 5) {
					this.getMTGZlist()
				}else if (index == 6) {
					this.getTSJDlist()
				}
			},
			// 停水，水质列表项点击跳转
			jumpdetails(id, p) {
				const act = this.current - 1
				uni.navigateTo({
					url: '../notice/index?id=' + id + '&active=' + act + '&cateId=' + p
				})
			},
			// 信息点击
			jumpother(id) {
				uni.navigateTo({
					url: './others?id=' + id
				})
			},
			// 获取tab列表
			async getTabsList() {
				await this.$u.get('/api/app/getCategory?category_id=65').then(res => {
					if (res.length > 3) {
						this.isScroll = true
					}
					this.list = res
				})
			},
			// 获取营商环境
			async getYSHJlist() {
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 35,
					index: 1,
					length: 15
				}).then(res => {
					if (res.length == 0) {
						this.isShow = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.YSHJlist = res.result
				})
			},
			// 获取更多营商环境
			async getmoreYSHJlist() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 35,
					index: this.pageIndex,
					length: 15
				}).then(res => {
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					this.YSHJlist.push(...res.result)
				})
			},
			// 获取水质公告
			async getSZlist() {
				await this.$u.get('/api/app/getYhyshjNoticeList', {
					cid: 6,
					index: 1,
					length: 15
				}).then(res => {
					if (res.length == 0) {
						this.isShow2 = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.SZlist = res.result
				})
			},
			// 加载更多水质公告
			async getmoreSZlist() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNoticeList', {
					cid: 6,
					index: this.pageIndex,
					length: 15
				}).then(res => {
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					this.SZlist.push(...res.result)
				})
			},
			// 获取停水降压列表
			async getTSlist() {
				await this.$u.get('/api/app/getYhyshjNoticeList', {
					cid: 7,
					index: 1,
					length: 15
				}).then(res => {
					if (res.result.length == 0) {
						this.isShow1 = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.TSlist = res.result
				})
			},
			// 加载更多停水降压
			async getMoreNews() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNoticeList', {
					cid: 7,
					index: this.pageIndex,
					length: 15
				}).then(res => {
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					if (res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.TSlist.push(...res.result)
				})
			},
			// 获取规章制度
			async getZDlist() {
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 61,
					index: 1,
					length: 15
				}).then(res => {
					if (res.result.length == 0) {
						this.isShow3 = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.ZDlist = res.result
				})
			},
			// 加载更多规章制度
			async getmoreZDlist() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 61,
					index: this.pageIndex,
					length: 15
				}).then(res => {
					console.log(res)
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					this.ZDlist.push(...res.result) 
				})
			},
			// 获取用水节水
			async getYSJSlist() {
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 31,
					index: 1,
					length: 15
				}).then(res => {

					if (res.result.length == 0) {
						this.isShow4 = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.YSJSlist = res.result
				})
			},
			// 加载更多用水节水
			async getmoreYSJSlist() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 31,
					index: this.pageIndex,
					length: 15
				}).then(res => {
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					this.YSJSlist.push(...res.result)
				})
			},
			// 获取媒体关注
			async getMTGZlist() {
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 62,
					index: 1,
					length: 15
				}).then(res => {
					if (res.result.length == 0) {
						this.isShow5 = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.MTGZlist = res.result
				})
			},
			// 加载更多媒体关注
			async getmoreMTGZlist() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 62,
					index: 1,
					length: 15
				}).then(res => {
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					this.MTGZlist = res.result
				})
			},
			// 获取投诉监督
			async getTSJDlist() {
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 64,
					index: 1,
					length: 15
				}).then(res => {
					if (res.result.length == 0) {
						this.isShow6 = true
					}
					if (res.result.length < 15 && res.result.length > 0) {
						this.status = 'nomore'
					}
					this.TSJDlist = res.result
				})
			},
			// 加载更多投诉监督
			async getmoreTSJDlist() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/app/getYhyshjNewsList', {
					cid: 64,
					index: this.pageIndex,
					length: 15
				}).then(res => {
					if (res.result.length < 15) {
						this.status = 'nomore'
					}
					this.TSJDlist = res.result
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.more {
		width: 100%;
		height: 100%;

		.more-item {
			width: 100%;
			height: 100%;

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
				display: flex;
				justify-content: space-between;
				width: 100%;
				border-bottom: 1px dashed #EEEEEE;
				padding: 30rpx;
				box-sizing: border-box;

				&:last-child {
					// border: 0;
					margin-bottom: 20rpx;
				}

				.intro {
					text {
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
					width: 70%;
					font-size: 32rpx;
					line-height: 40rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.list_time {
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
