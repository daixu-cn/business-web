import axios from "axios";

const BASEURL = process.env.NODE_ENV === "development" ? "/" : "";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 1000 * 30,
  headers: {
    "content-type": "application/json",
    token: localStorage.getItem("token")
  }
});

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    // if(response.data.code===-1){
    //   localStorage.removeItem("token");
    // }
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
