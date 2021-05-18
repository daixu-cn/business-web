<template>
  <el-container>
    <el-main>
      <div>
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          id="out-table"
        >
          <el-table-column
            prop="orderForm_id"
            label="订单编号"
            width="80"
          ></el-table-column>
          <el-table-column prop="product_img" label="产品图片" width="135">
            <template slot-scope="img_scope">
              <el-image
                style="width: 110px;height:110px;"
                :src="qiNiuDomainName + img_scope.row.product_img"
                fit="cover"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="product_name"
            label="产品名称"
          ></el-table-column>
          <el-table-column prop="kind" label="订单方式"></el-table-column>
          <el-table-column
            prop="member_phone"
            label="会员号码"
          ></el-table-column>
          <el-table-column
            prop="exchangeIntegral"
            label="获得积分"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="下单时间"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { orderFormList, deleteOrderForm } from "@/api/orderForm";
import { qiNiuDomainName } from "@/utils/util";
export default {
  data() {
    return {
      tableData: [], //表格内容
      currentPage: 1, //当前第几页
      pageSize: 3, //一页十条信息
      total: 0, //产品总数,
      qiNiuDomainName: qiNiuDomainName
    };
  },
  created() {
    orderFormList(this.currentPage, this.pageSize).then(res => {
      //获取全部订单列表
      if (res.data.code === 200) {
        this.tableData = res.data.data.orderFormList;
        this.total = res.data.data.total;
      }
    });
  },
  methods: {
    handleDelete(index, row) {
      //产品删除
      console.log(row);
      this.$confirm("此操作将删除该产品不可复原, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteOrderForm(
          row.orderForm_id,
          row.member_phone,
          row.exchangeIntegral
        ).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            orderFormList(this.currentPage, this.pageSize).then(res => {
              //获取全部订单列表
              if (res.data.code === 200) {
                this.tableData = res.data.data.orderFormList;
                this.total = res.data.data.total;
              }
            });
          } else {
            this.$message.error("删除失败,请稍后再试!");
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      orderFormList(this.currentPage, this.pageSize).then(res => {
        //获取全部订单列表
        if (res.data.code === 200) {
          this.tableData = res.data.data.orderFormList;
        }
      });
    },
    handleCurrentChange(val) {
      //分页功能
      this.currentPage = val;
      orderFormList(this.currentPage, this.pageSize).then(res => {
        //获取全部订单列表
        if (res.data.code === 200) {
          this.tableData = res.data.data.orderFormList;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  .el-main {
    background-color: white;
    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 30px;
    }
  }
  /deep/ .el-dialog__title {
    font-weight: bold;
  }
  .addProductInfo {
    .inp {
      width: 30%;
    }
  }
}
</style>
