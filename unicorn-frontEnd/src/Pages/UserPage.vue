<template>
	<div class="userPage">
		<HeadNav />
		<div class="user">
			<div class="userInfo">
				<div class="avator">
					<a-avatar :size="80" style="color: #f56a00; background-color: #fde3cf"
						>U
					</a-avatar>
				</div>
				<div class="username" v-if="username === ''" @click="turnLogin">
					登录 / 注册
				</div>
				<div class="username" v-if="username !== ''">{{ username }}</div>

				<div class="projectInfo">
					<div class="projectCount">项目数：{{ `${projects.length} / 5` }}</div>
					<div class="Edited">已编辑：{{ projects.length }}</div>
					<div class="Published">已发布：{{ publishedCount }}</div>
				</div>
			</div>
			<div class="project">
				<div class="proItem">
					<div class="addProject">
						<plus-circle-outlined
							class="addImg"
							:style="{ fontSize: '60px', color: '#08c' }"
						/>
						<div class="create animate__bounce">
							<div class="importPro createPro" @click="importProject">
								<import-outlined
									class="proIcon"
									:style="{ fontSize: '23px', color: '#f3cc2f' }"
								/>
								<span>导入项目</span>
							</div>
							<div class="addPro createPro" @click="addProject">
								<file-add-outlined
									class="proIcon"
									:style="{ fontSize: '23px', color: '#8dbe10' }"
								/>
								<span>新建项目</span>
								<!-- <a-modal
									:visible="addVisible"
									title="新建项目"
									@ok="addOk"
									@cancel="addVisible = false"
								>
									<a-input
										v-model:value="addValue"
										placeholder="请输入项目名称"
									/>
								</a-modal> -->
							</div>
						</div>
					</div>
				</div>
				<div
					class="pro proItem"
					:class="
						(index == 0 && projects.length == 1) ||
						(index == 3 && projects.length == 4)
							? 'right'
							: ''
					"
					v-for="(pro, index) in projects"
					:key="index"
				>
					<div class="addProject">
						<div class="addImg">
							<img :src="pro.cover" alt="" />
							<div class="proName">{{ pro.productName }}</div>
							<div class="saveTime">{{ pro.saveTime }}</div>
						</div>

						<div class="create animate__bounce">
							<div class="importPro createPro" @click="editorProject(pro)">
								<edit-outlined
									class="proIcon"
									:style="{ fontSize: '23px', color: '#2546ee' }"
								/>
								<span>编辑项目</span>
							</div>
							<div class="addPro createPro" @click="savePro(pro)">
								<save-outlined
									class="proIcon"
									:style="{ fontSize: '23px', color: '#25ebee' }"
								/>
								<span>修改项目</span>
								<a-modal
									:visible="saveVisible"
									title="修改项目名称"
									@ok="saveOk"
									@cancel="saveVisible = false"
								>
									<a-input
										v-model:value="saveValue"
										placeholder="请输入项目名称"
									/>
								</a-modal>
							</div>
							<div class="addPro createPro" @click="deletePro(pro)">
								<delete-outlined
									class="proIcon"
									:style="{ fontSize: '23px', color: '#ee2c25' }"
								/>
								<span>删除项目</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import HeadNav from '@/components/HeadNav.vue'
import {
	PlusCircleOutlined,
	ImportOutlined,
	FileAddOutlined,
	EditOutlined,
	DeleteOutlined,
	SaveOutlined,
} from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { getSaveList, deleteTemplate, updateInfo } from '@/api'
import userStore from '@/store/userStore'
import elStore from '@/store/elStore'

export default {
	components: {
		HeadNav,
		PlusCircleOutlined,
		ImportOutlined,
		FileAddOutlined,
		EditOutlined,
		DeleteOutlined,
		SaveOutlined,
	},
	setup() {
		const router = useRouter()
		const uStore = userStore()
		const useElStore = elStore()
		const username = uStore.username

		let projectCount = ref('—')
		let editedCount = ref('—')
		let publishedCount = ref('—')

		//项目数组
		let projects = ref([])

		//跳转登录/注册
		const turnLogin = () => {
			router.push('/login')
		}

		//修改项目相关
		let saveVisible = ref(false)
		let saveValue = ref('')
		let productNameItem = ref('')
		const savePro = (pro) => {
			saveValue.value = pro.productName
			productNameItem = pro.productName
			saveVisible.value = true
		}
		const saveOk = () => {
			updateInfo(username, productNameItem, saveValue.value)
			projects.value = []
			getProList()
			router.go(0)
			saveVisible.value = false
		}

		//新建项目相关
		let addVisible = ref(false)
		let addValue = ref('')
		const addProject = () => {
			addValue.value = ''
			addVisible.value = true
			router.push(`/editorPage/ `)
		}
		const addOk = () => {
			addVisible.value = false
		}

		//删除项目（需要确认）
		let deleteData = reactive({
			username: '',
			productName: '',
		})
		const deletePro = (pro) => {
			Modal.confirm({
				title: '确定',
				content: '确定要删除该项目吗',
				okText: '确定',
				cancelText: '取消',
				async onOk() {
					deleteData.username = username
					deleteData.productName = pro.productName

					deleteTemplate(deleteData)
					router.push('/userPage')

					projects.value = []
					getProList()
				},
				onCancel() {},
			})
		}

		//编辑项目
		const editorProject = (pro) => {
			useElStore.els = pro.content
			router.push({
				path: `/editorPage/${pro.productName}`,
			})
		}

		//获取项目列表
		const getProList = async () => {
			const { data, status } = await getSaveList(username)
			if (status == 1) {
				projects.value.push(...data.list)
			}
		}

		onMounted(() => {
			getProList()
		})

		return {
			projectCount,
			editedCount,
			publishedCount,
			saveVisible,
			saveValue,
			addValue,
			addVisible,
			turnLogin,
			deletePro,
			saveOk,
			addProject,
			addOk,
			savePro,
			editorProject,
			projects,
			username,
		}
	},
}
</script>

<style lang="less" scoped>
.userPage {
	width: 100%;
	height: 713px;
	background-color: #dce7ea;
	background: url('../assets/login-bg.svg') no-repeat;
	overflow-x: hidden;
	overflow-y: auto;
	.user {
		width: 1200px;
		margin: 0 auto;
	}
	.userInfo {
		display: flex;
		align-items: center;
		margin-top: 50px;
		width: 1200px;
		height: 130px;
		background-color: rgb(176, 217, 238);
		border-radius: 40px;
		border: 4px dashed #666699;
		.avator {
			margin-left: 50px;
			margin-right: 50px;
		}
		.username {
			font-size: 20px;
			cursor: pointer;
			&:hover {
				color: #5b9bc8;
			}
		}
		.projectInfo {
			width: 400px;
			display: flex;
			justify-content: space-between;
			margin-left: auto;
			margin-right: 100px;
			color: #5b9bc8;
			font-size: 18px;
		}
	}
	.project {
		margin-top: 30px;
		display: flex;
		width: 1200px;
		justify-content: space-between;
		flex-wrap: wrap;
		.addProject {
			padding: 20px;
			text-align: center;
			.addImg {
				overflow: hidden;
				img {
					width: 100%;
					height: 180px;
					object-fit: contain;
				}
				color: #5b9bc8;
				font-size: 20px;
			}
			.proName {
				font-size: 20px;
				position: absolute;
				top: 5px;
				right: 5px;
			}
			.saveTime {
				font-size: 16px;
				position: absolute;
				bottom: 5px;
				right: 5px;
			}
		}
		.proItem {
			width: 324px;
			height: 206px;
			display: flex;
			position: relative;
			justify-content: center;
			align-items: center;
			box-shadow: 0 2px 6px 1px #00000029;
			border-radius: 8px;
			border: 1px solid #707070;
			font-size: 20px;
			margin-bottom: 15px;
			&:hover .addImg {
				display: none;
			}
			&:hover .create {
				display: block;
			}
			.create {
				display: none;
				margin-top: 10px;
			}
			.createPro {
				width: 250px;
				height: 50px;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8px 50px;
				border: 1px solid #e9ebed;
				border-radius: 8px;
				cursor: pointer;
				margin-bottom: 10px;
				text-align: center;
				.proIcon {
					margin-right: 10px;
				}
				&:hover {
					background: #f6f6f6;
				}
			}
		}
	}
}
.right {
	margin-right: 36.5%;
}
</style>
