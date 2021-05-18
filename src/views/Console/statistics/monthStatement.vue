<template>
  <el-container>
    <el-header height="100px">
      <div>
        <el-date-picker
          v-model="selectMonth"
          type="month"
          :clearable="false"
          placeholder="选择月"
          @change="date"
          value-format="yyyy-MM"
        >
        </el-date-picker>
      </div>
      <div>
        <span>销售额(元): {{ salesAmount }}</span>
        <span>纯收入(元): {{ netIncome }}</span>
      </div>
    </el-header>
    <el-main>
      <div id="echartsExample"></div>
    </el-main>
  </el-container>
</template>
<script>
import { monthStatistics } from "@/api/statistics";
import { getDay } from "@/utils/util";
export default {
  data() {
    return {
      selectMonth: "", //选择月份
      salesAmount: 0, //销售额
      netIncome: 0, //纯收入
      year: null,
      month: null,
      option: {
        color: "pink",
        title: [
          {
            text: "月销售额统计表"
          }
        ],
        tooltip: {
          trigger: "axis"
        },
        xAxis: [
          {
            data: [],
            name: "日期"
          }
        ],
        yAxis: [
          {
            splitLine: { show: false },
            name: "销售额(元)"
          }
        ],
        series: []
      }
    };
  },
  created() {
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.selectMonth = this.year + "-" + this.month;
  },
  mounted() {
    let days = getDay(this.year, this.month.toString());
    for (let i = 0; i < days; i++) {
      this.option.xAxis[0].data.push(i + 1);
    }
    monthStatistics(this.year, this.month).then(res => {
      this.salesAmount = res.data.data.salesAmount;
      this.netIncome = res.data.data.netIncome;
      this.option.series = res.data.data.series;
      var myChart = this.$echarts.init(
        document.getElementById("echartsExample")
      );
      myChart.setOption(this.option);
    });
  },
  methods: {
    date() {
      this.$echarts.init(document.getElementById("echartsExample")).dispose();
      let dateArr = this.selectMonth.split("-");
      this.year = dateArr[0];
      this.month = dateArr[1].toString();
      let days = getDay(this.year, this.month.toString());
      this.option.xAxis[0].data = [];
      for (let i = 0; i < days; i++) {
        this.option.xAxis[0].data.push(i + 1);
      }
      monthStatistics(this.year, this.month).then(res => {
        this.salesAmount = res.data.data.salesAmount;
        this.netIncome = res.data.data.netIncome;
        this.option.series = res.data.data.series;
        var myChart = this.$echarts.init(
          document.getElementById("echartsExample")
        );
        myChart.setOption(this.option);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  .el-header {
    padding: 0 20px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 20px;
      font-weight: bold;
      margin-left: 50px;
    }
  }
  .el-main {
    background-color: white;
    margin-top: 20px;
    #echartsExample {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
