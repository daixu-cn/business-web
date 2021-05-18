<template>
  <el-container>
    <el-main>
      <div class="formerPaw" v-if="active === 0">
        <el-form label-position="right" label-width="150px">
          <el-form-item label="原密码:">
            <el-input v-model="formerPaw" show-password></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="next()">下一步</el-button>
      </div>
      <div class="newPaw" v-if="active === 1">
        <el-form label-position="right" label-width="150px">
          <el-form-item label="新密码:">
            <el-input v-model="newPaw" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码:">
            <el-input v-model="affirmPaw" show-password></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="save()" type="success" plain>修 改</el-button>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { pawVerify, alterPassword } from "@/api/system";
export default {
  data() {
    return {
      formerPaw: "", //原密码
      newPaw: "", //新密码
      affirmPaw: "", //确认密码
      active: 0 //0表示第一步,1表示第二步
    };
  },
  methods: {
    next() {
      if (this.formerPaw === "") {
        this.$message({
          message: "请先填写原密码!",
          type: "warning"
        });
      }
      pawVerify(this.formerPaw).then(res => {
        if (res.data.code === 200) {
          this.active = 1;
        } else {
          this.$message.error("与原密码不相符!");
        }
      });
    },
    save() {
      let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{4,16}$/;
      if (!reg.test(this.newPaw)) {
        this.$message({
          message: "新密码必须由 4-16位字母、数字、特殊符号线组成!",
          type: "warning"
        });
        return;
      }
      if (this.affirmPaw !== this.newPaw) {
        this.$message({
          message: "两次密码输入不一致!",
          type: "warning"
        });
        return;
      }
      alterPassword(this.affirmPaw).then(res => {
        if (res.data.code === 200) {
          localStorage.removeItem("token");
          this.$alert("密码修改成功,返回重新登录!", "密码修改", {
            confirmButtonText: "确定",
            showClose: false,
            callback: () => {
              this.$router.replace({ name: "Login" });
            }
          });
        } else {
          this.$message.error("服务器异常,请稍后再试!");
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
    display: flex;
    justify-content: center;
    align-items: center;
    .formerPaw,
    .newPaw {
      /deep/ .el-form-item__label {
        font-size: 30px;
        font-weight: bold;
      }
      /deep/ .el-button {
        margin-left: 50%;
        transform: translateX(-50%);
      }
      width: 50%;
    }
  }
}
</style>
