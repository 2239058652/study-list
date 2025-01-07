<template>
    <router-view v-slot="{ Component, route }">
        <keep-alive>
            <component :is="Component" :key="getFirstLevelRoute(route).name"
                v-if="getFirstLevelRoute(route).meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="getFirstLevelRoute(route).name"
            v-if="!getFirstLevelRoute(route).meta.keepAlive" />
    </router-view>
</template>

<script lang="ts" setup>

// 处理二级路由加载俩次问题，1级就返回第1个就不加载俩次
function getFirstLevelRoute(route: { matched: string | any[] }) {
    if (!Array.isArray(route.matched) || route.matched.length === 0) {
        return route
    }
    return route.matched[0]
}
</script>

<style scoped></style>