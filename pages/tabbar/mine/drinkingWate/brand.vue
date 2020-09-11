<template>
	<view class="container">
		<jyf-parser class="content" :html="content" ref="article" selectable domain="https://tougao.goodclouds.cn" lazy-load use-cache></jyf-parser>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
		    jyfParser
		},
		data () {
			return{
				content: null
			}
		},
		onLoad(option) {
			let title;
			if (option.type == 'ppwh') {
				title = '品牌文化'
			} else {
				title = '净水工艺'
			}
			uni.setNavigationBarTitle({
			    title: title
			});
			this.getContent(option.type)
		},
		methods: {
			// 获取品牌文化/净水工艺内容
			async getContent (type) {
				const isLogin = uni.getStorageSync('isLogin')
				await this.$u.get('/api/zys/getDy', {keyword: type, token: isLogin.token}).then(res => {
					this.content = res.content
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	padding: 40rpx;
	/deep/ .content {
		span {
			font-size: 36rpx !important;
			line-height: 70rpx;
		}
	}
}
</style>
