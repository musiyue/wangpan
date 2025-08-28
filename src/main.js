import '../src/assets/base.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router'
// 引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 自定义组件
import Table from '@/components/Table.vue'

// 引入cookoes
import VueCookies from 'vue-cookies'

const pinia = createPinia();

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(pinia);

// 渲染自定义组件
app.component("Table",Table)

app.mount('#app')
