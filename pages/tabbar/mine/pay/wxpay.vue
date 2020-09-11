<template>
	<view class="container">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				url: ""
			}
		},
		onLoad(option) {
			this.url = this.$Url + `/wxjf/${option.GSH}.html`
			setTimeout(function () {
				uni.navigateBack({
					delta: 1
				})
				// uni.navigateTo({
				// 	url: './pay?GS=' + option.GSH
				// }) 
			}, 3000)
		},
		methods: {
			
		}
	}
</script>

<style>
</style>
