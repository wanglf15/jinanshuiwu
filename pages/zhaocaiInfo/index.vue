<template>
	<view class="zhaocaiInfo">
		<view class="zhaocai-title">
			<text>{{ title }}</text>
			<view class="zhaocai-views">
				<span>济南水务APP</span>
				<view>
					<u-icon name="eye-fill" size="40"></u-icon><span>{{ views }}</span>
				</view>
			</view>
		</view>
		<view class="zhaocai-content">
			<!-- <text selectable v-html="content"></text> -->
			<jyf-parser :html="content" ref="article" autoscroll selectable></jyf-parser>
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
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
		    jyfParser
		},
		data() {
			return {
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
				show: false,
				title: null,
				content: null,
				views: null,
				id: '',
				cateId: '',
				shareUrl: null,
				profile: null
			}
		},
		onShow() {
			this.show = false
		},
		onLoad(option) {
			this.id = option.id
			let requestUrl;
			if (option.type == 0) {
				requestUrl = '/api/news/getMassageDetail';
			} else {
				requestUrl = 'api/news/getZbgsDetail';
			}
			this.getzhaocaiDetail(option.id, requestUrl)
			this.addViews(option.id)
		},
		methods: {
			// 导航栏按钮点击事件
			onNavigationBarButtonTap(e) {
			    this.show = !this.show
			},
			forward () {
				this.show = true
			},
			// 微信分享
			share (name) {
				// 分享给朋友 
				if (name == 'wx') {
					uni.share({
					    provider: "weixin",
					    scene: "WXSceneSession",
					    type: 0,
					    href: this.$Url + "/guide/" + this.id + '/' + this.cateId +'.html',
					    title: this.title,
					    summary: this.profile,
					    imageUrl: this.shareUrl,
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
					    href: this.$Url + "/guide/" + this.id + '/' + this.cateId +'.html',
					    title: this.title,
					    summary: this.profile,
					    imageUrl: this.shareUrl,
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
			// 浏览统计
			async addViews (id) {
				await this.$u.get('/api/app/incviews', { id: id, type: 'imagetext' }).then(res => {})
			},
			async getzhaocaiDetail (id, url) {
				await this.$u.get(url, { id }).then(res => {
					const data = res
					this.title = data.title
					this.content = data.content
					this.views = data.views
					this.cateId = data.category_id
					this.profile = data.profile
					this.shareUrl = this.$Url + data.wx_img
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.zhaocaiInfo {
	width: 100%;
	padding: 20rpx 40rpx;
	box-sizing: border-box;
	max-width: 100%;
	.zhaocai-title {
		width: 100%;
		border-bottom: 1px solid #EEEEEE;
		
		text {
			font-size: 40rpx;
			font-weight: 700;
		}
		.zhaocai-views {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 40rpx 0 0rpx;
			color: #666666;
			padding-bottom: 20rpx;
			.u-icon {
				margin-right: 10rpx;
			}
		}
	}
	.zhaocai-content {
		padding-top: 20rpx;
		/deep/ h1 {
			font-size: 36rpx !important;
		}
		/deep/ h2 {
			font-size: 36rpx !important;
			margin: 0 !important;
		}
		/deep/ p {
			padding: 0 !important;
			margin: 0 !important;
		}
		/deep/ table { border-collapse: collapse; padding: 0;}
	}	
}




</style>
