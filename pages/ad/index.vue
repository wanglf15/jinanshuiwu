<template>
	<view class="container">
		<view class="ad-content" v-if="is_link">
			<view class="tou-title">
				<text class="title"> {{ title }} </text>
				<view class="pubtime">
					<text>济南水务APP</text>
					<span>发布时间: {{ pubTime }}</span>
					<span class="hits">阅读次数: {{ hits }}</span>
				</view> 
			</view>
			<view class="content" v-html="content"></view>
		</view>
		<web-view :webview-styles="webviewStyles" :src="link"></web-view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
				    progress: {
				        color: '#19be6b'
				    }
				},
				title: '',
				pubTime: '',
				hits: '',
				content: '',
				link: null,
				is_link: false,
			}
		},
		onLoad(option) {
			if (option.index == 0) {
				this.getFirstAD()
			} else {
				this.getSecondAD()
			}
		},
		methods: {
			// 获取第一广告详情
			async getFirstAD () {
				await this.$u.get('/api/app/getActivityUp').then(res => {
					if (res.is_link == 1) {
						this.link = res.link
					} else {
						this.is_link = true
						this.title = res.content.title
						this.pubTime = res.content.update_time_text
						this.hits = res.content.views
						this.content = JSON.parse(res.content.content).content
					}
				})
			},
			// 获取第二广告详情
			async getSecondAD () {
				await this.$u.get('/api/app/getActivityDown').then(res => {
					if (res.is_link == 1) {
						this.link = res.link
					} else {
						this.is_link = true
						this.title = res.content.title
						this.pubTime = res.content.update_time_text
						this.hits = res.content.views
						this.content = JSON.parse(res.content.content).content
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.ad-content {
		width: 100%;

		.title {
			display: block;
			width: 100%;
			// height: 100rpx;
			padding: 30rpx;
			box-sizing: border-box;
			font-size: 36rpx;
			font-weight: 700;
		}

		.pubtime {
			position: relative;
			width: 100%;
			height: 60rpx;
			font-size: 24rpx;
			color: #929090;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #C0C0C0;

			text:first-child {
				margin-right: 30rpx;
			}

			.hits {
				position: absolute;
				right: 30rpx;
				text-align: right;
			}
		}

		.content {
			margin-top: 30rpx;
			margin-bottom: 20rpx;
			padding: 0 30rpx;

			/deep/ img {
				width: 100%;
			}
		}
	}
</style>
