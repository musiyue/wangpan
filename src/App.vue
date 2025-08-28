<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//   const locale = zhCn;
//   const config=reactive({
//   max:1,
//   });
const router = useRouter(); 
onMounted(() => {
  // 校验登录信息 选择进入的页面
  // 登录功能完善后再做校验登录信息 默认跳转login/index
  router.push({
    path: "/index",
  });
});
</script>

<style lang="scss" >
@import "@/assets/iconfont/iconfont.css";
/* 全局样式 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 防止任何意外的溢出 */
}

* {
  box-sizing: border-box;
}
</style>

