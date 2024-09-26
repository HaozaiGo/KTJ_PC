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
          <avatar @logout="logout" />
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

    <!-- 核销订单详情 -->
    <el-dialog v-model="state1.dialogVisible" title="查看订单" width="1000">
      <div style="text-align: center">
        <el-form
          ref="ruleFormRef"
          :model="state1.form"
          label-width="100px"
          inline
        >
          <el-form-item label="台号" prop="tableNo">
            <el-select
              v-model="state1.form.tableNo"
              placeholder="Select"
              style="width: 250px"
              clearable
              filterable
              allow-create
            >
              <el-option
                v-for="item in state1.tableNoOptions"
                :key="item.tableNo"
                :label="item.tableNo"
                :value="item.tableNo"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="state1.form.checked">暂无空位</el-checkbox>
          </el-form-item>
          <div style="text-align: left; margin-left: 290px">
            人数：{{ state1.orderDetailData.peopleQty }}人
          </div>
        </el-form>

        <div style="font-size: 25px">菜品</div>

        <el-table
          :data="state1.orderDetailData.menuList"
          stripe
          style="width: 100%"
          :max-height="tableHeight - 300"
        >
          <el-table-column prop="name" label="品名" />
          <el-table-column prop="unit" label="规格" width="150" />
          <el-table-column prop="qty" label="数量" width="150" />
          <el-table-column prop="price" label="单价" width="150" />
          <el-table-column prop="amount" label="小计" width="150" />
        </el-table>

        <div style="font-size: 16px; font-weight: bold; margin-top: 20px">
          合计：¥{{ state1.orderDetailData.billAmount }} &ensp;&ensp;
          优惠后实收：¥{{ state1.orderDetailData.amount }}
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state1.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleOutBill"> 出单 </el-button>
        </div>
      </template>
    </el-dialog>

    <audio ref="audioPlay" src="/newOrder.MP3">
      Your browser does not support the <code>audio</code> element.
    </audio>

    <printTable
      v-if="state.showPrintTable"
      ref="printTableDom"
      :tableData="state.printerData"
      :needScanImg="false"
      :needBottomPrice="false"
      style="
        position: fixed;
        left: 0;
        bottom: 0;
        transform: translate(-80mm, -80mm);
        opacity: 0;
      "
    ></printTable>

    <KitchenTable
      v-if="state.showPrintTable"
      ref="kitchenTableDom"
      :tableData="state.printerData"
      style="
        position: fixed;
        left: 0;
        bottom: 0;
        transform: translate(-80mm, -80mm);
        opacity: 0;
      "
    >
    </KitchenTable>
  </div>
</template>
<script>
import { getFavorites } from "@/api/common/router.js";
import { Avatar } from "@/layouts/components/index.js";
import router from "@/router/index.ts";
import common from "@/utils/common";
import { ElNotification } from "element-plus";
import getLodop from "@/utils/LodopFuncs.js";
import printTable from "@/components/printTable/diet.vue";
import KitchenTable from "@/components/printTable/kitchen.vue";

import {
  getDeskList,
  checkNoDetail,
  offlineCheckOrder,
  beforePayCheckOrder,
} from "@/api/project/foreign/order.js";

export default {
  name: "NavBar",
  components: {
    Avatar,
    printTable,
    KitchenTable,
  },
  data() {
    return {
      state1: {
        dialogVisible: false, //核销订单详情
        tableNoOptions: [],
        form: {
          tableNo: "",
          checked: false,
        },
        orderDetailData: {
          peopleQty: null,
          billAmount: null,
          amount: null,
          menuList: [],
        },
      },
      // 打印机数据
      state: {
        showPrintTable: false,
        printerData: {},
      },

      //audioSrc: "", //MP3地址
      showCollection: false,
      dialogVisible: false, //告警设置
      item: [],
      height: 0,
      themeColor:
        window.localStorage.getItem("ThemeStyle") == "false" ? "#000" : "#fff",
      collection: [],
      role: "",
      orderLists: [], //socket过来的订单数量
      storeId: "",
      socketData: {}, //点击的socket数据
      printerMethod: [], //打单方式
      printerOption: [], //打印机全部型号
      tableHeight: common.tableHeight(),
      notifiactions: [],
      wsClose: false,
      ws: null,
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
  mounted() {
    try {
      this.storeId = JSON.parse(localStorage.getItem("storeId")).storeId;
    } catch (err) {
      console.log(err);
    }
    if (this.role === "merchant") {
      common.getStoreDict("bill_print_method").then((res) => {
        this.printerMethod = res.data[0].list;
      });
    }
    setTimeout(() => {
      var agent = navigator.userAgent.toLowerCase();
      var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
        console.log("这是windows32位系统");
        this.getPrinterOption();
      }
      if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
        console.log("这是windows64位系统");
        this.getPrinterOption();
      }
      if (isMac) {
        console.log("这是mac系统");
      }
      if (this.role === "merchant") {
        this.getOrderListSocket();
        this.getTableNoList();
      }
    }, 1000);
  },
  methods: {
    logout() {
      try {
        this.wsClose = true;

        this.ws.close();
      } catch (err) {
        console.log(err);
      }
    },
    getPrinterOption() {
      let LODOP = getLodop();

      let count = LODOP.GET_PRINTER_COUNT();
      let arr = [];
      for (var i = 0; i < count; i++) {
        let obj = {};
        obj.value = LODOP.GET_PRINTER_NAME(i);
        obj.label = LODOP.GET_PRINTER_NAME(i);
        arr.push(obj);
      }

      this.printerOption = arr;
      console.log("打印机列表", arr);
    },
    async handleOutBill() {
      const body = {
        method:
          this.socketData.method === "新单"
            ? this.printerMethod[0].dictValue
            : this.printerMethod[1].dictValue,
        orderId: this.state1.orderDetailData.orderId,
        storeId: this.state1.orderDetailData.storeId,
        tableNo: this.state1.orderDetailData.tableNo,
      };
      var res;
      if (this.state1.orderDetailData.type === "SCAN_ORDER_UNDER") {
        //后付
        res = await offlineCheckOrder(body);
      } else {
        //前付
        res = await beforePayCheckOrder(body);
      }
      if (res.code === 0) {
        const printerArr = res.data;
        for (let i = 0; i < printerArr.length; i++) {
          await this.asyncEvent(printerArr[i]);
        }
        this.state1.dialogVisible = false;
        this.$message.success("出单成功!");
      }
    },

    async asyncEvent(ele) {
      return new Promise((resolve) => {
        setTimeout(
          (e) => {
            console.log(e);
            this.state.printerData = Object.assign(
              {},
              this.state1.orderDetailData,
              e
            );
            // 有数据才打单
            if (this.state.printerData.orderMenuList.length > 0) {
              this.handlePrint(e);
            }
            resolve(e);
          },
          10,
          ele
        );
      });
    },
    // 打印方法执行
    handlePrint(data) {
      this.state.showPrintTable = true;
      const res = this.printerOption.find((x) => x.label === data.printerModel);
      // 找到匹配的打印机
      if (res) {
        this.$nextTick(() => {
          let LODOP = getLodop();

          const height =
            data.printerType === "KITCHEN"
              ? (this.$refs.kitchenTableDom.$el.clientHeight /
                  this.$refs.kitchenTableDom.$el.clientWidth) *
                80
              : (this.$refs.printTableDom.$el.clientHeight /
                  this.$refs.printTableDom.$el.clientWidth) *
                80;
          console.log(height);

          const printerHtml =
            data.printerType === "KITCHEN"
              ? this.$refs.kitchenTableDom.$el.innerHTML
              : this.$refs.printTableDom.$el.innerHTML;

          LODOP.PRINT_INIT(data.printerModel);
          LODOP.SET_PRINT_PAGESIZE(1, "80mm", height + "mm", "");
          LODOP.SET_PRINTER_INDEX(data.printerModel);
          LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
          LODOP.ADD_PRINT_HTM(0, 0, "80mm", height + "mm", printerHtml);
          // LODOP.PREVIEW();
          LODOP.PRINT();
          this.state.showPrintTable = false;
          // debugger;
        });
      }
    },

    //获取台号
    async getTableNoList() {
      const res = await getDeskList({ storeId: this.storeId, pageSize: 999 });
      if (res.code === 0) {
        this.state1.tableNoOptions = res.rows;
      }
    },

    // 开启订单socket
    getOrderListSocket() {
      // 连接websocket
      const url = common.socketUrl;

      var that = this;
      this.ws = new WebSocket(
        `${url}/store/api/ws/order/handle/monitor/${this.storeId}`
      );
      // console.log(ws);
      // 监听消息

      this.ws.onmessage = function (event) {
        console.log(event);
        try {
          const data = JSON.parse(event.data);
          that.orderLists.push(data);
          that.$refs.audioPlay.play();
          // console.log(that.orderLists);
          let notifiaction = ElNotification({
            title: `订单号：${data.orderNo}`,
            message: `
            <p>订单数：${that.orderLists.length}</p>
            <div class="flex-sb"> <div>桌号：${data.tableNo} 人数：${data.peopleQty}</div><button style="padding:5px 10px;
  border-radius: 5px;
  background-color: rgb(64, 158, 255);
  color: #fff;
  margin-left: 20px;
  cursor: pointer;" >去处理</button></div>
  `,
            position: "bottom-right",
            dangerouslyUseHTMLString: true,
            showClose: false,
            onClick: function (e) {
              that.state1.dialogVisible = true;
              that.getOrderDetail(data);
              //关闭当前实例
              const v = that.notifiactions.splice(
                that.notifiactions.indexOf(notifiaction),
                1
              );
              v[0].close();
            },
            duration: 0,
          });
          that.notifiactions.push(notifiaction);
        } catch (err) {
          console.log(err);
        }
      };
      // 重连
      this.ws.onclose = function (event) {
        if (!that.wsClose) {
          console.log("重连");
          that.getOrderListSocket();
        } else {
          console.log("正常关闭");
        }
      };
      this.ws.onerror = function (event) {
        console.log("error");
        that.getOrderListSocket();
      };
    },

    // 获取订单详细
    async getOrderDetail(data) {
      // console.log(data.orderId);
      this.socketData = data;
      const res = await checkNoDetail(data.orderId);
      if (res.code === 0) {
        this.state1.form.tableNo = res.data.tableNo;
        this.state1.orderDetailData = res.data;
      }
    },

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
<style lang="scss" scoped>
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