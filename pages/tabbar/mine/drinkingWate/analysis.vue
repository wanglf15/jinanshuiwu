<template>
	<view class="container">
		<view class="water-total">
			<view class="total-left">
				<text>本月用水量</text>
				<text>{{ amountMonth }}升</text>
			</view>
			<view class="total-right">
				<text>总用水量</text>
				<text>{{ amountTotal }}升</text>
			</view>
		</view>
		<view class="water-tab">
			<view class="tab-items" :class="current == index ? 'active' : ''" v-for="(item,index) in tabList" :key="index"
			 @click="tabClick(index)">
				<text>{{ item.name }}</text>
			</view>
		</view>
		<view class="average">
			<view class="average-left">
				<text>平均用水量</text>
				<text>{{ amountAverage }}升/{{ current > 1 ? '月' : '天' }}</text>
			</view>
			<view class="average-right">
				<text>合计用水量</text>
				<text>{{ monthTotal }}升</text>
			</view>
		</view>
		<view class="water-colnum-content" v-show="current == 0">
			<view class="column-item" v-for="(item, index) in thismonth" :key="index">
				<text style="width: 120rpx;">{{ item.date }}</text>
				<text class="column" :style="{width: columnWidth*item.amount*(430/Monthcoefficient) + 'rpx'}"></text>
				<text>{{ item.amount }}L</text>
			</view>
		</view>
		<view class="water-colnum-content" v-show="current == 1">
			<view class="column-item" v-for="(item, index) in Lastmonth" :key="index">
				<text style="width: 120rpx;">{{ item.date }}</text>
				<text class="column" :style="{width: columnWidth*item.amount*(430/Monthcoefficient) + 'rpx'}"></text>
				<text>{{ item.amount }}L</text>
			</view>
		</view>
		<view class="water-colnum-content" v-show="current == 2">
			<view class="column-item" v-for="(item, index) in NearlyHrefYear" :key="index">
				<text style="width: 150rpx;">{{ item.date }}</text>
				<text class="column" :style="{width: columnWidth*item.amount*(430/coefficient) + 'rpx'}"></text>
				<text>{{ item.amount }}L</text>
			</view>
		</view>
		<view class="water-colnum-content" v-show="current == 3">
			<view class="column-item" v-for="(item, index) in NearlyYear" :key="index">
				<text style="width: 150rpx;">{{ item.date }}</text>
				<text class="column" :style="{width: columnWidth*item.amount*(430/coefficient) + 'rpx'}"></text>
				<text>{{ item.amount }}L</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				tabList: [{
						name: '本月'
					},
					{
						name: '上月'
					},
					{
						name: '近6月'
					},
					{
						name: '近12月'
					}
				],
				columnWidth: 1,
				Lastmonth: [],
				thismonth: [],
				NearlyHrefYear: [],
				NearlyYear: [],
				amountTotal: "0",
				amountMonth: "0",
				code: "",
				amountAverage: "0",
				monthTotal: "0",
				coefficient: "",
				Monthcoefficient: "",
				isLoading: false
			}
		},
		onLoad(option) {
			this.code = option.code
			this.getAmountQuery(option.code)
			this.getThisMonth(option.code)
		},

		methods: {
			// 获取用水量
			async getAmountQuery(code) {
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/amountQuery', {
					token: info.token,
					code: code
				}).then(res => {
					if(res.code == 1) {
						this.amountMonth = res.data.amountMonth
						this.amountTotal = res.data.amountTotal
					} else {
						uni.showToast({
							title: '数据加载失败',
							icon: 'none'
						})
					}
					
				})
			},
			// 获取本月用水量
			async getThisMonth(code) {
				this.isLoading = true
				this.thismonth = [];
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				let d = date.getDate();
				let dateEnd = y + '-' + m + '-' + d
				let dateStart = y + '-' + m + '-1';
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/amountInfoQuery', {
					token: info.token,
					code: this.code,
					dateStart: dateStart,
					dateEnd: dateEnd,
					standard: 1
				}).then(res => {
					const data = res.data.data
					let maxArr = [];
					data.map((el, index) => {
						data[index].date = el.date.slice(5)
						maxArr.push(el.amount)
					})
					var max = maxArr.sort(function(a,b){
					    return b-a;
					})[0];
					this.Monthcoefficient = max
					this.thismonth = data
					this.monthTotal = res.data.amountTotal
					this.amountAverage = res.data.amountAverage
					this.isLoading = false
				})
			},
			// 获取上月用水量
			async getlastMonth() {
				this.isLoading = true
				this.Lastmonth = []
				var nowdays = new Date();
				var year = nowdays.getFullYear();
				var month = nowdays.getMonth();
				if (month == 0) {
					month = 12;
					year = year - 1;
				}
				if (month < 10) {
					month = '0' + month;
				}
				var myDate = new Date(year, month, 0);
				var startDate = year + '-' + month + '-01'; //上个月第一天
				var endDate = year + '-' + month + '-' + myDate.getDate(); //上个月最后一天
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/amountInfoQuery', {
					token: info.token,
					code: this.code,
					dateStart: startDate,
					dateEnd: endDate,
					standard: 1
				}).then(res => {
					const data = res.data.data
					let maxArr = [];
					data.map((el, index) => {
						data[index].date = el.date.slice(5)
						maxArr.push(el.amount)
					})
					var max = maxArr.sort(function(a,b){
					    return b-a;
					})[0];
					this.Monthcoefficient = max
					this.Lastmonth = data
					this.monthTotal = res.data.amountTotal
					this.amountAverage = res.data.amountAverage
					this.isLoading = false
				})
			},
			// 获取近6月用水量
			async getNearlyHrefYear() {
				this.isLoading = true
				this.NearlyHrefYear = []
				//获取近6个月的时间
				//创建现在的时间
				var data = new Date();
				//获取年
				var year = data.getFullYear();
				//获取月
				var mon = data.getMonth() + 1;
				var d = data.getDate();
				let endDate = year + '-' + mon + '-' + d
				var arry = new Array();
				for (var i = 0; i < 5; i++) {
					mon = mon - 1;
					if (mon <= 0) {
						year = year - 1;
						mon = mon + 12;
					}
					if (mon < 10) {
						mon = "0" + mon;
					}
					arry[i] = year + "-" + mon;
				}
				// console.log(arry[4] + '-01')
				let startDate = arry[4] + '-01'
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/amountInfoQuery', {
					token: info.token,
					code: this.code,
					dateStart: startDate,
					dateEnd: endDate,
					standard: 2
				}).then(res => {
					const data = res.data.data
					let maxArr = [];
					data.map((el, index) => {
						maxArr.push(el.amount)
					})
					var max = maxArr.sort(function(a,b){
					    return b-a;
					})[0];
					this.coefficient = max
					this.NearlyHrefYear = data
					this.monthTotal = res.data.amountTotal
					this.amountAverage = res.data.amountAverage
					this.isLoading = false
				})
			},
			// 获取近12月用水量
			async getNearlyYear() {
				this.isLoading = true
				this.NearlyYear = []
				//获取近6个月的时间
				//创建现在的时间
				var data = new Date();
				//获取年
				var year = data.getFullYear();
				//获取月
				var mon = data.getMonth() + 1;
				var d = data.getDate();
				let endDate = year + '-' + mon + '-' + d
				var arry = new Array();
				for (var i = 0; i < 11; i++) {
					mon = mon - 1;
					if (mon <= 0) {
						year = year - 1;
						mon = mon + 12;
					}
					if (mon < 10) {
						mon = "0" + mon;
					}
					arry[i] = year + "-" + mon;
				}
				let startDate = arry[10] + '-01'
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/amountInfoQuery', {
					token: info.token,
					code: this.code,
					dateStart: startDate,
					dateEnd: endDate,
					standard: 2
				}).then(res => {
					const data = res.data.data
					let maxArr = [];
					data.map((el, index) => {
						maxArr.push(el.amount)
					})
					var max = maxArr.sort(function(a,b){
					    return b-a;
					})[0];
					this.coefficient = max
					this.NearlyYear = data
					this.monthTotal = res.data.amountTotal
					this.amountAverage = res.data.amountAverage
					this.isLoading = false
				})
			},
			
			tabClick(index) {
				if (this.isLoading) return
				this.current = index
				if (index == 0) {
					this.getThisMonth()
				}
				if (index == 1) {
					this.getlastMonth()
				}
				if (index == 2) {
					this.getNearlyHrefYear()
				}
				if (index == 3) {
					this.getNearlyYear()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;

		.water-total {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 40rpx 60rpx;

			.total-right,
			.total-left {
				text-align: center;

				text {
					display: block;
					font-size: 32rpx;

					&:first-child {
						color: #777777;
						margin-bottom: 20rpx;
					}

					&:nth-child(2) {
						// color: #777777;
						font-size: 45rpx;
					}
				}
			}
		}

		.water-tab {
			display: flex;
			justify-content: center;
			width: 100%;
			height: 100rpx;
			border-top: 1px solid #CCCCCC;
			border-bottom: 1px solid #CCCCCC;

			.tab-items {
				height: 100%;
				line-height: 100rpx;
				padding: 0 40rpx;
				font-size: 32rpx;
			}

			.active {
				background-color: #00919F;
				color: #FFFFFF;
			}
		}

		.average {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 30rpx 100rpx;
			border-bottom: 1px solid #CCCCCC;

			.average-right,
			.average-left {
				text-align: center;

				text {
					display: block;
					font-size: 32rpx;

					&:first-child {
						margin-bottom: 10rpx;
					}
				}
			}
		}

		.water-colnum-content {
			width: 100%;
			padding: 30rpx 20rpx 30rpx 50rpx;

			.column-item {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 100%;
				font-size: 32rpx;
				margin-bottom: 30rpx;

				.column {
					width: 300rpx;
					height: 50rpx;
					background-color: #00919F;
					margin-right: 20rpx;
					max-width: 440rpx;
					animation: widthTo 0.5s linear;
				}

				@keyframes widthTo {
					from {
						width: 0px;
					}

					// to {width:100%;}
				}

				text:first-child {
					width: 130rpx;
					// text-align: center;
					// margin-right: 30rpx;
				}
			}
		}

		.qiun-charts-rotate {
			width: 700upx;
			height: 1100upx;
			background-color: #FFFFFF;
			padding: 25upx;
		}

		.charts-rotate {
			width: 700upx;
			height: 1100upx;
			background-color: #FFFFFF;
		}
	}
</style>
