<template>
	<view class="container">
		<view class="title">
			<text style="font-weight: 700; font-size: 36rpx;">{{ title }}</text>
			<view class="pubtime">
				<text>济南水务APP</text>
				<text>{{ pubtime }}</text>
			</view>
		</view>
		<jyf-parser class="content" :html="content" ref="article" selectable domain="https://tougao.goodclouds.cn" lazy-load use-cache></jyf-parser>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
		    jyfParser
		},
		data () {
			return {
				content: null,
				title: null,
				pubtime: null
			}
		},
		onLoad(option) {
			this.getDetail(option.id)
		},
		methods: {
			// 获取详情
			getDetail(id) {
				const isLogin = uni.getStorageSync('isLogin')
				this.$u.get('/api/zys/getYscsDetail?id=' + id + '&token=' + isLogin.token).then(res => {
					this.content = res.content
					this.title = res.title
					this.pubtime = res.create_time_text
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 30rpx 40rpx;
		.title {
			font-size: 32rpx;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #EEEEEE;
			.pubtime {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
				color: #666;
				font-size: 28rpx;
			}
		}
		.content {
			margin-top: 30rpx;
			/deep/ b{
				font-size: 32rpx;
				margin-bottom: 20rpx;
			}
			/deep/ p {
				font-size: 32rpx;
				line-height: 50rpx;
			}
		}
	}
</style>
