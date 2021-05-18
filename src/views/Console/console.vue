<template>
  <div class="consoleIndex">
    <el-container>
      <el-aside width="300px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              :default-active="currentPath"
              class="el-menu-vertical-demo"
              background-color="#293846"
              text-color="#ccc"
              active-text-color="#4cd7d1"
              router
              unique-opened
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>产品详情</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="product">全部产品</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="addProduct">添加产品</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="classify">分类管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span>订单信息</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="orderForm">全部订单</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="addOrderForm">添加订单</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-user-solid"></i>
                  <span>会员管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="member">所有会员</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-s-flag"></i>
                  <span>积分系统</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="integral">产品兑换</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="record">兑换记录</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-s-data"></i>
                  <span>销量报表</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="dayStatement">当日报表</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="monthStatement">按月查询</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="yearStatement">年度统计</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="6">
                <template slot="title">
                  <i class="el-icon-s-tools"></i>
                  <span>系统配置</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="operatingRecord">操作记录</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="changePwd">密码修改</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item @click="quit()">退出</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header>
          <div class="logo">
            <img src="http://lollipop.ink/logo" />
          </div>
          <div>
            您好,{{ userName }}管理员
            <i class="iconfont icon-guanbi" @click="quit()"></i>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPath: "",
      userName: localStorage.getItem("userName"),
    };
  },
  created() {
    this.currentPath = this.$route.path.substr(1);
  },
  watch: {
    $route(to) {
      this.currentPath = to.path.substr(1);
    },
  },
  methods: {
    quit() {
      this.$confirm("是否确认退出,下次将要重新登录?", "退出提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        localStorage.removeItem("token");
        this.$router.replace({ name: "Login" });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.consoleIndex {
  background-color: #ebeaf0;
  .el-aside {
    background-color: aqua;
    height: 100vh;
  }
  .el-header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:nth-child(1) {
      font-size: 0;
      img {
        width: 30%;
        cursor: pointer;
      }
    }
    div:nth-child(2) {
      font-size: 20px;
      color: black;
      i {
        font-size: 18px;
        margin-left: 10px;
        color: #4cd7d1;
        cursor: pointer;
      }
    }
  }

  .el-main {
    // background-color: pink;
    width: 98%;
    margin: 1% auto 5% auto;
    padding: 0;
  }

  .tac {
    height: 100vh;
    background-color: #293846;
  }
}
</style>
