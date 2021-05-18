<template>
  <el-container>
    <el-header height="100px">
      <div>
        <el-date-picker
          v-model="selectYear"
          type="year"
          :clearable="false"
          placeholder="选择年"
          @change="date"
          value-format="yyyy"
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
import { yearStatistics } from "@/api/statistics";
export default {
  data() {
    return {
      selectYear: "", //选择年
      salesAmount: 0, //销售额
      netIncome: 0, //纯收入
      option: {
        color: ["#37a2da", "#67e0e3", "pink"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#ccc"
            }
          }
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true }
          }
        },
        legend: {
          data: ["堂食/打包", "外卖", "纯收入"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "销售量(件)"
          },
          {
            type: "value",
            name: "纯收入(元)"
          }
        ],
        series: [
          {
            name: "堂食/打包",
            type: "bar",
            data: []
          },
          {
            name: "外卖",
            type: "bar",
            data: []
          },
          {
            name: "纯收入",
            type: "line",
            yAxisIndex: 1,
            data: []
          }
        ]
      }
    };
  },
  created() {
    let currentYear = new Date().getFullYear().toString();
    this.selectYear = currentYear;
  },
  mounted() {
    yearStatistics(this.selectYear).then(res => {
      console.log(res.data);
      this.option.series[0].data = res.data.data.eatInList;
      this.option.series[1].data = res.data.data.takeOutList;
      this.option.series[2].data = res.data.data.netIncomeList;
      this.salesAmount = res.data.data.salesAmount;
      this.netIncome = res.data.data.netIncome;
      var myChart = this.$echarts.init(
        document.getElementById("echartsExample")
      );
      myChart.setOption(this.option);
    });
  },
  methods: {
    date() {
      yearStatistics(this.selectYear).then(res => {
        console.log(res.data);
        this.option.series[0].data = res.data.data.eatInList;
        this.option.series[1].data = res.data.data.takeOutList;
        this.option.series[2].data = res.data.data.netIncomeList;
        this.salesAmount = res.data.data.salesAmount;
        this.netIncome = res.data.data.netIncome;
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
