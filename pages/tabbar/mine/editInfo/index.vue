<template>
	<view class="editInfo">
		<view class="info">
			<view class="uni-form-item uni-column">
				<text>手机号</text>
				<input class="uni-input" maxlength="11" placeholder="请输入手机号" v-model="tel" />
			</view>
			<view class="uni-form-item uni-column">
				<text>昵称</text>
				<input class="uni-input" maxlength="11" placeholder="请输入昵称" v-model="nickName" />
			</view>
			<view class="uni-form-item uni-column" style="margin-top: 30rpx;">
				<text>头像</text>
				<u-upload ref="uUpload" :size-type="sizeType" @on-remove="onRemove" :action="action" :show-progress="false" :file-list="fileList" :max-count="1" @on-success="uploadImg"></u-upload>
			</view>
		</view>
		<view style="width: 100%; height: 30rpx; background-color: #EEEEEE; margin: 30rpx 0;"></view>
		<view class="bindingWX" v-if="isWX">
			<view class="" style="display: flex;">
				<text>已绑微信 :</text>
				<text class="txt" style="margin-left: 20rpx;">{{ wxNickname }}</text>
			</view>
			<text class="removebind" @click="removebind('wx')">解绑</text>
		</view>
		<view class="bindingWX" v-if="isApple">
			<view class="" style="display: flex;">
				<text>appleId :</text>
				<text class="txt" style="margin-left: 20rpx;">{{ appleId }}</text>
			</view>
			<text class="removebind" @click="removebind('apple')">解绑</text>
		</view>
		<view class="btn">
			<button type="primary" @click="submitInfo">修改信息</button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: null,
				nickName: null,
				action: 'https://www.jnwater.com.cn/api/upload/file',
				fileList: [
					{
						url: ''
					}
				],
				upUrl: '',
				wxNickname: '',
				appleId: '',
				isApple: false,
				isWX: false,
				sizeType:['compressed']
			}
		},
		onLoad(option) {
			this.getUserInfo()	
		},
		methods: {
			// 本地取用户信息
			getUserInfo () {
				const userInfo = uni.getStorageSync('isLogin')
				this.tel = userInfo.mobile
				this.nickName = userInfo.nickname
				this.fileList[0].url = userInfo.avatarUrl
				if (userInfo.wechat) {
					this.isWX = true
					this.wxNickname = userInfo.wechat.nickname
				}
				if (userInfo.apple) {
					this.isApple = true
					this.appleId = userInfo.apple.openid
				}
			},
			uploadImg (e) {
				this.fileList[0].url = e.code.url
			},
			onRemove (index, lists) {
				this.fileList[0].url = null
			},
			// 解绑
			removebind(type) {
				let requestUrl = ""
				if (type == 'wx') {
					requestUrl = '/api/user/unbindOpenid'
				} else {
					requestUrl = '/api/user/unbindAppleid'
				}
				uni.showModal({
				    title: '提示',
				    content: '是否确认解绑，解绑后需要重新登录',
				    success: (res) => {
				        if (res.confirm) {
							const token = uni.getStorageSync('isLogin').token
							this.$u.post(requestUrl + '?token=' + token).then(result => {
								if(result.code == 1) {
									uni.clearStorageSync();
									this.$refs.uToast.show({
										title: '解绑成功',
										type: 'success',
										isTab: true,
										url: '/pages/tabbar/mine/tabbar-5'
									})
									this.wxNickname = '已解绑'
								}else {
									this.$refs.uToast.show({
										title: '解绑失败',
										type: 'error'
									})
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
				
			},
			async submitInfo () {
				const userInfo = uni.getStorageSync('isLogin')
				if (!this.fileList[0].url) {
					uni.showToast({
						title: '请上传头像',
						icon: 'none'
					})
					return
				}
				let avatarUrls;
				if (this.fileList[0].url == userInfo.avatarUrl) {
					avatarUrls = userInfo.avatar
				} else {
					avatarUrls = this.fileList[0].url
				}
				await this.$u.post('/api/user/editBasicInfo?token=' + userInfo.token, {
					mobile: this.tel,
					nickname: this.nickName,
					avatar: avatarUrls
				}).then(res => {
					if (res.code == 1) {
						let avaterUrl = '';
						if (this.fileList[0].url.indexOf('http') == 0) {
							avaterUrl = this.fileList[0].url
						} else {
							avaterUrl = this.$Url + this.fileList[0].url
						}
						uni.setStorage({
						    key: 'isLogin',
						    data: {
								id: userInfo.id,
								avatarUrl: avaterUrl,
								avatar: avatarUrls,
								token: userInfo.token,
								group_id: userInfo.group_id,
								mobile: this.tel,
								nickname: this.nickName,
							},
						    success: function (res) {
						        console.log(res);
						    }
						});
					}
					
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.editInfo {
		width: 100%;
		.info {
			width: 100%;
			margin-top: 50rpx;

			.uni-column {
				display: flex;
				align-items: center;
				position: relative;

				text {
					position: relative;
					display: inline-block;
					width: 20%;
					vertical-align: middle;
					text-align: right;
					margin-right: 20rpx;
					font-size: 32rpx;
					&::after {
						content: ':';
						position: absolute;
						right: -15rpx;
					}
				}

				input {
					display: inline-block;
					width: 70%;
					height: 100rpx;
					padding-left: 20rpx;
					box-sizing: border-box;
					font-size: 28rpx;
					border-bottom: 1px solid #ccc;
					vertical-align: middle;
				}

				.getCode {
					position: absolute;
					top: 30%;
					right: 5%;
					color: #03a9f4;
					font-size: 28rpx;
				}
				.u-upload {
					// display: inline-block;
					// margin-left: 40rpx;	
				}
			}
		}
		.bindingWX {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 90%;
			margin: 0 auto;
			padding: 20rpx 0rpx;
			font-size: 32rpx;
			border-bottom: 1px solid #EEEEEE;
			.removebind {
				padding: 10rpx 20rpx;
				background-color: $mytheme-color;
				color: #FFFFFF;
				border-radius: 8rpx;
			}
			.txt {
				display: block;
				width: 360rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #999999;
			}
		}
		.btn {
			width: 100%;
			margin-top: 80rpx;

			button {
				width: 90%;
				height: 80rpx;
				line-height: 80rpx;
				margin-bottom: 50rpx;
				color: #FFFFFF;
				background-color: $mytheme-color;
				font-size: 36rpx;

				&:nth-child(2) {
					background-color: #f8f8f8;
					color: #000;
				}
			}
		}
	}
</style>
