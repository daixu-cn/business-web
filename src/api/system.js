import service from "@/utils/request";
import sha1 from "sha1";

// 修原密码验证
export async function pawVerify(password) {
  const data = service.request({
    method: "post",
    url: "/console/pawVerify",
    data: {
      password: sha1(password)
    }
  });
  return data;
}

// 修原密码
export async function alterPassword(password) {
  const data = service.request({
    method: "post",
    url: "/console/alterPassword",
    data: {
      password: sha1(password)
    }
  });
  return data;
}
