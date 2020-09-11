<template>
	<view class="content">
		<!-- 用水服务 -->
		<view class="useWater">
			<view class="server_header">
				<image src="../../../static/img/serve/v2_qa7gig.png" mode=""></image>
				<text>用水服务</text>
			</view>
			<view class="server_list">
				<view class="items" v-for="(item, index) in useWaterList" :key="index">
					<block>
					<view @click="pageTo(item.sign, item.is_login)">
						<u-image :src="item.image" width="60" height="60" mode=""></u-image>
						<text>{{ item.title }}</text>
					</view>
					</block>
				</view>
			</view>
		</view>
		<view class="splitLine" style="width: 100%; height: 30rpx; background-color: #f7f7f7;"></view>
		<!-- 业务办理 -->
		<view class="useWater">
			<view class="server_header">
				<image src="../../../static/img/serve/v2_qa7glc.png" mode=""></image>
				<text>业务办理</text>
			</view>
			<view class="server_list">
				<view class="items" @click="business(item.link)" v-for="(item, index) in businessList" :key="index">
					<u-image :src="item.image" width="60" height="60" mode=""></u-image>
					<text>{{ item.title }}</text>
				</view>
			</view>
		</view>
		<view class="splitLine" style="width: 100%; height: 30rpx; background-color: #f7f7f7;"></view>
		<!-- 用水常识 -->
		<view class="useWater">
			<view class="server_header">
				<image src="../../../static/img/serve/changshianniu.png" mode=""></image>
				<text>用水常识</text>
			</view>
			<view class="server_list">
				<view class="items" @click="question(index)" v-for="(item, index) in CommonSenseList" :key="index">
					<u-image :src="item.image" width="60" height="60" mode=""></u-image>
					<text>{{ item.title }}</text>
				</view>
			</view>
		</view>
		<u-modal v-model="show1" show-cancel-button content="您还未登录,请先登录" @confirm="confirmLogin"></u-modal>
		<!-- 无网络提示 -->
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				show1: false,
				useWaterList: [],
				businessList: [],
				CommonSenseList: []
			}
		},
		onLoad() {
			this.getUseWater()
			this.getBusiness()
			this.getCommonSense()
		},
		onPullDownRefresh() {
			this.getUseWater()
			this.getBusiness()
			this.getCommonSense()
			setTimeout(function () {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		methods: {
			// 获取用水服务列表
			async getUseWater () {
				await this.$u.get('/api/app/getysfwList').then(res => {
					res.map((el, index) => {
						res[index].image = this.$Url + el.image
					})
					this.useWaterList = res
				})
			},
			confirmLogin () {
				uni.switchTab({
					url: '../mine/tabbar-5' 
				})
			},
			pageTo (sign, isLog) {
				// console.log(isLog)
				if (!sign) return
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin && isLog == 1) {
					this.show1 = true
					return
				} 
				
				if (sign == 'sfcx') {
					uni.navigateTo({
						url: '../../Watercharg/index'
					})
				}
				if (sign == 'ysjg') {
					uni.navigateTo({
						url: '../../useWater/index'
					})
				}
				if (sign == 'dzfp') {
					uni.navigateTo({
						url: '../../Watercharg/fapiao'
					})
				}
				if (sign == 'tsjytz') {
					uni.navigateTo({
						url: '../../informed/index?act=0'
					})
				}
				if (sign == 'szgg') {
					uni.navigateTo({
						url: '../../informed/index?act=1'
					})
				}
				if (sign == 'yywd') {
					uni.navigateTo({
						url: './yingye/index'
					})
				}
				if (sign == 'zxkf') {
					uni.navigateTo({
						url: '../customer/tabbar-2'
					})
				}
				if (sign == 'jiaofei') {
					uni.navigateTo({
						url: '../mine/payment/payment'
					})
				}
				if (sign == 'chaxun') {
					uni.navigateTo({
						url: '../mine/payment/payment'
					})
				}
				if (sign == 'shuihao') {
					uni.navigateTo({
					url: '../shuihao/shuihao'
					})
				}
				if (sign == 'zysfw') {
					uni.navigateTo({
						url: '../mine/drinkingWate/drinkingWate'
					})
				}
				if (sign == 'xbrx') {
					uni.makePhoneCall({
						phoneNumber: '0531968133'
					});
				}
			},
			// 获取业务办理
			async getBusiness () {
				await this.$u.get('/api/app/getywblList').then(res => {
					res.map((el, index) => {
						res[index].image = this.$Url + el.image
					})
					this.businessList = res
				})
			},
			// 获取用水常识
			async getCommonSense () {
				await this.$u.get('/api/app/getyscsList').then(res => {
					res.map((el, index) => {
						res[index].image = this.$Url + el.image
					})
					this.CommonSenseList = res
				})
			},
			// 业务办理跳转
			business (src) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show1 = true
					return
				}
				uni.navigateTo({
					url: './yewu/index?url=' + src
				})
			},
			// 常见问题
			question (act) {
				uni.navigateTo({
					url: './question/index?act=' + act
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.server {
	background-color: #ececec;
}
.content {
	position: absolute;
	width: 100%;
}
.useWater {
	width: 100%;
	background-color: #fff;
	margin-bottom: 20rpx;
	.server_header {
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		border-bottom: 1px solid #CCCCCC;
		padding-left: 30rpx;
		box-sizing: border-box;
		image {
			width: 50rpx;
			height: 50rpx;
			vertical-align: middle;
			margin-right: 10rpx;
		}
		text {
			font-size: 32rpx;
			vertical-align: middle;
		}
	}
	.server_list {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		// align-items: flex-start;
		width: 100%;
		padding-bottom: 30rpx;
		.items {
			width: 33.3%;
			text-align: center;
			margin-top: 30rpx;
			.iconfont {
				font-size: 60rpx;
				color: #333333;
			}
			.u-image {
				// width: 60rpx;
				// height: 60rpx;
				margin: 0 auto;
			}
			text {
				display: block;
				width: 170rpx;
				font-size: 28rpx;
				margin: 0 auto;
				margin-top: 20rpx;
			}
			a {
				text-decoration: none;
			}
		}
		
	}
}
</style>

