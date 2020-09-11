<template>
	<view class="container">
		<view class="numCard" v-if="!dataEmpty" v-for="(item,index) in ZYSlist" :key="index">
			<view class="card-title"></view>
			<view class="card-content">
				<view>直饮水给水号</view>
				<view style="font-size: 60rpx; font-weight: 700; margin: 20rpx 0;">{{ item.code }}</view>
				<view class="detail">
					<text>当前余量: {{ item.marginAmount }}L</text>
					<text>总用水量: {{ item.cumulantAmount }}L</text>
					<text>联系电话: {{ item.mobile }}</text>
					<text>用水地址: {{ item.address }}</text>
				</view>
				<view class="btns">
					<button type="default" @click="pageto(item.code)">预存存值</button>
					<button type="default" @click="record(item.code)">充值记录</button>
					<button type="default" @click="removeBind(item.code)">解绑水号</button>
				</view>
			</view>
		</view>
		<u-empty text="您还没有绑定直饮水号" mode="data" :show="dataEmpty"></u-empty>
		<view class="addNum">
			<button type="default" @click="bindNum">添加直饮水号</button>
		</view>
		<u-mask :show="show1">
			<view class="bindDialog" @tap.stop>
				<view class="dialog-title">
					<text>绑定直饮水号</text>
					<u-icon name="close-circle-fill" size="50" color="#999" @click="show1 = false"></u-icon>
				</view>
				<view class="dialog-content">
					<view class="dialog-item">
						<text>直饮水号：</text><input type="number" v-model="zysnum" value="" />
					</view>
					<view class="dialog-item">
						<text>手机号码：</text><input type="text" v-model="tel" value="" />
					</view>
					<button type="default" @click="submit">确认提交</button>
					<view>
						<text style="display: block; margin-bottom: 10rpx;">温馨提示:</text>
						<text>水号查询或电话变更可拨打小白热线968133</text>
					</view>
				</view>
			</view>
		</u-mask>
		<u-modal v-model="show" title="解绑提示" content="请确认是否解绑,解绑后需要重新绑定" show-cancel-button @confirm="remove"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataEmpty: false,
				show: false,
				show1: false,
				ZYSlist: [],
				zysnum: "",
				tel: "",
				removeCode: ""
			}
		},
		onLoad() {
			this.getZYSList()
		},
		onBackPress() {
			uni.$emit('update',{msg:'页面更新'})
		},
		methods: {
			// 获取直饮水号列表
			async getZYSList () {
				const token = uni.getStorageSync('isLogin').token
				await this.$u.get('/api/zys/bindList',{
					token: token,
					index: 1,
					length: 12,
				}).then(res => {
					if(res.code == 1) {
						const data = res.data
						if (data.length == 0) {
							this.dataEmpty = true
							return
						} 
						data.map((el, index) => {
							data[index].mobile = this.geTel(el.mobile)
						})
						this.dataEmpty = false
						this.ZYSlist = data
					} else {
						uni.showToast({
							title: '数据获取失败，请稍后再试'
						})
					}
				})
			},
			// 绑定直饮水号
			bindNum () {
				this.show1 = true
				const info = uni.getStorageSync('isLogin')
				this.tel = info.mobile
			},
			// 提交
			async submit () {
				const info = uni.getStorageSync('isLogin')
				await this.$u.post('/api/zys/userBind?token=' + info.token,{
					code: this.zysnum
				}).then(res => {
					if (res.code == 1) {
						this.show1 = false
						this.getZYSList()
						this.$refs.uToast.show({
							title: '添加成功',
							type: 'success'
						})
					}
				})
			},
			// 解除绑定
			removeBind (code) {
				this.show = true
				this.removeCode = code
			},
			async remove () {
				const info = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/userUnBind', {
					token: info.token,
					code: this.removeCode
				}).then(res => {
					if (res.code == 1) {
						this.getZYSList()
						this.$refs.uToast.show({
							title: '解绑成功',
							type: 'success'
						})
					} else {
						uni.showToast({
							title: '解绑失败',
							icon: 'none'
						})
					}
				})
			},
			// 预存存值
			pageto(code) {
				uni.navigateTo({
					url: '../../../Recharge/Recharge?code=' + code
				})
			},
			// 充值记录
			record (code) {
				uni.navigateTo({
					url: 'record?code=' + code
				})
			},
			geTel(tel) {
				var reg = /^(\d{3})\d{4}(\d{4})$/;
				return tel.replace(reg, "$1****$2");
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 40rpx;

		.numCard {
			width: 100%;
			// height: 200rpx;
			box-shadow: 0 0 5px 2px #CCCCCC;
			border-radius: 20rpx;
			margin-bottom: 50rpx;
			.card-title {
				width: 100%;
				height: 100rpx;
				background-color: $mytheme-color;
				border-radius: 20rpx 20rpx 0 0;
			}

			.card-content {
				width: 100%;
				padding: 40rpx;

				view {
					font-size: 32rpx;
				}

				.detail {
					display: flex;
					flex-direction: column;
				}

				.btns {
					display: flex;
					margin-top: 30rpx;

					button {
						height: 60rpx;
						line-height: 60rpx;
						font-size: 32rpx;
						background-color: $mytheme-color;
						color: #FFFFFF;
					}
				}
			}
		}

		.addNum {
			button {
				font-size: 32rpx;
				color: #FFFFFF;
				margin-top: 50rpx;
				background-color: $mytheme-color;
			}
		}
		.bindDialog {
			width: 92%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #FFFFFF;
			border-radius: 10rpx;
			.dialog-title {
				display: flex;
				justify-content: space-between;
				padding: 30rpx;
				width: 100%;
				background-color: #CCCCCC;
				border-radius: 10rpx 10rpx 0 0;
				text {
					font-size: 36rpx;
					font-weight: 700;
				}
			}
			.dialog-content {
				width: 100%;
				padding: 60rpx;
				.dialog-item {
					display: flex;
					height: 100rpx;
					font-size: 32rpx;
				}
				input {
					padding-left: 10rpx;
					border-bottom: 1px solid #CCCCCC;
				}
				button {
					background-color: $mytheme-color;
					color: #FFFFFF;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 32rpx;
					margin-bottom: 30rpx;
				}
			}
		}
	}
</style>
