<template>
	<view class="content">
		<!-- 导航栏 -->
		<view class="bar" style="z-index: order;">
			<u-navbar :is-back="false" :is-fixed="true" height="55" :background="background" title-color="#fff">
				<view class="u-slot-left" @tap="goToLogin">
					<uni-icons type="person" size="23" color="#ffffff"></uni-icons>
					<text>{{ loginText }}</text>
				</view>
				<view class="slot-wrap" v-if="city" @click="refreshWeather">
						<text style="display: block;">{{ city }}</text>
						<text>{{ type }}</text>
						<text>最{{ highWendu }}</text>
				</view>
				<view class="slot-wrap" v-else>
					<text>暂无天气数据</text>
				</view>
			</u-navbar>
		</view>
		<!-- 主体内容 -->
		<refresh ref="refresh" @pullOpen="pullOpen">
			<view class="container">
				<!-- 快捷导航 -->
				<view class="fastNav">
					<view class="fastNav-bg"></view>
					<view class="nav">
						<view class="nav-item" @tap="navTo(item.sign, item.link, item.type, item.is_login)" v-for="(item, index) in fastNavList"
						 :key="index">
							<u-image :src="item.image" width="60" height="60"></u-image>
							<text>{{ item.title }}</text>
						</view>
						<view class="nav-item" @tap="goToPage('../serve/tabbar-1')">
							<span class="iconfont icon-quanbu"></span>
							<text>查看全部</text>
						</view>
					</view>
				</view>
				<!-- 第一广告位 -->
				<view class="firstAd" v-if="isFirstADShow" @click="ADdetail(0)">
					<!-- <image :src="firstADSrc" mode=""></image> -->
					<u-image :src="firstADSrc" height="200" border-radius="20"></u-image>
				</view>
				<!-- 通知 公告 -->
				<view class="notice">
					<view class="m-tabs">
						<view class="tabicons">
							<!-- <image src="../../../static/img/img/gaokaobei.png" mode=""></image> -->
							<text>公 告</text>
						</view>
						<view class="tabs-item" v-for="(item, index) in list2" :key="index" @click="change(index)">
							<text :class="currents === index ? 'active-class' : ''">{{ item.title }}</text>
						</view>
					</view>
					<view class="tabItem" v-if="currents == 0">
						<swiper class="swiper" :style="{height: activeHeight}" current="0">
							<swiper-item v-for="(swiperItem, ind) in Notice" :key="ind" v-if="len > 0">
								<view class="swiper-item" v-for="(item, index) in swiperItem" :key="item.id" @click="jumpDetail(item.id)">
									<span><em>{{ item.title }}</em><i>{{ item.action_time_text }}</i></span>
								</view>
								<view @click="lookMore(0)" class="swiper-item" style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 40rpx;">
									<text style="font-size: 32rpx; color: #999999;">查看更多</text><u-icon name="arrow-right" color="#cccccc" size="28"></u-icon>
								</view>
							</swiper-item>
							<swiper-item v-if="len == 0">
								<view class="swiper-item" style="height: 189rpx; display: flex; flex-direction: column; justify-content: center; font-size: 32rpx; align-items: center; border: 1px solid #EEEEEE; width: 90%; margin: 0 auto; margin-top: 25rpx;">
									<!-- <u-empty text="暂无公告" mode="list" img-width="100"></u-empty> -->
									<text style="margin-bottom: 20rpx;">暂无停水降压公告</text>
									<text>有问题请拨打济南水务热线968133</text>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="tabItem" v-show="currents == 1">
						<view class="water_content" v-if="Len1 > 0">
							<view class="waterItem" v-for="(item, index) in waterQualityList" :key="index" @click="jumpDetail(item.id, item.category_id)">
								<text style="margin-right: 20rpx;">{{ item.update_time_text}}</text><u-tag size="mini" mode="plain" :text="item.category_id == 6 ? '水质' : '水压'" :type="item.category_id == 6 ? 'success' : 'primary'" />
							</view>
							<view class="waterItem seeMore" @click="lookMore(1)">
								<text style="color: #999999;">查看更多</text><u-icon name="arrow-right" color="#999999" size="28"></u-icon>
							</view>
						</view>
						<view class="water_content" v-if="Len1 == 0" style="border: 1px solid #EEEEEE; width: 90%; margin: 0 auto; padding-top: 10rpx;">
							<u-empty text="暂无公告" mode="list" img-width="120"></u-empty>
						</view>
					</view>
					<view class="tabItem" v-if="currents == 2">
						<swiper class="swiper" :style="{height: activeHeight1}" :current="0">
							<swiper-item v-for="(v,k) in RecruitmentList" :key="k">
								<view class="swiper-item" v-for="(Recruititem, Recruitindex) in v" :key="Recruitindex" @click="pageTozhaocai(Recruititem.id)">
									<span><em>{{ Recruititem.title }}</em><i>{{ Recruititem.update_time_text }}</i></span>
								</view>
								<view @click="lookMore(2)" class="swiper-item" style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 40rpx;">
									<text style="font-size: 32rpx; color: #999999;">查看更多</text><u-icon name="arrow-right" color="#999999" size="28"></u-icon>
								</view>
							</swiper-item>
							<swiper-item v-if="len2 == 0">
								<view class="swiper-item" style="border: 1px solid #EEEEEE; width: 90%; margin: 0 auto; padding-top: 15rpx;">
									<u-empty text="空空如也" mode="news" img-width="100"></u-empty>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="splitLine"></view>
				<!-- 轮播 -->
				<!-- <view class="swipers"> -->
				<u-swiper style="margin-top: 35rpx;" :list="swiperList" name="img" id="id" :title="true" :effect3d="true" mode="rect"
				 height="420" border-radius="20" @click="navPageTo"></u-swiper>
				<!-- <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500" indicator-active-color="#ffffff" circular previous-margin="20px" next-margin="20px">
				     <swiper-item v-for="(item, index) in swiperList" :key="index" @click="navPageTo(item.id)">
						 <view class="swiper-item">
							 <image :src="item.img" mode=""></image>
							 <view class="title">{{ item.title }}</view>
						 </view>
				     </swiper-item>
				 </swiper> -->
				<!-- </view> -->
				<view class="splitLine"></view>
				<!-- 企业快讯 -->
				<view class="Newsflash">
					<view class="Newsflash_title">
						<text class="title" @click="changeTab(0)">水务快讯</text>
						<text class="title1" @click="changeTab(1)" v-if="liveNotice">直播预告</text>
						<text class="more" @click="pageTo(0)">更多 ></text>
					</view>
					<view class="Newsflash_list" v-for="(item, index) in newsflashList" :key="index" v-if="WaterAffairs == 0">
						<!-- 小图模式 -->
						<view class="smallImg" v-show="item.type == 0">
							<view class="Newsflash-title">
								<text class="list_title" @click="pageToNewsDetail(item.id)">{{ item.title }}</text>
								<span class="list_time">政工部 {{ item.update_time_text }}</span>
							</view>
							<view class="list-img" @click="pageToNewsDetail(item.id)">
								<u-image ref="imgs" width="210" height="168" border-radius="10" :src="item.img_thumb" mode=""></u-image>
							</view>
						</view>
						<!-- 大图模式 -->
						<view class="bigImg" v-show="item.type == 1">
							<text class="list_title" @click="pageToNewsDetail(item.id)">{{ item.title }}</text>
							<u-image :src="item.img_thumb" width="100%" height="430" border-radius="10" @click="pageToNewsDetail(item.id)"></u-image>
							<view class="list_time">
								<span>政工部 {{ item.update_time_text }}</span>
								<span>济南水务APP</span>
							</view>
						</view>
						<!-- 多图模式 -->
						<view class="moreImg" v-show="item.type == 2">
							<view class="moreImg-title" @click="pageToNewsDetail(item.id)">
								<text>{{ item.title }}</text>
							</view>
							<view class="moreImg-img" @click="pageToNewsDetail(item.id)">
								<u-image :src="ImgItem" width="33.3%" height="168" mode="" v-for="(ImgItem, index) in item.images_arr" :key="index"></u-image>
							</view>
							<view class="moreImg-time">
								<span>政工部 {{ item.update_time_text }}</span>
								<span>济南水务APP</span>
							</view>
						</view>
						<!-- 音频模式 -->
						<view class="audio" v-show="item.type == 3">
							<view class="audio-title" @click="pageToNewsDetail(item.id)">
								<text>{{ item.title }}</text>
							</view>
							<view class="audio-time">
								<span>政工部 {{ item.update_time_text }}</span>
								<span @click="playAudio(item.audio, item.title)" v-if="isPlay">播放<u-icon name="volume-fill" color="#00919f"
									 size="28"></u-icon></span>
								<span @click="playAudio" v-else>暂停<u-icon name="pause" color="#00919f" size="28"></u-icon></span>
							</view>
						</view>
					</view>
					<view class="Announcement" v-if="WaterAffairs == 1">
						<image :src="liveNoticeUrl" mode="aspectFill" @click="goLive()" style="height: 380rpx;"></image>
					</view>
				</view>
				<!-- 第二广告位 -->
				<view class="firstAd" style="margin-top: 30rpx;" v-if="isSecondADShow" @click="ADdetail(1)">
					<!-- <image :src="secondADSrc" mode=""></image> -->
					<u-image :src="secondADSrc" height="200" border-radius="20"></u-image>
				</view>
				<view class="splitLine"></view>
				<!-- 水务直播 -->
				<view class="Newsflash">
					<view class="Newsflash_title">
						<text class="title">水务直播</text>
						<text class="more" @click="getMore">更多 ></text>
					</view>
					<view class="video-list">
						<view class="video-item" v-for="(item, index) in liveList" :key="index" @click="pagetoVideo(item.id, item.image, item.category)">
							<view class="video-img">
								<u-image :src="item.image" width="325" height="230" mode="scaleToFill"></u-image>
								<text class="liveStatus" v-show="item.category == 0">预告</text>
								<text class="liveStatus" v-show="item.category == 1">直播中</text>
								<text class="liveStatus" v-show="item.category == 2">回放</text>
							</view>
							<view class="video-title">
								<text>{{ item.title }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="splitLine"></view>
				<!-- 员工风采 -->
				<view class="Newsflash">
					<view class="Newsflash_title">
						<text class="title">员工风采</text>
						<text class="more" @click="pageTo(1)">更多 ></text>
					</view>
					<view class="video-list">
						<view class="video-item" v-for="(item, index) in staffList" :key="index" @click="pagetoStaff(item.id)">
							<view class="video-img">
								<u-image :src="item.img" width="325" height="230" mode=""></u-image>
							</view>
							<view class="video-title">
								<text>{{ item.title }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 无网络提示 -->
				<u-no-network></u-no-network>
			</view>
		</refresh>
		<u-modal v-model="show" show-cancel-button content="您还未登录,请先登录" @confirm="confirmLogin"></u-modal>
		<!-- 音频播放组件 -->
		<view ref="audios" class="audioPlay" v-if="isShowPlay">
			<u-notice-bar style="width: 75%;" mode="horizontal" :list="audioName" type="none" :speed="100" color="#fff"
			 :volume-icon="false"></u-notice-bar>
			<view class="icon" style="position: absolute; right: 20rpx; top: 30%">
				<u-icon name="play-right-fill" color="#fff" size="34" @click="playAudio" v-if="isPlay"></u-icon>
				<u-icon name="pause" color="#fff" size="34" @click="playAudio" v-else></u-icon>
				<u-icon name="close" color="#fff" size="32" style="margin-left: 50rpx;" @click="closePlay"></u-icon>
			</view>
			<view class="play-progress">
				{{ currentTime }} / {{ totalTime }}
			</view>
		</view>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext();
	import refresh from '@/components/re-fresh/refresh.vue';
	export default {
		components: {
			refresh
		},
		data() {
			return {
				Notice: [],
				currents: 0,
				WaterAffairs: 0,
				background: {
					backgroundColor: '#00919f',
				},
				list2: [{
						title: '停水降压'
					},
					{
						title: '水质水压'
					},
					{
						title: '招采信息'
					}
				],
				show: false,
				noticeList: [],
				noticeList2: [],
				noticeList3: [],
				waterQualityList: [],
				len: '',
				Len1: '',
				Len2: '',
				swiperList: [],
				dotStyle: true,
				towerStart: 0,
				direction: '',
				newsflashList: [],
				activeHeight: '290rpx',
				activeHeight1: '290rpx',
				audioName: [],
				isShowPlay: false,
				isPlay: true,
				fastNavList: [],
				totalTime: '00:00',
				currentTime: '00:00',
				moreImageList: [],
				firstADSrc: '',
				isFirstADShow: false,
				secondADSrc: '',
				isSecondADShow: false,
				liveList: [],
				staffList: [],
				RecruitmentList: [],
				RecruitmentList1: [],
				loginText: '未登录',
				city: '',
				highWendu: '',
				lowWendu: '',
				type: '',
				liveNotice: false,
				liveNoticeUrl: null,
				liveNoticeStatus: null,
				liveId: null,
				flags: false,
				firstADislink: false
			};
		},
		onLoad() {
			this.getFastNav()
			this.getFirstAD()
			this.getNoticeList()
			this.getSwiper()
			this.getNewsflash()
			this.getSecondAD()
			this.getLiveList()
			this.getStaffList()
			this.getRecruitmentList()
			this.getWeather()
			this.getliveNotice()
		},
		onShow() {
			
			try {
				const value = uni.getStorageSync('userInfo');
				const islog = uni.getStorageSync('isLogin');
				if (value || islog) {
					this.isLogin = true
					if (value) {
						this.loginText = value.nickname
					} else {
						this.loginText = this.geTel(islog.mobile)
					}
				} else {
					this.loginText = '未登录'
				}
			} catch (e) {
				// console.log(e)
			}
		},
		onHide() {
			innerAudioContext.stop()
			this.isShowPlay = false
			this.isPlay = true
		},
		methods: {
			moreInfo () {
				uni.navigateTo({
					url: '../../newsflash/index'
				})
			},
			lookMore(act) {
				uni.navigateTo({
					url: '../../informed/index?act=' + act
				})
			},
			refreshWeather () {
				this.getWeather()
			},
			// 获取实时天气
			getWeather() {
				uni.getLocation({
					type: 'wgs84',
					geocode: true, //必写项
					success: (data) => {
						if (data.address) {
							this.city = data.address.city;
							uni.request({
								url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + data.address.city,
								success: (res) => {
									const data = res.data.data
									this.highWendu = data.forecast[0].high
									this.type = data.forecast[0].type
								}
							})
						}
					}
				})
			},
			goLive() {
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin) {
					this.show = true
					return
				}
				if(this.liveNoticeStatus == 0) {
					// uni.showToast({
					// 	title: '直播未开始',
					// 	icon: 'none'
					// })
					uni.navigateTo({
						url: '../../mudulive/index?id=' + this.liveId
					})
					return
				}
				uni.navigateTo({
					url: '../../live/live'
				})
			},
			geTel(tel) {
				var reg = /^(\d{3})\d{4}(\d{4})$/;
				return tel.replace(reg, "$1****$2");
			},
			changeTab(index) {
				this.WaterAffairs = index
			},
			// 下拉刷新
			pullOpen(next) {
				let that = this
				that.fresh()
				setTimeout(function() {
					if (that.flags) {
						next()
					}
				},1000);
			},
			fresh() {
				try{
					this.getNoticeList()
					this.getSwiper()
					this.getNewsflash()
					this.getFastNav()
					this.getFirstAD()
					this.getSecondAD()
					this.getLiveList()
					this.getStaffList()
					this.getRecruitmentList()
					this.getWeather()
				}catch(e){
					console.log(e)
				}
				
			},
			// 秒转分钟00:00格式
			timeToMinute(times) {
				var t = '';
				if (times > -1) {
					var min = Math.floor(times / 60) % 60;
					var sec = times % 60;
					if (min < 10) {
						t += "0";
					}
					t += min + ":";
					if (sec < 10) {
						t += "0";
					}
					t += sec.toFixed(2);
				}
				t = t.substring(0, t.length - 3);
				return t;
			},
			// 音频播放
			playAudio(audioSrc, name) {
				this.currentTime = "00:00"
				// 控制播放组件的显示
				if (name) {
					var Newname = name.split()
					this.audioName = Newname
				}
				this.isShowPlay = true
				this.isPlay = !this.isPlay
				// 判断音频当前状态 innerAudioContext.paused 为true 表示暂停或停止
				if (innerAudioContext.paused) {
					if (audioSrc) {
						innerAudioContext.src = this.$Url + audioSrc;
					}
					innerAudioContext.play()
				} else {
					innerAudioContext.stop()
				}
				innerAudioContext.onTimeUpdate(() => {
					this.totalTime = this.timeToMinute(parseInt(innerAudioContext.duration))
					this.currentTime = this.timeToMinute(parseInt(innerAudioContext.currentTime))
				});
			},
			// 关闭音频组件
			closePlay() {
				this.isShowPlay = false
				innerAudioContext.stop()
				this.isPlay = true
			},
			// 头条点击跳转
			navPageTo(index) {
				const id = this.swiperList[index].id
				// const url = this.swiperList[i].img
				uni.navigateTo({
					url: '../../news/index?id=' + id
				})
			},
			// 停水降压/水质公告列表点击跳转
			jumpDetail(id, cateId) {
				uni.navigateTo({
					url: '../../notice/index?id=' + id + '&active=' + this.currents + '&cateId=' + cateId
				})
			},
			// 企业快讯更多跳转
			pageTo(id) {
				uni.navigateTo({
					url: '../../newsflash/index?id=' + id
				})
			},
			// 快捷导航跳转
			navTo(sign, link, type, isLog) {
				if (!sign) return
				let url = '';
				const isLogin = uni.getStorageSync('isLogin')
				if (!isLogin && isLog == 1) {
					this.show = true
					return
				}
				if (type == 1) {
					// 站内
					if (sign == 'szgg') {
						url = '../../informed/index?act=1'
					}
					if (sign == 'sfcx') {
						url = '../../Watercharg/index'
					}
					if (sign == 'ysjg') {
						url = '../../useWater/index'
					}
					if (sign == 'dzfp') {
						url = '../../Watercharg/fapiao'
					}
					if (sign == 'tsjytz') {
						url = '../../informed/index?act=0'
					}
					if (sign == 'yywd') {
						url = '../serve/yingye/index'
					}
					if (sign == 'jiaofei') {
						url = '../mine/payment/payment'
					}
					if (sign == 'chaxun') {
						url = '../mine/payment/payment'
					}
					if (sign == 'shuihao') {
						url = '../shuihao/shuihao'
					}
					if (sign == 'zysfw') {
						url = '../mine/drinkingWate/drinkingWate'
					}
					if (sign == 'xbrx') {
						uni.makePhoneCall({
							phoneNumber: '0531968133'
						});
					}
					// 站外
				} else if (type == 2) {
					url = '../serve/yewu/index?url=' + link
				}
				uni.navigateTo({
					url
				});
			},
			// 去登陆
			confirmLogin() {
				uni.switchTab({
					url: '../mine/tabbar-5'
				})
			},
			// 跳转视频专题
			getMore(id) {
				uni.switchTab({
					url: '../video/tabbar-4?id=' + id
				})
			},
			// 跳转我的用水
			goToLogin() {
				uni.switchTab({
					url: '../mine/tabbar-5'
				})
			},
			// 查看全部
			goToPage(url) {
				if (!url) return
				uni.switchTab({
					url
				})
			},
			// 跳转新闻详情页
			pageToNewsDetail(id) {
				uni.navigateTo({
					url: '../../news/index?id=' + id
				})
			},
			// 广告详情
			ADdetail(index) {
				if (index == 0) {
					if (this.firstADislink == false) {
						uni.navigateTo({
							url: '../../business/business'
						})
					}else{
						uni.navigateTo({
							url: '../../ad/index?index=' + index
						})
					}
				} else {
					uni.navigateTo({
						url: '../../ad/index?index=' + index
					})
				}
			},
			// 直播回放列表项点击
			pagetoVideo(id, src, category) {
				if (category && category == 2) {
					uni.navigateTo({
						url: '../../Videotopics/index?id=' + id + '&src=' + src + '&category=' + category
					})
				}else if(category == 0) {
					uni.navigateTo({
						url: '../../mudulive/index?id=' + id
					})
				} else {
					uni.navigateTo({
						url: '../../live/live?id=' + id
					})
				}
			},
			// 员工风采列表点击
			pagetoStaff(id) {
				uni.navigateTo({
					url: '../../staff/index?id=' + id
				})
			},
			// 招采信息跳转
			pageTozhaocai(id) {
				uni.navigateTo({
					url: '../../zhaocaiInfo/index?id=' + id + '&type=0'
				})
			},
			// 获取第一广告位
			async getFirstAD() {
				await this.$u.get('/api/app/getActivityUp').then(res => {
					if (res.status == 1) {
						this.isFirstADShow = true
						this.firstADSrc = this.$Url + res.img
						if(res.is_link == 1) {
							this.firstADislink = true
						} else {
							this.firstADislink = false
						}
					}
				})
			},
			// 获取第二广告位
			async getSecondAD() {
				await this.$u.get('/api/app/getActivityDown').then(res => {
					if (res.status == 1) {
						this.isSecondADShow = true
						this.secondADSrc = this.$Url + res.img
					}
				})
			},
			// 获取快捷导航
			async getFastNav() {
				await this.$u.get('/api/app/getAppNav').then(res => {
					res.map((el, index) => {
						res[index].image = this.$Url + el.image
					})
					this.fastNavList = res
				})
			},
			// 获取直播预告
			async getliveNotice () {
				await this.$u.get('/api/live/getLiveList', {
					category: 0
				}).then(res => {
					if (res.result.length != 0) {
						this.liveNotice = true
						this.liveId = res.result[0].id
						this.liveNoticeUrl = this.$Url + res.result[0].image
						this.liveNoticeStatus = res.result[0].category
					} else {
						this.liveNotice = false
					}
				})
			},
			// 获取企业快讯新闻列表 
			async getNewsflash() {
				await this.$u.get('/api/app/getNews').then(res => {
					if(res.length > 0) {
						res.map((el, index) => {
							if (res[index].img_thumb.indexOf('http') != '-1') {
								res[index].img_thumb = el.img_thumb
							} else {
								res[index].img_thumb = this.$Url + el.img_thumb
							}
							
							if (res[index].images_arr.length > 1) {
								res[index].images_arr.map((els, i) => {
									res[index].images_arr[i] = this.$Url + els
								})
								res[index].images_arr.splice(3)
							}
						})
						this.newsflashList = res
					}
				})
			},
			// 获取轮播图
			async getSwiper() {
				await this.$u.get('/api/app/getIndexSwiper').then(res => {
					res.map((el, index) => {
						res[index].img = this.$Url + el.img
					})
					this.swiperList = res
				})
			},
			// 获取水质水压公告
			async getWaterQuality() {
				await this.$u.get('/api/notice/getszList',{
					index: 1,
					length: 5
				}).then(res => {
					const L = res.result.length
					this.Len1 = L
					this.waterQualityList = res.result
				})
			},
			// 获取停水公告列表
			async getNoticeList() {
				await this.$u.get('api/notice/gettsNoticeV1').then(res => {
					let L = res.length
					
					this.len = L;
					if (L == 1) {
						this.activeHeight = 72 * res[0].length + 72 + 'rpx'
					}
					if (L == 0) {
						this.activeHeight = '218rpx'
					}
					res.map((el, index) => {
						const data = res[index]
						data.map((els, i) => {
							data[i].action_time_text = els.action_time_text.slice(5)
						})
					})
					this.Notice = res
				})
			},
			// 获取直播回放列表
			async getLiveList() {
				await this.$u.get('/api/live/getLiveList').then(res => {
					// console.log(res)
					res.result.map((el, index) => {
						res.result[index].image = this.$Url + el.image
					})
					this.liveList = res.result
				})
			},
			// 获取员工风采列表
			async getStaffList() {
				await this.$u.get('/api/app/getygfc').then(res => {
					res.map((el, index) => {
						res[index].img = this.$Url + el.img
					})
					this.staffList = res
					this.flags = true
				})
			},
			// 获取招采信息列表
			async getRecruitmentList() {
				await this.$u.get('/api/app/getMassage').then(res => {
					res.map((el, index) => {
						res[index].update_time_text = el.update_time_text.slice(5)
					})
					let Len2 = res.length
					this.len2 = Len2
					if (Len2 == 0) {
						this.activeHeight1 = '218rpx'
						return
					}
					if (Len2 <= 3) {
						this.activeHeight1 = 72 * Len2 + +72 + 'rpx'
					}
					const arr1 = res.slice(0, 3)
					const arr2 = res.slice(3)
					if (this.RecruitmentList.length == 2) return
					this.RecruitmentList.push(arr1,arr2)
				})
			},
			change(index) {
				this.currents = index;
				if (index === 0) {
					this.getNoticeList()
				}
				if (index === 1) {
					this.getWaterQuality()
				}
				if (index === 2) {
					this.getRecruitmentList()
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .u-slot-content {
		padding: 0 40rpx !important;
	}

	.slot-wrap {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 92%;
		// padding-left: 40rpx;
		color: #FFFFFF;
		image {
			width: 80rpx;
			height: 50rpx;
		}
		text{
			margin-right: 20rpx;
		}
	}

	.u-slot-left {
		width: 400rpx;

		// margin-left: 40rpx;
		.uni-icons {
			vertical-align: middle;
			margin-right: 15rpx;
		}

		text {
			vertical-align: middle;
			color: #fff;
		}
	}

	.fastNav {
		position: relative;
		width: 100%;
		height: 480rpx;

		.fastNav-bg {
			width: 100%;
			height: 250rpx;
			background: url(../../../static/img/img/v2_qa7m3r.png) no-repeat top;
			background-size: 100% 30%;
			transform: rotate(180deg);
			background-color: $mytheme-color;
			// margin-top: 170rpx;
		}

		.nav {
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;
			position: absolute;
			top: 40rpx;
			left: 0;
			right: 0;
			bottom: 0;
			width: 90%;
			height: 400rpx;
			background-color: #fff;
			border-radius: 20rpx;
			box-shadow: 0px 0px 10px 1px #d2d1d1;
			margin: 0 auto;
			padding: 10rpx 0rpx;

			.nav-item {
				position: relative;
				width: 25%;

				span {
					display: block;
					font-size: 55rpx;
					text-align: center;
				}

				.u-image {
					display: block;
					// width: 65rpx;
					// height: 65rpx;
					margin: 0 auto;
				}

				text {
					display: block;
					text-align: center;
					margin-top: 20rpx;
					font-size: 28rpx;
				}

				a {
					position: absolute;
					top: 0;
					bottom: 0;
					right: 0;
					left: 0;
					display: block;
					width: 100%;
					height: 100%;
					text-decoration: none;
					color: #333333;
				}
			}
		}
	}

	.firstAd {
		width: 100%;
		text-align: center;
		padding: 0 40rpx;
		margin-bottom: 40rpx;
		image {
			width: 100%;
			height: 200rpx;
			border-radius: 20rpx;
		}
	}

	.notice {
		width: 100%;
		margin-top: 15rpx;
		margin-bottom: 30rpx;

		/deep/ #tab_item {
			font-size: 32rpx;
			font-weight: 700;
		}

		.m-tabs {
			position: relative;
			width: 90%;
			display: flex;
			justify-content: space-between;
			// padding-left: 70rpx;
			border-bottom: 1px solid #EEEEEE;
			margin: 0 auto;
			.tabicons {
				position: relative;
				// left: 0;
				// top: 50%;
				// transform: translate(0,-50%);
				height: 60rpx;
				padding: 5rpx 20rpx 0;
				background-color: $mytheme-color;
				color: #FFFFFF;
				font-size: 36rpx;
				font-weight: 700;
				// font-family: simsun;
				line-height: 50rpx;
				border-radius: 10rpx;
				&::after{
					content: '';
					position: absolute;
					top: 50%;
					right: -20rpx;
					transform: translate(50%, -50%);
					width: 0;
					height: 0;
					border: 15rpx solid transparent;
					border-left-color: $mytheme-color;
				}
			}
			
			.tabs-item {
				font-size: 36rpx;
				font-weight: 700;
				// margin-right: 50rpx;
				text {
					position: relative;
					display: block;
					height: 65rpx;
				}
			}

			.active-class {
				color: $mytheme-color;

				// border-bottom: 6rpx solid #00919F;
				// width: 100rpx;
				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translate(-50%);
					width: 100%;
					height: 6rpx;
					background-color: $mytheme-color;
					animation: rainbow 0.2s linear;
				}
			}

			@keyframes rainbow {
				0% {
					width: 0;
				}

				50% {
					width: 50%;
				}

				100% {
					width: 100%;
				}
			}
		}

		.tabItem {
			width: 100%;
			height: 100%;
			padding-top: 10rpx;

			span {
				position: relative;
				display: block;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 32rpx;
				padding: 0 40rpx;
				box-sizing: border-box;
				em {
					display: inline-block;
					width: 80%;
					font-style: normal;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				i {
					position: absolute;
					right: 40rpx;
					font-style: normal;
					color: #ccc;
				}
			}

			.water_content {
				display: flex;
				justify-content: space-around;
				align-items: center;
				flex-wrap: wrap;
				width: 100%;
				padding: 0 20rpx;
				// padding-top: 20rpx;
				.waterItem {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 45%;
					height: 75rpx;
					// line-height: 75rpx;
					text-align: center;
					border: 1px solid #d2d1d1;
					box-shadow: 0 0 5px 1px #d2d1d1;
					border-radius: 10rpx;
					margin-top: 20rpx;
					font-size: 32rpx;
				}
				.seeMore {
					justify-content: space-between; 
					align-items: center;
					padding: 0 10rpx 0 30rpx; 
				}
			}
		}
	}

	.swipers {

		.swiper {

			height: 460rpx !important;
			text-align: center;

			image {
				width: 95%;
				height: 460rpx;
				border-radius: 20rpx;
			}

			.swiper-item {
				position: relative;
			}

			.uni-swiper-dot {
				width: 30rpx;
				height: 8rpx;
				border-radius: 0;
			}

			.title {
				display: block;
				position: absolute;
				bottom: 10rpx;
				left: 50%;
				transform: translate(-50%);
				width: 95%;
				height: 100rpx;
				color: #FFFFFF;
				border-radius: 0 0 20rpx 20rpx;
				background-color: rgba(0, 0, 0, .5);
				z-index: 9999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 10rpx 20rpx;
				box-sizing: border-box;
			}
		}
	}

	.splitLine {
		width: 100%;
		height: 30rpx;
		background-color: #f9f9f9;
		margin-top: 30rpx;
	}

	.audioPlay {
		position: fixed;
		left: 20rpx;
		bottom: 200rpx;
		width: 80%;
		height: 100rpx;
		background-color: rgba(0, 0, 0, .8);
		border-radius: 15rpx;

		.play-progress {
			position: absolute;
			bottom: 8rpx;
			left: 35rpx;
			color: #e5e5e5;
		}
	}

	.Newsflash {
		width: 100%;

		.Newsflash_title {
			display: flex;
			height: 100rpx;
			line-height: 100rpx;
			background-color: #fff;
			border-bottom: 1px solid #EEEEEE;
			padding: 0 20rpx;
			box-sizing: border-box;

			.title {
				position: relative;
				flex: 1;
				padding-left: 40rpx;
				font-size: 36rpx;
				// color: #00919f;
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

			.title1 {
				font-size: 36rpx;
				font-weight: 700;
			}

			.more {
				flex: 1;
				font-size: 32rpx;
				text-align: right;
				color: #666666;
				padding-right: 20rpx;
				box-sizing: border-box;
			}
		}

		.Newsflash_list {
			width: 100%;
			padding: 0 40rpx;
			box-sizing: border-box;

			.bigImg {
				width: 100%;
				border-bottom: 1px solid #EEEEEE;

				.list_title {
					display: block;
					width: 100%;
					padding: 20rpx 0;
					font-size: 32rpx;
					font-weight: 400;
				}

				.u-image {
					// width: 100%;
					// height: 450rpx;
					// border-radius: 20rpx;
					margin-bottom: 20rpx;
				}

				.list_time {
					display: flex;
					justify-content: space-between;
					padding-bottom: 20rpx;
					color: #999999;
				}
			}

			.smallImg {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1px solid #EEEEEE;

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
						font-weight: 400;
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

					.u-image {
						// width: 100%;
						// height: 168rpx;
						// border-radius: 20rpx;
					}
				}
			}

			.audio {
				width: 100%;
				padding: 20rpx 0;
				border-bottom: 1px solid #EEEEEE;

				.audio-title {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 32rpx;
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

			.moreImg {
				width: 100%;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #EEEEEE;

				.moreImg-title {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 32rpx;
				}

				.moreImg-img {
					display: flex;
					justify-content: space-between;
					width: 100%;
					padding: 30rpx 0;

					.u-image {
						width: 33.3%;
						// height: 140rpx;
						padding: 0 8rpx;
					}
				}

				.moreImg-time {
					display: flex;
					justify-content: space-between;
					color: #999999;
				}
			}

			.list_title {
				font-weight: 700;
			}
		}

		.video-list {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: nowrap;
			padding: 40rpx 40rpx 0;
			overflow-x: scroll;
			overflow-y: hidden;

			.video-item {
				width: 51%;
				padding-bottom: 15rpx;
				padding-right: 15rpx;

				.video-img {
					position: relative;
					width: 100%;
					margin-bottom: 15rpx;

					image {
						width: 325rpx;
						height: 230rpx;
					}

					.liveStatus {
						position: absolute;
						top: 0rpx;
						right: 0rpx;
						background-color: #EEEEEE;
						padding: 5rpx 10rpx;
						z-index: 999;
					}
				}

				.video-title {
					margin-bottom: 15rpx;
					font-size: 32rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.Announcement {
			width: 100%;
			padding: 40rpx;

			image {
				width: 100%;
				border-radius: 20rpx;
			}
		}
	}
</style>
