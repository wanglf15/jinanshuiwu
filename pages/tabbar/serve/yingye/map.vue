<template>
	<view>
		<map :style="{ height: windowHeight, width: windowWidth }" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		<view class="foot">
			<view class="title">
				<span>{{ title }}</span>
				<span>{{ address }}</span>
			</view>
			<view class="icons" @click="open(address, title, latitude, longitude, mylat, mylon, myAddress)">
				<image src="../../../../static/img/img/nav2.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				latitude: '',
				longitude: '',
				covers: [{
					latitude: '',
					longitude: '',
					callout: {
						content: '',
						display: 'BYCLICK',
					},
					iconPath: '../../../../static/img/img/timg(6).png',
				}],
				title: '',
				address: '',
				windowHeight: '',
				windowWidth: '',
				mylat: '',
				mylon: '',
				myAddress: ''
			}
		},
		onLoad(option) {
			this.latitude = option.lat
			this.longitude = option.lon
			this.covers[0].latitude = option.lat
			this.covers[0].longitude = option.lon
			this.covers[0].callout.content = option.title + "(" + option.address + ")"
			this.title = option.title
			this.address = option.address
		},
		created() {
			const {
				windowWidth,
				windowHeight
			} = uni.getSystemInfoSync();
			this.windowHeight = windowHeight - 75 + 'px';
			this.windowWidth = windowWidth + 'px';
		},
		methods: {
			open(address,title, lat, lon, mylat, mylon, myAddress) {
				// #ifdef APP-PLUS
				if (plus.os.name == "Android") {
					let hasBaiduMap = plus.runtime.isApplicationExist({
						pname: 'com.baidu.BaiduMap',
						action: 'baidumap://'
					});
					let hasAmap = plus.runtime.isApplicationExist({
						pname: 'com.autonavi.minimap',
						action: 'androidamap://'
					});
					uni.getLocation({
					    type: 'wgs84',
						geocode: true,
					    success: (res) => {
							this.mylat = res.latitude
							this.mylon = res.longitude
							this.myAddress = res.address.poiName
					    }
					}); 
					let urlBaiduMap =
						`bdapp://map/direction?destination=${address}&coord_type=bd09ll&mode=driving&src=andr.baidu.openAPIdemo`
					urlBaiduMap = encodeURI(urlBaiduMap)
					let urlAmap = `amapuri://route/plan/?sid=&slat=${mylat}&slon=${mylon}&sname=${myAddress}&did=&dlat=${lat}&dlon=${lon}&dname=${address}&dev=0&t=0`
					if (hasBaiduMap && !urlAmap) {
						plus.nativeUI.actionSheet({
							title: "选择地图应用",
							cancel: "取消",
							buttons: [{
								title: "百度地图"
							}]
						}, function(e) {
							switch (e.index) {
								case 1:
									plus.runtime.openURL(urlBaiduMap);
									break;
							}
						})
					} else if (hasBaiduMap && hasAmap) {
						plus.nativeUI.actionSheet({
							title: "选择地图应用",
							cancel: "取消",
							buttons: [{
								title: "百度地图"
							}, {
								title: "高德地图"
							}]
						}, function(e) {
							console.log(e.index)
							switch (e.index) {
								case 1:
									plus.runtime.openURL(urlBaiduMap);
									break;
								case 2:
									plus.runtime.openURL(urlAmap);
									break;
							}
						})
					} else {
						plus.nativeUI.alert("本机未安装指定的地图应用");
					}
				} else if (plus.os.name == "iOS") {
					plus.nativeUI.actionSheet({
						title: "选择地图应用",
						cancel: "取消",
						buttons: [{
							title: "百度地图"
						},{
							title: "高德地图"
						}]
					}, function(e) {
						if (e.index == 1) {
							let hasBaiduMap = plus.runtime.isApplicationExist({
								pname: 'com.baidu.BaiduMap',
								action: 'baidumap://'
							});
							// baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`
							let urlBaiduMap =
								`baidumap://map/marker?location=${lat},${lon}&title=${address}&content=${title}&src=ios.baidu.openAPIdemo&coord_type=gcj02`
							urlBaiduMap = encodeURI(urlBaiduMap)
							
							if (hasBaiduMap) {
								plus.runtime.openURL(urlBaiduMap)
							} else {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							}
						} else if (e.index == 2) {
							let hasAmap = plus.runtime.isApplicationExist({
								pname: 'com.autonavi.minimap',
								action: 'iosamap://'
							});
							let urlAmap = `iosamap://path?sourceApplication=applicationName&sid=&slat=&slon=&sname=${myAddress}&did=&dlat=${lat}&dlon=${lon}&dname=&dev=0&t=0`
							// 检测是否安装高德
							if (hasAmap) {
								plus.runtime.openURL(urlAmap)
							} else {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							}
						}
					})
				}
				// #endif
			}
		}
	}
</script>

<style lang="less" scoped>
	.foot {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 140rpx;
		background-color: #FFFFFF;
		padding: 0 30rpx;
		box-sizing: border-box;
		z-index: 99999;

		.title {
			span {
				display: block;
				font-size: 36rpx;

				&:nth-child(2) {
					// width: 100%;
					font-size: 28rpx;
					color: #9a9a9a;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-top: 5rpx;
				}
			}
		}

		.icons {
			position: relative;
			width: 100rpx;
			height: 100rpx;
			background-color: #18ad18;
			border-radius: 50%;

			image {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: block;
				width: 70rpx;
				height: 70rpx;

			}
		}
	}
</style>
