<template>
	<div class="login">
		<div class="loginContent">
			<div>
				<h1 class="loginTitle">登录</h1>
			</div>
			<div class="loginBox">
				<a-form
					:model="formState"
					name="normal_login"
					class="login-form"
					@finish="onFinish"
				>
					<a-form-item
						label="用户名"
						name="username"
						:rules="[{ required: true, message: '请输入用户名' }]"
					>
						<a-input v-model:value="formState.username">
							<template #prefix>
								<UserOutlined class="site-form-item-icon" />
							</template>
						</a-input>
					</a-form-item>

					<a-form-item
						label="密码"
						name="password"
						:rules="[{ required: true, message: '请输入密码' }]"
					>
						<a-input-password v-model:value="formState.password">
							<template #prefix>
								<LockOutlined class="site-form-item-icon" />
							</template>
						</a-input-password>
					</a-form-item>

					<a-form-item>
						<a-button
							:disabled="disabled"
							type="primary"
							html-type="submit"
							class="login-form-button"
						>
							登录
						</a-button>
					</a-form-item>
				</a-form>
				<div class="toRegister">
					<a href="/#/register">还没账号？去注册</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { login } from '@/api/login'
import userStore from '@/store/userStore.js'
import { useRouter } from 'vue-router'

export default {
	components: { UserOutlined, LockOutlined },
	setup() {
		const formState = reactive({
			username: '123',
			password: '123',
		})

		const router = useRouter()

		//登录成功
		const uStore = userStore()
		const onFinish = async (values) => {
			await login(values)
			uStore.username = values.username
			router.push('/userPage')
		}

		//是否禁用
		const disabled = computed(() => {
			return !(formState.username && formState.password)
		})
		return {
			formState,
			onFinish,
			disabled,
		}
	},
}
</script>

<style lang="less" scoped>
.login {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: url('../assets/login-bg.svg');
	.loginContent {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 230px;
	}
	.loginTitle {
		text-shadow: 0px 0px 10px rgb(70, 134, 236);
		color: rgb(129, 158, 245);
	}
	.loginBox {
		// margin-top: 50px;
		padding: 30px;
		padding-bottom: 20px;
		border: 1px solid #dcdfe6;
		position: relative;
		:deep(.login-form-button) {
			width: 100%;
		}
		.toRegister {
			position: absolute;
			right: 10px;
			bottom: 2px;
			color: rgb(99, 141, 239);
			cursor: pointer;
		}
	}
}
</style>
