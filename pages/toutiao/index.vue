<template>
	<view class="news">
		<view class="toutiao-content">
			<view class="tou-title">
				<text class="title"> {{ title }} </text>
				<view class="pubtime">
					<text>济南水务APP</text>
					<span>发布时间: {{ pubTime }}</span>
					<span class="hits">阅读次数: {{ hits }}</span>
				</view>
			</view>
			<view>
				<text ref="imgs" selectable v-html="neirong" class="content"></text>
			</view>
			<view class="operation">
				<view class="read">
					<text>阅读</text>{{ hits }}
					<u-icon name="eye-fill" size="38"></u-icon>
				</view>
				<view class="fabulous">
					<text>点赞</text>{{ ZanNum > 9999 ? (((ZanNum - ZanNum%1000)/10000 + 'W')) : (ZanNum) }}
					<u-icon name="thumb-up" size="36" @click="zan" :class="activeColor ? 'red' : 'defaultColor'"></u-icon>
				</view>
			</view>
			<view style="display: block; width: 100%; height: 1px; background-color: #f1f1f1; margin-top: 60rpx;"></view>
			<!-- 推荐阅读 -->
			<view class="Recommend-reading">
				<view class="Newsflash_title">
					<text class="title">推荐阅读</text>
				</view>
				<view class="Recruitment">
					<view class="smallImg" v-for="(item, index) in bestReadList" :key="index" @click="pageToDetail(item.id)">
						<view class="Newsflash-title">
							<text class="list_title">{{ item.title }}</text>
							<span class="list_time">政工部 {{ item.update_time_text }}</span>
						</view>
						<view class="list-img">
							<image ref="imgs" :src="item.img_thumb" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 评论 -->
			<view id="comment" class="comment">
				<view class="comList">
					<view class="com-title" style="width: 100%; height: 80rpx;">
						精彩评论
					</view>
					<view class="com-item" v-for="(item, index) in commentList" :key="index" style="margin-top: 30rpx;">
						<image :src="item.avatar" mode="" style="width: 70rpx; height: 70rpx; border-radius: 50%; vertical-align: middle;"></image>
						<view class="combox" style="display: inline-block; margin-left: 30rpx; vertical-align: middle;">
							<text style="font-size: 32rpx;">{{ item.nickname }}</text>
							<text style="display: block; font-size: 24rpx; color: #C8C7CC;">{{ item.create_time }}</text>
						</view>
						<view class="com-content" style="padding-left: 100rpx; box-sizing: border-box; margin-top: 20rpx; width: 100%;  word-wrap:break-word">
							{{ item.text }}
						</view>
					</view>
					<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" style="height: 100rpx;" />
				</view>
			</view>
			<view class="footer">
				<view>
					<button type="default" style="width: 50%; display: inline-block;" @click="inp">发表你的观点</button>
					<view class="edit">
						<u-icon name="star" size="50" :class="activeColor1 ? 'red' : 'dfC'" @click="fav"></u-icon>
						<u-icon name="chat" size="50" color="#ccc" @click="open"></u-icon>
					</view>
				</view>
			</view>
			<view v-show="comment" class="pubComment">
				<u-mask :show="comment" @click="comment = false"></u-mask>
				<view class="comment-input" style="display: flex; justify-content: space-between; padding: 30rpx; color: #999999; font-size: 32rpx;">
					<u-cell-group>
						<textarea v-model="comments" cursor-spacing="140" placeholder="请输入评论" :focus="comment" style="border: 1px solid #EEEEEE; width: 100%; height: 150rpx; font-size: 32rpx; margin: 0 auto; padding: 10rpx 0 0 20rpx; box-sizing: border-box;"/>
					</u-cell-group>
					<text @click="sendComment" style="width: 80rpx; line-height: 150rpx;text-align: center; margin-left: 20rpx;">发布</text>
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
		<u-modal v-model="show1" show-cancel-button content="您还未登录,请先登录" @confirm="confirmLogin"></u-modal>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				fieldstyle: {
					border: '1px solid #ccc',
					padding: '0 0 0 15rpx',
					height: '70rpx'
				},
				show: false,
				show1: false,
				tit: '',
				title: null,
				pubTime: null,
				hits: null,
				neirong: null,
				comment: false,
				activeColor: false,
				activeColor1: false,
				ZanNum: 0,
				commentList: [],
				comments: '',
				shareData: [{
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
				articleId: null,
				shareUrl: null,
				profile: null,
				isPlay: true,
				cateId: '',
				bestReadList: [],
				btm: 0,
				pageIndex: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '我是有底线的'
				}
			}
		},
		onLoad(option) {
			this.articleId = option.id
			this.getJournalismDetail(option.id)
			this.getfavtatus(option.id)
			this.getNewsComment(option.id)
			this.getArticleZan(option.id)
			this.StatisticView()
		},
		onShow() {
			this.show = false
		},
		onReachBottom() {
			this.pageIndex++;
			this.getMoreComment(this.articleId)
		},
		methods: {
			pageToDetail(id) {
				uni.navigateTo({
					url: '../news/index?id=' + id
				})
			},
			// 导航栏按钮点击事件
			onNavigationBarButtonTap(e) {
			    this.show = !this.show
			},
			// 统计浏览量
			async StatisticView () {
				await this.$u.get('/api/app/incviews', { id: this.articleId, type: 'imagetext' }).then(res => {})
			},
			// 获取新闻详情
			async getJournalismDetail(id) {
				await this.$u.get('/api/news/getNewsById', { id }).then(res => {
					this.cateId = res.category_id
					this.title = res.title
					this.hits = res.views
					this.pubTime = res.update_time_text
					this.neirong = res.recontent
					this.ZanNum = res.zan
					this.shareUrl = this.$Url + res.wx_img
					this.profile = res.profile
					this.getBestRead()
				})
			},
			
			// 获取推荐阅读
			async getBestRead () {
				await this.$u.get('/api/app/bestRead', { cid: this.cateId, type: 'imagetext' }).then(res => {
					res.map((el,index) => {
						res[index].img_thumb = this.$Url + el.img_thumb
					})
					this.bestReadList = res
				})
			},
			// 滚动到评论区
			open() {
				let view = uni.createSelectorQuery().in(this).select("#comment");
				view.boundingClientRect(data => {
					console.log(data)
				  uni.pageScrollTo({
				      scrollTop: data.top,
				      duration: 0
				  });
				}).exec();
				
			},
			// 获取新闻评论列表
			async getNewsComment (id) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.status = 'nomore'
					return
				}
				await this.$u.get('/api/comment/getComment', {token: isLogin.token, cid: id, type: 'imagetext', index: this.pageIndex, length: 10 }).then(res => {
					res.result.map((el, index) => {
						res.result[index].avatar = this.$Url + el.avatar
					})
					if (res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.commentList = res.result
				})
			},
			// 加载更多
			async getMoreComment (id) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.status = 'nomore'
					return
				}
				await this.$u.get('/api/comment/getComment', {token: isLogin.token, cid: id, type: 'imagetext', index: this.pageIndex, length: 10 }).then(res => {
					res.result.map((el, index) => {
						res.result[index].avatar = this.$Url + el.avatar
					})
					if (res.result.length < 10) {
						this.status = 'nomore'
					}
					if (res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.commentList.push(...res.result)
				})
			},
			confirmLogin () {
				uni.switchTab({
					url: '../tabbar/mine/tabbar-5'
				})
			},
			// 发表评论
			sendComment() {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (!this.comments) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none',
						position: 'bottom'
					})
					return
				}
				this.$u.post('/api/comment/add?token=' + isLogin.token, 
					{ 	
						cid: this.articleId, 
						text: this.comments, 
						type: 'imagetext',
					},
				).then(res => {
					this.pageIndex = 1;
					this.getNewsComment(this.articleId)
				})
				this.comments = ''
				this.comment = false
			},
			closeComment() {
				this.comment = false
			},
			inp() {
				this.comment = true
			},
			// 获取文章点赞状态
			async getArticleZan (id) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					return
				}
				await this.$u.get('/api/like/isLike', { cid: id, token: isLogin.token, type: 'imagetext' }).then(res => {
					if(res.code == 1) {
						// 已点赞
						this.activeColor = true
					} else {
						// 未点赞
						this.activeColor = false
					}
				})
			},
			// 点赞/取消点赞
			zan() {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (this.activeColor) {
					this.ZanNum -= 1
					this.activeColor = false
					// 发请求
					this.$u.get('/api/like/remove', { cid: this.articleId, token: isLogin.token, type: 'imagetext' }).then(res => {})
				} else {
					this.ZanNum += 1
					this.activeColor = true
					// 发请求
					this.$u.get('/api/like/add', { cid: this.articleId, token: isLogin.token, type: 'imagetext' }).then(res => {})
				}
			},
			// 获取文章收藏状态
			async getfavtatus (id) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					return
				}
				await this.$u.get('/api/collection/isCollection', { token: isLogin.token, cid: id, type: 'imagetext' }).then(res => {
					if(res.code == 1) {
						// 已收藏
						this.activeColor1 = true
					} else {
						// 未收藏
						this.activeColor1 = false
					}
				})
			},
			// 收藏/取消收藏
			fav() {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (this.activeColor1) {
					this.activeColor1 = false
					this.$u.get('/api/collection/remove', { token: isLogin.token, cid: this.articleId, type: 'imagetext' }).then(res => {
						uni.showToast({
							title: '取消收藏成功',
							icon: 'none',
						})
					})
				} else {
					this.activeColor1 = true;
					this.$u.get('//api/collection/add', { token: isLogin.token, cid: this.articleId, type: 'imagetext' }).then(res => {
						uni.showToast({
							title: '收藏成功',
							icon: 'none',
						})
					})
				}
			},
			// 微信分享
			share(name) {
				// 分享给朋友
				if (name == 'wx') {
					uni.share({
						provider: "weixin",
						scene: "WXSceneSession",
						type: 0,
						href: this.$shareUrl + "/newsdetail/" + this.articleId +  ".html",
						title: this.title,
						summary: this.profile,
						imageUrl: this.shareUrl,
						success: function(res) {
							console.log("success:" + JSON.stringify(res));
						},
						fail: function(err) {
							console.log("fail:" + JSON.stringify(err));
						}
					});
				} else if (name == 'wxpyq') {
					// 分享到朋友圈
					uni.share({
						provider: "weixin",
						scene: "WXSenceTimeline",
						type: 0,
						href: this.$shareUrl + "/newsdetail/" + this.articleId +  ".html",
						title: this.title,
						summary: this.profile,
						imageUrl: this.shareUrl,
						success: function(res) {
							console.log("success:" + JSON.stringify(res));
						},
						fail: function(err) {
							console.log("fail:" + JSON.stringify(err));
						}
					});
				} 
			},
		}
	}
</script>

<style lang="scss" scoped>
	.toutiao-content {
		width: 100%;
		// background-color: #f9f9f9;
		padding: 30rpx;
		.tou-title {
			border-bottom: 1px solid #EEEEEE;	
		}
		.title {
			display: block;
			width: 100%;
			font-size: 36rpx;
			margin-bottom: 40rpx;
			font-weight: 700;
		}

		.pubtime {
			position: relative;
			width: 100%;
			height: 60rpx;
			font-size: 28rpx;
			color: #929090;
			box-sizing: border-box;

			text:first-child {
				margin-right: 30rpx;
			}

			.u-icon {
				margin-right: 10rpx;
			}
		}

		.hits {
			position: absolute;
			right: 0rpx;
			text-align: right;
		}

		.content {
			width: 100%;
			padding: 30rpx 0;
			box-sizing: border-box;
			font-size: 32rpx;

			/deep/ img {
				display: inline-block;
				max-width: 100% !important;
			}

			/deep/ span {
				font-size: 36rpx !important;
			}

			/deep/ table {
				border-collapse: collapse;
			}
		}

		.comment {
			// padding: 0 30rpx;
			margin-bottom: 80rpx;
			margin-top: 30rpx;
			font-size: 32rpx;
		}

		.operation {
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin: 30rpx 0;

			.read,
			.fabulous {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 47%;
				height: 66rpx;
				background-color: #F1F1F1;
				border-radius: 10rpx;
				padding: 0 20rpx;
				font-size: 32rpx;
			}
		}
		.Newsflash_title {
			display: flex;
			height: 100rpx;
			line-height: 100rpx;
			// background-color: #fff;
			.title {
				position: relative;
				flex: 1;
				padding-left: 20rpx;
				font-size: 36rpx;
				font-weight: 700;
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 5rpx;
					transform: translate(-50%, 0%);
					width: 8rpx;
					height: 40rpx;
					background-color: $mytheme-color;
				}
			}
		}
	}
	.smallImg {
		display: flex;
		padding: 30rpx 0;
		.Newsflash-title {
			position: relative;
			flex: 2;
			padding-right: 40rpx;
			.list_title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				width: 400rpx;
				font-size: 32rpx;
				line-height: 50rpx;
			}
			.list_time {
				position: absolute;
				bottom: 0;
				display: block;
				color: #999999;
			}
		}
		.list-img {
			flex: 1;
	
			image {
				width: 100%;
				height: 168rpx;
				border-radius: 20rpx;
			}
		}
	}
	.audio {
		width: 100%;
		padding: 30rpx 0;
		.audio-title {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			font-size: 32rpx;
			line-height: 50rpx;
		}
		.audio-time {
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
			span:first-child {
				color: #999999;
			}
			span:last-child {
				color: $mytheme-color;
	
				.u-icon {
					margin-left: 10rpx;
				}
			}
		}
	}
	.pubComment {
		position: fixed;
		bottom: var(--window-bottom,0);
		left: 0;
		width: 100%;
		// height: 100vh;
		// background-color: rgba(0, 0, 0, .5);
		z-index: 999999;
		
		.comment-input {
			width: 100%;
			position: absolute;
			bottom: 0;
			background-color: #FFFFFF;
			z-index: 999999;
		}
	}
</style>
