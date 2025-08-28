<template>
  <div class="Home-container">
    <div class="Home-layout-body flex">
      <!-- 左侧导航 -->
      <div class="Home-aside-nav">
        <div class="aside-flex flex">
          <div class="aside-flex-top">
            <div class="aside-header">
              <router-link
                class="top-header"
                :to="{ name: 'AllFile' }"
                active-class="is-active-nav"
              >
                <div class="flex header-main" style="flex-direction: row">
                  <div class="btn-hidden">
                    <transition name="irotate">
                      <i
                        class="iconfont"
                        @click="hiddenClick($event)"
                        :class="{ 'is-rotate': isHidden }"
                        >&#xe6a2;</i
                      >
                    </transition>
                  </div>
                  <span class="inline-middle"> 我的文件 </span>
                  <i
                    class="iconfont"
                    style="margin-left: auto; line-height: 40px"
                    >&#xe618;</i
                  >
                </div>
              </router-link>

              <transition name="aside">
                <div class="top-main flex" v-show="isHidden">
                  <router-link
                    :to="{ name: item.skipName }"
                    class="main-item"
                    active-class="is-active-nav"
                    v-for="(item, index) in asideNav"
                    :key="index"
                  >
                    <div>
                      <i class="iconfont">{{ item.icon }}</i>
                      <span>{{ item.title }}</span>
                    </div>
                  </router-link>
                </div>
              </transition>
            </div>
          </div>
          <div class="aside-flex-center"></div>
          <div class="aside-flex-bottom"></div>
        </div>
      </div>

      <!-- 右侧主内容区：✅ 使用 router-view 动态渲染 -->
      <div class="Home-main-container">
        <router-view /> <!-- ✅ 关键：这里会根据路由自动渲染 AllFile / Picture / Document 等 -->
      </div>
    </div>
  </div>
</template>

<script setup name="HomeComponent" lang="ts">
import { ref, onMounted , reactive, getCurrentInstance, nextTick } from "vue";
// import { useRouter, useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { useFilesStore } from '@/store/files'; // 路径根据你的实际结构调整

const filesStore = useFilesStore();

onMounted(() => {
  filesStore.loadAllFiles(); // ✅ 页面加载时请求一次所有文件
});

const router = useRouter();

const asideNav = [
  { title: "图片", skipName: "Picture", icon: "\ue65f" },
  { title: "文档", skipName: "Document", icon: "\ue69c" },
  { title: "视频", skipName: "Video", icon: "\ue623" },
  { title: "其他", skipName: "Other", icon: "\ue7ae" },
  { title: "音频", skipName: "Music", icon: "\uf366" },
];

let isHidden = ref<boolean>(true);
const hiddenClick = (event) => {
  isHidden.value = !isHidden.value;
  event.preventDefault();
};

// ✅ 页面加载后跳转到 AllFile（可选）
// 如果你希望默认显示 AllFile，可以保留
// 否则可以去掉，直接由路由配置决定
// 页面加载时跳转到 AllFile 路由
onMounted(() => {
  router.push({
    name: "AllFile",
  });
});

</script>

<style lang="less">
@import "@/assets/file.list.scss";
@import "@/assets/base.scss";

/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: "iconfont"; /* Project id 4750076 */
  src: url("//at.alicdn.com/t/c/font_4750076_pmz3x4a3o49.woff2?t=1748525694343")
      format("woff2"),
    url("//at.alicdn.com/t/c/font_4750076_pmz3x4a3o49.woff?t=1748525694343")
      format("woff"),
    url("//at.alicdn.com/t/c/font_4750076_pmz3x4a3o49.ttf?t=1748525694343")
      format("truetype");
}
html {
  font-family: "iconfont";
}
.Home-container {
  .flex {
    display: flex;
    flex-direction: column;
  }
  .Home-layout-body {
    width: 100%;
    flex-direction: row;
    .Home-aside-nav {
      width: 200px;
      padding-top: 20px;
      border-right: 1px solid #eee;
      //calc动态高度计算
      height: calc(100vh - 60px);
      .aside-header {
        span,
        a,
        p {
          display: inline-block;
          color: #636d7e;
        }
        .is-active-nav {
          background-color: rgb(238, 249, 254);
          span,
          i {
            color: rgb(6, 167, 255);
          }
        }
        .top-header {
          width: 160px;
          box-sizing: border-box;
          margin: 0 20px;
          height: 40px;
          border-radius: 10px;
          .header-main {
            margin-left: 20px;
            .btn-hidden {
              font-size: 18px;
              margin-top: 7px;
              i {
                display: inline-block;
                transition: all 0.6s ease;
              }
              .is-rotate {
                transform: rotate(90deg);
              }
            }
            .inline-middle {
              display: inline-block;
              line-height: 40px;
            }
          }
        }
        .top-main {
          transition: all 0.3s;
          text-align: center;
          padding: 0 20px;
          .main-item {
            height: 40px;
            line-height: 40px;
            border-radius: 10px;
            i {
              font-weight: 600;
            }
          }
          .main-item:hover {
            background-color: rgb(244, 245, 249);
          }
          .is-active-nav:hover {
            background-color: rgb(238, 249, 254);
          }
        }

        .aside-enter-active,
        .aside-leave-active {
          transition: all 0.6s ease;
        }
        .aside-enter-from,
        .aside-leave-to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
    }
    .Home-main-container {
      flex: 1;
    }
  }
}
</style>