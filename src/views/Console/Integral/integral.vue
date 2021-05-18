<template>
  <el-container>
    <el-header height="100px">
      产品名称
      <el-input
        placeholder="请输入相应的产品名称"
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
      <div class="bottons">
        <el-button
          type="success"
          round
          plain
          @click="
            addBounced = true;
            add_name = '';
            add_integral = '';
          "
          >添加兑换产品</el-button
        >
        <el-button type="warning" round plain @click="exportExcel()"
          >导出</el-button
        >
      </div>
      <div>
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          highlight-current-row
          id="out-table"
          @current-change="handleCurrentChange"
          style="width: 100%"
        >
          <el-table-column
            prop="convertibility_id"
            label="编号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="product_name"
            label="产品名称"
            width="300"
          ></el-table-column>
          <el-table-column
            prop="conversion_integral"
            label="消耗积分"
            width="180"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="conversionBtn(scope.row)"
                >兑 换</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button
            @click="
              if (currentRow) {
                editBounced = true;
                edit_name = currentRow.product_name;
                edit_integral = currentRow.conversion_integral;
              }
            "
            type="primary"
            >编 辑</el-button
          >
          <el-button @click="handleDelete" type="danger">删 除</el-button>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="currentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 7, 9, 11, 13]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
    <el-dialog
      title="添加兑换产品"
      :visible.sync="addBounced"
      width="60%"
      destroy-on-close
    >
      <el-form>
        <el-form-item label="产品名称" label-width="120px">
          <el-input v-model="add_name"></el-input>
        </el-form-item>
        <el-form-item label="消耗积分" label-width="120px">
          <el-input v-model="add_integral"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBounced = false">取 消</el-button>
        <el-button type="success" plain @click="addConversionBtn()"
          >添 加</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="产品编辑"
      :visible.sync="editBounced"
      width="60%"
      destroy-on-close
    >
      <el-form>
        <el-form-item label="产品名称" label-width="120px">
          <el-input v-model="edit_name"></el-input>
        </el-form-item>
        <el-form-item label="消耗积分" label-width="120px">
          <el-input v-model="edit_integral"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBounced = false">取 消</el-button>
        <el-button type="success" plain @click="handleRedact()">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  addIntegralProduct,
  integralProductList,
  revampIntegralProduct,
  deleteIntegralProduct,
  searchIntegralProduct,
  conversion
} from "@/api/integral";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      searchName: "", //搜索内容
      tableData: [], //表格内容
      currentPage: 1, //当前第几页
      pageSize: 5, //一页十条信息
      total: 0, //产品总数
      addBounced: false, //添加兑换产品弹框是否开启
      editBounced: false, //产品编辑弹框是否开启
      currentRow: null,
      add_name: "", //添加弹窗中的产品名
      add_integral: "", //添加弹窗中的所需积分
      edit_name: "", //编辑弹窗中的产品名
      edit_integral: "" //编辑弹窗中的所需积分
    };
  },
  created() {
    this.getIntegralProductList(this.currentPage, this.pageSize);
  },
  methods: {
    //搜索按钮
    searchBtn() {
      if (this.searchName === "") {
        this.getIntegralProductList(this.currentPage, this.pageSize);
      } else {
        searchIntegralProduct(this.searchName).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.integralProductList;
            this.total = res.data.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        });
      }
    },
    //添加兑换产品按钮
    addConversionBtn() {
      if (this.add_name === "") {
        this.$message({
          message: "产品名不能为空",
          type: "warning"
        });
        return;
      }
      if (this.add_integral === "") {
        this.$message({
          message: "所需积分不能为空",
          type: "warning"
        });
        return;
      }
      addIntegralProduct(this.add_name, this.add_integral).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "添加成功!",
            type: "success"
          });
          this.addBounced = false;
          this.getIntegralProductList(this.currentPage, this.pageSize);
        } else {
          this.$message.error("添加失败!");
        }
      });
    },
    //兑换按钮
    conversionBtn(row) {
      this.$prompt("请输入会员手机号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        conversion(value, row.conversion_integral, row.convertibility_id).then(
          res => {
            if (res.data.code === 200) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            } else {
              this.$message.error(res.data.msg);
            }
          }
        );
      });
    },
    //选中表格后执行
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getIntegralProductList(currentPage, pageSize) {
      integralProductList(currentPage, pageSize).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.integralProductList;
          this.total = res.data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
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
          "兑换产品列表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //产品删除
    handleDelete() {
      if (this.currentRow) {
        this.$confirm("此操作将删除该产品不可复原, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteIntegralProduct(this.currentRow.convertibility_id).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getIntegralProductList(this.currentPage, this.pageSize);
            } else {
              this.$message.error("删除失败,请稍后再试!");
            }
          });
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getIntegralProductList(this.currentPage, this.pageSize);
    },
    //分页功能
    currentChange(val) {
      this.currentPage = val;
      this.getIntegralProductList(this.currentPage, this.pageSize);
    },
    //编辑的保存按钮
    handleRedact() {
      if (this.edit_name === "") {
        this.$message({
          message: "产品名不能为空",
          type: "warning"
        });
        return;
      }
      if (this.edit_integral === "") {
        this.$message({
          message: "所需积分不能为空",
          type: "warning"
        });
        return;
      }
      revampIntegralProduct(
        this.edit_name,
        this.edit_integral,
        this.currentRow.convertibility_id
      ).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getIntegralProductList(this.currentPage, this.pageSize);
          this.editBounced = false;
        } else {
          this.$message.error("修改失败,请稍后再试!");
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
    .bottons {
      margin-bottom: 20px;
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 30px;
    }
  }
  .imagePreviewBounced {
    /deep/ .el-dialog__header {
      padding: 0;
    }
    /deep/ .el-dialog__body {
      font-size: 0;
      padding: 0;
      text-align: center;
    }
  }
  /deep/ .el-dialog__title {
    font-weight: bold;
  }
}
</style>
