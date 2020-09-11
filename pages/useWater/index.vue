<template>
	<view class="userWater">
		<view class="container">
			<u-parse :html="content" :selectable="true" loading-img="../../static/img/img/"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
			}
		},
		onLoad() {
			this.getWaterPrice()
		},
		methods: {
			// 获取用水价格详情
			async getWaterPrice() {
				await this.$u.get('/api/app/getDy?keyword=ysjg').then(res => {
					this.content = res.content
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		
		/deep/ p {
			margin-bottom: 20rpx;
			color: #666666;
		}
	}
</style>
