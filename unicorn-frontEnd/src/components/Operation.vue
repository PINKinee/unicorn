<template>
	<div class="operation">
		<div class="o-left" @click="undo(useElStore.rectValue)">
			<img src="../assets/left.png" alt="撤销" />
			<span>撤销</span>
		</div>
		<div class="text-alignment">
			<div
				v-for="item in AlignList"
				:key="item.id"
				class="item"
				@click="item.align(elsIdx, useElStore.rectValue)"
			>
				<img :src="item.img" :alt="item.title" class="item-img" />
				<p>{{ item.title }}</p>
			</div>
		</div>
		<div class="o-right" @click="redo(useElStore.rectValue)">
			<span>重做</span>
			<img src="../assets/right.png" alt="重做" />
		</div>
	</div>
</template>
<script>
import snapshot from '@/store/snapshot'
import elStore from '@/store/elStore'

export default {
	name: 'Operation',
	setup() {
		let useSnapshot = snapshot()
		let useElStore = elStore()
		//所选中的元素
		let elsIdx = useElStore.elsIdx
		//画布数据
		let els = useElStore.els

		const AlignList = [
			{
				id: 1,
				title: '居左对齐',
				img: require('../assets/' + 'align-left.png'),
				align: alignLeft,
			},
			{
				id: 2,
				title: '居中对齐',
				img: require('../assets/' + 'align-center.png'),
				align: alignCenter,
			},
			{
				id: 3,
				title: '居右对齐',
				img: require('../assets/' + 'align-right.png'),
				align: alignRight,
			},
			{
				id: 4,
				title: '两端对齐',
				img: require('../assets/' + 'full-justified.png'),
				align: alignFullJustified,
			},
		]

		//撤回方法
		function undo(rectValue) {
			useSnapshot.undo()
			if (!(JSON.parse(JSON.stringify(useElStore.els) === '{}')) && elsIdx[0] !== -1 && elsIdx[1] !== -1 && !(useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]] === undefined)) {
				useElStore.rectStyle.style = useElStore.els[elsIdx[0]][elsIdx[1]].style;
			}
			useSnapshot.isSnapshot = true;
			if (useElStore.rectIsShow && elsIdx[0] !== -1 && elsIdx[1] !== -1) {
				rectSynchronous(rectValue)
			}
		}

		//使矩形选择框同步到元素当前的位置
		function rectSynchronous(rectValue) {
			if (
				JSON.parse(JSON.stringify(useElStore.els) === '{}') || useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]] === undefined
			) {
				useElStore.rectIsShow = false
			} else {
				useElStore.rectStyle.style.left =
					useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].style.left
				useElStore.rectStyle.style.top =
					useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].style.top
				useElStore.rectStyle.style.width =
					useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].style.width
				useElStore.rectStyle.height =
					useElStore.els[useElStore.elsIdx[0]][
						useElStore.elsIdx[1]
					].style.height
				useElStore.rectStyle.style.rotate =
					useElStore.els[useElStore.elsIdx[0]][
						useElStore.elsIdx[1]
					].style.rotate
			}
		}

		//恢复方法
		function redo(rectValue) {
			useSnapshot.redo()
			useSnapshot.isSnapshot = true;
			if (useElStore.rectIsShow && elsIdx[0] !== -1 && elsIdx[1] !== -1) {
				rectSynchronous(rectValue)
			}
		}

		 //居左对齐  
		function alignLeft(elsIdx, rectValue) {
		if (useElStore.rectIsShow) {
			useElStore.els[elsIdx[0]][elsIdx[1]].style.left = useElStore.editorScroll;
			rectSynchronous(rectValue); 
			//居左对齐时，添加新的快照
			useSnapshot.recordSnapshot();
		}
		}

		//居中对齐
		function alignCenter(elsIdx, rectValue) {
		if (useElStore.rectIsShow) {
			useElStore.els[elsIdx[0]][elsIdx[1]].style.left = 876 / 2 - useElStore.els[elsIdx[0]][elsIdx[1]].style.width / 2 + useElStore.editorScroll;
			rectSynchronous(rectValue); 
			//居中对齐时，添加新的快照
			useSnapshot.recordSnapshot();
		}
		}

    	//居右对齐
		function alignRight(elsIdx, rectValue) {
		if (useElStore.rectIsShow) {
			useElStore.els[elsIdx[0]][elsIdx[1]].style.left = 876 - useElStore.els[elsIdx[0]][elsIdx[1]].style.width + useElStore.editorScroll - 9;
			rectSynchronous(rectValue); 
			//居右对齐时，添加新的快照
			useSnapshot.recordSnapshot();
		}
		}

		//两端对齐
		function alignFullJustified(elsIdx, rectValue) {
		if (useElStore.rectIsShow) { 
			useElStore.els[elsIdx[0]][elsIdx[1]].style.left = useElStore.editorScroll;
			rectSynchronous(rectValue); 
			//两端对齐时，添加新的快照
			useSnapshot.recordSnapshot();
		}
		}

		return {
			AlignList,
			undo,
			redo,
			alignLeft,
			alignCenter,
			alignRight,
			alignFullJustified,
			elsIdx,
			useElStore,
		}
	},
}
</script>

<style lang="less" scoped>
.operation {
	border-bottom: 1px solid rgb(211, 209, 209);
	display: flex;
	justify-content: space-between;
	padding: 10px 15px;
	.o-left,
	.o-right {
		cursor: pointer;
		img {
			width: 40px;
			height: 40px;
			margin-right: 10px;
			vertical-align: middle;
		}
		span {
			font-size: 16px;
			line-height: 40px;
			font-weight: 700;
			vertical-align: middle;
		}
	}
	.o-right {
		img {
			margin-right: 0;
			margin-left: 10px;
		}
	}
	.text-alignment {
		display: flex;
		cursor: pointer;
		.item {
			width: 90px;
			height: 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			.item-img {
				width: 25px;
				height: 25px;
			}
			p {
				margin-top: 3px;
				font-size: 12px;
			}
		}
	}
}
</style>
