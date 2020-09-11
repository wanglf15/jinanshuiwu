<template>
	<view class="container">
		<view class="sense" v-for="(item,index) in senseList" :key="index" @click="goDetail(item.id)">
			<view class="title">
				<text>{{ item.title }}</text>
				<text>发布时间： {{ item.create_time_text.slice(0,10) }}</text>
			</view>
			<view class="imgs">
				<u-image :src="item.img" height="140" border-radius="10"></u-image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				senseList: []
			}
		},
		onLoad() {
			this.getsenseList()
		},
		methods: {
			// 获取用水常识列表
			async getsenseList() {
				const isLogin = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/getYscsList', {
					index: 1,
					length: 10,
					token: isLogin.token
				}).then(res => {
					res.result.map((el, index) => {
						res.result[index].img = this.$Url + el.img
					})
					this.senseList = res.result
				})
			},
			// 跳转详情页
			goDetail (id) {
				uni.navigateTo({
					url: './senseDetail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;

		.sense {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 40rpx;
			border-bottom: 1px dashed #EEEEEE;

			.title {
				flex: 2;
				margin-right: 20rpx;
				text {
					display: block;
					font-size: 32rpx;

					&:nth-child(1) {
						display: -webkit-box;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					&:nth-child(2) {
						margin-top: 20rpx;
						color: #CCCCCC;
						font-size: 28rpx;
					}
				}
			}

			.imgs {
				flex: 1;
				width: 300rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
