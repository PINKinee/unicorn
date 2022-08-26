<template>
	<header class="nav">
		<a href="#" class="hd-logo">
			<img src="../assets/logo.png" alt="logo" />
			<div class="headName">Unicorn</div>
		</a>
		<div class="hd-btns">
			<a-button class="btn" @click="save">保存</a-button>
			<a-modal v-model:visible="saveVisible" title="保存项目" @ok="addOk" @cancel="saveVisible = false">
				<a-input v-if="productName !== ''" v-model:value="projectName" placeholder="请输入项目名称" />
			</a-modal>
			<a-button class="btn" @click="preview">预览</a-button>
			<a-modal okText="确认" cancelText="取消" v-model:visible="preVisible" title="预览" @ok="handleOk">
				<p>{{ modalText }}</p>
			</a-modal>
			<a-button class="btn" @click="publish">发布</a-button>
			<a-modal okText="复制" cancelText="取消" v-model:visible="pubVisible" title="发布" @ok="pubOk">
				<p>项目地址</p>
				<a-input v-model:value="publishHref" id="input" />
			</a-modal>
		</div>
		<div class="hd-user">
			<div class="user-img"></div>
			<a-dropdown>
				<a class="ant-dropdown-link" @click.prevent>
					{{ username }}
					<DownOutlined />
				</a>
				<template #overlay>
					<a-menu>
						<a-menu-item>
							<a href="/#/userPage">我的模板</a>
						</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>
		</div>
	</header>
</template>

<script>
import {
	computed,
	defineComponent,
	inject,
	onMounted,
	reactive,
	ref,
} from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import userStore from '@/store/userStore'
import elStore from '@/store/elStore'
import { saveTemplate } from '@/api'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'

export default defineComponent({
	name: 'Header',
	components: {
		DownOutlined,
	},
	setup() {
		//路由
		const router = useRouter()
		let productName = ref('')

		const uStore = userStore()
		const useElStore = elStore()
		let { els } = storeToRefs(useElStore)

		const username = computed(() => uStore.username)
		//预览效果
		const { href } = router.resolve({
			name: 'preview',
			params: {
				projectId: uStore.username,
			},
		})

		const modalText = ref('即将要跳转到预览页面')
		const preVisible = ref(false)
		const preview = () => {
			preVisible.value = true
		}

		const handleOk = () => {
			preVisible.value = false
			window.open(href)
		}

		//保存项目
		//新建项目相关
		const saveVisible = ref(false)
		const projectName = ref(inject('productName'))
		const saveData = reactive({
			username: '',
			content: {},
			productName: '',
			cover: '',
		})
		const save = () => {
			saveVisible.value = true
		}

		const addOk = () => {
			const editorPlate = document.querySelector('.editorPlate')
			saveData.username = uStore.username
			console.log(els.value)
			els.value[5][0] = editorPlate.offsetWidth
			els.value[5][1] = editorPlate.offsetHeight
			saveData.content = JSON.stringify(els.value)
			saveData.productName = projectName.value
			saveVisible.value = false
			createPreimg(editorPlate)
		}

		//生成预览图
		function createPreimg(editorPlate) {
			new Promise((resolve) => {
				//生成mousedown的事件对象
				const mouseEvent = new MouseEvent('mousedown')
				//触发editorPlate的mousedown事件 为了让截图里面没有矩形选择框
				editorPlate.dispatchEvent(mouseEvent)
				resolve()
				//截屏
			}).then(() => {
				html2canvas(editorPlate, {
					scale: 4,
					useCORS: true,
					async: false,
					background: 'transparent',
					dip: window.devicePixelRatio * 4, //处理模糊问题
				}).then((canvas) => {
					let imgUrl = canvas.toDataURL('image/jpeg')
					saveData.cover = imgUrl
					saveTemplate(saveData)
					message.info('保存成功')
				})
			})
		}

		//发布
		const pubVisible = ref(false)
		let publishHref = ref('')
		const publish = () => {
			if (confirm('确定将本项目发布吗')) {
				pubVisible.value = true
				const { href } = router.resolve({
					name: 'publish',
					params: {
						projectName: projectName.value,
					},
				})
				publishHref.value = `http://${window.location.host}:8000/` + href
			}
		}
		const pubOk = () => {
			const input = document.getElementById('input')
			input.select()
			document.execCommand('copy')
		}

		onMounted(() => {
			productName = inject('productName')
			console.log(productName)
		})

		return {
			preview,
			addOk,
			save,
			modalText,
			preVisible,
			projectName,
			saveVisible,
			username,
			productName,
			handleOk,
			publish,
			pubVisible,
			pubOk,
			publishHref,
		}
	},
})
</script>

<style lang="less" scoped>
.nav {
	display: flex;
	width: 100%;
	height: 50px;
	padding: 0 20px;
	background: linear-gradient(to right, #80d3df, #a97ddb);
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	justify-content: space-between;
	align-items: center;

	.hd-logo {
		display: flex;

		img {
			margin: 0 8px;
			height: 40px;
		}

		.headName {
			font-size: 30px;
			line-height: 40px;
			font-family: Book Antiqua;
			color: rgb(255, 255, 255);
		}
	}

	.hd-btns {
		.btn {
			margin: 0 20px;
			border: none;
			background-color: #fff;
			font-size: 14px;
			box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.2);
		}
	}

	.hd-user {
		display: flex;
		align-items: center;

		.user-img {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-color: antiquewhite;
			margin-right: 10px;
		}

		.ant-dropdown-link {
			color: #000;
		}
	}
}
</style>
