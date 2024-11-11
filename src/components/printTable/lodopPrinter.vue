<template>
  <div>
    <printTable
      v-if="state.showPrintTable"
      ref="printTableDom"
      :tableData="state.orderDetailData"
      :needScanImg="needScanImg"
      :needBottomPrice="needBottomPrice"
      :imgSrc="imgSrc"
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
      :tableData="state.orderDetailData"
      style="
        position: fixed;
        left: 0;
        bottom: 0;
        transform: translate(-80mm, -80mm);
        opacity: 0;
      "
    >
    </KitchenTable>
    <Front54
      v-if="state.showPrintTable"
      ref="Front54TableDom"
      :tableData="state.orderDetailData"
      :needScanImg="needScanImg"
      :needBottomPrice="needBottomPrice"
      :imgSrc="imgSrc"
      style="
        position: fixed;
        left: 0;
        bottom: 0;
        transform: translate(-80mm, -80mm);
        opacity: 0;
      "
    ></Front54>
    <KitchenTable58
      v-if="state.showPrintTable"
      ref="Front58Kitchen"
      :tableData="state.orderDetailData"
      style="
        position: fixed;
        left: 0;
        bottom: 0;
        transform: translate(-80mm, -80mm);
        opacity: 0;
      "
    >
    </KitchenTable58>
  </div>
</template>

<script setup>
import Front54 from "@/components/printTable/front54.vue";
import KitchenTable58 from "@/components/printTable/kitchen58.vue";
import printTable from "@/components/printTable/diet.vue";
import KitchenTable from "@/components/printTable/kitchen.vue";
import getLodop from "@/utils/LodopFuncs.js";
import { reactive, onMounted, ref, inject, nextTick } from "vue";
const kitchenTableDom = ref(null);
const printTableDom = ref(null);
const Front54TableDom = ref(null);
const Front58Kitchen = ref(null);
const LODOPOBJ = ref(null);
const props = defineProps({
  needScanImg: {
    default: true,
    type: Boolean,
  },
  needBottomPrice: {
    default: true,
    type: Boolean,
  },
  imgSrc: String,
});
const printerOption = ref([]);
const state = reactive({
  showPrintTable: false,
  orderDetailData: {},
});

onMounted(() => {
  setTimeout(() => {
    var agent = navigator.userAgent.toLowerCase();
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
      // console.log("这是windows32位系统");
      getPrinterList();
    }
    if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
      // console.log("这是windows64位系统");
      getPrinterList();
    }
    if (isMac) {
      console.log("这是mac系统");
    }
  }, 100);
});
// 获取打印机list
const getPrinterList = async () => {
  let LODOP = getLodop();
  let count = LODOP.GET_PRINTER_COUNT();
  let arr = [];
  for (var i = 0; i < count; i++) {
    let obj = {};
    obj.value = LODOP.GET_PRINTER_NAME(i);
    obj.label = LODOP.GET_PRINTER_NAME(i);
    arr.push(obj);
  }
  printerOption.value = arr;
  // console.log("打印机列表", arr);
  LODOPOBJ.value = LODOP;
};
//轮流打单
const asyncEvent = async (ele) => {
  return new Promise((resolve) => {
    setTimeout(
      async (e) => {
        // 一个菜一个单
        console.log("ddddd", e);
        if (e.isSingleMenu === "1") {
          for (let i = 0; i < e.orderMenuList.length; i++) {
            state.orderDetailData = Object.assign({}, state.orderDetailData, e);

            state.orderDetailData.orderMenuList = [e.orderMenuList[i]];
            console.log("打印菜单", state.orderDetailData);

            await handlePrint(state.orderDetailData);
          }
          resolve(e);
        } else {
          // 多个菜一个单
          state.orderDetailData = Object.assign({}, state.orderDetailData, e);

          handlePrint(e);
          resolve(e);
        }
      },
      10,
      ele
    );
  });
};
// 团购打单

const groupBuyAsyncEvent = async (ele) => {
  return new Promise((resolve) => {
    setTimeout(
      async (e) => {
        // 一个菜一个单
        console.log("ddddd", e);
        if (e.isSingleMenu === "1") {
          for (let i = 0; i < e.mealMenuList.length; i++) {
            state.orderDetailData = Object.assign({}, state.orderDetailData, e);

            state.orderDetailData.orderMenuList = [e.mealMenuList[i]];
            // console.log("打印菜单", state.orderDetailData);

            await handlePrint(state.orderDetailData);
          }
          resolve(e);
        } else {
          // 多个菜一个单
          state.orderDetailData = Object.assign({}, state.orderDetailData, e);
          state.orderDetailData.orderMenuList = e.mealMenuList;
          // console.log(state.orderDetailData);

          handlePrint(state.orderDetailData);
          resolve(e);
        }
      },
      10,
      ele
    );
  });
};

// 打印方法执行
const handlePrint = async (data) => {
  state.showPrintTable = true;
  console.log(printerOption.value);
  
  const res = printerOption.value.find((x) => x.label === data.printerModel);
  if (res) {
    console.log("-------找到打印机", res);
  }

  await nextTick();
  // 找到匹配的打印机

  console.log("----111----", data);

  if (res && data.orderMenuList.length > 0) {
    let LODOP = getLodop();
    var height;
    if (data.printSpec === "50mm") {
      height =
        data.printerType === "KITCHEN"
          ? (Front58Kitchen.value.$el.clientHeight /
              Front58Kitchen.value.$el.clientWidth) *
              50 +
            10
          : (Front54TableDom.value.$el.clientHeight /
              Front54TableDom.value.$el.clientWidth) *
              50 +
            20;
    } else {
      height =
        data.printerType === "KITCHEN"
          ? (kitchenTableDom.value.$el.clientHeight /
              kitchenTableDom.value.$el.clientWidth) *
              80 +
            10
          : (printTableDom.value.$el.clientHeight /
              printTableDom.value.$el.clientWidth) *
              80 +
            5;
    }
    console.log("height", height);

    var printerHtml;
    if (data.printSpec === "50mm") {
      printerHtml =
        data.printerType === "KITCHEN"
          ? Front58Kitchen.value.$el.innerHTML
          : Front54TableDom.value.$el.innerHTML;
    } else {
      printerHtml =
        data.printerType === "KITCHEN"
          ? kitchenTableDom.value.$el.innerHTML
          : printTableDom.value.$el.innerHTML;
    }

    LODOP.PRINT_INIT(data.printerModel);
    LODOP.SET_PRINT_PAGESIZE(
      1,
      data.printSpec === "50mm" ? "58mm" : "80mm",
      height + "mm",
      ""
    );
    LODOP.SET_PRINTER_INDEX(data.printerModel);
    LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
    LODOP.ADD_PRINT_HTM(
      0,
      0,
      data.printSpec === "50mm" ? "58mm" : "80mm",
      height + "mm",
      printerHtml
    );
    // LODOP.PREVIEW();
    LODOP.PRINT();
    state.showPrintTable = false;
    // debugger;
  }
};

defineExpose({
  handlePrint,
  asyncEvent,
  groupBuyAsyncEvent,
});
</script>

<style lang="scss" scoped>
</style>