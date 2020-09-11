<template>
	<view class="container">
		<view class="other_header">
			<view class="title">
				<text>{{ title }}</text>
			</view>
			<view class="pubtime">
				<text>济南水务APP</text>
				<text>{{ pubtime }}</text>
			</view>
		</view>
		<view class="other_body">
			<u-parse :html="content" :selectable="true" :show-with-animation="true" autoscroll domain="http://www.jnwater.com.cn"></u-parse>
			<!-- <text v-html="content" selectable=""></text> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				pubtime: "",
				content: ""
			};
		},
		onLoad(option) {
			this.getnewsdetail(option.id)
		},
		methods: {
			async getnewsdetail (id) {
				await this.$u.get('api/app/getNewsById', {id}).then(res => {
					this.title = res.title
					this.pubtime = res.update_time_text
					this.content = res.content
				})
			}
		}
	}
</script>

<style lang="scss">
.container {
	width: 100%;
	.other_header {
		width: 100%;
		padding: 20rpx 30rpx;
		font-size: 32rpx;
		border-bottom: 1px solid #EEEEEE;
		.title {
			font-size: 36rpx;
			font-weight: 700;
		}
		.pubtime {
			display: flex;
			justify-content: space-between;
			color: #999999;
			margin-top: 15rpx;
		}
	}
	.other_body {
		width: 100%;
		padding: 30rpx;
		font-size: 36rpx;
	}
}
</style>
