<template>
  <el-container>
    <el-header height="100px">
      会员号码
      <el-input
        placeholder="请输入相应的会员号码"
        v-model="searchName"
        class="searchName"
        @keyup.enter.native="searchBtn()"
      >
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="searchBtn()"
            >搜索</el-button
          >
        </template>
      </el-input>
    </el-header>
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
            prop="record_id"
            label="编号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="product_name"
            label="产品名称"
            width="300"
          ></el-table-column>
          <el-table-column
            prop="phone_number"
            label="会员号码"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="conversion_integral"
            label="兑换积分"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="record_time"
            label="兑换时间"
            width="200"
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
          :page-sizes="[5, 7, 9, 11, 13]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { forRecord, searchForRecord, deleteForRecord } from "@/api/integral";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      searchName: "", //搜索内容
      options: [], //分类列表
      value: "", //分类列表当前选项
      tableData: [], //表格内容
      currentPage: 1, //当前第几页
      pageSize: 5, //一页十条信息
      total: 0, //产品总数
      pagingCall: 0 //0代表全部记录列表,1代表会员号
    };
  },
  created() {
    this.getForRecord(this.currentPage, this.pageSize);
  },
  methods: {
    //获取全部列表
    getForRecord(currentPage, pageSize) {
      this.pagingCall = 0;
      forRecord(currentPage, pageSize).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.forRecordList;
          this.total = res.data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //搜索按钮
    searchBtn() {
      if (this.searchName === "") {
        this.currentPage = 1;
        this.getForRecord(this.currentPage, this.pageSize);
      } else {
        this.currentPage = 1;
        searchForRecord(this.searchName, this.currentPage, this.pageSize).then(
          res => {
            if (res.data.code === 200) {
              this.pagingCall = 1;
              this.tableData = res.data.data.forRecordList;
              this.total = res.data.data.total;
            } else {
              this.tableData = [];
              this.total = 0;
            }
          }
        );
      }
    },
    exportExcel() {
      /* out-table关联导出的dom节点  */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "兑换记录.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    handleDelete(index, row) {
      //产品删除
      this.$confirm("此操作将删除该产品不可复原, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteForRecord(row.record_id).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            this.getForRecord(this.currentPage, this.pageSize);
          } else {
            this.$message.error("删除失败,请稍后再试!");
          }
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getForRecord(this.currentPage, this.pageSize);
    },
    handleCurrentChange(val) {
      //分页功能
      this.currentPage = val;
      if (this.pagingCall === 0) {
        this.getForRecord(this.currentPage, this.pageSize);
      } else {
        searchForRecord(this.searchName, this.currentPage, this.pageSize).then(
          res => {
            if (res.data.code === 200) {
              this.pagingCall = 1;
              this.tableData = res.data.data.forRecordList;
              this.total = res.data.data.total;
            } else {
              this.tableData = [];
            }
          }
        );
      }
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
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .searchName {
      width: 30%;
      margin-left: 20px;
    }
  }
  .el-main {
    margin-top: 20px;
    background-color: white;
    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 30px;
    }
  }
}
</style>
