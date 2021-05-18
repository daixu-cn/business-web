import service from "@/utils/request";
import sha1 from "sha1";
// 登录验证
export async function login(name, password) {
  const data = service.request({
    method: "post",
    url: "/user/login",
    data: {
      name,
      password: sha1(password)
    }
  });
  return data;
}

// 获取修改密码的邮箱验证码
export async function getPwdCaptcha(name, email) {
  const data = service.request({
    method: "post",
    url: "/user/getPwdCaptcha",
    data: {
      name,
      email
    }
  });
  return data;
}

// 修改密码
export async function updatePassword(name, email, password) {
  const data = service.request({
    method: "post",
    url: "/user/changePassword",
    data: {
      name,
      email,
      password: sha1(password)
    }
  });
  return data;
}
// 获取邮箱验证码
export async function getCaptcha(email) {
  const data = service.request({
    method: "post",
    url: "/user/getCaptcha",
    data: {
      email
    }
  });
  return data;
}
// 用户注册
export async function registerUser(name, email, password) {
  const data = service.request({
    method: "post",
    url: "/user/register",
    data: {
      name,
      email,
      password: sha1(password)
    }
  });
  return data;
}
