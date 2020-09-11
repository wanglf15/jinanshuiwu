<template>
	<view class="waterCharg">
		<web-view :webview-styles="webviewStyles" src="http://yx.jnwater.com.cn/ShouFeiZJJ/H5" style="margin-top: 0rpx;"></web-view>
	</view>
</template>

<script>
export default {
	data () {
		return {
			webviewStyles: {
			    progress: {
			        color: '#19be6b'
			    }
			}
		}
	},
}
</script>

<style lang="less" scoped>

</style>
