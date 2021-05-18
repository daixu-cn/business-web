<template>
  <div class="loginIndex">
    <div class="title">
      daixu后台管理系统
    </div>
    <div class="main clearfix">
      <div class="left">
        <img src="../../assets/images/login2.png" alt="" />
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.loginIndex {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/login_backgrounde.png") no-repeat;
  background-size: cover;
  .title {
    font-size: 46px;
    color: white;
    text-align: center;
    position: fixed;
    top: 13%;
    left: 50%;
    transform: translateX(-50%);
  }
  .main {
    width: 55%;
    height: 50%;
    background: url("../../assets/images/login3.png") no-repeat center center;
    background-size: 200% 200%;
    background-color: rgba($color: #03294f, $alpha: 0.86);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5%;
    .left {
      width: 50%;
      height: 100%;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 70%;
      }
    }
    .right {
      width: 50%;
      height: 100%;
      // background-color: pink;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
