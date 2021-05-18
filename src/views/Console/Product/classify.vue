<template>
  <el-container>
    <el-main>
      <div class="bottons">
        <el-button type="success" round plain @click="addBounced = true"
          >添加分类</el-button
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
          <el-table-column
            prop="classify_id"
            label="分类编号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="classify_name"
            label="分类名称"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="classify_num"
            label="数量"
            width="80"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                :disabled="scope.row.classify_id === 0 ? true : false"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="scope.row.classify_id === 0 ? true : false"
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
      title="分类编辑"
      :visible.sync="editBounced"
      width="50%"
      destroy-on-close
      @closed="newClassifyName = ''"
    >
      <div>
        <el-form label-width="100px">
          <el-form-item label="新的分类名称">
            <el-input v-model="newClassifyName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBounced = false">取 消</el-button>
        <el-button type="success" plain @click="editSave()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加分类"
      :visible.sync="addBounced"
      width="50%"
      destroy-on-close
      @closed="createClassifyName = ''"
    >
      <div>
        <el-form label-width="100px">
          <el-form-item label="分类名称">
            <el-input v-model="createClassifyName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBounced = false">取 消</el-button>
        <el-button type="success" plain @click="addSave()">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  classifyParticulars,
  deleteClassify,
  revampClassify,
  addClassify
} from "@/api/product";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      tableData: [], //表格内容
      currentPage: 1, //当前页数
      pageSize: 5, //一页十行
      total: 0, //表格总条数
      editBounced: false, //编辑弹框
      addBounced: false, //添加弹框
      newClassifyName: "", //新的分类名,
      createClassifyName: "", //添加的分类名
      currentClassify: {}
    };
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  },
  methods: {
    getTableData(currentPage, pageSize) {
      classifyParticulars(currentPage, pageSize).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data.list[0].classify_id) {
            res.data.data.list[0].classify_id = 0;
            res.data.data.list[0].classify_name = "未分类";
          }
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    addSave() {
      //添加的保存按钮
      if (this.createClassifyName === "") {
        this.$message.error("分类名称不能为空!");
        return;
      }
      addClassify(this.createClassifyName).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getTableData(this.currentPage, this.pageSize);
        } else {
          this.$message.error("服务器繁忙,请稍后再试!");
        }
      });
      this.addBounced = false;
    },
    editSave() {
      //编辑的保存按钮
      if (this.newClassifyName === "") {
        this.$message.error("新的名称不能为空!");
        return;
      }
      revampClassify(
        this.newClassifyName,
        this.currentClassify.classify_id
      ).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getTableData(this.currentPage, this.pageSize);
        } else {
          this.$message.error("服务器繁忙,请稍后再试!");
        }
      });
      this.editBounced = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData(this.currentPage, this.pageSize);
    },
    handleCurrentChange(val) {
      //分页功能
      this.getTableData(val, this.pageSize);
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
          "分类列表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    handleEdit(index, row) {
      this.newClassifyName = row.classify_name;
      this.currentClassify = row;
      this.editBounced = true;
    },
    handleDelete(index, row) {
      //分类删除
      this.$confirm("此操作将删除该分类不可复原, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteClassify(row.classify_id).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            this.getTableData(this.currentPage, this.pageSize);
          } else {
            this.$message.error("删除失败,请稍后再试!");
          }
        });
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
