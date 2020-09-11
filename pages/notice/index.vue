<template>
	<view class="notice">
		
		<view class="notice-container">
			<view class="tou-title">
				<text class="title"> {{ title }}</text>
				<view class="pubtime">
					<text>济南水务APP</text>
					<span>发布时间: {{ pubTime }}</span>
				</view>
			</view>
			<view class="content" v-if="tit == '停水降压通知'">
				<text selectable v-html="content"></text>
			</view>
			<view class="SignUp" v-if="tit == '停水降压通知'">
				<view class="SignUp-name">
					<text>{{ signName }}</text>
					<text>{{ signTime }}</text>
				</view>
			</view>
			<view class="yaliContent" style="padding: 40rpx;" v-if="tit == '水压公告'">
				<u-table>
						<u-tr>
							<u-th>管网测压点名称</u-th>
							<u-th>压力</u-th>
						</u-tr>
						<u-tr v-for="(item, index) in syList" :key="index">
							<u-td>{{ item.name }}</u-td>
							<u-td>{{ item.value }}</u-td>
						</u-tr>
						<u-tr>
							<u-td>加压站平均出厂</u-td>
							<u-td>{{ jyzpjcc }}</u-td>
						</u-tr>
						<u-tr>
							<u-td>管网压力合格率</u-td>
							<u-td>{{ hgl }}</u-td>
						</u-tr>
						<u-tr>
							<u-td>
								<u-tr>{{ remark }}</u-tr>
							</u-td>
						</u-tr>
					</u-table>
			</view>
			<view class="content1" v-if="tit == '水质公告'">
				<view class="advance-area">
					<view class="flex-box tc thead">
						<view class="item-3">检测项目</view>
						<view class="item-3">国家标准(GB5749)</view>
						<view class="item-3">检测结果</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							浑浊度(NTU)
						</view>
						<view class="item-3">
							<view class="table-flex">
								≤1, 特殊情况 ≤3
							</view>
						</view>
						<view class="item-3">
							<view class="table-flex">
								<view class="item"><span>最大值</span><i>{{ hzdMax }}</i></view>
								<view class="item"><span>最小值</span><i>{{ hzdMin }}</i></view>
								<view class="item"><span>平均值</span><i>{{ hzdAvg }}</i></view>
							</view>
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							色度(铂钴色度单位)
						</view>
						<view class="item-3">
							<view class="table-flex">
								≤15
							</view>
						</view>
						<view class="item-3">
							<view class="table-flex">
								<view class="item"><span>最大值</span><i>{{ sdMax }}</i> </view>
								<view class="item"><span>最小值</span><i>{{ sdMin }}</i> </view>
								<view class="item"><span>平均值</span><i>{{ sdAvg }}</i> </view>
							</view>
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							臭和味
						</view>
						<view class="item-3">
							<view class="table-flex">
								无有臭和异味
							</view>
						</view>
						<view class="item-3">
							<view class="table-flex">
								<view class="item"><span>最大值</span><i>{{ chwMax }}</i></view>
								<view class="item"><span>最小值</span><i>{{ chwMin }}</i></view>
								<view class="item"><span>平均值</span><i>{{ chwAvg }}</i></view>
							</view>
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							余氯(mg/L)或二氧化氯(mg/L)
						</view>
						<view class="item-3">
							<view class="table-flex">
								出厂水≥0.3官网末梢水≥0.05(0.02)
							</view>
						</view>
						<view class="item-3">
							<view class="table-flex">
								<view class="item"><span>最大值</span><i>{{ ylMax }}</i></view>
								<view class="item"><span>最小值</span><i>{{ ylMin }}</i></view>
								<view class="item"><span>平均值</span><i>{{ ylAvg }}</i></view>
							</view>
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							菌落总数(CFU/mL)
						</view>
						<view class="item-3">
							<view class="table-flex">
								≤100
							</view>
						</view>
						<view class="item-3">
							<view class="table-flex">
								<view class="item"><span>最大值</span><i>{{ jlzsMax }}</i></view>
								<view class="item"><span>最小值</span><i>{{ jlzsMin }}</i></view>
								<view class="item"><span>平均值</span><i>{{ jlzsAvg }}</i></view>
							</view>
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							总大肠菌群(VFU/100mL)
						</view>
						<view class="item-3">
							<view class="table-flex">
								不得检出
							</view>
						</view>
						<view class="item-3">
							<view class="table-flex">
								<view class="item"><span>最大值</span><i>{{ zdcjqMax }}</i></view>
								<view class="item"><span>最小值</span><i>{{ zdcjqMin }}</i></view>
								<view class="item"><span>平均值</span><i>{{ zdcjqAvg }}</i></view>
							</view>
						</view>
					</view>
				</view>
				<view class="description" style="line-height: 80rpx; font-size: 32rpx;">
					<p><strong>管径1400</strong>：七贤加压站</p>
					<p><strong>管径1200</strong>：济南一中、板桥加压站、辛庄加压站、千佛山公园</p>
					<p><strong>管径800</strong>： 西城供水、龙奥大厦、黄台电厂</p>
					<p><strong>管径700</strong>：省体育学院、历南加压站</p>
					<p><strong>管径600</strong>：解放桥加压站、建设路加压站、佛山苑小区、102路终点站</p>
					<p><strong>管径500</strong>：东源加压站、齐鲁软件学院、龙洞安置房、山大老校、民生大街、济南志友集团、黄河河务局医院、历黄路33号、实验小学、八一游泳馆、铁路南苑小区、济南蔬菜总公司</p>
					<p><strong>管径400</strong>：刘志远加压站、武警总队、新东方花园、市立三院、省政协、建鑫小区、荣军医院、甸柳加压站、太平洋小区、金阁花园</p>
					<p><strong>管径325</strong>：军区第四招待所</p>
					<p><strong>管径315</strong>：明星小区、市立二院</p>
					<p><strong>管径300</strong>：制锦市小学、省环保局、大明湖西南门、商业学院、市立一院、小康人家、山大二附院、交通厅、玉函南区、财政厅宿舍、省委二宿舍、山东标准化馆、齐鲁医院、营市东街亮亮面馆、匡山小区、万盛园小区、济南啤酒厂、科技日报社</p>
					<p><strong>管径200</strong>：中医药大学、山东师范大学、山东工艺美术学院、山东省劳动技术学院、山东女子学院、常春藤小区、齐鲁工业大学、大众广场、甸柳一中、济南五中、田庄建材市场、山东省中医医院、趵突泉公园 管径150：七里山中路、郎茂山小区、金牛公园、济南传染病医院、十亩园小学、山东省立医院、山师东路北口、顺清苑小区</p>
					<p><strong>管径100</strong>：出版大酒店、东仓小区、燕山北区、毕家洼、济南口腔病医院、济南三中、闰千户小区、黄屯小区、市中营业所</p>
				</view>
			</view>
		</view>
		<!-- 底部分享弹窗 -->
		<u-popup v-model="show" mode="bottom" border-radius="20">
			<view class="share-pop">
				<view class="share-item" v-for="(item, index) in shareData" :key="index" @click="share(item.name)">
					<image :src="item.icon" mode=""></image>
					<text>{{ item.text }}</text>
				</view>
			</view>
			<view class="cancle" @click="show = false">
				取消分享
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				shareData: [
					{
						text: '微信',
						icon: '../../static/img/img/wx-icon.png',
						name: 'wx'
					},
					{
						text: '朋友圈',
						icon: '../../static/img/img/wxf-icon.png',
						name: 'wxpyq'
					}
				],
				title: null,
				pubTime: null,
				content: null,
				signName: null,
				signTime: null,
				tit: '',
				tableList: {},
				hzdMax: '',
				hzdMin: '',
				hzdAvg: '',
				sdMax: '',
				sdMin: '',
				sdAvg: '',
				chwMax: '',
				chwMin: '',
				chwAvg: '',
				ylMax: '',
				ylMin: '',
				ylAvg: '',
				jlzsMax: '',
				jlzsMin: '',
				jlzsAvg: '',
				zdcjqMax: '',
				zdcjqMin: '',
				zdcjqAvg: '',
				articleId: '',
				requestUrl: "",
				jyzpjcc: "",
				hgl: "",
				remark: "",
				syList: []
			}
		},
		onLoad(option) {
			this.articleId = option.id
			
			if (option.active == 0) {
				uni.setNavigationBarTitle({
					title: '停水降压通知'
				})
				this.tit = '停水降压通知'
				this.getDetail(option.id)
			} else {
				if (option.cateId && option.cateId == 60) {
					this.tit = '水压公告'
					uni.setNavigationBarTitle({
						title: '水压公告'
					})
					this.requestUrl = '/api/app/gettsNoticeById'
					this.getWaterDetail(option.id)
				} else {
					this.tit = '水质公告'
					uni.setNavigationBarTitle({
						title: '水质公告'
					})
					this.requestUrl = '/api/notice/getszNoticeById'
					this.getWaterDetail(option.id)
				}
				
			}
		},
		methods: {
			// 导航栏按钮点击事件
			onNavigationBarButtonTap(e) {
			    this.show = !this.show
			},
			// 转发
			forward () {
				this.show = true
			},
			// 分享
			share (name) {
				let url;
				if (this.tit == '停水降压通知') {
					url = this.$Url + '/tsdetail/' + this.articleId + '.html'
				} else {
					url = this.$Url + '/szdetail/' + this.articleId + '.html'
				}
				// 分享给朋友
				if (name == 'wx') {
					uni.share({
					    provider: "weixin",
					    scene: "WXSceneSession",
					    type: 0,
					    href: url,
					    title: this.title,
					    summary: this.title,
					    imageUrl: 'https://tougao.goodclouds.cn/uploads/20200724/c6990c644db4232643933f86a49e8a73.png',
					    success: function (res) {
					        uni.showToast({
					        	title: '分享成功'
					        });
					        this.show = false
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				} else if (name == 'wxpyq') {
					// 分享到朋友圈
					uni.share({
					    provider: "weixin",
					    scene: "WXSenceTimeline",
					    type: 0,
					    href: url,
					    title: this.title,
					    summary: this.title,
					    imageUrl: 'https://tougao.goodclouds.cn/uploads/20200724/c6990c644db4232643933f86a49e8a73.png', 
					    success: function (res) {
					       uni.showToast({
					       	  title: '分享成功'
					       });
					       this.show = false
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				} 
			},
			// 获取水质详情
			async getWaterDetail(id) {
				await this.$u.get(this.requestUrl, { id }).then(res => {
					if (res.category_id == 60) {
						this.title = res.title
						this.pubTime = res.action_time_text
						this.syList = res.content.works
						this.remark = res.content.remark
						this.hgl = res.content.hgl
						this.jyzpjcc = res.content.jyzpjcc
					} else {
						this.title = res.title
						this.pubTime = res.action_time_text
						const tableList = JSON.parse(res.content)
						this.hzdMax = tableList.hzd.max
						this.hzdMin = tableList.hzd.min
						this.hzdAvg = tableList.hzd.avg
						this.sdMax = tableList.sd.max
						this.sdMin = tableList.sd.min
						this.sdAvg = tableList.sd.avg
						this.chwMax = tableList.chw.max
						this.chwMin = tableList.chw.min
						this.chwAvg = tableList.chw.avg
						this.ylMax = tableList.yl.max
						this.ylMin = tableList.yl.min
						this.ylAvg = tableList.yl.avg
						this.jlzsMax = tableList.ljzs.max
						this.jlzsMin = tableList.ljzs.min
						this.jlzsAvg = tableList.ljzs.avg
						this.zdcjqMax = tableList.zdcjq.max
						this.zdcjqMin = tableList.zdcjq.min
						this.zdcjqAvg = tableList.zdcjq.avg
					}
				})
			},
			// 获取停水详情
			async getDetail(id) {
				await this.$u.get('/api/notice/gettsNoticeById', { id }).then(res => {
					this.title =res.title
					this.pubTime = res.create_time_text
					var txt = JSON.parse(res.content)
					this.signName = txt.name
					this.signTime = txt.date
					this.content = (txt.content).replace(/。/g, "。<br/><p style='margin-bottom: 10px;'></p>");
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.notice-container {
		position: absolute;
		width: 100%;
		background-color: #FFFFFF;
		.title {
			display: block;
			width: 100%;
			padding-left: 30rpx;
			padding: 40rpx;
			box-sizing: border-box;
			font-size: 36rpx;
			font-weight: 700;
		}

		.pubtime {
			position: relative;
			width: 100%;
			height: 60rpx;
			font-size: 24rpx;
			color: #929090;
			padding: 0 40rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #C0C0C0;

			text:first-child {
				margin-right: 30rpx;
			}
		}

		.content {
			width: 100%;
			padding: 30rpx 40rpx;
			box-sizing: border-box;
			font-size: 32rpx;
			text-indent: 20px;
			line-height: 50rpx;
		}
		.SignUp {
			width: 100%;
			padding: 0 40rpx;
			font-size: 32rpx;
			padding-left: 50%;
			.SignUp-name {
				text-align: right;
				text {
					display: block;
					margin-bottom: 20rpx;
				}
			}
		}
	}

	.content1 {
		display: flex;
		flex: 1;
		flex-direction: column;
		// text-indent: 0;
		padding: 30rpx 20rpx;
	}

	.flex-box {
		display: flex;
		flex-wrap: wrap;
	}

	.flex-box>.item-3 {
		flex: 35%;
	}

	.flex-box>.item-3:first-child {
		flex: 30%;
	}

	.flex-box>.item-3:nth-child(2) {
		flex: 20%;
	}

	.advance-area {
		.item-3 {
			font-size: 28upx;
			border: 1upx solid #e0e0e0;
			border-width: 1upx 1upx 0 0;
			box-sizing: border-box;

			&:first-child {
				border-left-width: 1upx;

			}

			&:last-child {
				border-right-width: 1upx;
			}
		}

		.thead {
			.item-3 {
				font-weight: bold;
				padding: 16upx 0;
				box-sizing: border-box;
				background-color: #f5f6f8;
				text-align: center;

				&:first-child {
					padding-top: 35rpx;
				}

				&:last-child {
					padding-top: 35rpx;
				}
			}
		}

		.table {
			&:last-child {
				border-bottom: 1upx solid #e0e0e0;
			}

			.item-3 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				text-align: center;

				&:first-child {
					padding: 0 20rpx;
				}

				&:nth-child(2) {
					padding: 0 10rpx;
					// flex: 20%;
				}

				&:last-child {
					text-align: left;
					// padding-left: ;
				}
			}
		}

		.table-flex {
			flex: 1;

			.item {
				border-bottom: 1upx solid #e0e0e0;
				height: 60rpx;
				box-sizing: border-box;

				&:last-child {
					border-width: 0;
				}

				span {
					display: inline-block;
					height: 60rpx;
					line-height: 60rpx;
					padding: 0 10rpx;
					border-right: 1px solid #f5f4f4;
				}

				i {
					display: inline-block;
					width: 60%;
					font-style: normal;
					text-align: center;
				}
			}
		}
	}
</style>
