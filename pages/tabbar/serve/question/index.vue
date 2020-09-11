<template>
	<view class="question">
		<u-navbar back-text="返回" :is-fixed="true" :title="title" title-size="36" :background="background" title-color="#fff"
		 back-icon-color="#fff" :back-text-style="textColor"></u-navbar>
		<view class="container">
			<view class="list" v-for="(item, index) in QuestionList" :key="index" @click="jumpdetail(item.id)">
				<text class="tit">• {{ item.title }}</text>
				<!-- <span>{{ item.update_time_text }}</span> -->
			</view>
		</view>
		<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
		<u-empty text="空空如也" mode="data" :show="QuestionList.length == 0" style="margin-top: 200rpx;"></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#00919f',
				},
				textColor: {
					color: '#fff'
				},
				title: '',
				QuestionList: [],
				act: '',
				current: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				pageIndex: 1
			}
		},
		onLoad(option) {
			if (option) {
				this.act = option.act
				if (option.act == 0) {
					this.title = '常见问题'
					this.getQuestionList()
				} else if (option.act == 1) {
					this.title = '法律法规'
					this.getLawList()
				} else if (option.act == 2) {
					this.title = '业务指南'
					this.getBusinessList()
				}
			}
		},
		onReachBottom() {
			this.pageIndex++
			if (this.act == 1) {
				this.getLawList()
			} else if (this.act == 0) {
				this.getQuestionList()
			} else {
				this.getBusinessList()
			}
		},
		methods: {
			// 获取常见问题列表
			async getQuestionList() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/guide/getwtList', {
					index: this.pageIndex,
					length: 15
				}).then(res => {
					const data = res.result
					if (data.length < 15) {
						this.status = 'nomore'
					}
					this.QuestionList.push(...data)
				})
			},
			// 获取法律法规列表
			async getLawList() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/guide/getLawList', {
					index: this.pageIndex,
					length: 15
				}).then(res => {
					const data = res.result
					if (data.length < 15) {
						this.status = 'nomore'
					}
					this.QuestionList.push(...data)
				})
			},
			// 获取业务指南列表
			async getBusinessList() {
				if (this.status == 'nomore') return
				await this.$u.get('/api/guide/getGuideList', {
					index: this.pageIndex,
					length: 15
				}).then(res => {
					const data = res.result
					if (data.length < 15) {
						this.status = 'nomore'
					}
					this.QuestionList.push(...data)
				})
			},
			jumpdetail(id) {
				uni.navigateTo({
					url: './detail?id=' + id + '&act=' + this.act
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

			text {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
