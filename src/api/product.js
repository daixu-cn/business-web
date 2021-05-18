import service from "@/utils/request";
//获取用户token
export async function getUserToken() {
  const data = service.request({
    method: "get",
    url: "/console/userToken"
  });
  return data;
}
// 获取分类列表
export async function getClassifyList() {
  const data = service.request({
    method: "get",
    url: "/console/classifyList"
  });
  return data;
}

//产品名搜索联想
export async function searchList(searchName) {
  if (searchName === "" || searchName === undefined) {
    searchName = "";
  } else {
    searchName = searchName.replace(/\s*/g, "");
  }
  const data = service.request({
    method: "get",
    url: "/console/productSearch",
    params: {
      searchName
    }
  });
  return data;
}

//查询所有产品
export async function getProductList(currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/productList",
    params: {
      currentPage,
      pageSize
    }
  });
  return data;
}

//查询搜索的产品
export async function getSearchProductResult(
  searchName,
  currentPage,
  pageSize
) {
  const data = service.request({
    method: "get",
    url: "/console/searchProductResult",
    params: {
      searchName,
      currentPage,
      pageSize
    }
  });
  return data;
}

//查询分类的产品
export async function getClassifyResult(classify, currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/classifyResult",
    params: {
      classify,
      currentPage,
      pageSize
    }
  });
  return data;
}

//删除产品
export async function deleteProduct(product_id, product_img) {
  const data = service.request({
    method: "get",
    url: "/console/deleteProduct",
    params: {
      product_id,
      product_img
    }
  });
  return data;
}
//修改产品库存状态信息
export async function revampInventory(inventory, product_id) {
  const data = service.request({
    method: "get",
    url: "/console/revampInventory",
    params: {
      inventory,
      product_id
    }
  });
  return data;
}
//获取用户的分类列表及该分类下的产品数量
export async function classifyParticulars(currentPage, pageSize) {
  const data = service.request({
    method: "get",
    url: "/console/classifyParticulars",
    params: {
      currentPage,
      pageSize
    }
  });
  return data;
}
//删除分类
export async function deleteClassify(classify_id) {
  const data = service.request({
    method: "get",
    url: "/console/deleteClassify",
    params: {
      classify_id
    }
  });
  return data;
}
//修改分类名
export async function revampClassify(newClassifyName, classify_id) {
  const data = service.request({
    method: "get",
    url: "/console/revampClassify",
    params: {
      newClassifyName,
      classify_id
    }
  });
  return data;
}
//添加分类
export async function addClassify(createClassifyName) {
  const data = service.request({
    method: "get",
    url: "/console/addClassify",
    params: {
      createClassifyName
    }
  });
  return data;
}
//获取添加产品页面的分类列表
export async function addProductClassifyList() {
  const data = service.request({
    method: "get",
    url: "/console/addProductClassifyList"
  });
  return data;
}
//添加产品
export async function addProduct(
  product_name,
  product_detailed,
  purchasing_price,
  selling_price,
  inventory,
  classify_id,
  exchangeIntegral,
  product_img
) {
  const data = service.request({
    method: "get",
    url: "/console/addProduct",
    params: {
      product_name,
      product_detailed,
      purchasing_price,
      selling_price,
      inventory,
      classify_id,
      exchangeIntegral,
      product_img
    }
  });
  return data;
}
//编辑产品
export async function revampProduct(
  product_name,
  product_detailed,
  purchasing_price,
  selling_price,
  classify_id,
  product_id,
  exchangeIntegral
) {
  const data = service.request({
    method: "get",
    url: "/console/revampProduct",
    params: {
      product_name,
      product_detailed,
      purchasing_price,
      selling_price,
      classify_id,
      product_id,
      exchangeIntegral
    }
  });
  return data;
}
//修改产品图片
export async function revampProductImg(product_img, product_id) {
  const data = service.request({
    method: "get",
    url: "/console/revampProductImg",
    params: {
      product_img,
      product_id
    }
  });
  return data;
}

//获取七牛云上传token
export async function getUploadToken() {
  const data = service.request({
    method: "post",
    url: "/console/token"
  });
  return data;
}

//获取七牛云上传token
export async function deleteQiqiu(fileName) {
  const data = service.request({
    method: "post",
    url: "/console/deleteQiqiu",
    data: {
      fileName
    }
  });
  return data;
}
