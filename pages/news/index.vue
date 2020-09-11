<template>
	<view class="news">
		<view class="news-container">
			<view class="tou-title">
				<text class="title"> {{ title }}</text>
				<view class="pubtime">
					<text>政工部</text><span>{{ pubTime }}</span>
					<span class="hits">
						<u-icon name="eye-fill" size="36"></u-icon>{{ hits }}
					</span>
				</view>
			</view>
			<view class="audioCom" v-if="isAudio">
				<view class="audio-play">
					<image src="../../static/img/img/music.jpg" mode=""></image>
					<u-icon name="play-right-fill" size="45" v-if="isAudioPlay" @click="playAudio"></u-icon>
					<u-icon name="pause" size="45" v-else @click="playAudio"></u-icon>
				</view>
				<view class="audio-name">
					<text>{{ title }}</text>
					<u-slider v-model="value" :max="max" :step="step" :disabled="true" active-color="#00919f"></u-slider>
				</view>
			</view>
			<view>
				<jyf-parser class="content" :html="neirong" :tag-style="style" ref="article" autopause @parse="parseready($event)" selectable domain="https://www.jnwater.com.cn" lazy-load use-cache></jyf-parser>
				<view class="signup">{{ signText }}</view>
			</view>
			<view class="operation">
				<view class="read">
					<text>阅读</text>{{ hits }}
					<u-icon name="eye-fill" size="38"></u-icon>
				</view>
				<view class="fabulous" style="position: relative;">
					<text>点赞</text>
					<text>{{ num > 9999 ? (((num - num%1000)/10000 + 'W')) : (num) }}</text>
					<u-icon name="thumb-up" size="36" @click="zan" :class="activeColor ? 'red' : 'defaultColor'" style="z-index: 99;"></u-icon>
					<text :class="isanimate ? 'animate': null" style="position: absolute; top: -10rpx; right: 20rpx; color: #FF0000; opacity: 0;">+1</text>
				</view>
			</view>
			<view style="display: block; width: 100%; height: 1px; background-color: #f1f1f1; margin-top: 60rpx;"></view>
			<!-- 推荐阅读 -->
			<view class="Recommend-reading">
				<view class="Newsflash_title">
					<text class="title">推荐阅读</text>
				</view>
				<view class="Recruitment">
					<view class="smallImg" v-for="(item,index) in bestReadList" :key="index" @click="pageToDetail(item.id)">
						<view class="Newsflash-title">
							<text class="list_title">{{ item.title }}</text>
							<span class="list_time">政工部 {{ item.update_time_text }}</span>
						</view>
						<view class="list-img">
							<u-image :src="item.img_thumb" width="100%" height="168" mode=""></u-image>
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
						<!-- <u-image width="70rpx" height="70rpx" :src="item.avatar" shape="circle"></u-image> -->
						<image :src="item.avatar" mode="aspectFill" style="width: 70rpx; height: 70rpx; border-radius: 50%; vertical-align: middle;"></image>
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
						<textarea value="" v-model="comments" cursor-spacing="140" placeholder="请输入评论" :focus="comment" style="border: 1px solid #EEEEEE; width: 100%; height: 150rpx; font-size: 32rpx; margin: 0 auto; padding: 10rpx 0 0 20rpx; box-sizing: border-box;"/>
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
			<u-modal v-model="show1" show-cancel-button content="您还未登录,请先登录" @confirm="confirmLogin"></u-modal>
		</view>
		
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	const innerAudioContext = uni.createInnerAudioContext();
	
	export default {
		components: {
		    jyfParser
		},
		data() {
			return {
				value: 0,
				max: 100,
				step: 1,
				fieldstyle: {
					border: '1px solid #ccc',
					padding: '0 0 0 15rpx',
					height: '70rpx'
				},
				isAudioPlay: true,
				isAudio: false,
				audioSrc: '',
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
				num: 0,
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
				pageIndex: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				scrollTop: 0,
				isanimate: false,
				signText: '',
				style: {
					p: 'font-size:36rpx; font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;',
				}
			}
		},
		onLoad(option) {
			this.articleId = option.id
			this.getJournalismDetail(option.id)
			this.getStatus(option.id)
			this.getfavtatus(option.id)
			this.getArticleComments(option.id)
			this.StatisticView()
		},
		onHide() {
			innerAudioContext.stop()
		},
		onBackPress() {
			innerAudioContext.stop()
		},
		onShow() {
			this.show = false
		},
		onReachBottom() {
			this.pageIndex++
			this.getMoreComment(this.articleId)
		},
		onPageScroll(e) {
			// console.log(e)
			this.scrollTop = e.scrollTop
		},
		methods: {
			// 富文本解析完成给视频加封面
			parseready(e) {
				e.map((el,index) => {
					el.children.map((v, k) => {
						if (v.name == 'video') {
							if (v.attrs.poster.indexOf('http') == '-1') {
								v.attrs.poster = this.$Url + v.attrs.poster
							}
						}
					})
				})
			},
			inp() {
				this.comment = true 
			},
			// 导航栏按钮点击事件
			onNavigationBarButtonTap(e) {
			    this.show = !this.show
			},
			// 推荐阅读跳转
			pageToDetail(id) {
				uni.redirectTo({
					url: '../news/index?id=' + id
				})
			},
			// 统计浏览量
			async StatisticView () {
				await this.$u.get('/api/app/incviews', {id: this.articleId, type: 'imagetext'}).then(res => {})
			},
			// 获取企业快讯详情
			async getJournalismDetail(id) {
				await this.$u.get('/api/news/getNewsById', {id}).then(res => {
					// console.log(res)
					if (res.type == 3) {
						this.isAudio = true
						this.audioSrc = this.$Url + res.audio
					}
					this.cateId = res.category_id
					this.title = res.title
					this.hits = res.views
					this.pubTime = res.update_time_text
					this.neirong = res.recontent
					this.num = res.zan
					this.shareUrl = this.$Url + res.wx_img
					this.profile = res.profile
					this.signText = res.content.sign
					this.getBestRead()
				})
			},
			playAudio () {
				this.isAudioPlay = !this.isAudioPlay
				if (innerAudioContext.paused) {
					if (this.audioSrc) {
						innerAudioContext.src = this.audioSrc;
					}
					innerAudioContext.play()
				} else { 
					innerAudioContext.stop()
				}
				innerAudioContext.onTimeUpdate (() => {
					this.step = this.max/innerAudioContext.duration
					this.value = parseInt(innerAudioContext.currentTime * this.step)
				})
				innerAudioContext.onEnded(() => {
					this.value = 0
					this.isAudioPlay = true
				})
			},
			// 滚动到评论区
			open() {
				this.$u.getRect('#comment').then(res => {
					uni.pageScrollTo({
						scrollTop: this.scrollTop + res.top,
						duration: 0
					})
				})
			},
			// 获取推荐阅读
			async getBestRead () {
				await this.$u.get('/api/app/bestRead', { cid: this.cateId, type: 'imagetext' }).then(res => {
					res.map((el,index) => {
						if (res[index].img_thumb.indexOf('http') != '-1') {
							res[index].img_thumb = el.img_thumb
						} else {
							res[index].img_thumb = this.$Url + el.img_thumb
						}
					})
					this.bestReadList = res
				})
			},
			// 获取文章评论列表
			async getArticleComments(id) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.status = 'nomore'
					return
				}
				await this.$u.get('/api/comment/getComment', {token: isLogin.token, cid: id, type: 'imagetext', index: this.pageIndex, length: 10 }).then(res => {
					res.result.map((el, index) => {
						if (res.result[index].avatar.indexOf('http') == 0) {
							res.result[index].avatar = el.avatar
						} else {
							res.result[index].avatar = this.$Url + el.avatar
						}
						
					})
					if (res.result.length == 0) {
						this.status = 'nomore'
						return
					}
					this.commentList = res.result
				})
			},
			async getMoreComment(id) {
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
					})
					return
				}
				// 发请求
				this.$u.get('/api/comment/add?token=' + isLogin.token, 
					{
						cid: this.articleId,
						text: this.comments,
						type: 'imagetext'
					}
				).then(res => {
					this.comment = false
					this.pageIndex = 1
					this.getArticleComments(this.articleId)
					this.open()
				})
				this.comments = ''
				this.comment = false
			},
			closeComment() {
				this.comment = false
			},
			
			// 获取文章点赞状态
			async getStatus (id) {
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
			// 点赞
			async zan() {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (this.activeColor) {
					this.isanimate = false
					this.activeColor = false
					this.num -= 1
					await this.$u.get('/api/like/remove', { cid: this.articleId, token: isLogin.token, type: 'imagetext' }).then(res => {})
				} else {
					this.isanimate = true
					this.activeColor = true
					this.num += 1
					await this.$u.get('/api/like/add', { cid: this.articleId, token: isLogin.token, type: 'imagetext' }).then(res => {})
				}
			},
			// 收藏
			async fav() {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (this.activeColor1) {
					this.activeColor1 = false
					await this.$u.get('/api/collection/remove', { token: isLogin.token, cid: this.articleId, type: 'imagetext' }).then(res => {
						uni.showToast({
							title: '取消收藏成功',
							icon: 'none',
						})
					})
				} else {
					this.activeColor1 = true;
					await this.$u.get('/api/collection/add', { token: isLogin.token, cid: this.articleId, type: 'imagetext' }).then(res => {
						uni.showToast({
							title: '收藏成功',
							icon: 'none',
						})
					})
				}
			},
			// 微信分享
			share(name) {
				console.log(name)
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
	.news-container {
		width: 100%;
		// background-color: #f9f9f9;
		padding: 30rpx;
		.signup{
			font-size: 32rpx;
			margin-bottom: 60rpx;
			text-align: right;
		}
		.title {
			display: block;
			width: 100%;
			font-size: 36rpx;
			margin-bottom: 40rpx;
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
			/deep/ .note-video-clip {
				width: 100%;
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
			.animate {
				animation: mymove 0.5s linear;
			}
		}
		@keyframes mymove
		{
			from {
				top:-10rpx;
				opacity: 1;
				}
			to {top:-30rpx;opacity: 0;}
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
	.audioCom {
		display: flex;
		width: 100%;
		height: 150rpx;
		background-color: #FFFFFF;
		border: 1px solid #EEEEEE;
		border-radius: 10rpx;
		.audio-play {
			position: relative;
			width: 200rpx;
			height: 100%;
			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx 0 0 10rpx;
			}
			.u-icon {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 32rpx;
			}
		}
		.audio-name {
			width: 75%;
			height: 100%;
			padding: 0 30rpx;
			text {
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin: 20rpx 0 40rpx 0;
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
