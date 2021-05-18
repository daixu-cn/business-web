import service from "@/utils/request";
// 获取单日报表
export async function dayStatistics(selectDate) {
  let date = selectDate.split("-");
  const data = service.request({
    method: "get",
    url: "/console/dayStatistics",
    params: {
      year: date[0],
      month: date[1],
      day: date[2]
    }
  });
  return data;
}

// 获取月份报表
export async function monthStatistics(year, month) {
  const data = service.request({
    method: "get",
    url: "/console/monthStatistics",
    params: {
      year,
      month
    }
  });
  return data;
}

// 获取月份报表
export async function yearStatistics(year) {
  const data = service.request({
    method: "get",
    url: "/console/yearStatistics",
    params: {
      year
    }
  });
  return data;
}
