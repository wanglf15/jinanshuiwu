<template>
	<view class="Videotopics">
		<view class="video">
			<video id="myVideo" :src="source" controls="true" autoplay page-gesture="true" object-fit="fill" :poster="poster" style="width: 100%;">
				<source :src="source" type="video/mp4" />
			</video>
		</view>
			<view :class="isAndroid ? 'videoTitle_android' : 'videoTitle'">
				<view class="title">{{ title }}</view>
				<view class="pubtime">
					<text>济南水务APP</text><span>{{ pubTime }}</span>
				</view>
				<view class="operation">
					<view class="read">
						<text>播放</text>{{ views }}
						<u-icon name="eye-fill" size="38"></u-icon>
					</view>
					<view class="fabulous" style="position: relative;">
						<text>点赞</text>
						<text>{{ zan > 9999 ? (((zan - zan%1000)/10000 + 'W')) : (zan) }}</text>
						<u-icon name="thumb-up" size="36" @click="zans()" :class="activeColor ? 'red' : 'defaultColor'" style="z-index: 99;"></u-icon>
						<text :class="isanimate ? 'animate': null" style="position: absolute; top: -10rpx; right: 20rpx; color: #FF0000; opacity: 0;">+1</text>
					</view>
				</view>
			</view>
			<view style="display: block; width: 100%; height: 10rpx; background-color: #EEEEEE;"></view>
			<!-- 简介 -->
			<view class="Newsflash">
				<view class="Newsflash_title">
					<text class="title">简介</text>
				</view>
				<view class="intro">
					<view class="intro-content" v-if="profile">
						{{ profile }}
					</view>
					<view class="no-intro" v-else>
						<text style="color: #666666;">暂无简介</text>
					</view>
				</view>
			</view>
			<!-- 推荐阅读 -->
			<view class="Recommend-reading">
				<view class="Newsflash_title">
					<text class="title">推荐阅读</text>
				</view>
				<view class="Recruitment" style="padding: 0 40rpx;">
					<view class="smallImg" v-for="(item,index) in bestReadList" :key="index" @click="pageToDetail(item.id)">
						<view class="Newsflash-title">
							<text class="list_title">{{ item.title }}</text>
							<span class="list_time">政工部 {{ item.update_time_text }}</span>
						</view>
						<view class="list-img">
							<image ref="imgs" :src="item.img" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 评论 -->
			<view id="comment" class="comment" @click="closeComment">
				<view class="comList">
					<view class="com-title" style="width: 100%; height: 80rpx;">
						精彩评论
					</view>
					<view class="com-item" v-for="(item, index) in commentList" :key="index" style="margin-top: 30rpx;">
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
			<u-mask :show="true" @click="comment = false"></u-mask>
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
		<u-modal v-model="show1" show-cancel-button content="您还未登录,请先登录" @confirm="confirmLogin"></u-modal>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#00919f',
				},
				textColor: {
					color: '#fff'
				},
				fieldstyle: {
					border: '1px solid #ccc',
					padding: '0 0 0 15rpx',
					height: '70rpx'
				},
				isPlay: true,
				show: false,
				show1: false,
				source: '',
				title: '',
				pubTime: '',
				hits: '',
				comment: false, 
				activeColor: false,
				activeColor1: false,
				num: 0,
				poster: '',
				intro: '',
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
				views: '',
				zan: '',
				id: '',
				bestReadList: [],
				cateId: '',
				type: 'video',
				isAndroid: false,
				profile: null,
				shareUrl: null,
				pageIndex: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				isanimate: false,
				scrollTop: 0
			}
		},
		onLoad(option) {
			this.id = option.id
			this.poster = option.src
			if(option.category) {
				this.type = 'live'
				this.getplayback(option.id)
				this.getVideoComments(option.id, 'live')
			} else {
				this.getVideoDetail(option.id)
				this.getVideoComments(option.id, 'video')
			}
			this.getStatus(option.id)
			this.getfavtatus(option.id)
			this.StatisticView()
			if (uni.getSystemInfoSync().platform === 'android') {
				this.isAndroid = true
			}
		},
		onReachBottom() {
			this.pageIndex++;
			this.getMoreComments(this.id, this.type)
		},
		onShow() {
			this.show = false
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			inp() {
				this.comment = true
			},
			pageToDetail(id) {
				uni.redirectTo({
					url: '../Videotopics/index?id=' + id
				})
			},
			// 统计浏览量
			async StatisticView () {
				await this.$u.get('/api/app/incviews', { id: this.id, type: this.type }).then(res => {})
			},
			// 获取回放视频详情
			async getplayback (id) {
				await this.$u.get('/api/live/getLiveDetail', { id }).then(res => {
					const data = res.data
					this.cateId = data.id
					this.source = data.playbackurl
					this.title = data.title
					this.pubTime = data.create_time
					this.views = data.views
					this.zan = data.zan 
					this.intro = data.intro
					this.profile = data.profile
					this.shareUrl = this.$Url + data.wx_img
					this.getBestRead()
				})
			},
			// 获取视频详情
			async getVideoDetail(id) {
				await this.$u.get('/api/video/videoDetail', { id }).then(res => {
					const data = res
					this.cateId = data.category_id
					this.source = data.video
					this.title = data.title
					this.pubTime = data.update_time_text
					this.views = data.views
					this.zan = data.zan
					this.profile = data.profile
					this.shareUrl = this.$Url + data.wx_img
					this.getBestRead()
				})
			},
			// 获取推荐阅读
			async getBestRead () {
				await this.$u.get('/api/app/bestRead', { cid: this.cateId, type: this.type }).then(res => {
					if (res) {
						res.map((el,index) => {
							if (el.img.startsWith('http')) {
								res[index].img = el.img
							} else {
								res[index].img = this.$Url + el.img
							}
						})
						this.bestReadList = res
					}
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
			onNavigationBarButtonTap(e) {
			    this.show = !this.show
			},
			// 分享
			share(name) {
				// 分享给朋友
				let url;
				if (this.type == 'video') {
					url = this.$Url + '/video/' + this.id + '.html';
				} else {
					url = this.$Url + '/live/' + this.id + '.html';
				}
				if (name == 'wx') {
					uni.share({
						provider: "weixin",
						scene: "WXSceneSession",
						type: 0,
						href: url,
						title: this.title,
						summary: this.profile,
						imageUrl: this.shareUrl,
						success: function(res) {
							uni.showToast({
								title: '分享成功'
							});
							this.show = false
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
						href: url,
						title: this.title,
						summary: this.profile,
						imageUrl: this.shareUrl,
						success: function(res) {
							uni.showToast({
								title: '分享成功'
							});
							this.show = false
						},
						fail: function(err) {
							console.log("fail:" + JSON.stringify(err));
						}
					});
				}
			},
			
			// 获取视频评论列表
			async getVideoComments(id, type) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.status = 'nomore'
					return
				}
				await this.$u.get('/api/comment/getComment', {token: isLogin.token, cid: id, type, index: this.pageIndex, length: 10 }).then(res => {
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
			// 加载更多
			async getMoreComments(id, type) {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.status = 'nomore'
					return
				}
				await this.$u.get('/api/comment/getComment', {token: isLogin.token, cid: id, type, index: this.pageIndex, length: 10 }).then(res => {
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
			// 获取视频点赞状态
			async getStatus (id) {
				const isLogin = uni.getStorageSync('isLogin') 
				if (!isLogin) return
				await this.$u.get('/api/like/isLike', { cid: id, token: isLogin.token, type: this.type }).then(res => {
					if(res.code == 1) {
						this.activeColor = true
					} else {
						this.activeColor = false
					}
				})
			},
			// 获取视频收藏状态
			async getfavtatus (id) {
				const isLogin = uni.getStorageSync('isLogin') 
				if (!isLogin) return
				await this.$u.get('//api/collection/isCollection', { token: isLogin.token, cid: id, type: this.type }).then(res => {
					if(res.code == 1) {
						this.activeColor1 = true
					} else {
						this.activeColor1 = false
					}
				})
			},
			confirmLogin () {
				uni.switchTab({
					url: '../tabbar/mine/tabbar-5' 
				})
			},
			// 发送评论
			sendComment() {
				const isLogin = uni.getStorageSync('isLogin') 
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (!this.comments) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				this.$u.get('/api/comment/add?token=' + isLogin.token,
					{
						cid: this.id,
						text: this.comments,
						type: this.type
					}
				).then(res => {
					this.pageIndex = 1
					this.getVideoComments(this.id, this.type)
					this.open()
				})
				this.open()
				this.comments = ''
				this.comment = false
			},
			closeComment() {
				this.comment = false
			},
			
			// 点赞/取消点赞
			zans() {
				const isLogin = uni.getStorageSync('isLogin') 
				if (!isLogin) {
					this.show1 = true
					return
				}
				if (this.activeColor) {
					this.isanimate = false
					this.zan -= 1
					this.activeColor = false
					// 发请求
					this.$u.get('/api/like/remove', { cid: this.id, token: isLogin.token, type: this.type }).then(res => {})
				} else {
					this.zan += 1
					this.isanimate = true
					this.activeColor = true
					// 发请求
					this.$u.get('/api/like/add', { cid: this.id, token: isLogin.token, type: this.type }).then(res => {})
				}
			},
			// 收藏/取消收藏
			fav() {
				const isLogin = uni.getStorageSync('isLogin') 
				if (!isLogin) { 
					this.show1 = true
					return
				}
				if (this.activeColor1) {
					this.activeColor1 = false;
					this.$u.get('/api/collection/remove', { token: isLogin.token, cid: this.id, type: this.type }).then(res => {
						uni.showToast({
							title: '取消收藏成功',
							icon: 'none',
						})
					})
				} else {
					this.activeColor1 = true;
					this.$u.get('//api/collection/add', { token: isLogin.token, cid: this.id, type: this.type }).then(res => {
						uni.showToast({
							title: '收藏成功',
							icon: 'none',
						})
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.Videotopics {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		.video {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 300rpx;
			#myVideo {
				width: 100%;
				// height: 300rpx;
				.uni-video-video {
					width: 100%;
					// height: 300rpx;
				}
			}
		}
		
		.videoTitle {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			margin-top: 420rpx;
			.title {
				font-size: 36rpx;
				font-weight: 700;
				padding: 20rpx 0;
			}
			.pubtime {
				font-size: 28rpx;
				color: #989898;
				text {
					margin-right: 40rpx;
				}

				.hits {
					position: absolute;
					right: 40rpx;
				}
			}
		}
		.videoTitle_android {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			margin-top: 480rpx;
			.title {
				font-size: 36rpx;
				font-weight: 700;
				padding: 20rpx 0;
			}
			.pubtime {
				font-size: 28rpx;
				color: #989898;
				text {
					margin-right: 40rpx;
				}
			
				.hits {
					position: absolute;
					right: 40rpx;
				}
			}
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
			@keyframes mymove
			{
				from {
					top:-10rpx;
					opacity: 1;
					}
				to {top:-30rpx;opacity: 0;}
			}
		}
		.comment {
			padding: 40rpx;
			margin-bottom: 80rpx;
			margin-top: 30rpx;
			font-size: 32rpx;
		}
	}
	.Newsflash_title {
		display: flex;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #fff;
		padding: 0 20rpx;
		box-sizing: border-box;
	
		.title {
			position: relative;
			flex: 1;
			padding-left: 40rpx;
			font-size: 36rpx;
			font-weight: 700;
			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 25rpx;
				transform: translate(-50%, -50%);
				width: 8rpx;
				height: 40rpx;
				background-color: $mytheme-color;
			}
		}
	}
	.intro {
		width: 100%;
		padding: 0 40rpx;
		font-size: 32rpx;
		padding-bottom: 50rpx;
		border-bottom: 1px solid #EEEEEE;
		text {
			display: block;
			text-indent: 40rpx;
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
