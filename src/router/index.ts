/*
 * @Author: xiaoHao
 */

import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/index.vue";
import setting from "@/config/settings.js";
import { vueRouter } from "./global";

// 公共路由
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    hidden: true,
  },
  {
    path: "/signup",
    component: () => import("@/views/login/merchantLogin.vue"),
    hidden: true,
  },
  // 数据大屏
  {
    path: "/SystemView",
    component: () => import("@/views/pages/systemView/index.vue"),
    hidden: true,
  },
  {
    path: "/404",
    component: (resolve: any) => import("@/views/status/404.vue"),
    hidden: true,
  },
  // {
  //   path: "",
  //   component: () => import("@/views/login/merchantLogin.vue"),
    
  // },
  
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: (resolve: any) => import("@/views/index/index.vue"),
        // component: (resolve:any) => require("@/views/index/index"),
        name: "首页",
        meta: { title: "首页", icon: "#icon-shouye", noCache: true, affix: true }
      },
      {
        path: "home",
        component: (resolve: any) => import("@/views/foreign/home/index.vue"),
        // component: (resolve:any) => require("@/views/index/index"),
        name: "商家首页",
        meta: { title: "商家首页", icon: "#icon-shouye", noCache: true, affix: true }
      },
      ...vueRouter(),
    ],
  },

];


const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHistory(setting.publicPath),
  routes: constantRoutes,
});
/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
