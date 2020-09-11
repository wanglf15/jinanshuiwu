<template>
	<view class="yingye">
		<u-navbar
			back-text="返回" 
			:is-fixed="true" 
			title="营业网点" 
			title-size="36" 
			:background="background" 
			title-color="#fff" 
			back-icon-color="#fff" 
			:back-text-style="textColor"
		>
		</u-navbar>
		 <view class="container">
		 	<view class="list" v-for="(item, index) in List" :key="index" @click="getDetail(item.id)">
		 		<view class="left-item">
		 			<text>{{ item.title }}</text>
					<span>电话 : {{ item.tel }}</span>
					<span>地址 : {{ item.address }}</span>
		 		</view>
				<view class="right-item">{{ item.category.name }}</view>
		 	</view>
		 </view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				List: [],
				show: false,
				background: {
					backgroundColor: '#00919f',
				},
				textColor: {
					color: '#fff'
				},
			}
		},
		onLoad() {
			
			this.getAll()
		},
		
		methods: {
			// 获取所有站点
			async getAll () {
				await this.$u.get('/api/work/getWorks').then(res => {
					this.List = res
				})
			},
			// 站点详情
			getDetail(id) {
				uni.navigateTo({
					url: './detail?id=' + id,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		position: relative;
		width: 100%;
		background-color: #ececec;
		// margin-top: 70rpx;
		.list {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-bottom: 1px solid #cccccc;
			margin-bottom: 20rpx;
			.left-item {
				flex: 5;
				text {
					display: block;
					font-size: 32rpx;
				}
				span {
					display: block;
					padding-top: 10rpx;
					font-size: 24rpx;
					color: #9e9e9e;
				}
			}
			.right-item {
				flex: 1;
				text-align: right;
				font-size: 32rpx;
			}
		}
		
	}
</style>
