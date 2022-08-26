<template>
	<div class="projectPreview">
		<div class="previewContent" :style="Style">
			<!-- 矩形 -->
			<div
				v-for="p of els[0]"
				:key="p.id"
				:class="`${p.class} ${p.animation}`"
				:style="{
					...styleFormat({ ...p.style }),
				}"
				@click="addClickEvent(p)"
			></div>
			<!-- 文本 -->
			<div
				v-for="p of els[1]"
				:key="p.id"
				:class="`${p.class} ${p.animation}`"
				:style="{
					...styleFormat({ ...p.style }),
				}"
				@click="addClickEvent(p)"
			>
				{{ p.content }}
			</div>
			<!-- 图片 -->
			<!-- <img src="" alt=""> -->
			<img
				v-for="p of els[2]"
				:key="p.id"
				:class="`${p.class} ${p.animation}`"
				:src="p.url"
				:style="{
					...styleFormat({ ...p.style }),
				}"
				@click="addClickEvent(p)"
			/>
			<!-- 按钮 -->
			<button
				v-for="p of els[3]"
				:key="p.id"
				:class="`${p.class} ${p.animation}`"
				:style="{
					...styleFormat({ ...p.style }, 'btn'),
				}"
				@click="addClickEvent(p)"
			>
				<a :href="p.other.href">{{ p.other.content }}</a>
			</button>
			<!-- 表单 -->
			<input
				v-for="p of els[4]"
				:key="p.id"
				:class="`${p.class} ${p.animation}`"
				:style="{
					...styleFormat({ ...p.style }),
				}"
				:type="p.other.type"
				v-model="p.content"
				:placeholder="p.other.tip"
				@click="addClickEvent(p)"
			/>
		</div>
	</div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import elStore from '@/store/elStore'
import { storeToRefs } from 'pinia'

export default {
	setup() {
		//pinia数据
		const useElStore = elStore()
		let { els } = storeToRefs(useElStore)

		//样式格式化
		function styleFormat(obj, type) {
			for (let key in obj) {
				if (
					typeof obj[key] == 'number' &&
					key != 'rotate' &&
					key != 'fontWeight' &&
					key != 'zIndex'
				)
					obj[key] = obj[key].toString() + 'px'
			}
			obj.backgroundImage = `url(${obj.backgroundImage})`
			obj.transform = `rotate(${obj.rotate}deg)`
			delete obj.rotate
			if (type == 'btn') obj.lineHeight = obj.height
			return obj
		}

		//设置页面宽度
		let Style = reactive({
			width: '0px',
		})

		//添加点击事件
		function addClickEvent(p) {
			if (p.link === '') return
			console.log(111)
			let index = p.link.slice(-1)
			if (index == 1) {
				window.location.href = p.link.slice(0, p.link.length-1);
			} else {
				alert(p.link.slice(0, p.link.length-1))
			}
		}

		onMounted(() => {
			Style.width = document.body.clientWidth + 'px'
		})

		return { els, Style, styleFormat, addClickEvent }
	},
}
</script>

<style lang="less" scoped>
.projectPreview {
	width: 100%;
	height: 100%;
	.previewContent {
		position: relative;
		margin: 0 auto;
	}
	.box,
	.text {
		position: absolute;
		width: 100px;
		word-wrap: break-word;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	input,
	button {
		position: absolute;
		box-sizing: border-box;
	}
	img {
		position: absolute;
	}
}
</style>
