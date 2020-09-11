<template>
	<view class="container">
		<web-view :webview-styles="webviewStyles" :src="link"></web-view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				link: null,
				webviewStyles: {
				    progress: {
				        color: '#19be6b'
				    }
				},
			}
		},
		onLoad(option) {
			console.log(option.id)
			this.getLiveDetail(option.id)
		},
		methods: {
			// 获取直播详情 http://mudu.tv/watch/6991067
			async getLiveDetail (id) {
				await this.$u.get('/api/live/getLiveDetail?id=' + id).then(res => {
					this.link= res.data.rtmpurl
				})
			}
		}
	}
</script>

<style>
</style>
