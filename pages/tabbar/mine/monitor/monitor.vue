<template>
	<view class="container">
		<view class="pickTime">
			<view class="startTime">
				<text>开始时间</text>
				<u-input @click="startTimeshow = true" v-model="startTime" type="select" :border="true" :select-open="startTimeshow" placeholder="请选择开始时间" />
			</view>
			<view class="endTime">
				<text>结束时间</text>
				<u-input @click="endTimeshow = true" v-model="endTime" type="select" :border="true" :select-open="endTimeshow" placeholder="请选择结束时间" />
			</view>
		</view>
		<view class="query">
			<u-button class="custom-style">查询</u-button>
		</view>
		<view class="tabs">
			<view class="tabItem" @click="tabClick(index)" v-for="(item, index) in tabList" :key="index" :class="current === index ? 'active' : ''">
				<text>{{ item.name }}</text>
			</view>
		</view>
		<view class="dayTable">
			<u-table>
				<u-tr>
					<u-th width="20%">抄表时间</u-th>
					<u-th width="80%">用水详情</u-th>
				</u-tr>
				<u-tr v-for="(item, index) in dayTable" :key="index">
					<u-td width="20%">{{ item.time }}</u-td>
					<u-td>
						<u-tr style="height: 80rpx;">
							<u-td>当前止度</u-td>
							<u-td>{{ item.dqzd }}</u-td>
							<u-td>去年同期</u-td>
							<u-td>{{ item.quniantq }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>当前用量</u-td>
							<u-td>{{ item.dqyl }}</u-td>
							<u-td>前年同期</u-td>
							<u-td>{{ item.qntq }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>日最大量</u-td>
							<u-td>{{ item.rzdl }}</u-td>
							<u-td>日最小量</u-td>
							<u-td>{{ item.rzxl }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>平均用量</u-td>
							<u-td>{{ item.pjyl }}</u-td>
							<u-td>日均用量</u-td>
							<u-td>{{ item.rjyl }}</u-td>
						</u-tr>
					</u-td>
				</u-tr>
			</u-table>	
		</view>
		<!-- <view class="dayTable" v-if="current == 1">
			<u-table>
				<u-tr>
					<u-th width="20%">抄表时间</u-th>
					<u-th width="80%">用水详情</u-th>
				</u-tr>
				<u-tr v-for="(item, index) in monthTable" :key="index">
					<u-td width="20%">{{ item.time }}</u-td>
					<u-td>
						<u-tr style="height: 80rpx;">
							<u-td>当前止度</u-td>
							<u-td>{{ item.dqzd }}</u-td>
							<u-td>去年同期</u-td>
							<u-td>{{ item.quniantq }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>当前用量</u-td>
							<u-td>{{ item.dqyl }}</u-td>
							<u-td>前年同期</u-td>
							<u-td>{{ item.qntq }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>日最大量</u-td>
							<u-td>{{ item.rzdl }}</u-td>
							<u-td>日最小量</u-td>
							<u-td>{{ item.rzxl }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>平均用量</u-td>
							<u-td>{{ item.pjyl }}</u-td>
							<u-td>日均用量</u-td>
							<u-td>{{ item.rjyl }}</u-td>
						</u-tr>
					</u-td>
				</u-tr>
			</u-table>	
		</view>
		<view class="dayTable" v-if="current == 2">
			<u-table>
				<u-tr>
					<u-th width="20%">抄表时间</u-th>
					<u-th width="80%">用水详情</u-th>
				</u-tr>
				<u-tr v-for="(item, index) in yearTable" :key="index">
					<u-td width="20%">{{ item.time }}</u-td>
					<u-td>
						<u-tr style="height: 80rpx;">
							<u-td>当前止度</u-td>
							<u-td>{{ item.dqzd }}</u-td>
							<u-td>去年同期</u-td>
							<u-td>{{ item.quniantq }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>当前用量</u-td>
							<u-td>{{ item.dqyl }}</u-td>
							<u-td>前年同期</u-td>
							<u-td>{{ item.qntq }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>日最大量</u-td>
							<u-td>{{ item.rzdl }}</u-td>
							<u-td>日最小量</u-td>
							<u-td>{{ item.rzxl }}</u-td>
						</u-tr>
						<u-tr style="height: 80rpx;">
							<u-td>平均用量</u-td>
							<u-td>{{ item.pjyl }}</u-td>
							<u-td>日均用量</u-td>
							<u-td>{{ item.rjyl }}</u-td>
						</u-tr>
					</u-td>
				</u-tr>
				
			</u-table>	
		</view> -->
		<u-picker v-model="startTimeshow" mode="time" title="选择开始时间" @confirm="confirmStartTime"></u-picker>
		<u-picker v-model="endTimeshow" mode="time" title="选择结束时间" @confirm="confirmEndTime"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				startTimeshow: false,
				endTimeshow: false,
				startTime: '',
				endTime: '',
				current: 0,
				tabList: [
					{
						name: '日汇总'
					},
					{
						name: '月汇总'
					},
					{
						name: '年汇总'
					}
				],
				dayTable: [
					{
						time: '2020-06-03',
						dqzd: 1,
						quniantq: 2,
						dqyl: 3,
						qntq: 4,
						rzdl: 5,
						rzxl: 6,
						pjyl: 7,
						rjyl: 8
					}
				],
				newdayTable: [
					{
						time: '2020-06-03',
						dqzd: 1,
						quniantq: 2,
						dqyl: 3,
						qntq: 4,
						rzdl: 5,
						rzxl: 6,
						pjyl: 7,
						rjyl: 8
					}
				],
				monthTable: [
					{
						time: '2020-06',
						dqzd: 1.01,
						quniantq: 2.01,
						dqyl: 3.01,
						qntq: 4.01,
						rzdl: 5.01,
						rzxl: 6.01,
						pjyl: 7.01,
						rjyl: 8.01
					}
				],
				yearTable: [
					{
						time: '2020',
						dqzd: 1.1,
						quniantq: 2.1,
						dqyl: 3.1,
						qntq: 4.1,
						rzdl: 5.1,
						rzxl: 6.1,
						pjyl: 7.1,
						rjyl: 8.1
					}
				]
			};
		},
		methods: {
			confirmStartTime(e) {
				this.startTime = e.year + '-' + e.month + '-' + e.day
			},
			confirmEndTime (e) {
				this.endTime = e.year + '-' + e.month + '-' + e.day
			},
			tabClick (index) {
				this.current = index
				if (index == 0) {
					this.dayTable = this.newdayTable
				} else if (index == 1) {
					this.dayTable = this.monthTable
				} else {
					this.dayTable = this.yearTable
				}
			}
		}
	}
</script>

<style lang="scss">
.container {
	width: 100%;
	.pickTime {
		display: flex;
		justify-content: flex-start;
		padding: 40rpx;
		font-size: 32rpx;
		.startTime {
			width: 48%;
			margin-right: 40rpx;
		}
		.endTime {
			width: 48%;
		}
		text {
			display: block;
			margin-bottom: 20rpx;
		}
	}
	.query {
		width: 100%;
		padding: 0 40rpx;
		.custom-style {
			font-size: 32rpx;
			background-color: $mytheme-color;
			color: #FFFFFF;
			border: 0;
		}
	}
	.tabs {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		border-top: 1px solid #EEEEEE;
		border-bottom: 1px solid #EEEEEE;
		margin: 40rpx 0;
		height: 100rpx;
		font-size: 32rpx;
		.tabItem {
			position: relative;
			display: block;
			width: 176rpx;
			height: 100%;
			line-height: 100rpx;
			padding: 0 40rpx;
			z-index: 999;
		}
		.active {
			color: #FFFFFF;
		}
		.active::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 176rpx;
			height: 100rpx;
			background-color: $mytheme-color;
			animation: mymove 0.2s linear;
			z-index: -1;
		}
		@keyframes mymove {
			from {width: 0; height: 0}
			to {width: 176rpx; height: 100%}
		}
	}
	.dayTable {
		width: 100%;
		padding: 0 40rpx 40rpx;
		.u-th {
			height: 100rpx;
			// font-size: 32rpx;
		}
		
		.u-td {
			padding: 0 !important;
		}
	}
}
</style>
