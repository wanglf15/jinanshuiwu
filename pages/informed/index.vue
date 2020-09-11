<template>
	<view class="informed">
		<u-sticky>
			<u-tabs :list="list" :is-scroll="true" bg-color="#eee" active-color="#00919f" bar-width="80" font-size="36" :current="current" @change="change"></u-tabs>		
		</u-sticky>
		
		<view class="container" v-if="current == 0">
			<view class="list" v-for="(item, index) in Stopwaterlist" :key="index" @click="jumpdetail(item.id, item.category_id)">
				<text class="tit">• {{ item.title }}</text>
				<span>{{ item.update_time_text }}</span>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" margin-top="20" margin-bottom="20"/>
		</view>
		<view class="container" v-if="current == 1">
			<view class="list" v-for="(item, index) in SZlist" :key="index" @click="jumpdetail(item.id, item.category_id)">
				<text class="tit">• {{ item.title }}</text>
				<span>{{ item.update_time_text }}</span>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" margin-top="20" margin-bottom="20"/>
		</view>
		<view class="container" v-if="current == 2">
			<view class="list" v-for="(item, index) in JournalismList" :key="index" @click="opendetail(item.id, 0)">
				<view class="Journalism_item">
					<view class="Journalism_title">
						<text class="title">{{ item.title }}</text>
					</view>
					<view class="Journalism-pub">
						<text>类型: {{ item.category_name }}</text>
						<view class="">
							<text>状态: </text><text :style="{color: item.status_text == '已结束' ? '#999' : 'red' }">{{ item.status_text }}</text>
						</view>
						
						<text>{{ item.update_time_text }}</text>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" margin-top="20" margin-bottom="20"/>
		</view>
		<view class="container" v-if="current == 3">
			<view class="list" v-for="(item, index) in bidlist" :key="index" @click="opendetail(item.id, 1)">
				<view class="Journalism_item">
					<view class="Journalism_title">
						<text class="title">{{ item.title }}</text>
					</view>
					<view class="Journalism-pub">
						<text>类型: {{ item.category_name }}</text>
						<view class="">
							<text>状态: </text><text :style="{color: item.status_text == '已结束' ? '#999' : 'red' }">{{ item.status_text }}</text>
						</view>
						
						<text>{{ item.update_time_text }}</text>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" margin-top="20" margin-bottom="20"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Stopwaterlist: [],
				JournalismList: [],
				SZlist: [],
				bidlist: [],
				act: '',
				currentPage: 1,
				list: [{
					name: '停水降压'
				}, {
					name: '水质水压'
				}, {
					name: '招采信息'
				},{
					name: '中标公示'
				}],
				current: 0,
				status: 'loading',
				iconType: 'flower',
			}
		},
		onLoad(option) {
			this.current = option.act
			if (option) {
				this.act = option.act
				if (option.act == 0) {
					this.getStopwater()
				} else if (option.act == 1) {
					this.getwaterQulity()
				} else if (option.act == 2) {
					this.getJournalism()
				} else if (option.act == 3) {
					this.getbidlist()
				}
			}
		},
		// 触底
		onReachBottom() {
			this.currentPage++
			if (this.current == 0) {
				this.getmoreStopwater()
			} else if (this.current == 1) {
				this.getmorewaterQulity()
			} else if (this.current == 2) {
				this.getmoreJournalism()
			} else if (this.current == 3) {
				this.getmorebidlist()
			}
		},
		methods: {
			change(index) {
				this.currentPage = 1;
				this.status = 'loading'
				this.current = index;
				if (index == 0) {
					this.getStopwater()
				} else if (index == 1) {
					this.getwaterQulity()
				} else if (index == 2) {
					this.getJournalism()
				} else if (index == 3) {
					this.getbidlist()
				}
			},
			// 获取停水降压列表
			async getStopwater() {
				await this.$u.get('/api/notice/gettsList', {
						index: 1,
						length: '15'
					})
					.then(res => {
						if (res.result.length < 15) {
							this.status = 'nomore'
						}
						this.Stopwaterlist = res.result
					})
			},
			// loadmore停水降压列表
			async getmoreStopwater() {
				if(this.status == 'nomore') return
				await this.$u.get('/api/notice/gettsList', {
						index: this.currentPage,
						length: '15'
					})
					.then(res => {
						if (res.result.length < 15) {
							this.status = 'nomore'
						}
						this.Stopwaterlist.push(...res.result)
					})
			},
			// 获取水质公告
			async getwaterQulity() {
				await this.$u.get('/api/notice/getszList', {
						index: 1,
						length: '15'
					})
					.then(res => {
						if (res.result.length < 15) {
							this.status = 'nomore'
						}
						this.SZlist = res.result
					})
			},
			// loadmore水质公告
			async getmorewaterQulity() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/notice/getszList', {
						index: this.currentPage,
						length: '15'
					})
					.then(res => {
						if (res.result.length < 15) {
							this.status = 'nomore'
						}
						this.SZlist.push(...res.result)
					})
			},
			// 获取招采信息
			async getJournalism() {
				await this.$u.get('/api/news/getMassageList', {
					index: 1,
					length: 8
				}).then(res => {
					if (res.result.length < 8) {
						this.status = 'nomore'
					}
					this.JournalismList = res.result
				})
			},
			// loadmore招采信息
			async getmoreJournalism() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/news/getMassageList', {
					index: this.currentPage,
					length: 8
				}).then(res => {
					if (res.result.length < 8) {
						this.status = 'nomore'
					}
					this.JournalismList.push(...res.result)
				})
			},
			// 获取中标公示列表
			async getbidlist() {
				await this.$u.get('api/news/getZbgsList', {
					index: 1,
					length: 8
				}).then(res => {
					if (res.result.length < 8) {
						this.status = 'nomore'
					}
					this.bidlist = res.result
				})
			},
			// loadmor中标公示
			async getmorebidlist() {
				if(this.status == 'nomore') return
				await this.$u.get('api/news/getZbgsList', {
					index: this.currentPage,
					length: 8
				}).then(res => {
					if (res.result.length < 8) {
						this.status = 'nomore'
					}
					this.bidlist.push(...res.result)
				})
			},
			// 跳转详情页
			jumpdetail(id, cateId) {
				uni.navigateTo({
					url: '../notice/index?active=' + this.current + '&id=' + id + '&cateId=' + cateId
				})
			},
			opendetail (id, index) {
				uni.navigateTo({
					url: '../zhaocaiInfo/index?id=' + id + '&type=' + index
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;

		.list {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			font-size: 32rpx;
			border-bottom: 1px dashed #C0C0C0;

			.tit {
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.Journalism_item {
				width: 100%;
				.Journalism_title {
					display: -webkit-box;
					text-overflow: ellipsis;
					overflow: hidden;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
				}
				.Journalism-pub {
					display: flex;
					justify-content: space-between;
					width: 100%;
					margin-top: 20rpx;
					color: #999999;
				}
			}
		}
	}
</style>
