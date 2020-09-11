<template>
	<view class="staff">
		<u-navbar back-text="返回" :is-fixed="true" title="员工风采" title-size="36" :background="background" title-color="#fff"
		 back-icon-color="#fff" :back-text-style="textColor"></u-navbar>
		 <view class="current" style="color: #FFFFFF;">
		 	{{ current }}/{{ len }}
		 </view>
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :interval="interval" :duration="duration" circular @change="change">
						<swiper-item v-for="(item, index) in StaffDetail" :key="index">
							<view class="swiper-item">
								<u-image :src="item" width="100%" height="500" mode="widthFix">
									<u-loading slot="loading"></u-loading>
								</u-image>
							</view>
							<view class="title">{{ title }}</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		
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
				indicatorDots: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				StaffDetail: null,
				title: '',
				current: '1',
				len: null
			}
		},
		onLoad(option) {
			this.getStaffDetail(option.id)
		},
		methods: {
			// 获取员工风采详情
			async getStaffDetail(id) {
				await this.$u.get('/api/gallery/getGalleryDetail', { id }).then(res => {
					res.imgs_arr.map((el, index) => {
						res.imgs_arr[index] = this.$Url + el
					})
					this.StaffDetail = res.imgs_arr
					this.title = res.title
					this.len = res.imgs_arr.length
				})
			},
			change(e) {
				this.current = e.detail.current + 1
			},
		}
	}
</script>

<style lang="less" scoped>
	.staff {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		background-color: #000000;
	}
	.uni-padding-wrap {
		margin-top: 20%;
		background-color: #000000;
		.swiper {
			width: 100%;
			height: 750rpx;
			background-color: #000000;
			image {
				width: 100%;
				height: 500rpx;
			}
			.title {
				position: absolute;
				bottom: 0;
				color: #FFFFFF;
				font-size: 32rpx;
				padding-left: 30rpx;
				box-sizing: border-box;
			}
		}
	}
	.current {
		width: 100%;
		text-align: center;
		padding: 30rpx 0;
		box-sizing: border-box;
		margin-top: 70rpx;
	}
</style>
