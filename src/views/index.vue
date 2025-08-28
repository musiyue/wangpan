<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <indexHeader></indexHeader>
      </el-header>
      <el-container>
        <el-aside width="80px">
          <div class="aside-nav">
            <router-link
              v-for="(item, index) in asideItem"
              :key="index"
              :to="{ name: item.skipName }"
              active-class="is-aside-item"
              class="link-item"
            >
              <div class="aside-item">
                <img :src="`${item.baseimg}`" alt="" />
                <img :src="item.hoverimg" alt="" />
                <p>{{ item.title }}</p>
              </div>
            </router-link>
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup name="index">
import indexHeader from "../components/indexHeader.vue";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import homeBase from "@/assets/img/homeBase.png";
import homeHover from "@/assets/img/homeHover.png";
import collectBase from "@/assets/img/collectBase.png";
import collectHover from "@/assets/img/collectHover.png";
const router = useRouter();

const asideItem = [
  {
    title: "首页",
    baseimg: homeBase,
    hoverimg: homeHover,
    skipName: "Home",
  },
  {
    title: "收发",
    baseimg: collectBase,
    hoverimg: collectHover,
    skipName: "Collect",
  },
];

onMounted(() => {
  router.push({
    name: "Home",
  });
});
</script>

<style lang="less">
@import "@/assets/file.list.scss";

.common-layout {
  width: 100vw;
  .el-container {
    overflow: hidden;
    .el-header {
      box-shadow: -7px 3px 10px 0 rgba(0, 0, 0, 0.06);
      z-index: 2000;
    }
    .el-container {
      .el-main {
        padding: 0;
      }
      .el-aside {
        background-color: #fefefe;
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.06);
        z-index: 2;
        padding: 0 10px;
        .aside-nav {
          display: flex;
          flex-direction: column;
          margin-top: 30px;
          .link-item {
            margin: 2px auto;
            border-radius: 13px;
            .aside-item {
              width: 58px;
              height: 58px;
              text-align: center;
              img:nth-child(2) {
                display: none;
              }
              img {
                margin-top: 6px;
                width: 24px;
                height: 24px;
                line-height: 0;
                display: inline-block;
              }
              p {
                margin-top: 6px;
                color: #666;
                font-weight: 600;
                font-size: 12px;
              }
            }
          }
          .link-item:hover {
            background-color: rgb(244, 245, 249);
          }
          .is-aside-item {
            background-color: rgb(242, 250, 255);
            .aside-item {
              img:nth-child(1) {
                display: none;
              }
              img:nth-child(2) {
                display: inline-block;
              }
            }
          }
          .is-aside-item:hover {
            background-color: rgb(242, 250, 255);
          }
        }
      }
    }
  }
}
</style>