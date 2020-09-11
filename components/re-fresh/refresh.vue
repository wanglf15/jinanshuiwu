<template>
	<view class="refresh refreshCase" style="width: 100%;height: 100%;">
		<view class="loading" :style="{ height: `${move}`, opacity: `${Math.round(parseInt(move) / 94)}` }">
			<view v-if="loading" class="item flex_row_c hint"><text>下拉刷新...</text></view>
			<view v-else class="item flex_row_c loading">
				<image
					src="data:image/gif;base64,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"
					mode=""
				></image>
				<text>加载中...</text>
			</view>
		</view>
		<view class="refresh refreshOperator" :style="{ transform: `translate3d(0,${move},0)` }" @touchend="touchend" @touchstart="touchstart" @touchmove="touchmove">
			<scroll-view style="height: 100%;" scroll-y="true" @scrolltoupper="scrolltoupper" @scroll="scroll"><slot /></scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			triggered: true,
			move: 0,
			loading: true
		};
	},
	onLoad() {},
	methods: {
		scrolltoupper() {
			this.triggered = true;
		},
		scroll(ev) {
			let t = ev.detail.scrollTop;
			if (t > 0) this.triggered = false;
		},
		touchstart(ev) {
			if (!this.triggered || this.close) return;
			this.startY = ev.changedTouches[0].clientY;
		},
		touchmove(ev) {
			if (!this.triggered || this.close) return;
			let moveY = ev.changedTouches[0].clientY,
				move = (moveY - this.startY) / 3,
				stand = 50;
			this.stand = stand;
			if (move > stand && !this.action) {
				this.action = true;
				clearTimeout(this.loadingTime);
				this.loadingTime = setTimeout(() => {
					this.loading = false;
					this.action = true;
					clearTimeout(this.loadingTime);
					this.send();
				}, 300); 
				return (this.move = `${stand}px`);
			} 
			if (move > 0 && !this.action) this.move = `${move}px`;
		},
		touchend() {
			this.action = false;
			clearTimeout(this.loadingTime);
			if (this.loading) this.pullClose();
		},
		send() {
			if (!this.triggered || this.close) return;
			this.startY = 0;
			if (parseInt(this.move) >= this.stand) {
				this.move = `${this.stand}px`;
				this.close = true;
				this.$emit('pullOpen', () => {
					this.pullClose();
					setTimeout(() => {
						this.close = false;
						this.loading = true;
					}, 300);
				});
			} else {
				this.pullClose();
			}
		},
		pullClose() {
			this.move = `0`;
		}
	}
};
</script>
<style lang="stylus">
.flex_row_c
  display flex
  align-items center
  justify-content center
.refreshCase
	position relative
	.loading
		position absolute
		top 0
		left 0
		width 100%
		transition all 0.2s
		overflow hidden
		.item
			width 100%
			height 100%
		image
			width 16px
			height 16px
		text
			margin-left 4px
			font-size 30rpx
			color #666
.refresh
	width 100%
	height 100%
	overflow hidden
	transition all 0.3s
</style>
