import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import DatePicker from 'ant-design-vue';
import BoxAtrr from './components/Attribute.vue'
import 'ant-design-vue/dist/antd.css';
import Animation from './components/Animation.vue'
import { usePersist } from 'pinia-use-persist'
import '../public/css/animation.css'

//数据持久化
const pinia = createPinia()
pinia.use(usePersist)

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(DatePicker);
app.component('attribute', BoxAtrr);
app.component('animation', Animation);
app.mount('#app')