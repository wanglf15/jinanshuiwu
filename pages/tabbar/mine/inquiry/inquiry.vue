<template>
	<view class="container">
		<view class="inquiry">
			<text class="inquiry-title">最近用水量</text>
			<view class="qiun-charts" >
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
			</view>
			<!-- 已缴费 -->
			<view class="inquiry-card" v-for="(item, index) in InquiryList" :key="index" v-if="item.XZBZ">
				<view class="card-top">
					<view class="detail">
						<text>单价：{{ item.DJ }}</text>
						<text>水量：{{ item.SL }}m<sup>3</sup></text>
						<text>止度：{{ item.ZD }}</text>
					</view>
					<view class="money">
						<text>￥{{ item.ZJE }}</text>
					</view>
				</view>
				<view class="card-bottom">
					<view class="times">
						<text style="font-size: 40rpx;">{{ item.SmDate.slice(5) }}</text>
						<text>/{{ item.SmDate.slice(0,4) }}</text>
					</view>
					<view class="AccountPeriod">
						<text>抄表日期：{{ item.R1 }}</text>
					</view>
				</view>
				<view class="Paid">
					<text>已缴费</text>
				</view>
			</view>
			<!-- 未缴费 -->
			<view class="inquiry-card-Paid" v-else>
				<view class="card-top">
					<view class="detail">
						<text>单价：{{ item.DJ }}</text>
						<text>水量：{{ item.SL }}m<sup>3</sup></text>
						<text>止度：{{ item.ZD }}</text>
					</view>
					<view class="money">
						<text>￥{{ item.ZJE }}</text>
						<view class="" style="font-size: 32rpx;" @click="goPay">立即交费</view>
					</view>
				</view>
				<view class="card-bottom">
					<view class="times">
						<text style="font-size: 40rpx;">{{ item.SmDate.slice(5) }}</text>
						<text>/{{ item.SmDate.slice(0,4) }}</text>
					</view>
					<view class="AccountPeriod">
						<text>抄表日期：{{ item.R1 }}</text>
					</view>
				</view>
				<view class="Paid">
					<text>未缴费</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	// var _self;
	let _self;
	let canvaColumn = null;
	
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				InquiryList: [],
				gsh:''
			}
		},
		onLoad(option) {
			this.gsh = option.GS
			this.getInquiryList(option.GS)
			_self = this
			this.cWidth = uni.upx2px(700);
			this.cHeight = uni.upx2px(500);
			// this.getServerData();
		},
		methods: {
			goPay () {
				uni.navigateTo({
					url: '../pay/pay?GS=' + this.gsh
				})
			},
			getInquiryList(GS) {
				const isLogin = uni.getStorageSync('isLogin')
				this.$u.get('/api/gs/billList', {token: isLogin.token, gsh: GS})
				.then(res => {
					const data = res.data
					this.InquiryList = res.data
					let Column = {
						categories: [],
						series: []
					};
					let arr = [];
					arr = data.map((el, index) => {
						Column.categories.push(el.SmDate)
						arr.push(el.SL)
						return arr
					})
					Column.series = [{
						name: '用水量',
						data: arr[0]
					}]
					_self.showColumn("canvasColumn", Column); 
				})
				.catch(err => {
					if (err) {
						uni.showToast({
							title: '数据加载失败',
							icon: 'none'
						})
					}
				})
			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: false
					},
					dataLabel:false,
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
						gridType:'dash',
					},
					yAxis: {
						gridType:'dash',
						dashLength:8,
						splitNumber:5,
						min:0,
						// max:180,
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						lineStyle: 'straight',
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});

			},
			touchColumn(e) {
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.container {
		width: 100%;
		padding: 20rpx 0;
		.inquiry {
			background-color: #FFFFFF;

			.inquiry-title {
				display: block;
				width: 90%;
				height: 80rpx;
				line-height: 80rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				background-color: #EEEEEE;
				font-size: 32rpx;
				margin: 0 auto;
			}

			.qiun-charts {
				width: 100%; 
				height:500rpx;
				background-color: #FFFFFF;
				margin: 0 auto;
				margin-top: 30rpx;
				
				padding: 0 30rpx;
			}
			.charts{width: 100%; height:480rpx;background-color: #FFFFFF;}

			.inquiry-card,
			.inquiry-card-Paid {
				position: relative;
				width: 90%;
				background-color: #55aa7f;
				margin: 0 auto;
				margin-top: 20rpx;
				padding: 20rpx 50rpx;
				box-sizing: border-box;
				color: #FFFFFF;
				border-radius: 10rpx;
				font-size: 32rpx;
				line-height: 50rpx;
				overflow: hidden;
				
				.card-top {
					display: flex;
					justify-content: space-between;
					border-bottom: 1px solid #FFFFFF;
					padding-bottom: 20rpx;

					.detail {
						width: 50%;
						padding-left: 60rpx;

						text {
							display: block;
						}
					}

					.money {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 50%;
						font-size: 50rpx;
					}
				}

				.card-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 80rpx;
				}

				.Paid {
					position: absolute;
					top: 20rpx;
					left: -50rpx;
					width: 200rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					// background-color: ;
					border: 1px solid #FFFFFF;
					// border-radius: 50%;
					font-size: 28rpx;
					color: #00aa00;
					transform: rotate(-45deg);
					background-color: #FFFFFF;
					// padding: 10rpx;
				}
			}

			.inquiry-card-Paid {
				background-color: #ff7f7b;

				.Paid {
					color: #ff0000;
				}
			}
		}
	}
</style>
