<template>
	<view>
		<web-view :src="src" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				webviewStyles: {
				    progress: {
				    	color: '#19be6b'
				    },
				}
			};
		},
		onLoad(option) {
			console.log(option)
			if (option.type == 1) {
				this.src = 'https://tougao.goodclouds.cn/appdy/12.html'
			} else {
				this.src = 'https://tougao.goodclouds.cn/appdy/11.html'
			}
		}
	}
</script>

<style lang="less">

</style>
