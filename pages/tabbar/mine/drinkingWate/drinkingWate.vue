<template>
	<view>
		<u-swiper :list="swiperlist" name="img" mode="dot" height="450" border-radius="0" @click="handlerClick"></u-swiper>
		<view class="induction">
			<view class="in-item" @click="gobrand('ppwh')">
				<image src="../../../../static/img/zhiyinshui/pinpaiwenhuaBrandculture.png" mode=""></image>
				<text>品牌文化</text>
			</view>
			<view class="in-item" @click="gobrand('jsgy')">
				<image src="../../../../static/img/zhiyinshui/process.png" mode=""></image>
				<text>净水工艺</text>
			</view>
			<view class="in-item" @click="commonSense">
				<image src="../../../../static/img/zhiyinshui/changshi.png" mode=""></image>
				<text>用水常识</text>
			</view>
		</view>
		<view class="serve-card">
			<view class="card-title">
				<text>管道式直饮水服务卡</text>
			</view>
			<view class="card-content">
				<text style="display: block; padding: 20rpx 40rpx; font-size: 32rpx;">直饮水给水号</text>
				<view class="select-num" @click="selectShow">
					<text style="font-size: 40rpx; vertical-align: middle; font-weight: 700;">{{ value }}</text>
					<u-icon name="arrow-down-fill"></u-icon>
				</view>
				<u-select v-model="show" :list="lists" value-name="code" label-name="code" @confirm="selectVal"></u-select>
				<view class="tel">
					<text>联系电话: {{ contextNum }}</text>
				</view>
				<view class="adress">
					<text>用水地址: {{ address }}</text>
				</view>
			</view>
		</view>
		<view class="induction">
			<view class="in-items" @click="reCharge">
				<image src="../../../../static/img/zhiyinshui/chongzhi.png" mode=""></image>
				<text>预存存值</text>
			</view>
			<view class="in-items" @click="record">
				<image src="../../../../static/img/zhiyinshui/chongzhijilu.png" mode=""></image>
				<text>充值记录</text>
			</view>
			<view class="in-items" @click="analysis">
				<image src="../../../../static/img/zhiyinshui/shuiliangjiance.png" mode=""></image>
				<text>水量分析</text>
			</view>
			<view class="in-items" @click="publicitys">
				<image src="../../../../static/img/zhiyinshui/gongshi.png" mode=""></image>
				<text>水质公示</text>
			</view>
			<view class="in-items" @click="setting">
				<image src="../../../../static/img/zhiyinshui/guanli.png" mode=""></image>
				<text>水号管理</text>
			</view>
			<view class="in-items">
				<image src="../../../../static/img/zhiyinshui/dianzifapiao.png" mode=""></image>
				<text>电子发票</text>
			</view>
		</view>
		<!-- 终端式直饮水 -->
		<view class="terminal">
			<view class="terminal-title">
				<image src="../../../../static/img/img/shui2.png" mode=""></image>
				<text>终端式直饮水服务</text>
			</view>
			<view class="terminal-content">
				<view class="terminal-item">
					<image src="../../../../static/img/zhiyinshui/saoma.png" mode=""></image>
					<text>无卡扫码取水</text>
				</view>
				<view class="terminal-item">
					<image src="../../../../static/img/zhiyinshui/yucunqia.png" mode=""></image>
					<text>预存卡存值</text>
				</view>
				<view class="terminal-item">
					<image src="../../../../static/img/zhiyinshui/chongzhijilu.png" mode=""></image>
					<text>充值记录</text>
				</view>
			</view>
			<view class="terminal-content" style="border-top: 1px solid #EEEEEE; padding-top: 50rpx;">
				<view class="terminal-item">
					<image src="../../../../static/img/zhiyinshui/jilu.png" mode=""></image>
					<text>取水记录</text>
				</view>
				<view class="terminal-item">
					<image src="../../../../static/img/zhiyinshui/zhanghuguanli.png" mode=""></image>
					<text>水卡账户管理</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperlist: [],
				lists: [],
				show: false,
				value: "",
				contextNum: "未绑定",
				address: "未绑定"
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getbindNum()
		},
		onShow() {
			uni.$on('update', (data) => {
			    this.getbindNum()
			})
		},
		methods: {
			// 获取轮播
			async getSwiperList() {
				const isLogin = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/getActivityList?position=top&token=' + isLogin.token).then(res => {
					res.map((el,index) => {
						res[index].img = this.$Url + el.img
					})
					this.swiperlist = res
				})
			},
			// 获取绑定水号列表
			async getbindNum () {
				const isLogin = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/bindListBasic',{
					index: 1,
					length: 12,
					token: isLogin.token
				}).then(res => {
					const data = res.data
					if (!data[0]) {
						this.value = "您还没有绑定直饮水号"
						this.contextNum = '未绑定'
						this.address = '未绑定'
						return
					}
					this.value = data[0].code
					this.contextNum = data[0].phone
					this.address = data[0].address
					this.lists = data
				})
			},
			// 轮播点击
			handlerClick(e) {
				// uni.navigateTo({
				// 	url: '../../../news/index?id=' + this.swiperlist[e].id
				// })
				
			},
			// 品牌文化/净水工艺
			gobrand(type) {
				uni.navigateTo({
					url: './brand?type=' + type
				})
			},
			// 用水常识
			commonSense() {
				uni.navigateTo({
					url: './commonSense'
				})
			},
			selectShow() {
				if (this.value === "您还没有绑定直饮水号") {
					uni.showToast({
						title: '您还没有绑定直饮水号',
						icon: 'none'
					})
					return
				}
				this.show = true
			},
			// 水号选择
			selectVal(e) {
				this.value = e[0].value
				const info = uni.getStorageSync('isLogin')
				this.$u.get('/api/zys/getCodeInfo', {
					token: info.token,
					code: e[0].value,
					type: 'basic'
				}).then(res => {
					this.contextNum = res.data.phone
					this.address = res.data.address
					// this.lists = data
				})
			},
			// 预存充值
			reCharge() {
				if (this.value === "您还没有绑定直饮水号") {
					uni.showModal({
					    title: '提示',
					    content: '您还没有绑定直饮水号,是否前往绑定？',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url: 'myNumber'
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				uni.navigateTo({
					url: '../../../Recharge/Recharge?code=' + this.value
				})
			},
			// 水号管理
			setting() {
				uni.navigateTo({
					url: './myNumber'
				})
			},
			// 水质公示
			publicitys () {
				if (this.value === "您还没有绑定直饮水号") {
					uni.showModal({
					    title: '提示',
					    content: '您还没有绑定直饮水号,是否前往绑定？',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url: 'myNumber'
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				uni.navigateTo({
					url: './publicity'
				})
			},
			// 水量分析
			analysis () {
				if (this.value === "您还没有绑定直饮水号") {
					uni.showModal({
					    title: '提示',
					    content: '您还没有绑定直饮水号,是否前往绑定？',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url: 'myNumber'
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				uni.navigateTo({
					url: './analysis?code=' + this.value
				})
			},
			// 充值记录
			record () {
				if (this.value === "您还没有绑定直饮水号") {
					uni.showModal({
					    title: '提示',
					    content: '您还没有绑定直饮水号,是否前往绑定？',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url: 'myNumber'
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				uni.navigateTo({
					url: './record?code=' + this.value
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.induction {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		padding: 40rpx 0;

		.in-items {
			width: 33.3%;
			font-size: 32rpx;
			text-align: center;
			margin-bottom: 60rpx;

			image {
				display: block;
				width: 60rpx;
				height: 60rpx;
				margin: 0 auto;
				margin-bottom: 15rpx;
			}
		}

		.in-item {
			width: 33.3%;
			font-size: 32rpx;
			text-align: center;

			image {
				display: block;
				width: 70rpx;
				height: 70rpx;
				margin: 0 auto;
				margin-bottom: 15rpx;
			}
		}
	}

	.serve-card {
		width: 90%;
		margin: 0 auto;
		box-shadow: 0 0 5px 1px #CCCCCC;
		border-radius: 20rpx;
		padding-bottom: 20rpx;

		.card-title {
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: $mytheme-color;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 20rpx 20rpx 0 0;
		}

		.select-num {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
		}

		.tel,
		.adress {
			padding: 10rpx 40rpx;
			font-size: 32rpx;
			// margin-bottom: 20rpx;
		}
	}

	.terminal {
		width: 100%;

		.terminal-title {
			background-color: $mytheme-color;
			padding: 20rpx 40rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			margin-bottom: 50rpx;

			image {
				width: 50rpx;
				height: 50rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}

			text {
				vertical-align: middle;
			}
		}

		.terminal-content {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			width: 100%;

			.terminal-item {
				width: 33.3%;
				text-align: center;
				margin-bottom: 50rpx;
				font-size: 32rpx;

				image {
					display: block;
					width: 60rpx;
					height: 60rpx;
					margin: 0 auto;
					margin-bottom: 15rpx;
				}
			}
		}

	}
</style>
