<template>
  <div class="indexHeader">
    <div class="flex-header">
      <div class="user-info">
        <div class="user-body">
          <div class="user-img">
            <img src="../assets/img/user.jpg" alt="" />
          </div>
          <p class="user-name">云邮网盘</p>
        </div>
      </div>
      <div class="loginout">
        <button @click="loginout()">
          <span>退出登录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup name="indexHeader">
import { LoginoutPost } from "../apis/login";
import { ElMessage } from "element-plus";
const loginout = async () => {
  LoginoutPost({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }).then(
    (res) => {
      if (res.status == 200) {
        ElMessage.success("退出登录成功");
        localStorage.removeItem("token");
      } else {
        ElMessage.error("退出失败 请稍后再试");
      }
    },
    (err) => {}
  );
};
</script>

<style lang="less">
.indexHeader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 60px;
  width: 100%;
  a,
  p {
    line-height: 30px;
  }
  .flex-header {
    display: flex;
    .user-info {
      .user-body {
        display: flex;
        .user-img {
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 30px;
            height: 30px;
            line-height: 0;
          }
        }
        .user-name {
          padding: 0 20px;
          height: 30px;
          p {
            color: #666;
          }
        }
      }
    }
    .loginout {
      height: 30px;
      margin-left: auto;
      button {
        background-color: #fff;
        span {
          color: #007fff;
        }
        span:hover {
          color: #63b1ff;
        }
      }
    }
  }
}
</style>