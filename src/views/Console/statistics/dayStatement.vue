<template>
  <el-container>
    <el-header height="100px">
      <div>
        <el-date-picker
          v-model="selectDate"
          :clearable="false"
          type="date"
          placeholder="选择日期"
          @change="date"
          value-format="yyyy-MM-dd"
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
import { dayStatistics } from "@/api/statistics";
export default {
  data() {
    return {
      selectDate: "", //选择日期
      salesAmount: 0, //销售额
      netIncome: 0, //纯收入
      option: {
        color: "#37a2da",
        tooltip: {},
        title: {
          text: "产品售出统计表(件)"
        },
        yAxis: {
          type: "value"
        }
      }
    };
  },
  methods: {
    async date() {
      await dayStatistics(this.selectDate).then(res => {
        if (res.data.code === 200) {
          this.salesAmount = res.data.data.salesAmount;
          this.netIncome = res.data.data.netIncome;
          this.option.xAxis = res.data.data.xAxis;
          this.option.series = res.data.data.series;
          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(
            document.getElementById("echartsExample")
          ); // echartsExample是显示echart的元素id
          // 绘制图表
          myChart.setOption(this.option);
        } else {
          this.$message.error(this.selectDate + " 未售出任何产品");
          this.$echarts
            .init(document.getElementById("echartsExample"))
            .dispose(); // 销毁实例
        }
      });
    }
  },
  created() {
    let date = new Date();
    let currentDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.selectDate = currentDate;
  },
  async mounted() {
    await dayStatistics(this.selectDate).then(res => {
      if (res.data.code === 200) {
        this.salesAmount = res.data.data.salesAmount;
        this.netIncome = res.data.data.netIncome;
        this.option.xAxis = res.data.data.xAxis;
        this.option.series = res.data.data.series;
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(
          document.getElementById("echartsExample")
        ); // echartsExample是显示echart的元素id
        // 绘制图表
        myChart.setOption(this.option);
      } else {
        this.$message.error(this.selectDate + " 未售出任何产品");
        this.$echarts.init(document.getElementById("echartsExample")).dispose(); // 销毁实例
      }
    });
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
