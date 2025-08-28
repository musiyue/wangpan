import axios from "axios";

// 用于获取图片

let httpInstance = axios.create({
  timeout: 5000,
});

// 请求拦截器
httpInstance.interceptors.request.use((config) => {
  // 设置对应的请求信息
  return config;
});

// 响应拦截器
httpInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    // 我将错误也返回了 所以你看不见报错信息
    return err;
    console.log(err);
  }
);

export default httpInstance;
