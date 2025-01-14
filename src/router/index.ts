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
    path: "/signup/login",
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
    component: () => import("@/views/bigScreen/systemView/index.vue"),
    hidden: true,
  },
  {
    path: "/404",
    component: (resolve: any) => import("@/views/status/404.vue"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    redirect: "home",
    children: [
      {
        path: "index",
        component: (resolve: any) => import("@/views/index/index.vue"),
        name: "首页",
        meta: { title: "首页", icon: "#icon-shouye", noCache: true, affix: true }
      },
      {
        path: "home",
        component: (resolve: any) => import("@/views/foreign/home/index.vue"),
        name: "商家首页",
        meta: { title: "商家首页", icon: "#icon-shouye", noCache: true, affix: true }
      },
      ...vueRouter(),
    ],
  },
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/404'
  // }

];


const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHistory(setting.publicPath),
  routes: constantRoutes,
});

// 路由拦截

// router.beforeEach(async (to, from) => {
//   console.log(to);
//   console.log(from);

// })

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
