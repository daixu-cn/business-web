import service from "@/utils/request";

//查找会员
export async function memberList(currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/memberList",
    params: {
      currentPage,
      pageSize
    }
  });
  return data;
}
//删除会员
export async function deleteMember(member_id) {
  const data = service.request({
    method: "get",
    url: "/console/deleteMember",
    params: {
      member_id
    }
  });
  return data;
}
//根据手机号会员
export async function searchMember(phone_number) {
  const data = service.request({
    method: "get",
    url: "/console/searchMember",
    params: {
      phone_number
    }
  });
  return data;
}
//根据手机号会员
export async function addMember(member_name, phone_number) {
  const data = service.request({
    method: "get",
    url: "/console/addMember",
    params: {
      member_name,
      phone_number
    }
  });
  return data;
}
