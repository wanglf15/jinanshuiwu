<template>
	<view class="container">
		<view class="setItem">
			<text>颜色:</text>
			<u-input v-model="colors" type="text" :border="true" />
		</view>
		<view class="setItem">
			<text>字体:</text>
			<view class="">
				<u-input v-model="fontSize" type="select" :border="true" @click="show = true" />
				<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
			</view>
		</view>
		<view class="setItem">
			<text>间距:</text>
			<u-input v-model="spacing" type="number" :border="true" />
		</view>
		<view class="setItem">
			<text>是否外链:</text>
			<u-radio-group v-model="islink" size="40">
				<u-radio @change="radioChange" v-for="(item, index) in linklist" :key="index" :name="item.name" :disabled="item.disabled">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		<view class="setItem">
			<text>外链地址:</text><u-input v-model="link" type="text" :border="true" :disabled="islink == '否'" placeholder="请输入外链地址" />
		</view>
		<view class="setItems">
			<text>显示位置:</text>
			<u-radio-group v-model="position" @change="radioGroupChange" style="width: 500rpx;" size="40">
				<u-radio v-for="(item, index) in positionlist" :key="index" :name="item.name" :disabled="item.disabled">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		<view class="btn">
			<button type="default" @click="submit">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colors: "",
				fontSize: '16',
				spacing: 0,
				islink: '否',
				link: "",
				position: "默认",
				position_text: "def",
				show: false,
				actionSheetList: [{
						text: '14'
					},
					{
						text: '16'
					},
					{
						text: '18'
					},
					{
						text: '20'
					},
					{
						text: '22'
					},
					{
						text: '24'
					},
					{
						text: '26'
					},
					{
						text: '28'
					},
				],
				linklist: [{
						name: '是',
						disabled: false
					},
					{
						name: '否',
						disabled: false
					}
				],
				positionlist: [{
						name: '默认',
						disabled: false
					},
					{
						name: '头条',
						disabled: false
					},
					{
						name: '推荐',
						disabled: false
					},
					{
						name: '头条左',
						disabled: false
					},
					{
						name: '头条右',
						disabled: false
					}
				],
				id: ""
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getNewsDetail(option.id)
		},
		methods: {
			// 获取新闻设置详情
			async getNewsDetail (id) {
				await this.$u.get('/api/news/getNewsById?id=' + id).then(res => {
					this.colors = res.content.color
					this.fontSize = res.content.font
					this.spacing = res.content.spacing
					if (res.is_link == 1) {
						this.islink = '是'
						this.link = res.link
					} else {
						this.islink = '否'
					}
					this.position = res.position_text
				})
			},
			// 提交
			async submit () {
				let is_link;
				if (this.islink == '是') {
					is_link = "1"
					if (!this.link) {
						uni.showToast({
							title: '请输入外链地址',
							icon: 'none'
						})
						return
					}
				} else {
					is_link = "0"
					this.link = ""
				}
				let row = {
						is_link: is_link,
						link: this.link,
						position: this.position_text,
						content: 
							{
								color: this.colors,
								font: this.fontSize,
								spacing: this.spacing
							}
					}
				const token = uni.getStorageSync('isLogin').token
				await this.$u.post('/api/user_news/edit?token=' + token + '&id=' + this.id,{
					row: JSON.stringify(row)
				}, {
					"Content-type": "application/x-www-form-urlencoded"
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: res.msg
						})
					}
				})
			},
			actionSheetCallback(index) {
				this.fontSize = this.actionSheetList[index].text;
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
				// if (e == '否') {
				// 	this.link = ""
				// }
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				if (e == '默认') {
					this.position_text = 'def'
				} else if (e == '头条') {
					this.position_text = 'top'
				} else if (e == '推荐') {
					this.position_text = 'best'
				} else if (e == '头条左') {
					this.position_text = 'left'
				} else {
					this.position_text = 'right'
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 30rpx 40rpx;

		.setItem {
			display: flex;
			align-items: center;
			width: 100%;
			padding: 20rpx 0;
			font-size: 32rpx;

			text {
				// margin-right: 30rpx;
				display: block;
				width: 170rpx;
			}
			/deep/ .u-input {
				width: 500rpx !important;
			}
		}
		.setItems {
			display: flex;
			// align-items: center;
			margin-top: 20rpx;
			text {
				// margin-right: 30rpx;
				display: block;
				width: 170rpx;
				font-size: 32rpx;
			}
			.u-radio {
				margin-bottom: 20rpx;
				margin-right: 20rpx;
			}
		}
		.btn {
			margin-top: 100rpx;
			/deep/ uni-button {
				background-color: #00919F !important;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}
	}
</style>
