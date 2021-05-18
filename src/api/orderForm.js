import service from "@/utils/request";

//添加订单
export async function addOrderForm(
  product_id,
  kind,
  member_phone,
  exchangeIntegral
) {
  const data = service.request({
    method: "get",
    url: "/console/addOrderForm",
    params: {
      product_id,
      kind,
      member_phone,
      exchangeIntegral
    }
  });
  return data;
}

//查询所有订单
export async function orderFormList(currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/orderFormList",
    params: {
      currentPage,
      pageSize
    }
  });
  return data;
}

//删除订单
export async function deleteOrderForm(
  orderForm_id,
  member_phone,
  exchangeIntegral
) {
  const data = service.request({
    method: "get",
    url: "/console/deleteOrderForm",
    params: {
      orderForm_id,
      member_phone,
      exchangeIntegral
    }
  });
  return data;
}
