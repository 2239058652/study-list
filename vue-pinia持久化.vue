<template>
    <div>

     </div>
</template>

<script lang="ts" setup>
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入pinia持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import "./assets/style/common.css";
import './permission'

const app = createApp(App)

app.use(createPinia())
// 定义pinia并且使用持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
</script>

<style scoped>

</style>