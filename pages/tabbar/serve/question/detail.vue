<template>
	<view class="detail">
		<u-navbar
			back-text="返回"
			:is-fixed="true"
			title="详情"
			title-size="36"
			:background="background"
			title-color="#fff"
			back-icon-color="#fff"
			:back-text-style="textColor"
		>
		</u-navbar>
		<view class="container">
			<view class="tou-title">
				<text class="title"> {{ title }}</text>
				<view class="pubtime">
					<text>济南水务APP</text>
					<span>发布时间: {{ pubTime }}</span>
				</view>
			</view>
			<!-- <view class="content" v-html="content"></view>	 -->
			<jyf-parser class="content" :html="content" ref="article" selectable domain="https://tougao.goodclouds.cn" lazy-load></jyf-parser>
		</view>
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
			show: false,
			content: '',
			title: '',
			url: '',
			pubTime: '',
			background: {
				backgroundColor: '#00919f',
			},
			textColor: {
				color: '#fff'
			}
		}
	},
	onLoad(option) {
		if (option.act == 0) {
			this.getContent(option.id)
		} else if(option.act == 1) {
			this.getLaw(option.id)
		} else {
			this.getYWDetail(option.id)
		}
		
	},
	onShow() {
		this.show = false
	},
	methods: {
		// 转发
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
				    href: "http://m.jnwater.com.cn/index.php?s=info&c=mshow&id=" + this.articleId,
				    title: this.title,
				    summary: this.title,
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
				    href: "http://m.jnwater.com.cn/index.php?s=info&c=mshow&id="+ this.articleId, 
				    title: this.title,
				    summary: this.title,
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
			} else if (name == 'qq') {
				// 分享到qq 
				uni.share({
				    provider: "qq",
					scene: "WXSenceTimeline",
				    type: 1,
				    href: "http://m.jnwater.com.cn/index.php?s=info&c=mshow&id=" + this.articleId,
				    title: this.title,
				    summary: this.title,
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
		// 获取常见问题详情
		async getContent (id) {
			await this.$u.get('/api/guide/getwtDetail', { id }).then(res => {
				this.title = res.title
				this.pubTime = res.create_time_text
				this.content = res.content.da
			})
		},
		// 获取法律法规详情
		async getLaw (id) {
			await this.$u.get('/api/guide/getLawDetail', { id }).then(res => {
				this.title = res.title
				this.pubTime = res.create_time_text
				this.content = res.content
			})
		},
		// 获取业务指南详情
		async getYWDetail (id) {
			await this.$u.get('/api/guide/getGuideDetail', { id }).then(res => {
				this.title = res.title
				this.pubTime = res.create_time_text
				this.content = res.content
			})
		}
	}
}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		.tou-title {
			width: 100%;
			border-bottom: 1px solid #EEEEEE;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
			.pubtime {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
				color: #999999;
			}
		}
		.title {
			padding-bottom: 30rpx;
			font-size: 40rpx;
			font-weight: 700;
			text-align: center;
		}
		.content {
			margin-top: 30rpx;
			/deep/ p {
				font-size: 40rpx;
				padding: 0 !important;
				span {
					font-size: 40rpx !important;
				}
			}
		}
	}
</style>
