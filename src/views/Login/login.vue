<template>
  <div class="login">
    <div class="inp">
      <el-input
        placeholder="请输入用户名"
        v-model="name"
        clearable
        class="phone"
        :maxlength="11"
      >
      </el-input>
      <el-input
        placeholder="请填写密码"
        v-model="password"
        show-password
        class="password"
        @keyup.enter.native="loginBtn"
      ></el-input>
    </div>
    <div class="btnBox">
      <span @click="skip('忘记密码')">忘记密码</span>
      <span @click="skip('注册')">加入我们?立即注册</span>
    </div>
    <div class="loginBtn" @click="loginBtn">
      安全登录
    </div>
  </div>
</template>

<script>
import { login } from "@/api/login";
export default {
  data() {
    return {
      name: localStorage.getItem("userName"),
      password: ""
    };
  },
  methods: {
    loginBtn() {
      if (this.name === "") {
        this.$message.error("用户名不能为空!");
      } else if (this.password === "") {
        this.$message.error("密码不能为空!");
      } else {
        login(this.name, this.password).then(res => {
          if (res.data.code === 200) {
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("userName", this.name);
            localStorage.setItem("userId", res.data.data.userId);
            this.$router.replace({ name: "Console" });
          } else {
            this.$message.error("用户名或密码输入错误!");
          }
        });
      }
    },
    skip(e) {
      //选择点击的是忘记密码还是立即注册
      if (e === "忘记密码") {
        this.$router.replace({ name: "ForgetPwd" });
      } else {
        this.$router.replace({ name: "Register" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 70%;
  .inp /deep/ .el-input__inner {
    border-radius: 25px;
    background-color: #0e6aae;
    border: 4px solid #5bd0e8;
    color: white;
    height: 50px;
  }
  .inp /deep/ .el-input__clear {
    color: white;
  }
  .password {
    margin-top: 25px;
  }
  .btnBox {
    margin-top: 15px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 2%;
    :hover {
      transition: color 0.3s;
      color: #0e6aae;
    }
    cursor: pointer;
  }
  .loginBtn {
    margin-top: 60px;
    height: 50px;
    border-radius: 25px;
    color: white;
    background-color: #46b0e2;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
}
</style>
