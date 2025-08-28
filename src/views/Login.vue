<template>
  <div class="login-body">
    <div class="login-panel">
      <el-form
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent="submitForm"
      >
        <div class="login-title">云邮网盘</div>
        <div class="login-welcome">WELCOME!</div>

        <!-- 账号输入 -->
        <el-form-item label="" prop="account">
          <el-input
            size="large"
            clearable
            placeholder="手机号/用户名/邮箱"
            v-model.trim="formData.account"
            maxlength="150"
          >
            <template #prefix>
              <img
                src="@/assets/icon/icon-account.png"
                alt="account"
                style="width: 24px; height: 24px"
              />
            </template>
          </el-input>
        </el-form-item>

        <!-- 登录密码 -->
        <el-form-item label="" prop="password" v-if="opType === 1">
          <el-input
            type="password"
            size="large"
            placeholder="请输入密码"
            v-model.trim="formData.password"
            show-password
          >
            <template #prefix>
              <img
                src="@/assets/icon/icon-mima.png"
                alt="mima"
                style="width: 24px; height: 24px"
              />
            </template>
          </el-input>
        </el-form-item>

        <!-- 注册和重置密码部分 -->
        <div v-if="[0, 2].includes(opType)">
          <!-- 昵称（仅注册） -->
          <el-form-item label="" prop="madeName" v-if="opType === 0">
            <el-input
              size="large"
              placeholder="请输入昵称"
              v-model.trim="formData.madeName"
              maxlength="20"
            >
              <template #prefix>
                <img
                  src="@/assets/icon/icon-madeName.png"
                  alt="madeName"
                  style="width: 24px; height: 24px"
                />
              </template>
            </el-input>
          </el-form-item>

          <!-- 设置密码 -->
          <el-form-item label="" prop="registerPassword">
            <el-input
              type="password"
              size="large"
              placeholder="请输入密码"
              v-model.trim="formData.registerPassword"
              show-password
            >
              <template #prefix>
                <img
                  src="@/assets/icon/icon-mima.png"
                  alt="mima"
                  style="width: 24px; height: 24px"
                />
              </template>
            </el-input>
          </el-form-item>

          <!-- 确认密码（仅注册） -->
          <el-form-item label="" prop="reRegisterPassword" v-if="opType === 0">
            <el-input
              type="password"
              size="large"
              placeholder="请再次输入密码"
              v-model.trim="formData.reRegisterPassword"
              show-password
            >
              <template #prefix>
                <img
                  src="@/assets/icon/icon-mima.png"
                  alt="mima"
                  style="width: 24px; height: 24px"
                />
              </template>
            </el-input>
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item label="" prop="madeCode">
            <div class="send-code-panel">
              <el-input
                size="large"
                placeholder="请输入验证码"
                v-model.trim="formData.madeCode"
              >
                <template #prefix>
                  <img
                    src="@/assets/icon/icon-madeCode.png"
                    alt="code"
                    style="width: 24px; height: 24px"
                  />
                </template>
              </el-input>
              <el-button
                size="large"
                class="send-code-btn"
                type="primary"
                :disabled="isSending"
                @click="sendCode"
              >
                {{ codeButtonText }}
              </el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 提交按钮 -->
        <el-form-item label="">
          <el-button
            type="primary"
            class="login-btn"
            size="large"
            native-type="submit"
            block
          >
            <span v-if="opType === 0">立即注册</span>
            <span v-if="opType === 1">立即登录</span>
            <span v-if="opType === 2">重置密码</span>
          </el-button>
        </el-form-item>

        <!-- 底部链接 -->
        <el-form-item v-if="opType === 1">
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(2)"
              >忘记密码？</a
            >
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)"
              >点击注册</a
            >
          </div>
        </el-form-item>
        <el-form-item v-if="opType === 2">
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
              >去登录</a
            >
          </div>
        </el-form-item>
        <el-form-item v-if="opType === 0">
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
              >已有账号，去登录</a
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup name="login">
import { sendCodePost, RegisterPost, LoginPost } from "../apis/login";
import { ref, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();

// 操作类型：0=注册，1=登录，2=重置密码
const opType = ref(1);
const formData = ref({});
const formDataRef = ref(null);

// 验证码发送状态
const isSending = ref(false);
const countdown = ref(60);
const timer = ref(null);

const router = useRouter();
// 倒计时文本
const codeButtonText = ref("获取验证码");

// 切换面板并重置表单
const showPanel = (type) => {
  opType.value = type;
  formData.value = {};
  if (formDataRef.value) {
    formDataRef.value.resetFields();
  }
  resetCountdown();
};

// 验证码发送逻辑
const sendCode = () => {
  if (!formData.value.account) {
    ElMessage.warning("请输入账号（邮箱）");
    return;
  }

  // 发送请求
  sendCodePost({ email: formData.value.account });
  ElMessage.success("验证码已发送，请注意查收");
  isSending.value = true;

  timer.value = setInterval(() => {
    countdown.value--;
    codeButtonText.value = `${countdown.value}s 后重发`;
    if (countdown.value <= 0) {
      resetCountdown();
    }
  }, 1000);
};

// 重置验证码倒计时
const resetCountdown = () => {
  clearInterval(timer.value);
  isSending.value = false;
  countdown.value = 60;
  codeButtonText.value = "获取验证码";
};
// 跳转主页并保存登录状态信息
const keepLoginInfo = (data) => {
  // 保存登录信息
  console.log(data);
  localStorage.setItem("token", data.token);
};

// 跳转主页
const skipIndex = () => {
  router.push({
    name: "Index",
  });
};

// 刷新当前页
const refreshPage = () => {
  setTimeout(() => {
    router.go(0); // 最简单的方式
  }, 300);
};

// 注册提交以及验证
const registerAck = () => {
  let RegisterData = {
    email: formData.value.account,
    password: formData.value.registerPassword,
    user_name: formData.value.madeName,
    code: formData.value.madeCode,
  };

  RegisterPost(RegisterData).then(
    (res) => {
      if (res.status == 200) {
        ElMessage.success(res.data.message);
        refreshPage();
      } else if (res.status == 401) {
        formData.value.madeCode = "";
        ElMessage.error(res.response.data.error);
      } else {
        ElMessage.warning(res.response.data.error);
      }
    },
    (err) => {
      ElMessage.error("服务器繁忙请稍后再试");
    }
  );
};

// 登录提交以及验证
const loginAck = () => {
  let loginData = {
    email: formData.value.account,
    user_name: formData.value.account,
    password: formData.value.password,
  };

  LoginPost(loginData).then(
    (res) => {
      if (res.status == 200) {
        ElMessage.success("登录成功");
        keepLoginInfo(res.data);
        skipIndex();
      } else {
        ElMessage.warning(res.response.data.error);
      }
    },
    (err) => {
      ElMessage.error("服务器繁忙请稍后再试");
    }
  );
};

// 他好像没有修改密码这个功能 我等会问问他
const reSetPsw = () => {
  let RegisterData = {
    email: formData.value.account,
    password: formData.value.registerPassword,
    code: formData.value.madeCode,
  };
};

// 表单提交
const submitForm = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      if (opType.value === 1) {
        loginAck();
      } else if (opType.value === 0) {
        registerAck();
      } else if (opType.value === 2) {
        console.log("执行重置密码:", formData.value);
        ElMessage.success("成功重置密码");
        refreshPage();
      }
    } else {
      ElMessage.error("请检查输入内容");
      return false;
    }
  });
};

// 自定义验证函数
const validateRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};

//表单验证规则
const rules = {
  account: [{ d: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  madeCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  madeName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  registerPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 8,
      max: 18,
      message: "密码只能是数字，字母，特殊字符且长度为8-18位",
      trigger: "blur",
    },
  ],
  reRegisterPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: validateRePassword,
      trigger: "blur",
    },
  ],
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
}
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.a-link {
  text-decoration: none;
  color: rgb(102, 102, 102);
}
.a-link:hover,
.a-link:active {
  color: #969696;
}

.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("@/assets/login-bg.jpg");
  overflow: hidden;
}

.login-panel {
  width: 100%;
  max-width: 430px;
  background-color: #fff;
  padding: 25px;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.login-welcome {
  text-align: center;
  font-size: 10px;
  margin-bottom: 20px;
  color: #666;
}

.send-code-panel {
  display: flex;
  width: 100%;
  .send-code-btn {
    min-width: 100px;
    margin-left: 8px;
  }
}

.no-account {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.login-btn {
  width: 100%;
}
</style>
