<template>
	<view class="container">
		<view class="item">
			<text>标题</text>
			<u-input v-model="title" type="text" border placeholder="请输入标题" />
		</view>
		<view class="item">
			<text>封面</text>
			<u-upload :action="action" max-count="1" @on-change="uploadChange" :file-list="fileList"></u-upload>
		</view>
		
		<view class="item">
			<text>类型</text>
			<u-radio-group v-model="value" @change="radioGroupChange">
				<u-radio shape="circle" @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.name"
				 :disabled="item.disabled">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		<view class="item" v-if="value == '多图'">
			<text>多图</text>
			<u-upload :action="action" :max-size="5 * 1024 * 1024" max-count="6" @on-success="uploadFinsh" :file-list="moreImgList"></u-upload>
		</view>
		<!-- <view class="item">
			<text>音频</text>
			<button type="default" @click="uploadAudio">上传</button>
		</view> -->
		<view class="item1">
			<text>描述</text>
			<u-input v-model="cover" type="textarea" border placeholder="请输入描述" />
		</view>
		<view class="items">
			<text>内容</text>
			<view class="toolbar" :style="'bottom: ' + (isIOS ? keyboardHeight : 0) + 'px'">
				<i class="iconfont icon-charutupian" @touchend.stop="insertImage"></i>
				<!-- <i class="iconfont icon-format-header-1" @tap="format('header','H1', $event)"></i>
				<i class="iconfont icon-format-header-2" @tap="format('header','H2')"></i>
				<i class="iconfont icon-format-header-3" @tap="format('header','H3')"></i>
				<i class="iconfont icon-format-header-4" @tap="format('header','H4')"></i>
				<i class="iconfont icon-format-header-5" @tap="format('header','H5')"></i>
				<i class="iconfont icon-format-header-6" @tap="format('header','H6')"></i>
				<i class="iconfont icon-zitijiacu" @tap="format('bold','bold')"></i>
				<i class="iconfont icon-zitishanchuxian" @tap="format('strike','strike')"></i>
				<i class="iconfont icon-zitixieti" @tap="format('italic','italic')"></i>
				<i class="iconfont icon-zuoduiqi" @tap="format('align','left')"></i>
				<i class="iconfont icon-juzhongduiqi" @tap="format('align','center')"></i>
				<i class="iconfont icon-youduiqi" @tap="format('align','right')"></i>
				<i class="iconfont icon-zuoyouduiqi" @tap="format('align','justify')"></i>
				<i class="iconfont icon-line-height" @tap="format('lineHeight','2')"></i>
				<i class="iconfont icon-Character-Spacing" @tap="format('letterSpacing','2em')"></i>
				<i class="iconfont icon-722bianjiqi_duanqianju" @tap="format('marginTop','20px')"></i>
				<i class="iconfont icon-723bianjiqi_duanhouju" @tap="format('marginBottom','20px')"></i> -->
				<!-- <i class="iconfont icon-clearedformat" @tap="removeFormat"></i> -->
				<!-- <i :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')" data-name="fontFamily" data-value="Pacifico"></i> -->
				<!-- <i class="iconfont icon-fontsize" @tap="format('fontSize','24px')"></i> -->
				<!-- <i class="'iconfont icon-text_color" data-name="color" :data-value="fontColor" @tap="open"></i> -->
				<!-- <i class="iconfont icon-fontbgcolor" @tap="format('backgroundColor','#00ff00')"></i> -->
				<!-- 引用黄河浪的color取色器 -->
				<i class="iconfont icon-date" @tap="insertDate"></i>
				<i class="iconfont icon-undo" @tap="undo"></i>
				<i class="iconfont icon-redo" @tap="redo"></i>
				<i class="iconfont icon-zitixiahuaxian" @tap="format('underline','underline')"></i>
				<!-- <i class="iconfont icon--checklist" @tap="format('list','check')"></i> -->
				<!-- <i class="iconfont icon-youxupailie" @tap="format('list','ordered')"></i> -->
				<!-- <i class="iconfont icon-wuxupailie" @tap="format('list','bullet')"></i> -->
				<i class="iconfont icon-outdent" @tap="format('indent','-1')"></i>
				<i class="iconfont icon-indent" @tap="format('indent','+1')"></i>
				<i class="iconfont icon-fengexian" @tap="insertDivider"></i>
				<!-- <i class="iconfont icon-preview" @tap="store" id="2"></i> -->
				<!-- <i class="iconfont icon-zitixiabiao" @tap="format('script','sub')"></i> -->
				<!-- <i class="iconfont icon-zitishangbiao" @tap="format('script','super')"></i> -->
				<!-- <i class="iconfont icon-quanping"></i> -->
				<i class="iconfont icon-shanchu" @tap="clear"></i>
				<!-- <i class="iconfont icon-direction-rtl" @tap="format('direction','rtl')"></i> -->
				<!-- <i class="iconfont icon-baocun" @tap="store" id="1"></i> -->
			</view>
			<editor id="editor" @ready="onEditorReady" @statusChange="onStatusChange" @input="contentInp" class="ql-container" show-img-toolbar show-img-resize show-img-size placeholder="开始输入..."></editor>
		</view>
		<view class="pubNews">
			<u-button @click="pubNews">{{ type ? '发布新闻' : '保存'}}</u-button>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				title: "",
				cover: "",
				action: 'https://www.jnwater.com.cn/api/upload/file?size=350',
				fileList: [],
				moreImgList: [],
				moreImgList1: [],
				list: [{
						name: '小图',
						disabled: false
					},
					{
						name: '大图',
						disabled: false
					},
					{
						name: '多图',
						disabled: false
					},
					// {
					// 	name: '音频',
					// 	disabled: false
					// }
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: '小图',
				fontColor: '#000',
				formats: "",
				readOnly: false,
				placeholder: '开始输入...',
				editorHeight: 300,
				keyboardHeight: 0,
				isIOS: false,
				content: '',
				type: true,
				Id: "",
				images: ""
			}
		},
		onLoad(option) {
			_self = this;
			if (option.type && option.type == 'edit') {
				uni.setNavigationBarTitle({
					title: '新闻编辑'
				})
				this.Id = option.id 
				this.type = false
				this.getNewsDetail(option.id)
			}
			
		},
		methods: {
			uploadAudio () {},
			// 发布
			async pubNews() {
				if(this.type) {
					if (!this.title) {
						uni.showToast({
							title: '标题不能为空！！',
							icon: 'none'
						})
						return
					}
					if (!this.fileList[0]) {
						uni.showToast({
							title: '请上传封面图片！！',
							icon: 'none'
						})
						return
					}
					if (!this.content) {
						uni.showToast({
							title: '请输入发布内容！！',
							icon: 'none'
						})
						return
					}
					let type = '';
					if (this.value == '小图') {
						type = 0
					} else if (this.value == '大图') {
						type = 1
					} else if (this.value == '多图') {
						type = 2
					} else {
						type = 3
					}
					let row = {
							title: this.title,
							img: this.fileList[0].url,
							type: type,
							profile: this.cover,
							images: this.images,
							content: 
								{
									content: this.content
								}
							
						}
					const token = uni.getStorageSync('isLogin').token
					await this.$u.post('/api/user_news/add?token=' + token, 
					{ 
						row: JSON.stringify(row)
					},
					{
						"Content-type": "application/x-www-form-urlencoded"
					}).then(res => {
						console.log(res)
						if (res.code == 1) {
							uni.navigateBack({
								delta: 1
							})
							uni.showToast({
								title: res.msg
							})
							
						}
					})
				} else {
					if (!this.title) {
						uni.showToast({
							title: '标题不能为空！！',
							icon: 'none'
						})
						return
					}
					if (!this.fileList[0]) {
						uni.showToast({
							title: '请上传封面图片！！',
							icon: 'none'
						})
						return
					}
					if (!this.content) {
						uni.showToast({
							title: '请输入发布内容！！',
							icon: 'none'
						})
						return
					}
					let type = '';
					if (this.value == '小图') {
						type = 0
					} else if (this.value == '大图') {
						type = 1
					} else if (this.value == '多图') {
						type = 2
					} else {
						type = 3
					}
					console.log(this.fileList[0].url)
					let row = {
							title: this.title,
							img: this.fileList[0].url,
							type: type,
							profile: this.cover,
							images: this.images,
							content: 
								{
									content: this.content
								}
							
						}
					const token = uni.getStorageSync('isLogin').token
					await this.$u.post('/api/user_news/edit?token=' + token + '&id=' + this.Id, 
					{ 
						row: JSON.stringify(row)
					},
					{
						"Content-type": "application/x-www-form-urlencoded"
					}).then(res => {
						if (res.code == 1) {
							uni.navigateBack({
								delta: 1
							})
							uni.showToast({
								title: res.msg
							})
							
						}
					})
				}
			},
			// 编辑器内容输入事件
			contentInp (e) {
				this.content = e.detail.html
			},
			// 获取新闻详情
			async getNewsDetail (id) {
				await this.$u.get('/api/news/getNewsById?id=' + this.Id).then(res => {
					this.title = res.title
					this.cover = res.profile
					if (res.type == 0) {
						this.value = "小图"
					} else if (res.type == 1) {
						this.value = "大图"
					} else if (res.type == 2) {
						this.value = "多图"
					}
					if (res.images_arr[0] !== "") {
						res.images_arr.map((el,index) => {
							if (el.indexOf('http') != '-1') {
								this.moreImgList.push({url: el})
							} else {
								this.moreImgList.push({url: this.$Url + el})
							}
							
						})
					}
					
					
					if (res.img.indexOf('http') != '-1') {
						this.fileList.push({url: res.img})
					} else {
						this.fileList.push({url: this.$Url + res.img})
					}
					
					this.content = res.recontent
				})
			},
			uploadChange(e) {
				const data = JSON.parse(e.data)
				this.fileList[0] = data.code
			},
			uploadFinsh(e) {
				this.moreImgList1.push(e.code)
				let images = []
				this.moreImgList1.map((el, index) => {
					images.push(el.url)
				})
				this.images = images.toString()
			},
			onStatusChange(e) {
				this.formats = e.detail;
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			cancel() {
				this.isEdit = false;
			},
			
			hideKey() {
				uni.hideKeyboard();
			},
			// async confirm(e) {
			// 	this.isEdit = false;
			// 	this.fontColor = await e.hex;
			// 	this.onStatusChange({
			// 		detail: {
			// 			color: e.hex
			// 		}
			// 	});
			// 	this.$forceUpdate();
			// },
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				let that = this;
				uni.createSelectorQuery().select('#editor').context(function(res) {
					_self.editorCtx = res.context;
					that.editorCtx.setContents({
						html: that.content
					})
				}).exec();
			},
			undo() {
				this.editorCtx.undo();
			},
			
			redo() {
				this.editorCtx.redo();
			},
			
			blur() {
				this.editorCtx.blur();
			},
			
			format(name, value, e) {
				this.formats = value
				if (!name) return; // console.log('format', name, value)
				this.editorCtx.format(name, value);
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success');
					}
				});
			},
			
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success");
					}
				});
			},
			
			removeFormat() {
				this.editorCtx.removeFormat();
			},
			// 日期
			insertDate() {
				const date = new Date();
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
				this.editorCtx.insertText({
					text: formatDate
				});
			},
			// 图片
			insertImage() {
				// const that = this;
				uni.chooseImage({
					count: 1,
					success: function(res) {
						uni.uploadFile({
							url: "https://www.jnwater.com.cn/api/upload/file?size=750",
							filePath: res.tempFilePaths[0],
							name: 'file',
							fileType: 'image',
							formData: {
								uploadpath: 'file',
								filename: 'file'
							},
							success: res => {
								let uploadRes = JSON.parse(res.data);
								
								_self.editorCtx.insertImage({
									src:  _self.$Url + uploadRes.code.url,
									alt: 'img',
									success: function() {
										console.log('insert image success')
									}
								})
							},
							fail: uploadFileRes => {
								console.log(uploadFileRes);
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.container {
		width: 100%;
		padding: 40rpx;

		.item {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			text {
				font-size: 32rpx;
				margin-right: 20rpx;
			}
			.u-upload {
				width: 550rpx;
			}
		}

		.item1 {
			display: flex;
			margin-bottom: 30rpx;

			text {
				font-size: 32rpx;
				margin-right: 20rpx;
			}
		}

		.items {
			text {
				display: block;
				font-size: 32rpx;
				margin-bottom: 20rpx;
			}
		}
		#editor {
		        width: 100%;
		        // height: 300px;
		        // background-color: #CCCCCC;
				border: 1px solid #EEEEEE;
		    }
			.pubNews {
				margin: 50rpx 0;
				.u-btn {
					background-color: #00919f;
					color: #FFFFFF;
				}
			}
	}
	@import "./editor.css";
</style>
