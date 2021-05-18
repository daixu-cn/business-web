<template>
  <el-container>
    <el-header height="100px">
      <div>
        产品名称
        <el-autocomplete
          v-model="searchName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          @change="handleSelect"
        ></el-autocomplete>
      </div>
      <div>
        产品分类
        <el-select
          v-model="value"
          placeholder="请选择"
          @change="hanldeClassify"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </el-header>
    <el-main>
      <div class="bottons">
        <el-button
          type="success"
          round
          plain
          @click="$router.push({ name: 'AddProduct' })"
          >添加产品</el-button
        >
        <el-button
          type="primary"
          round
          plain
          @click="$router.push({ name: 'Classify' })"
          >分类管理</el-button
        >
        <el-button type="warning" round plain @click="exportExcel()"
          >导出</el-button
        >
        <el-button type="danger" round plain @click="resetTable()"
          >重置</el-button
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
          <el-table-column prop="product_id" label="产品编号"></el-table-column>
          <el-table-column
            prop="product_name"
            label="产品名称"
          ></el-table-column>
          <el-table-column
            prop="product_detailed"
            label="产品内容"
          ></el-table-column>
          <el-table-column
            prop="purchasing_price"
            label="进价"
          ></el-table-column>
          <el-table-column prop="selling_price" label="售价"></el-table-column>
          <el-table-column prop="classify" label="类别"></el-table-column>
          <el-table-column
            prop="exchangeIntegral"
            label="获得积分"
          ></el-table-column>
          <el-table-column prop="product_img" label="产品图片">
            <template slot-scope="img_scope">
              <div
                class="imagePreview"
                @click="handleImagePreview(img_scope.$index, img_scope.row)"
              >
                点击查看
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inventory" label="库存" width="100">
            <template slot-scope="inventory_scope">
              <el-switch
                :value="inventory_scope.row.inventory === 0 ? true : false"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleInventory(inventory_scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
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
          :page-sizes="[5, 7, 9, 10, 12]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
    <el-dialog
      title="产品编辑"
      :visible.sync="editBounced"
      width="60%"
      destroy-on-close
    >
      <el-form
        :label-position="'right'"
        label-width="80px"
        :model="formLabelAlign"
      >
        <el-form-item label="产品图片">
          <el-upload
            action="http://up-z0.qiniu.com"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            :show-file-list="false"
            :data="uploadData"
            :on-success="handleSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-image
              style="width: 200px;"
              :src="qiniuConfig.qiniuPath + formLabelAlign.productImg"
              fit="scale-down"
            ></el-image>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="formLabelAlign.product_name"></el-input>
        </el-form-item>
        <el-form-item label="产品内容">
          <el-input
            type="textarea"
            :rows="5"
            v-model="formLabelAlign.product_detailed"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品进价">
          <el-input
            v-model="formLabelAlign.purchasing_price"
            class="price"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品售价">
          <el-input
            v-model="formLabelAlign.selling_price"
            class="price"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品分类">
          <el-select
            v-model="formLabelAlign.classify"
            placeholder="请选择"
            @change="changeSelect"
          >
            <el-option
              v-for="item in formLabelAlign.classifyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获得积分">
          <el-input
            v-model="formLabelAlign.exchangeIntegral"
            class="price"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBounced = false">取 消</el-button>
        <el-button type="success" plain @click="handleRedact()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="imagePreview"
      :show-close="false"
      class="imagePreviewBounced"
    >
      <!-- <img width="100%" :src="dialogImageUrl" /> -->
      <el-image
        style="width: 100%; height: 70vh"
        :src="dialogImageUrl"
        fit="scale-down"
      ></el-image>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  getUserToken,
  getClassifyList,
  searchList,
  getProductList,
  getSearchProductResult,
  getClassifyResult,
  deleteProduct,
  revampInventory,
  addProductClassifyList,
  revampProduct,
  getUploadToken,
  revampProductImg
} from "@/api/product";
import { getRandom, qiNiuDomainName } from "@/utils/util";
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
      pagingCall: 0, //0代表分页查询所有产品,1代表产品名,2代表分类
      editBounced: false, //产品编辑弹框是否开启
      imagePreview: false, //图片预览弹框
      dialogImageUrl: "",
      formLabelAlign: {
        productImg: null,
        product_id: null,
        product_name: "",
        product_detailed: null,
        purchasing_price: null,
        selling_price: null,
        classify: null,
        classify_id: null,
        exchangeIntegral: null,
        classifyList: []
      },
      uploadData: { key: "", token: "" }, //key为上传的文件名
      qiniuConfig: {
        qiniuPath: qiNiuDomainName
      }
    };
  },
  created() {
    // getUserToken().then(res => {
    //   if (res.data.code === 200) {
    //     if (localStorage.getItem("token") !== res.data.data) {
    //       this.$router.go(0);
    //       return;
    //     }
    //   } else {
    //     this.$router.go(0);
    //   }
    // });
    getClassifyList().then(res => {
      //获取产品分类列表
      this.options = res.data.data.classifyList;
    });
    getProductList(this.currentPage, this.pageSize).then(res => {
      //获取全部产品列表
      if (res.data.code === 200) {
        this.tableData = res.data.data.productList;
        this.total = res.data.data.total;
      }
    });
    addProductClassifyList().then(res => {
      //获取编辑弹窗内分类列表
      this.formLabelAlign.classifyList = res.data.data;
    });
    getUploadToken().then(res => {
      //获取七牛云上传token
      if (res.data.code === 200) {
        this.uploadData.token = res.data.data.uploadToken;
      }
    });
  },
  methods: {
    handleSuccess(res, file, fileList) {
      //上传成功返回执行
      this.formLabelAlign.productImg = res.key;
      revampProductImg(res.key, this.formLabelAlign.product_id).then(res2 => {
        if (res2.data.code === 200) {
          getProductList(this.currentPage, this.pageSize).then(res => {
            //获取全部产品列表
            if (res.data.code === 200) {
              this.tableData = res.data.data.productList;
              this.total = res.data.data.total;
            }
          });
        }
      });
      this.$message({
        message: "修改成功",
        type: "success"
      });
    },
    beforeUpload(file) {
      //上传之前
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      this.uploadData.key = "";
      for (let i = 0; i < 5; i++) {
        this.uploadData.key = this.uploadData.key + getRandom(0, 9);
      }
      this.uploadData.key = `${new Date().getTime()}` + this.uploadData.key;
    },
    uploadError(err, file, fileList) {
      //上传失败调用
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    changeSelect(item) {
      //编辑弹框中的分类框变更时
      this.formLabelAlign.classify_id = item;
    },
    resetTable() {
      //重置按钮
      this.value = "";
      this.searchName = "";
      getProductList(this.currentPage, this.pageSize).then(res => {
        //获取全部产品列表
        if (res.data.code === 200) {
          this.tableData = res.data.data.productList;
          this.total = res.data.data.total;
        }
      });
    },
    handleImagePreview(index, row) {
      //图片预览弹框
      this.dialogImageUrl = qiNiuDomainName + row.product_img;
      this.imagePreview = true;
    },
    handleInventory(item) {
      //改变库存是否充足状态
      revampInventory(item.inventory, item.product_id).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "修改成功!",
            type: "success"
          });
          getProductList(this.currentPage, this.pageSize).then(res => {
            //获取全部产品列表
            if (res.data.code === 200) {
              this.tableData = res.data.data.productList;
              this.total = res.data.data.total;
            }
          });
        } else {
          this.$message.error("服务器繁忙,请稍后再试");
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
          "产品信息.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    querySearchAsync(queryString, cb) {
      //获取产品名搜索列表
      var list = [{}];
      searchList(queryString)
        .then(res => {
          list = res.data.data.searchList;
          cb(list);
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSelect(item) {
      //产品名选定后执行
      this.currentPage = 1;
      getSearchProductResult(
        this.searchName,
        this.currentPage,
        this.pageSize
      ).then(res => {
        if (res.data.code === 200) {
          this.pagingCall = 1;
          this.tableData = res.data.data.productList;
          this.total = res.data.data.total;
          this.$message({
            message: "查询成功!",
            type: "success"
          });
        } else {
          this.$message("未查询到该产品!");
        }
      });
    },
    hanldeClassify(item) {
      //产品分类选中后执行
      this.currentPage = 1;
      getClassifyResult(item, this.currentPage, this.pageSize).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.productList;
          this.total = res.data.data.total;
          this.pagingCall = 2;
          this.$message({
            message: "查询成功!",
            type: "success"
          });
        } else {
          this.$message("该分类未添加产品!");
        }
      });
    },
    handleEdit(index, row) {
      //编辑按钮
      this.formLabelAlign.productImg = row.product_img;
      this.formLabelAlign.product_id = row.product_id;
      this.formLabelAlign.product_name = row.product_name;
      this.formLabelAlign.product_detailed = row.product_detailed;
      this.formLabelAlign.purchasing_price = row.purchasing_price;
      this.formLabelAlign.selling_price = row.selling_price;
      this.formLabelAlign.classify = row.classify;
      this.formLabelAlign.classify_id = row.classify_id;
      this.formLabelAlign.exchangeIntegral = row.exchangeIntegral;
      this.editBounced = true;
    },
    handleDelete(index, row) {
      //产品删除
      this.$confirm("此操作将删除该产品不可复原, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProduct(row.product_id, row.product_img).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "删除成功!",
              type: "success"
            });
            getProductList(this.currentPage, this.pageSize).then(res => {
              //获取全部产品列表
              if (res.data.code === 200) {
                this.tableData = res.data.data.productList;
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
      getProductList(this.currentPage, this.pageSize).then(res => {
        //获取全部产品列表
        if (res.data.code === 200) {
          this.tableData = res.data.data.productList;
          this.total = res.data.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      //分页功能
      this.currentPage = val;
      if (this.pagingCall === 0) {
        getProductList(this.currentPage, this.pageSize).then(res => {
          this.tableData = res.data.data.productList;
        });
      } else if (this.pagingCall === 1) {
        getSearchProductResult(
          this.searchName,
          this.currentPage,
          this.pageSize
        ).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.productList;
          }
        });
      } else if (this.pagingCall === 2) {
        getClassifyResult(item, this.currentPage, this.pageSize).then(res => {
          this.tableData = res.data.data.productList;
        });
      }
    },
    handleRedact() {
      //编辑的保存按钮
      if (this.formLabelAlign.product_name === "") {
        this.$message({
          showClose: true,
          message: "产品名不能为空!",
          type: "warning"
        });
        return;
      }
      revampProduct(
        this.formLabelAlign.product_name,
        this.formLabelAlign.product_detailed,
        this.formLabelAlign.purchasing_price,
        this.formLabelAlign.selling_price,
        this.formLabelAlign.classify_id,
        this.formLabelAlign.product_id,
        this.formLabelAlign.exchangeIntegral
      ).then(res => {
        if (res.data.code === 200) {
          this.$message({
            showClose: true,
            message: "保存成功!",
            type: "success"
          });
          this.editBounced = false;
          getProductList(this.currentPage, this.pageSize).then(res => {
            //获取全部产品列表
            if (res.data.code === 200) {
              this.tableData = res.data.data.productList;
              this.total = res.data.data.total;
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "服务器繁忙,请稍后再试!",
            type: "error"
          });
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
    display: flex;
    justify-content: flex-start;
    align-items: center;
    div {
      margin-right: 20px;
    }
    div:nth-child(1),
    div:nth-child(2) {
      font-size: 20px;
      font-weight: bold;
      .el-autocomplete,
      .el-select {
        margin-left: 15px;
      }
    }
  }
  .el-main {
    margin-top: 20px;
    background-color: white;
    .bottons {
      margin-bottom: 20px;
    }
    .imagePreview {
      cursor: pointer;
      color: #8799a3;
      transition: all 0.7s;
    }
    .imagePreview:hover {
      color: #40b6ee;
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
  .addProductInfo {
    .inp {
      width: 30%;
    }
  }
}
</style>
