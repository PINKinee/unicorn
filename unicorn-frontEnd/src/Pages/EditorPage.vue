<template>
	<div class="container">
		<!-- 头部部分 -->
		<Header></Header>
		<!-- 主体部分 -->
		<div class="main">
			<!-- 左侧组件部分 -->
			<div class="left">
				<Component-list></Component-list>
			</div>
			<!-- 中间画布部分 -->
			<div class="middle">
				<Operation></Operation>
				<div class="writeBox" @scroll="scroll">
					<EditorPlate></EditorPlate>
				</div>
			</div>
			<!-- 右边组件部分 -->
			<div class="right">
				<Setting></Setting>
			</div>
		</div>
		<!-- 提示框 -->
		<div class="maskLayer" ref="maskLayer">
    		<div class="promptBox">
				<div class="headTitle">
					<div class="text">选择添加的事件类型</div>
					<div class="cha" @click="maskLayerHid">×</div>
				</div>
				<div class="promptMain">
					<div class="chooseMenu">
						<a-menu v-model:selectedKeys="current" mode="horizontal">
							<a-menu-item key="link" @click="eventIndex.showIndex = 1">
							网址跳转
							</a-menu-item>
							<a-menu-item key="alert" @click="eventIndex.showIndex = 2">
							弹框提示
							</a-menu-item>
						</a-menu>
					</div>
					<div class="chooseContent">
						<div 
						v-for="item in promptList"
						:key="item.id"
						class="linkContent" 
						v-show="eventIndex.showIndex === item.id"
						>
						<a-form
						:model="formState"
						name="promptContent"
						@finish="onFinish"
						class="promptForm"
						>
							<a-form-item
							:label="item.label"
							name="link"
							:rules="[{ required: true, message: item.message }]"
							>
							<a-input v-model:value="formState.link" class="link"/>
							</a-form-item>
							<a-form-item>
							<a-button 
							type="primary" 
							html-type="submit"
							class="determine"
							>
							确定
							</a-button>
							</a-form-item>
						</a-form>
						</div>
					</div>
				</div>
			</div>
 		</div>
	</div>
</template>

<script>
import { reactive } from 'vue';
import Header from '../components/Header.vue'
import ComponentList from '../components/ComponentList.vue'
import Operation from '../components/Operation.vue'
import Setting from '../components/Setting.vue'
import EditorPlate from '../components/EditorPlate.vue'
import elStore from '@/store/elStore.js'
import { computed, onBeforeUnmount, onMounted, provide, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { getRecentlySave } from '@/api'
import userStore from '@/store/userStore'
import snapshot from '@/store/snapshot'
import { deepCopy } from '@/hooks/DeepCopy'
import { UploadOutlined } from '@ant-design/icons-vue';
// import { storeToRefs } from 'pinia'

export default {
	name: 'Home',
	components: { Header, ComponentList, Operation, Setting, EditorPlate, UploadOutlined },
	setup() {
		const route = useRoute()
		const useSnapshot = snapshot()
		const useElStore = elStore()
        const maskLayer = ref(null)
		const current = ref(['link']);
		const formState = reactive({
			link: '',
		});
		let elsIdx = useElStore.elsIdx;
		const promptList = [
			{id: 1, title: 'chooseContent', label: '跳转地址', message: '请输入想跳转的地址'},
			{id: 2, title: 'alertContent', label: '弹框内容', message: '请输入想弹出的内容'},
		];
		
		let eventIndex = reactive({
			showIndex: 1,
		});
		useElStore.maskLayerValue = maskLayer;
		
		const onFinish = values => {
			 useElStore.els[elsIdx[0]][elsIdx[1]].link = values.link + eventIndex.showIndex;
			 maskLayer.value.style.display = 'none'
			 // 判断是否添加了事件
      		 judge();
		}

		// 判断是否添加了事件
		function judge() {
			if(elsIdx[0] === -1 || elsIdx[1] === -1) {
				useElStore.judgeIsShow = false;
				return;
			}
			if(useElStore.els[elsIdx[0]][elsIdx[1]].link === '') {
				useElStore.judgeIsShow = false;
			} else {
				useElStore.judgeIsShow = true;
			}
		}

		// 防抖
		function debounce(fn, wait) {
			let timeoutID = null
			let flag = true
			return function (e) {
				if (timeoutID != null && flag) clearTimeout(timeoutID)
				timeoutID = setTimeout(fn, wait, e, flag)
			}
		}
		const scrollHandle = (e) => {
			useElStore.editorScroll = e.target.scrollLeft
		}
		const scroll = debounce(scrollHandle, 1000)

		const uStore = userStore()
		//获取保存模板数据
		const productName = ref(route.params.productName)
		provide('productName', productName)
		const getSaveByName = async () => {
			await getRecentlySave(
				uStore.username,
				route.params.productName
			)
		}
		//提示框消失
		function maskLayerHid() {
			maskLayer.value.style.display = 'none'
		}

		onMounted(() => {
			getSaveByName();
			useSnapshot.snapshotIndex = -1;
			useSnapshot.snapshotData = [];
			useSnapshot.snapshotData[++useSnapshot.snapshotIndex] = deepCopy(
				useElStore.els
			)
			useElStore.judgeIsShow = false
			useElStore.elsIdx[0] = -1;
			useElStore.elsIdx[1] = -1;
			useElStore.editorScroll = 0;
		})

		onBeforeUnmount(() => {
			useElStore.updataEls(Array.from(new Array(6), () => []))
		})

		return {scroll, 
				maskLayer,
				current, 
				eventIndex, 
				maskLayerHid,
				formState,
				onFinish,
				promptList,
				}
	},
}
</script>

<style lang="less" scoped>
* {
	margin: 0;
	padding: 0;
}
.container {
	width: 100%;
	height: 100%;
	background-color: #eeecf0;
	.main {
		display: flex;
		justify-content: center;
		padding: 0 15px;
		overflow: hidden;
		.left {
			margin-top: 65px;
			padding-left: 0;
			width: 290px;
			height: 673px;
			background-color: #fff;
			border-radius: 6px;
			overflow: hidden;

		}
		.middle {
			// flex:1;
			margin: 0 20px;
			margin-top: 65px;
			width: 876px;
			height: 673px;
			border-radius: 6px;
			background-color: #fff;
			.writeBox {
				width: 100%;
				height: calc(100% - 61px);
				overflow-y: scroll;
				&::-webkit-scrollbar {
					width: 10px;
					height: 10px;
				}

				&::-webkit-scrollbar-thumb {
					background-color: #c5c8c7;
					border-radius: 32px;
				}
				
				&::-webkit-scrollbar-track {
					background-color: #f3f3f3;
					border-radius: 32px;
				}	
			}
		}
		.right {
			margin-top: 65px;
			padding-right: 0;
			padding-bottom: 30px;
			width: 290px;
			height: 673px;
			background-color: #fff;
			border-radius: 6px;
			overflow: hidden;
			overflow-y: auto;
			&::-webkit-scrollbar {
					width: 10px;
					height: 10px;
				}

				&::-webkit-scrollbar-thumb {
					background-color: #c5c8c7;
					border-radius: 32px;
				}
				
				&::-webkit-scrollbar-track {
					background-color: #f3f3f3;
					border-radius: 32px;
				}	
		}
	}
	.maskLayer {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 999;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.5);		
		display: none;
		.promptBox {
		width: 600px;
		height: 400px;
		margin: 0 auto;
		margin-top: 200px;
		background-color: #fff;
		border-radius: 4px;
		opacity: 1;
			.headTitle {
				padding: 10px 20px;
				display: flex;
				justify-content: space-between;
				.text, .cha {
					font-size: 20px;
					opacity: 1;
				}
				.cha {
					cursor: pointer;
				}
			}
			.promptMain {
				.chooseMenu {
					/deep/.ant-menu-overflow {
						&::before {
							display: none;
						}
						justify-content: space-around;
						.ant-menu-overflow-item {
							padding: 0 64px;
							cursor: pointer;
						}
					}
				}
			}
			.chooseContent {
				.promptForm {
					margin-top: 80px;
					padding: 0 80px;
					.link {
					width: 300px;
					height: 40px;
					margin-bottom: 60px;
					/deep/.ant-form-item-control-input-content {
						flex: none;
					}
					}
					.determine {
						width: 80px;
						height: 40px;
						border-radius: 4px;
						margin-left: 182px;
					}
				}
			}
		}
	}
}
</style>
