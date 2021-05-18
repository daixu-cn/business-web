<template>
  <el-container>
    <el-main>
      <el-form
        :label-position="'right'"
        label-width="80px"
        :model="formLabelAlign"
      >
        <el-form-item label="产品图片">
          <el-upload
            class="uploaderImg"
            action="http://up-z0.qiniu.com"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            :data="uploadData"
            :on-success="handleSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :on-remove="deleteUpload"
            ref="upload"
            list-type="picture-card"
            :limit="1"
            :show-file-list="true"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
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
        <el-form-item label="获得积分">
          <el-input
            v-model="formLabelAlign.exchangeIntegral"
            class="price"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-radio v-model="formLabelAlign.inventory" :label="0"
            >充足</el-radio
          >
          <el-radio v-model="formLabelAlign.inventory" :label="1"
            >不充足</el-radio
          >
        </el-form-item>
        <el-form-item label="产品分类">
          <el-select v-model="formLabelAlign.classify" placeholder="请选择">
            <el-option
              v-for="item in formLabelAlign.classifyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="danger" plain @click="resetBtn()">重置</el-button>
        <el-button type="success" plain @click="addBtn()">添加</el-button>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import {
  getUploadToken,
  addProductClassifyList,
  addProduct
} from "@/api/product";
import { getRandom, qiNiuDomainName } from "@/utils/util";
export default {
  data() {
    return {
      uploadData: { key: "", token: "" }, //key为上传的文件名
      qiniuConfig: {
        qiniuPath: qiNiuDomainName
      },
      imageUrl: "product_img",
      isUpload: false, //是否要上传图片
      formLabelAlign: {
        product_name: "",
        product_detailed: null,
        purchasing_price: null,
        selling_price: null,
        inventory: 0,
        classify: null,
        exchangeIntegral: null,
        classifyList: []
      }
    };
  },
  created() {
    //获取上传图片token
    getUploadToken().then(res => {
      if (res.data.code === 200) {
        this.uploadData.token = res.data.data.uploadToken;
      }
    });
    //获取分类列表
    addProductClassifyList().then(res => {
      this.formLabelAlign.classifyList = res.data.data;
    });
  },
  methods: {
    handleChange() {
      this.isUpload = true;
    },
    deleteUpload() {
      this.isUpload = false;
    },
    verification() {
      if (!this.formLabelAlign.product_detailed) {
        this.formLabelAlign.product_detailed = "";
      }
      if (!this.formLabelAlign.purchasing_price) {
        this.formLabelAlign.purchasing_price = 0;
      }
      if (!this.formLabelAlign.selling_price) {
        this.formLabelAlign.selling_price = 0;
      }
      if (!this.formLabelAlign.classify) {
        this.formLabelAlign.classify = 0;
      }
      if (!this.formLabelAlign.exchangeIntegral) {
        this.formLabelAlign.exchangeIntegral = 0;
      }
      addProduct(
        this.formLabelAlign.product_name,
        this.formLabelAlign.product_detailed,
        this.formLabelAlign.purchasing_price,
        this.formLabelAlign.selling_price,
        this.formLabelAlign.inventory,
        this.formLabelAlign.classify,
        this.formLabelAlign.exchangeIntegral,
        this.imageUrl
      ).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: "添加成功!",
            type: "success"
          });
          this.$refs.upload.clearFiles();
          this.imageUrl = "product_img";
          this.isUpload = false; //是否要上传图片
          this.formLabelAlign = {
            product_name: "",
            product_detailed: null,
            purchasing_price: null,
            selling_price: null,
            inventory: 0,
            classify: null,
            classifyList: []
          };
        } else {
          this.$message.error("添加失败!请稍后再试!");
        }
      });
    },
    /**
     * 上传成功返回执行
     */
    handleSuccess(res, file, fileList) {
      this.imageUrl = res.key;
      this.verification();
    },
    /**
     * 上传之前
     */
    beforeUpload(file) {
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
      for (let i = 0; i < 5; i++) {
        this.uploadData.key = this.uploadData.key + getRandom(0, 9);
      }
      this.uploadData.key = `${new Date().getTime()}` + this.uploadData.key;
    },
    /**
     * 上传失败调用
     */
    uploadError(err, file, fileList) {
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    /**
     * 重置按钮
     */
    resetBtn() {
      this.$refs.upload.clearFiles();
      this.imageUrl = "product_img";
      this.isUpload = false; //是否要上传图片
      this.formLabelAlign = {
        product_name: "",
        product_detailed: null,
        purchasing_price: null,
        selling_price: null,
        inventory: 0,
        classify: null,
        classifyList: []
      };
    },
    /**
     * 添加按钮
     */
    addBtn() {
      if (this.formLabelAlign.product_name === "") {
        this.$message.error("产品名称不能为空!");
        return;
      }
      if (this.isUpload) {
        this.$refs.upload.submit(); //触发图片上传
      } else {
        this.verification();
      }
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
    .price {
      /deep/ .el-input__inner {
        width: 20%;
      }
    }
    .uploaderImg {
      /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      /deep/ .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
      }
      .avatar {
        width: 148px;
        height: 148px;
        display: block;
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 50px;
      /deep/ .el-button {
        margin: 0 20px;
      }
    }
  }
}
</style>
