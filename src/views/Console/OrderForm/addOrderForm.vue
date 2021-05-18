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
      <div>
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          id="out-table"
        >
          <el-table-column
            prop="product_id"
            label="产品编号"
            width="80"
          ></el-table-column>
          <el-table-column prop="product_img" label="产品图片" width="135">
            <template slot-scope="img_scope">
              <el-image
                style="width: 110px;height:110px;"
                :src="qiNiuDomainName + img_scope.row.product_img"
                :preview-src-list="[
                  qiNiuDomainName + img_scope.row.product_img
                ]"
                fit="cover"
              ></el-image>
            </template>
          </el-table-column>
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
                type="success"
                @click="handleAdd(scope.$index, scope.row)"
                >加入订单</el-button
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
    <el-dialog
      title="订单录入"
      :visible.sync="addBounced"
      width="40%"
      destroy-on-close
    >
      <el-form :label-position="'right'" label-width="80px">
        <el-form-item label="产品图片">
          <el-image
            style="width: 50%;"
            :src="product_img"
            fit="contain"
          ></el-image>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="product_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="获得积分">
          <el-input v-model="exchangeIntegral" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单种类">
          <el-select v-model="kindValue" placeholder="请选择">
            <el-option
              v-for="item in kindList"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员手机">
          <el-input v-model="member_phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBounced = false">取 消</el-button>
        <el-button type="success" plain @click="handleSave()">添加</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  getClassifyList,
  searchList,
  getProductList,
  getSearchProductResult,
  getClassifyResult,
  revampInventory,
  revampProduct,
  getUploadToken,
  revampProductImg
} from "@/api/product";
import { addOrderForm } from "@/api/orderForm";
import { qiNiuDomainName } from "@/utils/util";
export default {
  data() {
    return {
      searchName: "", //搜索内容
      options: [], //分类列表
      value: "", //分类列表当前选项
      tableData: [], //表格内容
      currentPage: 1, //当前第几页
      pageSize: 3, //一页十条信息
      total: 0, //产品总数
      pagingCall: 0, //0代表分页查询所有产品,1代表产品名,2代表分类
      addBounced: false, //添加订单弹框
      product_name: "",
      product_id: null,
      product_img: "",
      member_phone: "",
      exchangeIntegral: 0,
      kindValue: "堂食/打包",
      kindList: [
        { value: "堂食/打包" },
        { value: "美团" },
        { value: "饿了么" },
        { value: "其他" }
      ],
      qiNiuDomainName: qiNiuDomainName
    };
  },
  created() {
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
  },
  methods: {
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
    //打开添加的弹框
    handleAdd(index, row) {
      this.kindValue = "堂食/打包";
      this.member_phone = "";
      this.product_id = row.product_id;
      this.product_name = row.product_name;
      this.exchangeIntegral = row.exchangeIntegral;
      this.product_img = qiNiuDomainName + row.product_img;
      if (row.inventory === 1) {
        this.$confirm("该产品库存不足, 是否继续?", "库存提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.addBounced = true;
        });
      } else {
        this.addBounced = true;
      }
    },
    //弹框内的添加按钮
    handleSave() {
      addOrderForm(
        this.product_id,
        this.kindValue,
        this.member_phone,
        this.exchangeIntegral
      ).then(res => {
        if (res.data.code === 201) {
          this.$message.error(res.data.msg);
        } else {
          if (res.data.data.integral) {
            this.$message({
              message: "下单成功!该会员积分余额:" + res.data.data.integral,
              type: "success"
            });
          } else {
            this.$message({
              message: "下单成功!",
              type: "success"
            });
          }
          this.addBounced = false; //关闭弹窗
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
