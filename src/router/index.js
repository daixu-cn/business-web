import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LoginIndex",
    component: () => import("@/views/Login/index.vue"),
    redirect: "/login",
    meta:{
      title:"daixu后台管理系统"
    },
    children: [
      {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login/login.vue")
      },
      {
        path: "/forgetPwd",
        name: "ForgetPwd",
        component: () => import("@/views/Login/forgetPwd.vue")
      },
      {
        path: "/register",
        name: "Register",
        component: () => import("@/views/Login/register.vue")
      }
    ]
  },
  {
    path: "/console",
    name: "Console",
    component: () => import("@/views/Console/console.vue"),
    redirect: "/product",
    meta:{
      title:"daixu后台管理系统"
    },
    children: [
      {
        path: "/product",
        name: "Product",
        component: () => import("@/views/Console/Product/product.vue")
      },
      {
        path: "/addProduct",
        name: "AddProduct",
        component: () => import("@/views/Console/Product/addProduct.vue")
      },
      {
        path: "/classify",
        name: "Classify",
        component: () => import("@/views/Console/Product/classify.vue")
      },
      {
        path: "/orderForm",
        name: "OrderForm",
        component: () => import("@/views/Console/OrderForm/orderForm.vue")
      },
      {
        path: "/addOrderForm",
        name: "AddOrderForm",
        component: () => import("@/views/Console/OrderForm/addOrderForm.vue")
      },
      {
        path: "/member",
        name: "Member",
        component: () => import("@/views/Console/Member/member.vue")
      },
      {
        path: "/integral",
        name: "Integral",
        component: () => import("@/views/Console/Integral/integral.vue")
      },
      {
        path: "/record",
        name: "Record",
        component: () => import("@/views/Console/Integral/record.vue")
      },
      {
        path: "/dayStatement",
        name: "DayStatement",
        component: () => import("@/views/Console/statistics/dayStatement.vue")
      },
      {
        path: "/monthStatement",
        name: "MonthStatement",
        component: () => import("@/views/Console/statistics/monthStatement.vue")
      },
      {
        path: "/yearStatement",
        name: "YearStatement",
        component: () => import("@/views/Console/statistics/yearStatement.vue")
      },
      {
        path: "/operatingRecord",
        name: "OperatingRecord",
        component: () => import("@/views/Console/System/operatingRecord.vue")
      },
      {
        path: "/changePwd",
        name: "ChangePwd",
        component: () => import("@/views/Console/System/changePwd.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }

  if (localStorage.getItem("token")) {
    //判断是否需要登录
    next();
  } else {
    if (
      to.name !== "Login" &&
      to.name !== "ForgetPwd" &&
      to.name !== "Register"
    ) {
      next("/login");
    } else {
      next();
    }
  }
});
export default router;
