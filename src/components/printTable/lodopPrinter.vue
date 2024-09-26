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
  </div>
</template>

<script setup>
import printTable from "@/components/printTable/diet.vue";
import KitchenTable from "@/components/printTable/kitchen.vue";
import getLodop from "@/utils/LodopFuncs.js";
import { reactive, onMounted, ref, inject, nextTick } from "vue";
const kitchenTableDom = ref(null);
const printTableDom = ref(null);
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
      console.log("这是windows32位系统");
      getPrinterList();
    }
    if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
      console.log("这是windows64位系统");
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
  console.log("打印机列表", arr);
  LODOPOBJ.value = LODOP;
};
//轮流打单
const asyncEvent = async (ele) => {
  return new Promise((resolve) => {
    setTimeout(
      (e) => {
        state.orderDetailData = Object.assign({}, state.orderDetailData, e);
        handlePrint(e);
        resolve(e);
      },
      10,
      ele
    );
  });
};

// 打印方法执行
const handlePrint = async (data) => {
  state.orderDetailData = Object.assign({}, data);
  state.showPrintTable = true;
  const res = printerOption.value.find((x) => x.label === data.printerModel);
  console.log("-------找到打印机", res);
  await nextTick();
  // 找到匹配的打印机
  if (res && data.orderMenuList.length > 0) {
    let LODOP = getLodop();
    const height =
      data.printerType === "KITCHEN"
        ? (kitchenTableDom.value.$el.clientHeight /
            kitchenTableDom.value.$el.clientWidth) *
          80
        : (printTableDom.value.$el.clientHeight /
            printTableDom.value.$el.clientWidth) *
            80 +
          5;
    console.log(height);

    const printerHtml =
      data.printerType === "KITCHEN"
        ? kitchenTableDom.value.$el.innerHTML
        : printTableDom.value.$el.innerHTML;

    LODOP.PRINT_INIT(data.printerModel);
    LODOP.SET_PRINT_PAGESIZE(1, "80mm", height + "mm", "");
    LODOP.SET_PRINTER_INDEX(data.printerModel);
    LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
    LODOP.ADD_PRINT_HTM(0, 0, "80mm", height + "mm", printerHtml);
    // LODOP.PREVIEW();
    LODOP.PRINT();
    state.showPrintTable = false;
    // debugger;
  }
};

defineExpose({
  handlePrint,
  asyncEvent,
});
</script>

<style lang="scss" scoped>
</style>