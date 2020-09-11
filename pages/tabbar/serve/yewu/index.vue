<template>
	<view class="business">
		<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: null,
				webviewStyles: {
				    progress: {
				        color: '#19be6b'
				    }
				}
			}
		},
		onLoad(option) {
			// console.log((this.$u.queryParams(option, false)).slice(4));
			const src = (this.$u.queryParams(option, false)).slice(4)
			this.url = src
			// if (option.id && !option.idd) {
			// 	this.url = option.url + '&id=' + option.id
			// } else if(option.id && option.idd) {
			// 	this.url = option.url + '&id=' + option.id + '&idd=' + option.idd
			// } else {
				// this.url = option.url
			// }
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
.business {
	width: 100%;
	.title {
		width: 100%;
		padding: 30rpx;
		text-align: center;
		box-sizing: border-box;
		font-weight: 700;
		font-size: 36rpx;
	}
	.container {
		padding: 0 30rpx;
		box-sizing: border-box;
		line-height: 70rpx;
		p {
			text-indent: 20px;
			font-size: 36rpx;
		}
		text {
			font-size: 36rpx;
		}
		h4 {
			font-size: 36rpx;
		}
	}
}
</style>

