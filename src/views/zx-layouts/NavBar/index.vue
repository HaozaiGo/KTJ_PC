<template>
  <div class="nav-bar-container">
    <el-row :gutter="15">
      <el-col :xs="4" :sm="10" :md="10" :lg="10" :xl="10">
        <!-- <el-menu
          ref="elMenu"
          class="el-menu-navbar"
          mode="horizontal"
          style="position: absolute; background: transparent !important"
          menu-trigger="hover"
          default-active="0"
        >
          <el-menu-item index="1" style="width: 60px" @click="handleCollapse">
            <slot name="title">
              <span
                style="
                  color: #fff;
                  float: left;
                  font-size: 21px;
                  margin-left: -10px;
                  line-height: 43px;
                "
              >
                <img
                  src="@/assets/img/shuidian/headerLogo.png"
                  alt=""
                  style="width: 50px; vertical-align: sub"
                />
                水电综合计费监管系统
              </span>
              <i
                style="
                  font-size: 32px;
                  line-height: 47px !important;
                  margin-left: -5px;
                  display: block;
                  margin-top: -1px;
                  cursor: pointer;
                  display: none;
                "
                :class="
                  collapse ? 'iconfont iconyouhua' : 'iconfont iconzuocelan'
                "
                :title="collapse ? '展开' : '收起'"
              />
            </slot>
          </el-menu-item>
        </el-menu> -->

        <div class="topBg">
          <span
            style="
              color: #fff;
              float: left;
              font-size: 21px;
              margin-left: 20px;
              line-height: 43px;
            "
          >
            <img
              style="width: 32px; vertical-align: middle; margin-right: 5px"
              src="@/assets/img/login_images/KTJ_Logo.png"
              alt=""
            />
            {{
              role === "platform" ? "魁腾蛟后台管理系统" : "帮到你商户运营系统"
            }}
          </span>
        </div>
      </el-col>
      <el-col :xs="16" :sm="14" :md="14" :lg="14" :xl="14" style="float: right">
        <div class="right-panel">
          <div
            :title="'总览'"
            style="cursor: pointer"
            class="warning"
            @click="handleShowBigView"
            v-if="role === 'platform'"
          >
            <el-icon style="transform: translateY(-2px)"><View /></el-icon>
            <span style="color: #fff">总览 </span>
          </div>
          <!-- <div
            :title="'收藏'"
            style="cursor: pointer; margin-left: 10px"
            class="warning"
          >
            <el-icon><Memo /></el-icon>

            <span style="color: #fff">收藏</span>
          </div> -->
          <avatar />
        </div>
      </el-col>
    </el-row>
    <!--收藏 -->
    <el-drawer
      title="收藏"
      :visible.sync="showCollection"
      :with-header="false"
      style="top: 45px"
      size="100px"
    >
      <div class="collection_top">我的收藏</div>
      <div
        style="
          overflow: hidden;
          overflow-y: auto;
          border: 1px solid rgba(214, 214, 214, 1);
        "
        :style="{ height: OverallHeight + 200 + 'px' }"
      >
        <div
          class="collection"
          v-for="(item, index) in collection"
          @click="goLink(item)"
          :key="index"
        >
          <div class="collection_div">
            <svg class="icon indexIcon">
              <use :xlink:href="item.meta.icon"></use>
            </svg>
          </div>
          <div class="collection_div1">{{ item.meta.title }}</div>
        </div>
      </div>
    </el-drawer>
    <!-- <audio ref="audioPlay" :src="audioSrc" /> -->
  </div>
</template>
<script>
import { getFavorites } from "@/api/common/router.js";
import { Avatar } from "@/layouts/components/index.js";
import router from "@/router/index.ts";
export default {
  name: "NavBar",
  components: {
    Avatar,
  },
  data() {
    return {
      //audioSrc: "", //MP3地址
      showCollection: false,
      dialogVisible: false, //告警设置
      item: [],
      index: 999,
      height: 0,
      WindoWwidth: window.innerWidth,
      themeColor:
        window.localStorage.getItem("ThemeStyle") == "false" ? "#000" : "#fff",
      collection: [],
      role: "",
    };
  },
  computed: {},
  watch: {
    $route: {
      handler(route) {},
    },
  },

  created() {
    this.role = window.localStorage.getItem("role");
  },
  methods: {
    handleShowBigView() {
      this.$router.push("/SystemView");
    },
    goLink(item) {
      var arr = JSON.parse(window.localStorage.getItem("routes"));
      var path = "";
      var path1 = "";
      var path2 = "";
      arr.forEach((res) => {
        if (res.meta != undefined && res.meta.title == item.meta.title) {
        }
        res.children.forEach((res1) => {
          if (res1.meta != undefined && res1.meta.title == item.meta.title) {
          }
          res1.children.forEach((res2) => {
            if (res2.meta != undefined && res2.meta.title == item.meta.title) {
              path = res.path.split("/")[res.path.split("/").length - 1];
              path1 = res1.path;
              path2 = res2.path;
            }
          });
        });
      });
      this.$router.push({
        path: "/" + path + "/" + path1 + "/" + path2,
      });
    },
  },
};
</script>
<style lang="scss" >
.auth {
  color: red;
  cursor: pointer;
  margin-right: 12px;
  animation: blink 2s linear infinite;
  -webkit-animation: blink 2s linear infinite;
  -moz-animation: blink 2s linear infinite;
  -ms-animation: blink 2s linear infinite;
  -o-animation: blink 2s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.8;
  }
}

@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.8;
  }
}

@-moz-keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.8;
  }
}

@-ms-keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.8;
  }
}

@-o-keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.8;
  }
}

.menu-h1:hover {
  color: $base-color-default !important;
}

.menu-h1:focus {
  color: $base-color-default !important;
}

.meter-back .menu-h1 {
  color: #fff !important;
}

.mrbs-white .menu-h1 {
  color: #4e4e4e !important;
  border-bottom: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
}

.el-menu-navbar .el-menu-item i {
  color: #fff !important;
}

.el-menu-navbar .el-menu-item:hover i,
.el-menu-navbar .el-menu-item.is-active i {
  color: $base-color-white !important;
}

.el-menu-navbar .el-submenu__title:hover i {
  color: #fff !important;
}

.el-menu-navbar .el-submenu__title i {
  color: $base-color-default !important;
}

.el-menu-item {
  &:hover {
    color: $base-color-white;
    background-color: $base-menu-background-active !important;
  }

  &.is-active {
    color: $base-color-white;
    background-color: $base-menu-background-active !important;
  }
}

.nav-bar-container i.el-submenu__icon-arrow.el-icon-arrow-down {
  display: none;
}

.mrbs-white
  .nav-bar-container
  .el-menu--horizontal
  .el-menu-item:not(.is-disabled):hover {
  background-color: #fff0 !important;
}

.mrbs-black
  .nav-bar-container
  .el-menu--horizontal
  .el-menu-item:not(.is-disabled):hover {
  background-color: #fff0 !important;
}

.mrbs-white .nav-bar-container li.el-submenu.is-opened div {
  background-color: #fff0 !important;
}

.mrbs-black .nav-bar-container li.el-submenu.is-opened div {
  background-color: #fff0 !important;
}

.nav-bar-container .el-menu--horizontal > .el-submenu .el-submenu__title {
  line-height: 35px;
}

.nav-bar-container.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.nav-bar-container .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: #a7b8be00 !important;
}
</style>
<style lang="scss" scoped>
.warning {
  color: #fff;
  float: left;
  display: flex;
  align-items: center;
}

li.el-menu-item.is-active.is-active {
  background-color: #fff0 !important;
}

.nav-bar-container {
  margin-left: 0px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: $base-nav-bar-height;
  padding-right: $base-padding;
  overflow: hidden;
  user-select: none;
  background: $base-color-white;
  box-shadow: $base-box-shadow;
  z-index: 100;

  .left-panel {
    height: $base-nav-bar-height;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .menu-router {
    color: #7d7b81;
    margin: 10px 0px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .right-panel {
    height: $base-nav-bar-height;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
  }
}

.collection_top {
  border-left: 1px solid rgba(214, 214, 214, 1);
  width: 100%;
  height: 25px;
  line-height: 25px;
  text-align: center;
  color: rgba(76, 116, 144, 1);
}

.collection {
  text-align: center;
  margin: 15px auto;
  cursor: pointer;

  .collection_div {
    width: 45px;
    height: 45px;
    background-color: rgba(214, 227, 249, 1);
    margin-left: 27.5px;
    border-radius: 8px;
    line-height: 25px;
    font-size: 22px;
    position: relative;
  }

  .collection_div1 {
    line-height: 25px;
    color: rgba(0, 0, 0, 1);
    text-align: center;
    width: 100px;
  }
}
</style>
<style scoped>
.el-checkbox :deep(.el-checkbox__inner) {
  border-radius: 50%;
}
</style>