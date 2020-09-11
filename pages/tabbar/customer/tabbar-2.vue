<template>
	<view class="customer">
		<view class="toast"></view>
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				src: 'https://net.zoosnet.net/LR/Chatpre.aspx?id=NET95634826&cid=1526231261571194720042&lng=cn&sid=1526231261571194720042&p=http%3A//www.jnwater.com.cn/&rf1=&rf2=&msg=&d=1526231265357',
				webviewStyles: {
					progress: {
					    color: '#19be6b'
					},
				},
			}
		}
	}
</script>

<style lang="less">
	.toast {
		position: absolute;
		top: 0;
		right: 0;
		width: 60rpx;
		height: 84rpx;
		background: url(../../../static/img/img/top1.gif);
		z-index: 99999;
	}
</style>