<template>
  <div class="register">
    <div class="inp">
      <el-input placeholder="用户名" v-model="name" clearable :maxlength="11">
      </el-input>
      <div class="email">
        <el-input :placeholder="emailPlaceholder" v-model="email" clearable>
        </el-input>
        <P
          ><el-button
            type="primary"
            round
            :disabled="captchaBtn"
            @click="getCaptchaBtn()"
            >{{ getCaptchaTxt }}</el-button
          ></P
        >
      </div>
      <el-input
        placeholder="请填写密码"
        v-model="password"
        show-password
        class="password"
      ></el-input>
      <el-input
        placeholder="确认密码"
        v-model="password2"
        show-password
        class="password"
        @keyup.enter.native="loginBtn"
      ></el-input>
      <el-input
        placeholder="请输入注册码"
        v-model="registerCode"
        clearable
        class="registerCode"
      >
      </el-input>
    </div>
    <div class="btnBox">
      <span @click="skip('返回登录')">返回登录</span>
      <span @click="skip('注册')">获取注册码</span>
    </div>
    <div class="forgetPwdBtn" @click="forgetPwdBtn">
      <el-button type="primary" round>立即注册</el-button>
    </div>
  </div>
</template>

<script>
import { getCaptcha, registerUser } from "@/api/login";
export default {
  data() {
    return {
      name: "",
      email: "",
      finalEmail: "", //最后保存的邮箱
      password: "",
      password2: "",
      registerCode: "",
      getCaptchaTxt: "获取验证码",
      captcha: "", //验证码
      emailPlaceholder: "输入邮箱",
      isGetCaptcha: false, //是否获取过验证码
      captchaBtn: false //验证码按钮是否可点
    };
  },
  methods: {
    forgetPwdBtn() {
      //点击注册按钮
      let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{4,16}$/;
      if (this.name === "") {
        this.$message.error("用户名不能为空!");
      } else if (!this.isGetCaptcha) {
        this.$message.error("请先获取验证码!");
      } else if (this.email !== this.captcha) {
        this.$message.error("验证码不正确!");
      } else if (!reg.test(this.password)) {
        this.$message.error("新密码必须由 4-16位字母、数字、特殊符号线组成!");
      } else if (this.password !== this.password2) {
        this.$message.error("两次密码不一致,请重新输入!");
      } else if (this.registerCode !== "daixu") {
        this.$message.error("无效的非法注册码!");
      } else {
        registerUser(this.name, this.finalEmail, this.password).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "注册成功,快去登录吧!",
              type: "success"
            });
          } else {
            this.$message.error("注册失败!");
          }
        });
      }
    },

    getCaptchaBtn() {
      //获取验证码按钮
      if (this.email === "" && !this.isGetCaptcha) {
        this.$message.error("邮箱不能为空!");
      } else {
        let email = this.finalEmail === "" ? this.email : this.finalEmail;
        getCaptcha(email).then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "验证码已发送,请及时填写!",
              type: "success"
            });
            this.captcha = res.data.data.captcha;
            this.emailPlaceholder = "填写验证码";
            let countDown = 60; //验证码60秒后失效
            if (this.email !== "") {
              this.finalEmail = this.email;
            }
            this.isGetCaptcha = true;
            this.email = "";
            this.captchaBtn = true;
            this.getCaptchaTxt = "重新发送(" + countDown + ")";
            let timer = setInterval(() => {
              countDown--;
              this.getCaptchaTxt = "重新发送(" + countDown + ")";
              if (countDown === 0) {
                this.getCaptchaTxt = "重新发送";
                this.captcha = ""; //清除验证码
                clearInterval(timer);
                this.captchaBtn = false;
              }
            }, 1000);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    skip(e) {
      //选择点击的是返回登录还是立即注册
      if (e === "返回登录") {
        this.$router.replace({ name: "Login" });
      } else {
        alert("联系QQ:2064889594");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.register {
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
  .email {
    p /deep/ .el-button.is-round {
      display: inline-block;
      height: 50px;
      background-color: #46b0e2;
      border-radius: 25px;
    }
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .password,
  .registerCode {
    margin-top: 20px;
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
  .forgetPwdBtn /deep/ .el-button.is-round {
    margin-top: 30px;
    display: inline-block;
    width: 100%;
    height: 50px;
    border-radius: 25px;
    background-color: #46b0e2;
  }
}
</style>
