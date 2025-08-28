import httpInstance from "../../utils/httpInstance";

enum API {
  REGISTER_URL = "/auth/register",
  SEND_CODE_URL = "/auth/send-code",
  LOGIN_URL = "/auth/login",
  LOGIN_OUT_URL = "/auth/logout",
  RESET_PSW_URL = "",
}

export function sendCodePost(data: {}) {
  return httpInstance.post(API.SEND_CODE_URL, data).then(
    (res) => {
      return res.status;
    },
    (err) => {
      console.log(err);
    }
  );
}

export function RegisterPost(data: {}) {
  console.log(data);
  // 如果这里没有 return，调用方获取不到 Promise 则不会执行调用方的回调函数
  return httpInstance.post(API.REGISTER_URL, data).then(
    (res) => {
      return res;
    },
    (err) => {
      return err;
    }
  );
}

export function LoginPost(data: {}) {
  return httpInstance.post(API.LOGIN_URL, data).then(
    (res) => {
      console.log(res);
      return res;
    },
    (err) => {
      return err;
    }
  );
}

export function LoginoutPost(data: {}) {
  return httpInstance
    .post(API.LOGIN_OUT_URL, {
      Headers: data,
    })
    .then(
      (res) => {
        console.log(res, "###");
        return res;
      },
      (err) => {
        console.log(err);
        return err;
      }
    );
}
