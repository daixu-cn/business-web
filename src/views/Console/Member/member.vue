<template>
  <el-container>
    <el-header height="100px">
      会员号码
      <el-input
        placeholder="请输入手机号码"
        v-model="searchPhone"
        class="searchPhone"
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
        <el-button type="success" round plain @click="addBtn()"
          >添加会员</el-button
        >
        <el-button type="warning" round plain @click="exportExcel()"
          >导出</el-button
        >
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          id="out-table"
        >
          <el-table-column prop="member_id" label="会员编号"></el-table-column>
          <el-table-column
            prop="member_name"
            label="会员名称"
          ></el-table-column>
          <el-table-column
            prop="phone_number"
            label="会员号码"
          ></el-table-column>
          <el-table-column prop="integral" label="积分数"></el-table-column>
          <el-table-column prop="count" label="下单数"></el-table-column>
          <el-table-column
            prop="create_time"
            label="注册时间"
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
          :page-sizes="[5, 7, 9, 11]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
    <el-dialog
      title="添加会员"
      :visible.sync="dialogFormVisible"
      @closed="handleClose()"
    >
      <el-form>
        <el-form-item label="会员名称" label-width="120px">
          <el-input v-model="member_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员手机号" label-width="120px">
          <el-input v-model="phone_number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" plain @click="handleSave()">添 加</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  memberList,
  deleteMember,
  searchMember,
  addMember
} from "@/api/menber";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      searchPhone: "", //搜索的手机号
      tableData: [], //表格内容
      currentPage: 1, //当前第几页
      pageSize: 5, //一页十条信息
      total: 0, //产品总数
      dialogFormVisible: false,
      member_name: "",
      phone_number: ""
    };
  },
  created() {
    memberList(this.currentPage, this.pageSize).then(res => {
      if (res.data.code === 200) {
        this.tableData = res.data.data.memberList;
        this.total = res.data.data.total;
      }
    });
  },
  methods: {
    //弹框关闭时触发
    handleClose() {
      (this.member_name = ""), (this.phone_number = "");
    },
    //弹框中的保存按钮
    handleSave() {
      if (this.phone_number === "") {
        this.$message({
          message: "手机号不能为空!",
          type: "warning"
        });
        return;
      }
      addMember(this.member_name, this.phone_number).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "添加成功!",
            type: "success"
          });
          memberList(this.currentPage, this.pageSize).then(res => {
            if (res.data.code === 200) {
              this.tableData = res.data.data.memberList;
              this.total = res.data.data.total;
            }
          });
          this.dialogFormVisible = false;
        } else {
          this.$message.error("添加失败!");
        }
      });
    },
    //添加会员按钮
    addBtn() {
      this.dialogFormVisible = true;
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
          "会员信息.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    handleDelete(index, row) {
      //产品删除
      this.$confirm("此操作将删除该会员不可复原, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteMember(row.member_id).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            memberList(this.currentPage, this.pageSize).then(res => {
              if (res.data.code === 200) {
                this.tableData = res.data.data.memberList;
                this.total = res.data.data.total;
              } else {
                this.tableData = [];
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
      memberList(this.currentPage, this.pageSize).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.memberList;
          this.total = res.data.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      //分页功能
      this.currentPage = val;
      memberList(this.currentPage, this.pageSize).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.memberList;
          this.total = res.data.data.total;
        }
      });
    },
    searchBtn() {
      if (this.searchPhone === "") {
        memberList(this.currentPage, this.pageSize).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.memberList;
            this.total = res.data.data.total;
          } else {
            this.tableData = [];
          }
        });
      } else {
        searchMember(this.searchPhone).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "查询成功!",
              type: "success"
            });
            this.tableData = res.data.data.member;
            this.total = res.data.data.total;
          } else {
            this.$message("未查到相关手机号!");
          }
        });
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
    .searchPhone {
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
  /deep/ .el-dialog__title {
    font-weight: bold;
  }
}
</style>
