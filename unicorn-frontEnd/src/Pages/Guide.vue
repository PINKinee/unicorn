<template>
	<div class="guide">
		<HeadNav />
		<div class="title">
			<div class="projectName">
				<div class="proTitle">
					<strong>Unicorn</strong>
					<h5>低代码快速搭建平台</h5>
					<h5>让想法变成现实</h5>
				</div>
				<div class="toLogin" @click="toLogin">立即使用</div>
			</div>
			<img src="../assets/guideBg2.png" alt="" />
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router'
import HeadNav from '@/components/HeadNav.vue'

export default {
	components: { HeadNav },
	setup() {
		const router = useRouter()
		const toLogin = () => {
			router.push('/login')
		}

		return { toLogin }
	},
}
</script>

<style lang="less" scoped>
.guide {
	width: 100%;
	height: 100%;
	background: url('../assets/login-bg.svg');
	.title {
		width: 1200px;
		margin: 50px auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.projectName {
			font-family: Book Antiqua;
			color: rgb(127, 180, 209);
			.proTitle {
				font-size: 50px;
			}
			.toLogin {
				font-size: 18px;
				display: block;
				width: 100px;
				height: 50px;
				margin-top: 50px;
				text-align: center;
				font-weight: light;
				font-family: Book Antiqua;
				text-align: center;
				line-height: 50px;
				letter-spacing: -1px;
				color: white;
				border-radius: 10px;
				border: none;
				background: #5a99d4;
				cursor: pointer;
				box-shadow: 0 0 0 0 rgba(#5a99d4, 0.5);
				animation: pulse 1.5s infinite;
				display: flex;
				padding: 10px;
				justify-content: center;
				align-items: center;
				box-shadow: 0 3px 6px 1px #99d0f029;
				cursor: pointer;
			}
		}
		@keyframes pulse {
			0% {
				@include transform(scale(0.7));
			}
			70% {
				@include transform(scale(0.5));
				box-shadow: 0 0 0 50px rgba(#5a99d4, 0);
			}
			100% {
				@include transform(scale(0.7));
				box-shadow: 0 0 0 0 rgba(#5a99d4, 0);
			}
		}
		h5 {
			color: rgb(31, 103, 144);
		}
	}
}
</style>
