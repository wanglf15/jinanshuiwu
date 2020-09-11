<template>
	<view class="container">
		<view class="header_img">
			<u-image width="100%" height="100%" src="../../static/img/img/mobile_bg.jpg" mode="widthFix"></u-image>
		</view>
		<view class="notice">
			<view class="notice_tab">
				<view class="notice_tabItem">
					<text v-for="(item, index) in tabList1" :key="index" class="active">{{ item.title }}</text>
				</view>
				<view class="notice_more">
					<text @click="gomore(0)">更多></text>
				</view>
			</view>
			<view class="notice_content">
				<view class="tingshui">
					<view class="contentItem" v-for="(item,index) in yhhjList" :key="index" @click="openNewsdetail(item.id)">
						<text>{{ item.title }}</text>
						<text>{{ item.update_time_text.slice(5) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 15rpx; background-color: #f4f4f4;"></view>
		<view class="notice">
			<view class="notice_tab">
				<view class="notice_tabItem">
					<text v-for="(item, index) in tabList" :key="index" :class="currentTab == index+1 ? 'active' : null" @click="tabClick(index)">{{ item.title }}</text>
				</view>
				<view class="notice_more">
					<text @click="gomore(currentTab)">更多></text>
				</view>
			</view>
			<view class="notice_content">
				<view class="tingshui" v-if="currentTab == 1">
					<view class="contentItem" v-for="(item,index) in tingshuiList" :key="index" @click="jumpDetail(item.id)">
						<text>{{ item.title }}</text>
						<text>{{ item.update_time_text.slice(5) }}</text>
					</view>
				</view>
				<view class="shuizhi"v-else>
					<view class="contentItem" v-for="(item,index) in SZSYList" :key="index" @click="jumpDetail(item.id,item.category_id)">
						<text>{{ item.title }}</text>
						<text>{{ item.update_time_text.slice(5) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 15rpx; background-color: #f4f4f4;"></view>
		<!-- 规章制度 -->
		<view class="system">
			<view class="system_header">
				<text>规章制度</text>
				<text @click="gomore(3)">更多></text>
			</view>
			<view class="system_body">
				<view class="imgItem">
					<u-image width="100%" height="220rpx" :src="zdsrc"></u-image>
				</view>
				<view class="listContent">
					<view class="list_item" v-for="(item,index) in ZDlist" :key="index" @click="openNewsdetail(item.id)">
						<text>{{ item.title }}</text>
						<text>{{ item.update_time_text.slice(5) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 15rpx; background-color: #f4f4f4;"></view>
		<!-- 用水节水 -->
		<view class="system">
			<view class="system_header">
				<text>用水节水</text>
				<text @click="gomore(4)">更多></text>
			</view>
			<view class="system_body">
				<view class="imgItems">
					<u-image width="100%" height="100%" :src="ysjsSrc"></u-image>
				</view>
				<view class="listContent">
					<view class="list_items" v-for="(item,index) in YSJSlist" :key="index" @click="openNewsdetail(item.id)">
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 15rpx; background-color: #f4f4f4;"></view>
		<!-- 媒体关注 -->
		<view class="system">
			<view class="system_header">
				<text>媒体关注</text>
				<text @click="gomore(5)">更多></text>
			</view>
			<view class="system_body">
				<view class="mediaItem" v-for="(item, index) in MTlist" :key="index" @click="openNewsdetail(item.id)">
					<view class="rightItem">
						<view class="top">
							<text>{{ item.title }}</text>
						</view>
						<text class="createtime">{{ item.update_time_text }}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width: 100%; height: 15rpx; background-color: #f4f4f4;"></view>
		<!-- 投诉监督 -->
		<view class="system">
			<view class="system_header">
				<text>投诉监督</text>
				<text @click="gomore(6)">更多></text>
			</view>
			<view class="banner">
				<u-image :src="TSJDsrc" width="750rpx" height="100%" mode="widthFix"></u-image>
			</view>
			<view class="message">
				<view class="mes-item">
					<text>联系人:</text>
					<u-input v-model="contacts" type="text" :border="true" :clearable="false" placeholder="请输入联系人" />
				</view>
				<view class="mes-item">
					<text>联系电话:</text>
					<u-input v-model="contactNumber" type="number" :border="true" :clearable="false" maxlength="11" placeholder="请输入联系电话"  />
				</view>
				<view class="mes-items">
					<text>问题描述:</text>
					<u-input v-model="des" type="textarea" :border="true" height="150" :clearable="false" maxlength="500" placeholder="请输入问题描述" />
				</view>
				<button type="default" @click="submit">提交</button>
			</view>
			<view class="system_body">
				<view class="superviseItem" v-for="(item, index) in jianduList" :key="index" @click="openNewsdetail(item.id)">
					<view class="superviseItem_title">
						<text>{{ item.title }}</text>
					</view>
					<text class="createtime">{{ item.update_time_text }}</text>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTab: 1,
				tabList: [
					{
						title: "停水降压公告"
					}, 
					{
						title: "水质水压公告"
					}
				],
				tabList1: [
					{
						title: "优化营商环境"
					}
				],
				tingshuiList: [],
				SZSYList: [],
				ZDlist: [],
				zdsrc: "",
				YSJSlist: [],
				ysjsSrc: "",
				MTlist: [],
				jianduList: [],
				TSJDsrc: "",
				yhhjList: [],
				contacts: '',
				contactNumber: '',
				des: ''
			};
		},
		onLoad() {
			this.getAll()
		},
		methods: {
			async getAll() {
				await this.$u.get('/api/app/getYhyshj').then(res => {
					const data = res.data
					this.tingshuiList = data.ts.list
					this.SZSYList = data.szsy.list
					this.ZDlist = data.gzzd.list
					this.zdsrc = this.$Url + data.gzzd.category.image
					this.YSJSlist = data.jsys.list
					this.ysjsSrc = this.$Url + data.jsys.category.image
					data.mtgz.list.map((el,index) => {
						data.mtgz.list[index].wx_img = this.$Url + el.wx_img
					})
					this.MTlist = data.mtgz.list
					this.jianduList = data.tsjd.list
					this.TSJDsrc = this.$Url + data.tsjd.category.image
					this.yhhjList = data.yhhj.list
					
				})
			},
			tabClick(index) {
				this.currentTab = index+1
			},
			// 停水降压/水质公告列表点击跳转
			jumpDetail(id, cateId) {
				const act = this.currentTab - 1
				uni.navigateTo({
					url: '../notice/index?id=' + id + '&active=' + act + '&cateId=' + cateId
				})
			},
			// 跳转详情页
			openNewsdetail(id) {
				uni.navigateTo({
					url: './others?id=' + id
				})
			},
			// 更多
			gomore(index) {
				uni.navigateTo({
					url: './more?type=' + index
				})
			},
			// 提交留言
			async submit () {
				if (!this.contacts) {
					this.$refs.uToast.show({
						title: '请输入联系人',
						type: 'warning',
					})
					return
				}
				if (!this.contactNumber) {
					this.$refs.uToast.show({
						title: '请输入联系电话',
						type: 'warning',
					})
					return
				}
				if (!this.des) {
					this.$refs.uToast.show({
						title: '请输入问题描述',
						type: 'warning',
					})
					return
				}
				await this.$u.post('/api/app/formTsjd', {
					people: this.contacts,
					tel: this.contactNumber,
					notes: this.des
				}).then(res => {
					if (res.code == 1) {
						this.$refs.uToast.show({
							title: res.msg,
							type: 'success'
						})
						this.contacts = ''
						this.contactNumber = ''
						this.des = ''
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.container {
	width: 100%;
	.header_img {
		width: 100%;
	}
	.notice {
		width: 100%;
		.notice_tab {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			font-size: 36rpx;
			padding: 0rpx 30rpx;
			border-bottom: 1px solid #EEEEEE;
			.notice_tabItem {
				display: flex;
				justify-content: space-between;
				text {
					position: relative;
					display: inline-block;
					height: 100rpx;
					line-height: 100rpx;
					font-weight: 700;
					margin-right: 50rpx;
					
				}
				.active {
					color: $mytheme-color;
					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translate(-50%, 0);
						width: 100%;
						height: 6rpx;
						text-align: center;
						background-color: $mytheme-color;
						animation: mymove 0.2s linear;
					}
					@keyframes mymove {
						from {width:0rpx;}
						to {width:100%;}
					}
				}
			}
			.notice_more {
				font-size: 28rpx;
				color: #999999;
			}
		}
		.notice_content {
			width: 100%;
			padding: 20rpx 0;
			.contentItem {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 30rpx;
				font-size: 32rpx;
				text:nth-child(1){
					width: 75%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				text:nth-child(2){
					color: #999999;
				}
			}
		}
	}
	.system {
		width: 100%;
		.system_header {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			font-size: 36rpx;
			border-bottom: 1px solid #EEEEEE;
			text:nth-child(1) {
				position: relative;
				font-weight: 700;
				padding-left: 20rpx;
				&::before {
					content: '';
					position: absolute;
					top: 7rpx;
					left: 0;
					width: 8rpx;
					height: 40rpx;
					background-color: $mytheme-color;
				}
			}
			text:nth-child(2) {
				font-size: 28rpx;
				color: #999999;
			}
		}
		.system_body {
			width: 100%;
			padding: 30rpx;
			.imgItem {
				width: 100%;
				height: 220rpx;
				margin-bottom: 20rpx;
			}
			.imgItems {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 220rpx;
				margin-bottom: 20rpx;
			}
			.listContent {
				width: 100%;
				.list_item, .list_items {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0;
					font-size: 32rpx;
					text:nth-child(1){
						display: block;
						width: 75%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					text:nth-child(2) {
						color: #999999;
					}
				}
				.list_items {
					border-bottom: 1px dashed #EEEEEE;
					text:nth-child(1){
						display: block;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&:last-child{
						border-bottom: 0;
					}
				}
			}
			.mediaItem {
				width: 100%;
				margin-bottom: 30rpx;
				.rightItem {
					width: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					font-size: 32rpx;
					border-bottom: 1px dashed #EEEEEE;
					padding-bottom: 20rpx;
					.top {
						display: -webkit-box;
						/* autoprefixer: ignore next */
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.createtime {
						text-align: right;
						color: #999999;
						margin-top: 15rpx;
					}
				}
			}
			.superviseItem {
				width: 100%;
				border-bottom: 1px dashed #EEEEEE;
				font-size: 32rpx;
				padding: 30rpx 0;
				.superviseItem_title {
					line-height: 50rpx;
					margin-bottom: 20rpx;
					display: -webkit-box;
					/* autoprefixer: ignore next */
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.createtime {
					display: block;
					width: 100%;
					color: #999999;
					text-align: right;
				}
				&:last-child{
					border: 0;
				}
				&:first-child{
					padding-top: 0;
				}
			}
			
		}
		.message {
			width: 100%;
			padding: 30rpx;
			border-bottom: 1px solid #EEEEEE;
			.mes-item {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				text {
					display: block;
					width: 150rpx;
					font-size: 32rpx;
				}
			}
			.mes-items {
				display: flex;
				margin-bottom: 30rpx;
				text {
					display: block;
					width: 150rpx;
					font-size: 32rpx;
					margin-top: 10rpx;
				}
			}
			button {
				// width: 50%;
				height: 80rpx;
				line-height: 80rpx;
				background-color: $mytheme-color;
				color: #FFFFFF;
			}
		}
	}
}
</style>
