<template>
  <div class="whiteBg" v-show="model" @click="model = false;clickBoxState = null">
    <div
      style="position: absolute; left: 180px; top: 150px"
      class="flex-c"
      @click="
        model = false;
        clickBoxState = null;
      "
    >
      <img
        src="@/assets/img/commonPic/back.png"
        alt=""
        style="width: 40px; height: 40px; margin-right: 10px"
      />
      <span style="font-size: 25px">返回</span>
    </div>
    <div class="choosedItem center">
      <div>
        <p style="text-align: center">{{ deskItem.tableNo }}</p>

        <div class="flex-c">
          <el-icon><Avatar /></el-icon>
          <span>{{ deskItem.peopleQty }}人</span>
        </div>
      </div>
    </div>

    <div class="clickBox center" style="top: 55%">
      <div class="flex row1">
        <div
          style="border-right: 1px solid #000; border-top-left-radius: 10px"
          @click.stop="handleClickBox('add')"
          :class="{ active: clickBoxState === 'add' }"
        >
          点菜
        </div>
        <div
          style="border-top-right-radius: 10px"
          @click.stop="handleClickBox('refund')"
          :class="{ active: clickBoxState === 'refund' }"
        >
          退菜
        </div>
      </div>
      <div class="flex">
        <div
          class="row2"
          @click.stop="handleClickBox('pay')"
          :class="{ active: clickBoxState === 'pay' }"
          :style="
            props.canClearDesk
              ? 'border-bottom-right-radius: 0px;border-right:1px solid #000'
              : 'border-bottom-right-radius: 10px;'
          "
        >
          结账
        </div>
        <div
          v-if="props.canClearDesk"
          class="row2Clear"
          @click="handleClearDesk"
        >
          清台
        </div>
      </div>
    </div>
    <!-- 结账 -->
    <el-drawer v-model="drawer" :with-header="false" direction="rtl" size="35%">
      <div class="order-summary">
        <div class="flex-sb" style="margin: 30px 0 5px 0; align-items: center">
          <h2>菜品</h2>
          <div>
            共{{ orderDetail.data.menuList.length }}项
            <span
              style="
                color: #f27d43;
                margin-left: 30px;
                display: inline-block;
                font-size: 19px;
              "
              >¥{{ orderDetail.data.amount }}</span
            >
          </div>
        </div>
        <div :style="`height:${tableHeight - 120}px;overflow: auto`">
          <ul>
            <li v-for="(item, idx) in items" :key="idx" class="liSty">
              <span class="flex-c">
                <img
                  src="@/assets/img/merchant/refund.png"
                  alt=""
                  style="
                    width: 30px;
                    height: 30px;
                    margin-right: 8px;
                    display: block;
                  "
                  v-if="item.isReturnMenu === '1'"
                />
                {{ item.name }}
              </span>
              <span>x{{ item.qty }}</span>
              <span>¥{{ item.price }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 支付方式 -->
      <div class="flex-sb payWayMax">
        <div style="flex: 2">
          <h3 style="text-align: center">支付方式</h3>
          <div class="flex-c payWay">
            <!-- <div >现金支付</div> -->
            <div class="activePayWay">
              <img
                src="@/assets/img/commonPic/wxpay.png"
                style="
                  width: 20px;
                  height: 20px;
                  vertical-align: sub;
                  background-color: #ffffff;
                "
              />
              微信支付
            </div>
          </div>
        </div>
        <div style="flex: 1">
          <h3 style="text-align: center">结账明细</h3>
          <div class="payDetail">
            <div>
              <span>原价</span>
              <span style="width: 80px"
                >¥{{ orderDetail.data.billAmount }}</span
              >
            </div>
            <div>
              <span>应收 </span
              ><span style="width: 80px">¥{{ orderDetail.data.amount }}</span>
            </div>
            <div>
              <span>实收</span>
              <span style="width: 80px; font-size: 20px; color: #f27d43"
                >¥{{ orderDetail.data.amount }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="confirmPay flex-c" @click="handleConfirm">确认结账</div>
    </el-drawer>

    <!-- 退菜退单 -->
    <el-drawer
      v-model="refundDrawer"
      :with-header="false"
      direction="rtl"
      size="35%"
      :show-close="true"
    >
      <!-- 退菜数量明显 -->
      <div class="refundItemNum" v-if="refundNum">
        <div class="flex-sb">
          <div style="padding: 6px">退菜数量</div>
          <div style="padding: 6px" @click="refundList = []">清空</div>
        </div>

        <div class="refundListSty">
          <div
            class="flex-sb"
            v-for="(item1, idx1) in refundList"
            :key="idx1"
            style="align-items: center"
          >
            <div>{{ item1.name }}</div>

            <div class="flex-c">
              <el-icon
                @click="decreaseQuantity(idx1)"
                color="#ff1014"
                size="29"
                style="cursor: pointer; margin: 5px 8px"
                ><RemoveFilled
              /></el-icon>
              {{ item1.qty }}
              <el-icon
                @click="increaseQuantity(idx1)"
                color="#3e8bfb"
                size="29"
                style="cursor: pointer; margin: 5px 8px"
                ><CirclePlusFilled
              /></el-icon>
            </div>
          </div>
        </div>

        <p>退菜原因 <span style="color: red; font-size: 22px">*</span></p>
        <div class="flex">
          <button class="why" @click="whyRefund('未按要求制作')">
            未按要求制作
          </button>
          <button class="why" @click="whyRefund('不新鲜')">不新鲜</button>
          <button class="why" @click="whyRefund('发现异物')">发现异物</button>

          <button class="why" @click="whyRefund('无')">无</button>
          <button class="why" @click="showCustom = true" v-if="!showCustom">
            自定义
          </button>
          <input
            v-else
            type="text"
            placeholder="自定义"
            style="
              width: 100px;
              padding: 7px 10px;
              border: 1px solid #ccc;
              margin: 5px;
              border-radius: 6px;
              background-color: #ffffff;
            "
            v-model="customVal"
            @change="customChange"
          />
        </div>
      </div>
      <div class="order-summary">
        <div class="flex-sb" style="margin: 30px 0 10px 0; align-items: center">
          <div class="flex">
            <h2>菜品</h2>
            <el-checkbox
              v-model="checkedAll"
              label="全选"
              size="large"
              style="margin-left: 10px"
              @change="checkboxChange"
            />
          </div>
          <div>
            共{{ orderDetail.data.menuList.length }}项
            <span
              style="
                color: #f27d43;
                margin-left: 30px;
                display: inline-block;
                font-size: 19px;
              "
              >¥{{ orderDetail.data.amount }}</span
            >
          </div>
        </div>
        <div :style="`height:${tableHeight - 45}px;overflow: scroll`">
          <ul>
            <li
              v-for="(item, idx) in items"
              :key="idx"
              class="liSty"
              @click="handleSelectList(item, idx)"
              :class="{ activeListy: liStyIdx === idx }"
            >
              <span class="flex-c">
                <img
                  src="@/assets/img/merchant/refund.png"
                  alt=""
                  style="
                    width: 30px;
                    height: 30px;
                    margin-right: 8px;
                    display: block;
                  "
                  v-if="item.isReturnMenu === '1'"
                />

                {{ item.name }}</span
              >
              <span>x{{ item.qty }}</span>
              <span>¥{{ item.price }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 退菜明细 -->
      <div class="flex-sb payWayMax" style="border: none">
        <div style="flex: 1">
          <h3 style="text-align: center">退菜明细</h3>
          <div class="payDetail">
            <div>
              <span>退菜数量 </span
              ><span style="width: 80px">x{{ refundNumTotal }}</span>
            </div>
            <div style="margin-top: 10px">
              <span>退菜金额 </span
              ><span style="width: 80px">¥{{ refundTotalCost }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="confirmPay flex-c" @click="handleConfirmRefundMenu">
        确认退菜
      </div>
    </el-drawer>

    <!-- 自定义打单 -->
    <el-dialog
      v-model="printerWay.dialogVisible"
      title="打单方式"
      width="500"
      align-center
    >
      <el-form>
        <el-form-item label="指定打印机">
          <el-select
            v-model="printerWay.form.printerId"
            placeholder="打印机型号"
            style="width: 300px"
            @change="switchPrinter"
          >
            <el-option
              v-for="item in printerWay.printerLists"
              :key="item.printerId"
              :label="item.printerName"
              :value="item.printerId"
            />
            <el-option value="all" label="全部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印方式">
          <el-radio-group v-model="printerWay.form.method">
            <el-radio
              :value="item.dictValue"
              v-for="(item, idx) in methodOption"
              :key="idx"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="printerWay.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCustom"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <lodopPrinter :imgSrc="printerWay.imgSrc" ref="lodopPrint"></lodopPrinter>
  </div>
</template>

<script setup>
import lodopPrinter from "@/components/printTable/lodopPrinter.vue";
import {
  checkHasOrder,
  clearTable,
  refundMenu,
} from "@/api/project/foreign/createDesk.js";
import { ref, onMounted, reactive, inject, computed, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  checkNoDetail,
  getSysPrinterLists,
  customPrint,
  getQrCodePayImg,
  offlineCheckOrder,
} from "@/api/project/foreign/order.js";
const router = useRouter();
const printerWay = reactive({
  dialogVisible: false,
  form: { printerId: "", method: "" },
  printerLists: [],
  needScanImg: true,
  imgSrc: "",
});
const tableHeight = inject("$com").tableHeight();
const emit = defineEmits(["clearDesk"]);
const liStyIdx = ref(null); //列表acticeIdx

const lodopPrint = ref(null);
const filePath = localStorage.getItem("filePath");
const methodOption = ref([]);
const items = ref([]);
const model = defineModel({ default: false });
const props = defineProps({ deskItem: Object, canClearDesk: Boolean });
const clickBoxState = ref(null);
const drawer = ref(null);
const refundDrawer = ref(false);
const orderDetail = ref({});
const orderId = ref(null);
const refundNum = ref(false);
const refundList = ref([]);
const refundState = ref(false); //是否已经选择退菜原因
const checkedAll = ref(false);
const showCustom = ref(false); //自定义原因
const customVal = ref(""); //自定义原因
const customChange = (e) => {
  console.log(e.target.value);
  refundList.value.forEach((x) => (x.tasteNeed = e.target.value));
};
//全选
const checkboxChange = (e) => {
  if (e) {
    refundList.value = [];

    const allList = items.value
      .map((x) => {
        if (x.isReturnMenu != "1") {
          return x;
        }
      })
      .filter((x) => !!x);

    for (let i = 0; i < allList.length; i++) {
      const obj = Object.assign({}, allList[i]);
      refundList.value.push(obj);
    }
  }
};
// 退菜原因
const whyRefund = (val) => {
  refundList.value.forEach((x) => (x.tasteNeed = val));
  refundState.value = true;
  console.log(refundList.value);
};

const handleSelectList = async (item, idx) => {
  console.log(item);

  liStyIdx.value = idx;
  const index = refundList.value.findIndex((x) => x.menuId === item.menuId);

  // 退菜list
  if (item.isReturnMenu != "1") {
    if (index === -1) {
      refundList.value.push(Object.assign({}, item, { qty: 1 }));
    } else {
      if (refundList.value[index].qty >= item.qty) {
        ElMessage.error("退菜数量不能大于原菜数量!");
      } else {
        refundList.value[index].qty += 1;
      }
    }
  } else {
    ElMessage.error("该菜品已经退菜!");
  }
};
const decreaseQuantity = (idx) => {
  if (refundList.value[idx].qty > 1) {
    refundList.value[idx].qty--;
  } else {
    refundList.value.splice(idx, 1);
  }
};
const increaseQuantity = (idx) => {
  const idxs = items.value.findIndex(
    (x) => x.menuId === refundList.value[idx].menuId
  );
  if (idxs === -1) {
    refundList.value[idx].qty++;
  } else {
    if (refundList.value[idx].qty >= items.value[idxs].qty) {
      ElMessage.error("退菜数量不能大于原菜数量!");
    } else {
      refundList.value[idx].qty++;
    }
  }
};

const handleCheckHasOrder = async () => {
  return new Promise(async (resolve, reject) => {
    // 检查是否存在订单
    const hadOrder = await checkHasOrder({
      storeId: props.deskItem.storeId,
      tableNo: props.deskItem.tableNo,
    });
    if (hadOrder.code === 0 && hadOrder.data != null) {
      orderId.value = hadOrder.data.orderId;
      orderDetail.value = await checkNoDetail(orderId.value);
      if (
        orderDetail.value.code === 0 &&
        orderDetail.value.data.menuList.length > 0
      ) {
        items.value = orderDetail.value.data.menuList;
        resolve();
      }
    } else {
      reject();
    }
  });
};
// 确认退菜
const handleConfirmRefundMenu = async () => {
  if (refundList.value.length <= 0) {
    ElMessage.error("请选择需要退的菜品!");
  } else if (refundState.value) {
    const body = {
      menuList: refundList.value,
      orderId: orderId.value,
      storeId: props.deskItem.storeId,
    };
    const res = await refundMenu(body);
    if (res.code === 0) {
      ElMessage.success("退菜成功!");
      handleCheckHasOrder();
      refundList.value = [];
      refundState.value = false;
      customVal.value = "";
      showCustom.value = false;
      refundDrawer.value = false;
    }
  } else {
    ElMessage.error("请选择退菜原因!");
  }
};
const handleClickBox = async (val) => {
  clickBoxState.value = val;
  if (val === "pay") {
    console.log(props.deskItem);
    // 检查是否存在订单
    handleCheckHasOrder()
      .then((res) => {
        drawer.value = true;
      })
      .catch(() => {
        ElMessage.info("该桌台无订单,无法进行结账");
      });
  } else if (val === "add") {
    // 点菜
    console.log(props.deskItem);
    router.push({
      name: "Add-menus",
      query: {
        peopleQty: props.deskItem.peopleQty,
        storeId: props.deskItem.storeId,
        tableNo: props.deskItem.tableNo,
      },
    });
  } else if (val === "refund") {
    handleCheckHasOrder()
      .then((res) => {
        refundDrawer.value = true;
        refundNum.value = true;
      })
      .catch(() => {
        ElMessage.info("该桌台无订单,无法进行退单退菜操作");
      });
  }
};
// 获取已经配置的打印机
const getPrinterSysList = async () => {
  const res = await getSysPrinterLists({
    storeId: props.deskItem.storeId,
  });
  if (res.code === 0) {
    printerWay.printerLists = res.rows;
    console.log(printerWay.printerLists);
  }
};
const handleConfirm = () => {
  getPrinterSysList();
  handleOfflinePay();
  // printerWay.dialogVisible = true;
};

//结账
const handleOfflinePay = async () => {
  // 二维码
  const res1 = await getQrCodePayImg({
    orderId: orderId.value,
  });
  if (res1.code === 0) {
    printerWay.imgSrc = filePath + res1.data;
  }
  const printerIdItem = printerWay.printerLists
    .map((x) => {
      if (x.printerType === "CLIENT") {
        return x;
      }
    })
    .filter((x) => !!x);
    console.log('------0000111',printerIdItem);
    
  for (let i = 0; i < printerIdItem.length; i++) {
    const body = {
      orderId: orderId.value,
      printerId: printerIdItem[i].printerId,
      storeId: props.deskItem.storeId,
      method: "ALL",
    };
    const res = await customPrint(body);
    if (res.code === 0) {
      setTimeout(() => {
        const orderDetailData = Object.assign(
          {},
          orderDetail.value.data,
          res.data
        );
        // console.log("--------", orderDetailData);
        lodopPrint.value.handlePrint(orderDetailData);
        printerWay.dialogVisible = false;
        drawer.value = false;
        model.value = false;
      }, 500);
    } else {
      ElMessage.error("结账失败，请检查配置!");
    }
  }
};

//自定义打单
const handleCustom = async () => {
  if (printerWay.form.printerId == "") {
    return ElMessage.error("请选择打印机!");
  }
  // 二维码
  const res1 = await getQrCodePayImg({
    orderId: orderId.value,
  });
  if (res1.code === 0) {
    printerWay.imgSrc = filePath + res1.data;
  }

  if (printerWay.form.printerId == "all") {
    // 全部机一起打单
    const body = {
      method: "ALL",
      orderId: orderId.value,
      storeId: props.deskItem.storeId,
      tableNo: props.deskItem.tableNo,
    };
    const res = await offlineCheckOrder(body);
    // console.log("--------all", res);
    if (res.code === 0) {
      const printerArr = res.data;
      for (let i = 0; i < printerArr.length; i++) {
        const orderDetailData = Object.assign(
          {},
          orderDetail.value.data,
          printerArr[i]
        );
        await lodopPrint.value.asyncEvent(orderDetailData);
      }
    }
    printerWay.dialogVisible = false;
    drawer.value = false;
  } else {
    const body = {
      orderId: orderId.value,
      printerId: printerWay.form.printerId,
      storeId: props.deskItem.storeId,
      method: printerWay.form.method,
    };
    const res = await customPrint(body);
    if (res.code === 0) {
      setTimeout(() => {
        const orderDetailData = Object.assign(
          {},
          orderDetail.value.data,
          res.data
        );
        // console.log("--------", orderDetailData);
        lodopPrint.value.handlePrint(orderDetailData);
        printerWay.dialogVisible = false;
        drawer.value = false;
      }, 500);
    }
  }
};

const handleClearDesk = async () => {
  const res = await clearTable({
    storeId: props.deskItem.storeId,
    tableNo: props.deskItem.tableNo,
    realStatus: "FREE_TIME",
    peopleQty: 0,
  });
  if (res.code === 0 && res.data.length === 0) {
    ElMessage.success("清台成功!");

    emit("clearDesk");
  }
};
const refundNumTotal = computed(() => {
  const arr = refundList.value.map((x) => x.qty);
  return arr.reduce((a, b) => a + b, 0);
});

const refundTotalCost = computed(() => {
  const arr = refundList.value.map((x) => x.price * x.qty);
  return arr.reduce((a, b) => a + b, 0);
});

onMounted(() => {
  inject("$com")
    .getStoreDict("bill_print_method")
    .then((res) => {
      methodOption.value = res.data[0].list;
      printerWay.form.method = res.data[0].list[0].dictValue;
    });
});
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

:deep(.el-drawer__body) {
  position: relative;
}
.refundItem {
  display: flex;
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  background: #ffffff;
  border-radius: 10px;
  div {
    width: 150px;
    height: 100px;
    margin: 5px;
    border: 1px solid #302e2e;
    border-radius: 8px;
    display: flex;
    font-size: 23px;
    align-items: center;
    justify-content: center;
  }
}

.refundItemNum {
  min-width: 450px;
  position: fixed;
  top: 45px;
  left: 46%;
  transform: translateX(-50%);
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
  p {
    font-size: 13px;
    color: #828282;
    margin: 4px;
  }
  button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    margin: 5px;
    border-radius: 6px;
    background-color: #ffffff;
  }
}
.clickBox {
  width: 250px;
  height: 250px;
  border: 1px solid #000;
  border-radius: 10px;
  cursor: pointer;
}
.active {
  background-color: #bda471 !important;
}
.activePayWay {
  background-color: #bda472 !important;
  color: #ffffff !important;
}
.row1 > div {
  letter-spacing: 2px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  background-color: #ffffff;
}

.row2 {
  font-size: 22px;
  border-top: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 98px;
  font-weight: bold;
  letter-spacing: 2px;
  border-bottom-left-radius: 10px;

  background-color: #ffffff;
  flex: 1;
}
.row2Clear {
  flex: 1;
  font-size: 22px;
  border-top: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 98px;
  font-weight: bold;
  letter-spacing: 2px;
  border-bottom-right-radius: 10px;
  background-color: #ffffff;
}
.choosedItem {
  width: 160px;
  height: 160px;
  border-radius: 10px;
  transform: translate(-400px, -120px);
  background-color: #f55e31;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 21px;
}

.order-summary {
  background-color: #f8f8f8;
}

ul {
  list-style: none;
  padding: 0;
}

.liSty {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.payWayMax {
  border-radius: 15px;
  border: 1px solid #000;
  position: absolute;
  bottom: 80px;
  width: calc(100% - 40px);
  padding: 20px 0;
}
.payWay > div {
  margin: 10px 5px;
  border: 1px solid #ccc;
  padding: 5px 20px;
  border-radius: 8px;
  cursor: pointer;
}
.payDetail > div {
  display: flex;
  justify-content: space-between;
}
.confirmPay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  font-size: 24px;
  letter-spacing: 2px;
  font-weight: bold;
  background: #bda471;
}
.activeListy {
  background-color: #bda471;
}
.refundListSty {
  max-height: 600px;
  overflow-y: scroll;
}

.why:focus {
  background-color: #bda471 !important;
}
</style>