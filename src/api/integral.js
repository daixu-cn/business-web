import service from "@/utils/request";

//添加兑换产品
export async function addIntegralProduct(product_name, conversion_integral) {
  const data = service.request({
    method: "get",
    url: "/console/addIntegralProduct",
    params: {
      product_name,
      conversion_integral
    }
  });
  return data;
}

//获取兑换产品列表
export async function integralProductList(currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/integralProductList",
    params: {
      currentPage,
      pageSize
    }
  });
  return data;
}
//修改兑换产品
export async function revampIntegralProduct(
  product_name,
  conversion_integral,
  convertibility_id
) {
  const data = service.request({
    method: "get",
    url: "/console/revampIntegralProduct",
    params: {
      product_name,
      conversion_integral,
      convertibility_id
    }
  });
  return data;
}
//删除兑换产品
export async function deleteIntegralProduct(convertibility_id) {
  const data = service.request({
    method: "get",
    url: "/console/deleteIntegralProduct",
    params: {
      convertibility_id
    }
  });
  return data;
}
//搜索兑换产品
export async function searchIntegralProduct(product_name) {
  const data = service.request({
    method: "get",
    url: "/console/searchIntegralProduct",
    params: {
      product_name
    }
  });
  return data;
}
//兑换产品
export async function conversion(phone_number, integral, convertibility_id) {
  const data = service.request({
    method: "get",
    url: "/console/conversion",
    params: {
      phone_number,
      integral,
      convertibility_id
    }
  });
  return data;
}
//全部兑换记录
export async function forRecord(currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/forRecord",
    params: {
      currentPage,
      pageSize
    }
  });
  return data;
}
//搜索兑换记录
export async function searchForRecord(phone, currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/searchForRecord",
    params: {
      phone,
      currentPage,
      pageSize
    }
  });
  return data;
}
//删除兑换记录
export async function deleteForRecord(record_id) {
  const data = service.request({
    method: "get",
    url: "/console/deleteForRecord",
    params: {
      record_id
    }
  });
  return data;
}
