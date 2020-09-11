<template>
	<view class="waterCharg">
		<u-sticky>
			<u-tabs :list="list" :is-scroll="false" height="120" :current="current" bg-color="#eee" bar-width="120" active-color="#00919f"
			 font-size="32" @change="change">
			</u-tabs>
		</u-sticky>
		<view class="tab-item" v-show="current == 0">
			<!-- 未验证 -->
			<view class="no-verification" v-if="noverification">
				<view class="auth-card" style="margin-top: 40rpx;">
					<view class="card-title">
						<text>用户验证</text>
					</view>
					<view class="card-body">
						<view class="inp">
							<text>给水号</text>
							<input type="number" v-model="gsh" value="" />
						</view>
						<view class="inp">
							<text>验证码</text>
							<input type="number" v-model="code" value="" />
						</view>
						<view class="careful">
							<text>注：户表用户验证码为身份证号码后六位或预留手机号。户表用户证号码是身份证号，总表用户验证码为纳税号、预留手机号或最新抄表编码。</text>
						</view>
					</view>
				</view>
				<button type="default" @click="pass">验证并申领发票</button>
				<view class="explain">
					<text class="title">发票领取说明:</text>
					<text class="tips">在您交费成功后3个自然日即可登录本网站自助获取增值税普通电子发票，本电子发票与纸质发票均为国家税务总局认定的具有法律效力。</text>
					<text class="title">温馨提示:</text>
					<text class="tips">您可以通过点击补领发票按钮申请或补领电子发票，但对于交费时间超过3年（最长40个月）的水费发票无法申领或补领发票。对于已交费无法申领或补领的电子发票请前往就近的营业网点补打发票。</text>
					<text>24小时客服电话：0531-968133。</text>
				</view>
			</view>
			<!-- 已验证 -->
			<view class="verification" v-if="verification">
				<view v-for="(item, index) in FPList" :key="index">
					<view class="" v-if="item.dzfpzt == '欠费'">
						<view class="verification-item bg-r" @tap="openDetail(index)">
							<view class="times color-r">
								<text>{{ index+1 }}.</text>
								<text>{{ item.SmDate.replace('-', '年') }}月</text>
								<text>金额:{{ item.FPJE.toFixed(2) }}</text>
							</view>
							<view class="tags bg-red">
								<text>未交费</text>
							</view>
						</view>
						<view class="opens" v-if="isshow == index">
							<view class="open-items">
								<view class="yue">
									<view class="yuE">
										<text>上次余额: {{ item.scye }}</text>
										<text>本次余额: {{ item.bcye }}</text>
									</view>
									<view class="btns bg-red" @tap="goPay(item.GS)">
										<text>交费</text>
									</view>
								</view>
								<view class="details">
									<view class="">
										<text>上次表数：{{ item.QD }}m<sup>3</sup></text>
										<text>本次用量：{{ item.SL }}m<sup>3</sup></text>
										<text>缴费日期：{{ item.R1 }}</text>
									</view>
									<view class="">
										<text>本次表数：{{ item.ZD }}m<sup>3</sup></text>
										<text>人口基数：{{ item.SLJS }}人</text>
										<text>综合单价：{{ item.DJ }}</text>
									</view>
								</view>
							</view>
							<view class="open-table">
								<u-table border-color="transparent">
									<u-tr>
										<u-th>项目</u-th>
										<u-th>单价</u-th>
										<u-th>金额</u-th>
									</u-tr>
									<u-tr>
										<u-td>一阶基本水费</u-td>
										<u-td>{{ item.MX[0].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[0].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr style="background-color: #f5f6f8;">
										<u-td>水资源税</u-td>
										<u-td>{{ item.MX[1].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[1].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr>
										<u-td>污水处理费</u-td>
										<u-td>{{ item.MX[2].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[2].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr style="background-color: #f5f6f8;">
										<u-td></u-td>
										<u-td style="font-weight: 700;">合计</u-td>
										<u-td style="font-weight: 700;">￥{{ item.ZJE.toFixed(2) }}</u-td>
									</u-tr>
								</u-table>
							</view>
						</view>
					</view>
					<view v-if="item.dzfpzt == '已开票'">
						<view class="verification-item bg-b" @tap="openDetail(index)">
							<view class="times color-b">
								<text>{{ index+1 }}.</text>
								<text>{{ item.SmDate.replace('-', '年') }}月</text>
								<text>金额:{{ item.FPJE.toFixed(2) }}</text>
							</view>
							<view class="tags bg-blue">
								<text>已开票</text>
							</view>
						</view>
						<view class="opens" v-if="isshow == index">
							<view class="open-items">
								<view class="yue">
									<view class="yuE">
										<text>上次余额: {{ item.scye }}</text>
										<text>本次余额: {{ item.bcye }}</text>
									</view>
									<view class="btns bg-blue" @click="fpbl(item)">
										<text>补领发票</text>
									</view>
								</view>
								<view class="details">
									<view class="">
										<text>上次表数：{{ item.QD }}m<sup>3</sup></text>
										<text>本次用量：{{ item.SL }}m<sup>3</sup></text>
										<text>缴费日期：{{ item.R1 }}</text>
									</view>
									<view class="">
										<text>本次表数：{{ item.ZD }}m<sup>3</sup></text>
										<text>人口基数：{{ item.SLJS }}人</text>
										<text>综合单价：{{ item.DJ }}</text>
									</view>
								</view>
							</view>
							<view class="open-table">
								<u-table border-color="transparent">
									<u-tr>
										<u-th>项目</u-th>
										<u-th>单价</u-th>
										<u-th>金额</u-th>
									</u-tr>
									<u-tr>
										<u-td>一阶基本水费</u-td>
										<u-td>{{ item.MX[0].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[0].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr style="background-color: #f5f6f8;">
										<u-td>水资源税</u-td>
										<u-td>{{ item.MX[1].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[1].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr>
										<u-td>污水处理费</u-td>
										<u-td>{{ item.MX[2].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[2].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr style="background-color: #f5f6f8;">
										<u-td></u-td>
										<u-td style="font-weight: 700;">合计</u-td>
										<u-td style="font-weight: 700;">￥{{ item.ZJE.toFixed(2) }}</u-td>
									</u-tr>
								</u-table>
							</view>
						</view>
					</view>
					<view v-if="item.dzfpzt == '未开票'">
						<view class="verification-item bg-gr" @tap="openDetail(index)">
							<view class="times color-g">
								<text>{{ index+1 }}.</text>
								<text>{{ item.SmDate.replace('-', '年') }}月</text>
								<text>金额:{{ item.FPJE.toFixed(2) }}</text>
							</view>
							<view class="tags bg-green">
								<text>可开票</text>
							</view>
						</view>
						<view class="opens" v-if="isshow == index">
							<view class="open-items">
								<view class="yue">
									<view class="yuE">
										<text>上次余额: {{ item.scye }}</text>
										<text>本次余额: {{ item.bcye }}</text>
									</view>
									<view class="btns bg-green" @tap="Invoice(item)">
										<text>开票</text>
									</view>
								</view>
								<view class="details">
									<view class="">
										<text>上次表数：{{ item.QD }}m<sup>3</sup></text>
										<text>本次用量：{{ item.SL }}m<sup>3</sup></text>
										<text>缴费日期：{{ item.XZRQ.slice(0,10) }}</text>
									</view>
									<view class="">
										<text>本次表数：{{ item.ZD }}m<sup>3</sup></text>
										<text>人口基数：{{ item.SLJS }}人</text>
										<text>综合单价：{{ item.DJ }}</text>
									</view>
								</view>
							</view>
							<view class="open-table">
								<u-table border-color="transparent">
									<u-tr>
										<u-th>项目</u-th>
										<u-th>单价</u-th>
										<u-th>金额</u-th>
									</u-tr>
									<u-tr>
										<u-td>一阶基本水费</u-td>
										<u-td>{{ item.MX[0].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[0].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr style="background-color: #f5f6f8;">
										<u-td>水资源税</u-td>
										<u-td>{{ item.MX[1].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[1].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr>
										<u-td>污水处理费</u-td>
										<u-td>{{ item.MX[2].XMDJ.toFixed(3) }}</u-td>
										<u-td>{{ item.MX[2].XMJE.toFixed(2) }}</u-td>
									</u-tr>
									<u-tr style="background-color: #f5f6f8;">
										<u-td></u-td>
										<u-td style="font-weight: 700;">合计</u-td>
										<u-td style="font-weight: 700;">￥{{ item.ZJE.toFixed(2) }}</u-td>
									</u-tr>
								</u-table>
							</view>
						</view>
					</view>
				</view>

				<u-modal v-model="Invoiceshow" show-cancel-button title="申领电子发票" @confirm="Invoiceconfirm" ref="uModal"
				 :async-close="true">
					<view class="slot-content" style="width: 100%; padding: 30rpx;">
						<view class="">
							<text>点击【确定申领】按钮后，系统将自动为您开具出单日期为：{{ CDRQ }} 的电子发票。</text>
							<text style="display: block; margin-top: 20rpx; font-weight: 700;">重要提示：发票申请开具不能取消不能退费！</text>
						</view>
					</view>
				</u-modal>
			</view>
		</view>
		<view class="tab-item" v-show="current == 1">
			<view class="auth-card" style="margin-top: 40rpx;">
				<view class="card-title">
					<text>使用发票号码验证</text>
				</view>
				<view class="card-body">
					<view class="inp">
						<text>发票代码</text>
						<input type="number" v-model="FPcode" value="" placeholder="请输入发票代码" />
					</view>
					<view class="inp">
						<text>发票号码</text>
						<input type="number" v-model="FPNumber" value="" placeholder="请输入发票号码" />
					</view>
					<view class="inp">
						<text>校验码</text>
						<input type="number" v-model="FPjym" value="" placeholder="请输入校验码" />
					</view>
					<button type="default" @click="checkFP">验证发票</button>
					<view class="careful">
						<text style="display: block; margin-bottom: 20rpx; font-weight: 700; font-size: 32rpx;">发票验证说明:</text>
						<text style="color: #666666;">本网站只能验证您持有的增值税普通电子发票是否是济南水务集团有限公司开具的并且内容是否真实有效！对于其他电子发票请到相关开票公司验证或到国家税务总局全国增值税发票查验平台查询。</text>
						<text style="display: block; margin-top: 20rpx; color: #666666;">24小时客服电话：0531-968133。</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tab-item" v-show="current == 2">
			<view class="auth-card" style="margin-top: 40rpx;">
				<view class="card-title">
					<text>发票补领下载</text>
				</view>
				<view class="card-body">
					<view class="inp">
						<text>申领代码</text>
						<input type="text" v-model="applyCode" value="" placeholder="请输入申领代码" />
					</view>
					<button type="default" @click="quickapply">下载发票</button>
					<view class="careful">
						<text style="display: block; margin-bottom: 20rpx; font-weight: 700; font-size: 32rpx;">发票领取说明:</text>
						<text style="color: #666666;">在您收到济南水务集团有限公司发送的电子发票开票通知短信后，即可登录本网站获取我司开局的增值税普通电子发票打印版式文件（PDF格式），本电子发票与纸质发票均为国家税务总局认定的具有法律效力，如有疑问可以与国税总局询问，国税总局电话：12366。</text>
						<text style="display: block; margin-top: 20rpx; color: #666666;">24小时客服电话：0531-968133。</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tab-item" v-show="current == 100">
			<view class="auth-card" style="margin-top: 40rpx;">
				<view class="card-title">
					<text :style="{color: show == 0 ? '#00919f': '#333'}" style="margin-right: 60rpx;" @click="show = 0">开票信息</text>
					<text :style="{color: show == 1 ? '#00919f': '#333'}" @click="show = 1">用户基本信息</text>
				</view>
				<view class="card-body">
					<view class="InvoiceInfo" v-show="show == 0">
						<view class="radios">
							<radio-group @change="radioChange">
								<radio value="r1" checked /><text style="margin-right: 100rpx;">个人</text>
								<radio value="r2" /><text>单位</text>
							</radio-group>
						</view>
						<view class="r1-infos" v-show="r1">
							<view class="r1-item">
								<text>姓名:</text>
								<text>张芳</text>
							</view>
							<view class="r1-item">
								<text>发票电话:</text>
								<input type="text" value="" />
							</view>
							<view class="">
								<text class="changes">变更</text>
								<text class="tips">重要提示:信息修改后立即生效!</text>
							</view>
						</view>
						<view class="r2-infos" v-show="r2">
							<view class="r1-item">
								<text>单位名称:</text>
								<text>济南水务</text>
							</view>
							<view class="r1-item">
								<text>纳税号:</text>
								<input type="text" value="" />
							</view>
							<view class="r1-item">
								<text>开户银行:</text>
								<input type="text" value="" />
							</view>
							<view class="r1-item">
								<text>开户账号:</text>
								<input type="text" value="" />
							</view>
							<view class="r1-item">
								<text>发票电话:</text>
								<input type="text" value="" />
							</view>
							<view class="">
								<text class="changes">变更</text>
								<text class="tips">重要提示:信息修改后立即生效!</text>
							</view>
						</view>
					</view>
					<view class="userInfo" v-show="show == 1">
						<view class="items-left">
							<text>给水号:</text>
							<text>抄码编号:</text>
							<text>客户名称:</text>
							<text>客户地址:</text>
							<text>人口基数:</text>
							<text>签约开始:</text>
							<text>签约结束:</text>
							<text>一阶基数:</text>
							<text>二阶基数:</text>
							<text>年用水量:</text>
							<text>预存余额:</text>
							<text>当前违约金:</text>
							<text>联系电话1:</text>
							<text>联系电话2:</text>
							<text>发票类型:</text>
						</view>
						<view class="items-right">
							<text>316489</text>
							<text>25-123-365</text>
							<text>张芳</text>
							<text>西客站腊山河东路绿地广场</text>
							<text>4</text>
							<text>2016-06-22</text>
							<text>2049-06-22</text>
							<text>144</text>
							<text>144</text>
							<text>69</text>
							<text>0.00</text>
							<text>0.00</text>
							<text>8848568</text>
							<text>15954758985</text>
							<text>增值税普通电子发票</text>
						</view>
					</view>

				</view>
			</view>
			<view class="explain" style="margin-top: 60rpx;">
				<text class="title">温馨提示:</text>
				<text class="tips">您可以通过点击补领发票按钮申请或补领电子发票，但对于交费时间超过3年（最长40个月）的水费发票无法申领或补领发票。对于已交费无法申领或补领的电子发票请前往就近的营业网点补打发票。</text>
			</view>
		</view>
		<u-modal v-model="fpblShow" :mask-close-able="true" title="电子发票校验" confirm-text="下载发票PDF文件" :async-close="true"
		 @confirm="downloadFP">
			<view class="slot-content" style="width: 100%; padding: 30rpx;">
				<view class="" style="color: #8a6d3b;">
					<text>请认真比对下面的内容与您手中所持有的发票内容是否一致。</text>
				</view>
				<view class="FPItem">
					<text>发票代码:</text><text>{{ FPdetail.dzfpdm }}</text>
				</view>
				<view class="FPItem">
					<text>发票号码:</text><text>{{ FPdetail.dzfphm }}</text>
				</view>
				<view class="FPItem">
					<text>校验码:</text><text>{{ FPdetail.dzfpjym }}</text>
				</view>
				<view class="FPItem">
					<text>出单日期:</text><text>{{ FPdetail.R1 }}</text>
				</view>
				<view class="FPItem">
					<text>户名:</text><text>{{ FPdetail.HM }}</text>
				</view>
				<view class="FPItem">
					<text>地址:</text><text>{{ FPdetail.MP }}</text>
				</view>
				<view class="FPItem">
					<text>发票金额:</text><text>{{ FPdetail.FPJE || FPdetail.XZJE }}</text>
				</view>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '自助申领'
				}, {
					name: '验证发票'
				}, {
					name: '快速申领'
				},
				// {
				// 	name: '开票信息'
				// }, 
				],
				current: 0,
				noverification: true,
				verification: false,
				isshow: null,
				show: 0,
				r1: true,
				r2: false,
				gsh: "",
				code: "",
				FPList: [],
				fpblShow: false,
				FPdetail: {},
				Invoiceshow: false,
				CDRQ: "",
				InvoiceItem: {},
				FPcode: "",
				FPNumber: "",
				FPjym: "",
				applyCode: ""

			}
		},
		methods: {
			// tab切换
			change(index) {
				this.current = index;
			},
			// 验证并申领
			async pass() {
				if (!this.gsh) {
					uni.showToast({
						title: '请输入给水号',
						icon: 'none'
					})
					return
				}
				if (!this.code) {
					uni.showToast({
						title: '请输入给水号',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '正在验证···'
				})
				const info = uni.getStorageSync('isLogin');
				await this.$u.post('/api/invoice/YonghuYanZheng', {
					token: info.token,
					gsh: this.gsh,
					uidm: this.code
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: '验证成功',
						})
						this.noverification = false
						this.verification = true
						this.getFPList(res.data.GS)
					} else {
						uni.showToast({
							title: '请检查输入的给水号及验证码是否正确',
							icon: 'none'
						})
					}
				})
			},
			// 获取发票列表
			async getFPList(gsh) {
				const info = uni.getStorageSync('isLogin');
				await this.$u.get('/api/invoice/FaPiaoList', {
					token: info.token,
					gsh: gsh
				}).then(res => {
					// console.log(res)
					this.FPList = res.data
				})
			},
			// 展开详情
			openDetail(index) {
				if (this.isshow == index) {
					this.isshow = null
				} else {
					this.isshow = index
				}
			},
			// 发票补领
			fpbl(item) {
				// console.log(item)
				this.fpblShow = true
				this.FPdetail = item
			},
			// 下载发票
			async downloadFP() {
				const info = uni.getStorageSync('isLogin');
				await this.$u.get('/api/invoice/getFpPdf', {
					token: info.token,
					DZFPSQDM: this.FPdetail.dzfpsqdm
				}).then(res => {
					if (res.code == 1) {
						uni.downloadFile({
							url: res.data.RedirectURL,
							success: (res) => {
								if (res.statusCode === 200) {
									var filePath;
									if(this.$u.os() == 'android') {
										filePath = res.tempFilePath;
									} else {
										filePath = escape(res.tempFilePath)
									}
									uni.openDocument({
										filePath: filePath,
										success: function(res) {
											console.log('打开文档成功');
										},
										fail: (err) => {
											console.log(err)
										}
									});
									this.fpblShow = false
									this.getFPList(this.gsh)
									// this.verification = true
								}
							}
						});
					}
				})
			},
			// 开票
			Invoice(item) {
				this.Invoiceshow = true;
				this.CDRQ = item.R1
				this.InvoiceItem = item
			},
			// 确定开票
			async Invoiceconfirm() {
				const info = uni.getStorageSync('isLogin');
				await this.$u.get('/api/invoice/KaiPiao', {
					token: info.token,
					gsh: this.InvoiceItem.GS,
					ID: this.InvoiceItem.ID,
					R1: this.InvoiceItem.R1
				}).then(res => {
					// console.log(res)
					if (res.code == 1) {
						this.Invoiceshow = false
						this.fpblShow = true
						this.FPdetail = res.data
						this.FPdetail.R1 = this.CDRQ
						this.FPdetail.HM = this.InvoiceItem.HM
						this.FPdetail.MP = this.InvoiceItem.MP
						this.FPdetail.XZJE = this.InvoiceItem.XZJE
					}
				})
			},
			// 交费
			goPay(gsh) {
				uni.navigateTo({
					url: '../tabbar/mine/pay/pay?GS=' + gsh
				})
			},
			// 发票验证
			async checkFP() {
				const info = uni.getStorageSync('isLogin');
				await this.$u.get('/api/invoice/YanZheng', {
					token: info.token,
					gsh: "",
					FPDM: this.FPcode,
					FPHM: this.FPNumber,
					JYM: this.FPjym
				}).then(res => {
					console.log(res)
					if (res.code == 1) {
						this.fpblShow = true;
						this.FPdetail = res.data
					} else {
						this.$refs.uToast.show({
							title: '验证失败,请检查输入的内容是否正确',
							type: 'error'
						})
					}
				})
			},
			// 快速申领
			async quickapply() {
				uni.showLoading({
					title: '正在获取中···'
				})
				const info = uni.getStorageSync('isLogin');
				await this.$u.get('/api/invoice/getFpPdf', {
					token: info.token,
					DZFPSQDM: this.applyCode
				}).then(res => {
					if (res.code == 1) {
						uni.downloadFile({
							url: res.data.RedirectURL,
							success: (res) => {
								if (res.statusCode === 200) {
									var filePath = res.tempFilePath;
									uni.openDocument({
										filePath: filePath,
										success: function(res) {
											console.log('打开文档成功');
										}
									});
								}
							}
						});
					} else {
						uni.showToast({
							title: '获取信息失败,请稍后重试'
						})
					}
				})
			},
			radioChange(e) {
				if (e.detail.value == 'r1') {
					this.r1 = true
					this.r2 = false
				} else {
					this.r1 = false
					this.r2 = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slot-content {
		.FPItem {
			display: flex;
			width: 100%;
			margin: 20rpx 0;

			text:first-child {
				display: inline-block;
				// width: 140rpx
				width: 26%;
				;
				text-align: right;
				margin-right: 15rpx;
			}

			text:last-child {
				display: inline-block;
				width: 74%;
				font-weight: 700;
			}
		}
	}

	.tab-item {
		width: 100%;
		padding: 0 40rpx;
		padding-bottom: 50rpx;

		.auth-card {
			width: 100%;
			border: 1px solid #EEEEEE;
			border-radius: 10rpx;

			.card-title {
				width: 100%;
				padding: 20rpx 30rpx;
				background-color: #d9edf7;
				border-radius: 10rpx 10rpx 0 0;
				color: $mytheme-color;
				font-size: 32rpx;
			}

			.card-body {
				width: 100%;
				padding: 30rpx;
				font-size: 32rpx;

				.inp {
					display: flex;
					margin-bottom: 30rpx;

					text {
						width: 170rpx;
						height: 74rpx;
						line-height: 74rpx;
						text-align: center;
						background-color: #EEEEEE;
						padding: 0 20rpx;
						border-radius: 8rpx 0 0 8rpx;
					}

					input {
						width: 70%;
						height: 70rpx;
						border: 1px solid #EEEEEE;
						border-radius: 0 8rpx 8rpx 0;
						padding-left: 10rpx;
						font-size: 28rpx;
					}
				}

				.careful {
					font-size: 28rpx;
				}

				.userInfo {
					display: flex;
					justify-content: space-around;
					width: 100%;

					text {
						display: block;
						height: 70rpx;
					}

					.items-left {
						text-align: right;
					}
				}

				.InvoiceInfo {
					.radios {
						padding-left: 60rpx;

						text {
							vertical-align: middle;
						}
					}

					.r1-infos,
					.r2-infos {
						width: 100%;

						.r1-item {
							display: flex;
							align-items: center;
							margin-top: 50rpx;

							text:first-child {
								display: block;
								width: 140rpx;
								text-align: right;
								margin-right: 30rpx;
							}

							input {
								width: 66%;
								height: 70rpx;
								padding-left: 20rpx;
								border: 1px solid #CCCCCC;
								vertical-align: middle;
							}
						}

						.changes {
							display: block;
							width: 150rpx;
							text-align: center;
							border-radius: 10rpx;
							padding: 10rpx 0;
							border: 1px solid #CCCCCC;
							margin: 0 auto;
							margin-top: 50rpx;
						}

						.tips {
							display: block;
							width: 100%;
							text-align: center;
							margin: 50rpx 0;
						}
					}
				}
			}

		}

		button {
			width: 50%;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 32rpx;
			background-color: #5bc0de;
			color: #FFFFFF;
			margin: 80rpx auto;
		}

		.explain {
			width: 100%;
			padding: 40rpx 30rpx;
			background-color: #fcf8e3;
			border-radius: 10rpx;
			margin-bottom: 50rpx;

			text {
				display: block;
				font-size: 32rpx;
				color: #8a6d3b;
			}

			.title {
				font-weight: 700;
				margin-bottom: 15rpx;
			}

			.tips {
				margin-bottom: 40rpx;
			}
		}

		.verification {
			width: 100%;

			.verification-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				padding: 20rpx 30rpx;
				// background-color: #f2dede;
				border-radius: 10rpx;
				margin-top: 40rpx;

				.times {
					font-size: 32rpx;

					text:first-child {
						margin-right: 15rpx;
					}

					text:nth-child(2) {
						margin-right: 20rpx;
					}
				}

				.tags {
					height: 50rpx;
					line-height: 50rpx;

					padding: 0 10rpx;
					border-radius: 8rpx;
				}

				.bg-blue {
					background-color: #5bc0de;
					color: #FFFFFF;
				}

				.bg-green {
					background-color: #5cb85c;
					color: #FFFFFF;
				}

				.color-r {
					color: #d9534f;
				}

				.color-b {
					color: #447e9b;
				}

				.color-g {
					color: #3c763d;
				}

			}

			.bg-b {
				background-color: #d9edf7;
			}

			.bg-gr {
				background-color: #dff0d8;
			}

			.bg-r {
				background-color: #f2dede;
			}

			.bg-red {
				background-color: #d9534f;
				color: #FFFFFF;
			}

			.bg-blue {
				background-color: #5bc0de;
				color: #FFFFFF;
			}

			.bg-green {
				background-color: #5cb85c;
				color: #FFFFFF;
			}

			.opens {
				width: 100%;
				// height: 200rpx;
				border: 1px solid #EEEEEE;
				border-radius: 0 0 10rpx 10rpx;
				border-top: 0;
				overflow: hidden;
				animation: mymove 0.2s linear;

				@keyframes mymove {
					from {
						height: 0rpx;
					}

					to {
						height: 400rpx;
					}
				}

				.open-items {
					width: 100%;
					padding-top: 30rpx;

					text {
						display: block;
						margin-bottom: 10rpx;
					}

					.yue,
					.details {
						display: flex;
						justify-content: space-between;
						padding: 0 30rpx;

						.btns {
							// width: 120rpx;
							height: 70rpx;
							line-height: 70rpx;
							text-align: center;
							border-radius: 10rpx;
							padding: 0 30rpx;
						}
					}
				}

				.open-table {
					margin-top: 30rpx;
				}
			}
		}
	}
</style>
