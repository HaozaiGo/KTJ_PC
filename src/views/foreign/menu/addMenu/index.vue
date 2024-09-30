<template>
  <div class="content flex">
    <!-- 左边下单 -->
    <div class="order-container" style="flex: 1">
      <!-- Header -->
      <div class="header">
        <button @click="goBack" class="backBtn">返回</button>
        <span
          >桌台 {{ propsData.data.tableNo }} {{ propsData.data.peopleQty }} 人
          大桌</span
        >
        <button @click="clearAll" class="backBtn">清空</button>
      </div>
      <!-- Order List -->
      <div class="order-list" :style="`height: ${tableHeight - 50}px;`">
        <div v-for="(item, index) in orderList" :key="index" class="order-item">
          <div style="flex: 1">
            <span class="item-name">{{ item.name }}</span>
            <p style="font-size: 13px; color: #aeaaaa">{{ item.tasteNeed }}</p>
          </div>
          <div class="item-actions">
            <el-icon
              @click="decreaseQuantity(index)"
              color="#ff1014"
              size="24"
              style="cursor: pointer"
              ><RemoveFilled
            /></el-icon>

            <span
              style="display: inline-block; width: 52px; text-align: center"
              >{{ item.qty }}</span
            >
            <el-icon
              @click="increaseQuantity(index)"
              color="#3e8bfb"
              size="24"
              style="cursor: pointer"
              ><CirclePlusFilled
            /></el-icon>
          </div>
          <span class="item-price">¥{{ item.price }}</span>
        </div>
      </div>
      <!-- Total Price -->
      <div class="total">
        <span style="font-size: 15px; display: inline-block; margin-right: 20px"
          >共{{ totalItems }}项
        </span>
        ¥{{ Number(totalPrice).toFixed(2) }}
      </div>

      <!-- Bottom Buttons -->
      <div class="actions">
        <el-popover
          :visible="visible0"
          placement="top"
          :width="180"
          v-if="false"
        >
          <p style="text-align: center; margin: 10px 0px 20px 0px">
            请选择就餐方式
          </p>
          <div style="text-align: right; margin: 0">
            <el-button size="large" type="primary" @click="placeOrderOnly('TS')"
              >堂食</el-button
            >
            <el-button
              size="large"
              type="primary"
              @click="placeOrderOnly('WD')"
            >
              外带
            </el-button>
          </div>
          <template #reference>
            <button
              @click="
                underOrderAndPay;
                visible0 = true;
                needScanImg = true;
                needBottomPrice = true;
              "
              style="background-color: #b0a07e"
            >
              下单并结账
            </button>
          </template>
        </el-popover>

        <el-popover :visible="visible" placement="top" :width="180">
          <p style="text-align: center; margin: 10px 0px 20px 0px">
            请选择就餐方式
          </p>
          <div style="text-align: right; margin: 0">
            <el-button size="large" type="primary" @click="placeOrderOnly('TS')"
              >堂食</el-button
            >
            <el-button
              size="large"
              type="primary"
              @click="placeOrderOnly('WD')"
            >
              外带
            </el-button>
          </div>
          <template #reference>
            <button @click="justUnderOrder" style="background-color: #b0a07e">
              下单
            </button>
          </template>
        </el-popover>
      </div>
    </div>
    <el-tabs
      v-model="tasteData.activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
      style="flex: 2; width: calc(100% - 400px)"
    >
      <div :style="`height: ${tableHeight + 70}px;`" style="overflow-y: auto">
        <el-tab-pane
          :label="item.name"
          :name="item.typeId"
          v-for="(item, idx) in tasteData.leftData"
          :key="idx"
        >
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(item1, idx1) in tasteData.rightData"
              :key="idx1"
              class="menuBox"
              @click="handleClick1(item1)"
            >
              <div class="twoRow" style="height: 60px">{{ item1.name }}</div>
              <span v-if="item1.isSpec === '1'"> 多规格</span>
              <span v-else> ¥{{ item1.price }}/{{ item1.unit }} </span>
            </div>
          </div>
        </el-tab-pane>
      </div>
    </el-tabs>

    <!-- 自定义菜品 -->
    <div class="cover" v-if="custom.showCover">
      <div class="cover-content center">
        <h2 style="text-align: center; margin-bottom: 30px">自定义菜品</h2>

        <div class="flex-c" style="justify-content: space-between">
          <div class="customLabel">菜品名称</div>
          <input type="text" class="spcailInput" v-model="custom.form.name" />
        </div>

        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div class="customLabel">售卖价</div>
          <input
            type="number"
            class="spcailInput"
            v-model="custom.form.price"
          />
        </div>
        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div class="customLabel">数量</div>
          <input type="number" class="spcailInput" v-model="custom.form.qty" />
        </div>
        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div class="customLabel">菜品单位</div>
          <el-select
            v-model="custom.form.unit"
            placeholder="请选择"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in custom.unitOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </div>
        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div class="customLabel">特殊备注</div>
          <input
            type="text"
            class="spcailInput"
            v-model="custom.form.tasteNeed"
          />
        </div>
        <div style="text-align: right">
          <button class="btn" @click="comfirmCustom">确定</button>
        </div>
      </div>
    </div>

    <!-- 口味选择 -->
    <div class="cover" v-if="tasteNeed.showCover">
      <div class="cover-content center">
        <h2 style="text-align: center; margin-bottom: 30px">菜品备注</h2>

        <div class="flex-c" style="justify-content: space-between">
          <div style="font-size: 22px; margin-right: 25px; white-space: nowrap">
            口味要求
          </div>
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(item, index) in tasteNeed.need"
              :key="index"
              class="itemBox"
              @click="handleChoose(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div style="font-size: 22px; margin-right: 25px; white-space: nowrap">
            特殊要求
          </div>
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(item, index) in tasteNeed.priceDetail"
              :key="index"
              class="itemBox"
              @click="handleChoose1(item)"
            >
              {{ item.size }} {{ item.price }}元
            </div>
          </div>
        </div>

        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div style="font-size: 22px; margin-right: 25px; white-space: nowrap">
            特殊备注
          </div>
          <input type="text" class="spcailInput" />
        </div>
        <div style="text-align: right">
          <button class="btn">适用全单</button>
          <button class="btn" @click="comfirm">确定/跳过</button>
        </div>
      </div>
      <img
        src="@/assets/img/commonPic/back.png"
        alt=""
        style="
          width: 50px;
          height: 50px;
          position: absolute;
          left: 15%;
          top: 20%;
        "
        @click="tasteNeed.showCover = false"
      />

      <div class="choosedItem">
        {{ tasteNeed.tasteItem.name }}
      </div>

      <div class="choosedMenuList">
        <h3>新增单</h3>
        <div class="flex-c" style="flex-wrap: wrap">
          <span style="font-size: 18px; font-weight: bold">
            {{ tasteNeed.tasteItem.name }}：
          </span>
          <div v-for="(item1, idx1) in tasteNeed.choosingList" :key="idx1">
            {{ item1.val }}、
          </div>
        </div>
      </div>
    </div>

    <lodopPrinter
      :imgSrc="printerWay.imgSrc"
      ref="lodopPrint"
      :needScanImg="needScanImg"
      :needBottomPrice="needBottomPrice"
    ></lodopPrinter>
  </div>
</template>



<script setup>
import lodopPrinter from "@/components/printTable/lodopPrinter.vue";
import {
  reactive,
  onMounted,
  ref,
  inject,
  nextTick,
  computed,
  watch,
} from "vue";
import {
  getTypeList,
  getMenusList,
  getMenusDetail,
} from "@/api/project/foreign/menu.js";
import { useRouter, useRoute } from "vue-router";
import { checkHasOrder } from "@/api/project/foreign/createDesk.js";
import {
  checkNoDetail,
  underOrderAfterPay,
  getTeaInfo,
  getQrCodePayImg,
  offlineCheckOrder,
  afterPayChangeOrder,
} from "@/api/project/foreign/order.js";
import { ElMessage } from "element-plus";
defineOptions({
  name: "Add-menus",
  isRouter: true,
});
const lodopPrint = ref(null);
const printerWay = reactive({
  imgSrc: "",
});
const custom = reactive({
  showCover: false,
  unitOptions: [],
  form: {
    name: "",
    price: "",
    qty: "",
    unit: "",
    tasteNeed: "",
    isCustom: "1",
  },
});
const needBottomPrice = ref(false); //是否需要底部结算
const needScanImg = ref(false); //是否需要二维码
const filePath = localStorage.getItem("filePath");
const tableHeight = inject("$com").tableHeight();
const orderList = ref([]);
const orderListChange = ref(false);
const router = useRouter();
const route = useRoute();
const orderId = ref(null);
const orderDetail = ref({});
const visible = ref(false);
const visible0 = ref(false);
const tasteNeed = reactive({
  tasteItem: {}, //选中项
  showCover: false,
  need: [], //口味
  priceDetail: [], //规格
  choosingList: [],
});
const propsData = reactive({
  data: {},
});

onMounted(() => {
  console.log(route.query, "-----");
  // 是否从桌台详情页跳转过来
  propsData.data = route.query;
  const dataLength = Object.keys(propsData.data);
  console.log(dataLength);

  if (dataLength.length > 0) {
    hadOrder();
  }
  inject("$com")
    .getStoreDict("bill_store_menu_unit")
    .then((res) => {
      custom.unitOptions = res.data[0].list;
    });
  getList();
});

const tasteData = reactive({
  activeName: "",
  leftData: [],
  selected: {},
  rightData: [], //子菜单
  finalChoose: {},
});
//下单按钮
const justUnderOrder = () => {
  if (!orderListChange.value) {
    return ElMessage({
      message: "菜品没有修改，请检查菜品",
      type: "error",
    });
  }
  visible.value = true;
  needScanImg.value = false;
  needBottomPrice.value = true;
};
// 先查询是否已经下单，订单是否存在
const hadOrder = async () => {
  const res = await checkHasOrder({
    storeId: propsData.data.storeId,
    tableNo: propsData.data.tableNo,
  });
  if (res.code === 0 && res.data != null) {
    // 已有订单
    orderId.value = res.data.orderId;
    orderDetail.value = await checkNoDetail(orderId.value);
    if (orderDetail.value.data.menuList.length > 0) {
      orderList.value = orderDetail.value.data.menuList.slice(0);
    }
  } else {
    // 开台
    //获取茶位信息
    const res = await getTeaInfo(propsData.data.storeId);
    if (res.code === 0) {
      orderList.value.push({
        name: res.data.name,
        price: res.data.price,
        qty: propsData.data.peopleQty,
      });
    }
  }
};
const comfirmCustom = async () => {
  orderListChange.value = true;
  orderList.value.push(custom.form);
  custom.showCover = false;
};
const totalItems = computed(() => {
  return orderList.value.reduce(
    (total, item) => Number(total) + Number(item.qty),
    0
  );
});
const totalPrice = computed(() => {
  return orderList.value.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
});

// 下单
const placeOrderOnly = async (way) => {
  if (orderId.value) {
    // 已开单-----------
    const body = {
      orderId: orderId.value,
      storeId: propsData.data.storeId,
      itemList: orderList.value,
    };
    const res = await afterPayChangeOrder(body);

    const payImg = await getQrCodePayImg({
      orderId: orderId.value,
    });
    if (payImg.code === 0) {
      printerWay.imgSrc = filePath + payImg.data;
    }

    // 后付 补单
    const body1 = {
      method: "REFILL",
      orderId: orderId.value,
      storeId: propsData.data.storeId,
      tableNo: propsData.data.tableNo,
    };
    const res1 = await offlineCheckOrder(body1);
    // console.log("--------all", res);
    if (res1.code === 0) {
      const printerArr = res1.data;
      for (let i = 0; i < printerArr.length; i++) {
        const orderDetailData = Object.assign(
          {},
          orderDetail.value.data,
          printerArr[i]
        );
        console.log(orderDetailData);

        await lodopPrint.value.asyncEvent(orderDetailData);
      }
      visible.value = false;
      visible0.value = false;
    }
  } else {
    // 新开单--------------
    const body = {
      peopleQty: propsData.data.peopleQty,
      storeId: propsData.data.storeId,
      tableNo: propsData.data.tableNo,
      remark: "",
      pickupWay: way,
      itemList: orderList.value,
    };
    const res = await underOrderAfterPay(body);
    if (res.code === 0) {
      orderId.value = res.data.orderId;
      ElMessage({
        message: "下单成功！",
        type: "success",
      });
    }

    const payImg = await getQrCodePayImg({
      orderId: res.data.orderId,
    });
    if (payImg.code === 0) {
      printerWay.imgSrc = filePath + payImg.data;
    }

    // 后付 全部机一起打单
    const body1 = {
      method: "ALL",
      orderId: res.data.orderId,
      storeId: propsData.data.storeId,
      tableNo: propsData.data.tableNo,
    };
    const res1 = await offlineCheckOrder(body1);
    // console.log("--------all", res);
    if (res1.code === 0) {
      const printerArr = res1.data;
      for (let i = 0; i < printerArr.length; i++) {
        const orderDetailData = Object.assign({}, res.data, printerArr[i]);
        await lodopPrint.value.asyncEvent(orderDetailData);
      }
      visible.value = false;
      visible0.value = false;
    }
  }
  hadOrder();
  orderListChange.value = false;
};
const goBack = () => {
  // 返回
  router.back();
};
const decreaseQuantity = (index) => {
  orderListChange.value = true;
  if (orderList.value[index].qty > 1) {
    orderList.value[index].qty--;
  } else {
    orderList.value.splice(index, 1);
  }
};

const increaseQuantity = (index) => {
  orderList.value[index].qty++;
  orderListChange.value = true;
};

const clearAll = () => {
  orderList.value = [];
};
const comfirm = () => {
  tasteNeed.tasteItem.tasteNeed = tasteNeed.choosingList
    .map((x) => x.val)
    .join(",");
  console.log(tasteNeed.tasteItem);

  handleFinish(tasteNeed.tasteItem);
};
const handleChoose = (item) => {
  console.log(item);
  tasteNeed.choosingList.push({
    key: "taste",
    val: item,
  });
};
const handleChoose1 = (item) => {
  const v = tasteNeed.choosingList.filter((x) => x.key != "size");
  tasteNeed.choosingList = v;
  tasteNeed.choosingList.push({
    key: "size",
    val: item.size + " " + item.price + "元",
  });
};

const getList = async () => {
  const res = await getTypeList({
    storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
    pageSize: 50,
  });
  if (res.code === 0) {
    tasteData.leftData = res.rows;
    tasteData.selected = tasteData.leftData[0];
    getList1();
  }
};
// 子菜单
const getList1 = async () => {
  try {
    const res = await getMenusList({
      typeId: tasteData.selected.typeId,
      storeId: tasteData.selected.storeId,
      pageSize: 50,
    });
    if (res.code === 0) {
      tasteData.rightData = res.rows;
      tasteData.activeName = tasteData.selected.typeId;
      tasteData.rightData.unshift({
        name: "自定义菜品",
        isSpec: "1",
      });
    }
  } catch (e) {}
};

const handleClick1 = async (item) => {
  // console.log("-----", item);
  if (item.name === "自定义菜品") {
    console.log("自定义菜品");
    custom.showCover = true;
    return;
  }
  orderListChange.value = true;

  tasteNeed.tasteItem = item;
  const res = await getMenusDetail({
    storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
    menuId: item.menuId,
  });
  // 如果有设置规格口味
  if (res.data.ElTabstasteNeed || res.data.priceDetail) {
    tasteNeed.need = res.data.tasteNeed.split(",");
    tasteNeed.need = tasteNeed.need.filter((x) => x != "");
    console.log(tasteNeed.need);
    tasteNeed.priceDetail = JSON.parse(res.data.priceDetail);
    tasteNeed.priceDetail = tasteNeed.priceDetail.filter((x) => x.price != "");

    tasteNeed.showCover = true;
    tasteNeed.choosingList = [];
    return;
  }

  // 追加到左边的orderList
  const idx = orderList.value.findIndex((x) => x.name === item.name);
  if (idx != -1) {
    orderList.value[idx].qty++;
  } else {
    const itemList = Object.assign({}, item, { qty: 1, menuId: "" });
    orderList.value.unshift(itemList);
  }
};

// 完成加餐并跳转
const handleFinish = (item) => {
  console.log(item);
  try {
    const res = item.tasteNeed.split(" ");
    const price = res[1].split("元")[0];

    // 追加到左边的orderList
    const obj = Object.assign({}, item, {
      price: price,
      qty: 1,
      menuId: "",
    });
    orderList.value.unshift(obj);
    tasteNeed.showCover = false;
  } catch (err) {
    ElMessage({
      message: "请至少选择一个规格",
      type: "error",
    });
  }
};

const handleClick = (e) => {
  // console.log(e.index);
  tasteData.selected = tasteData.leftData[e.index];
  getList1();
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  // width: calc(100% - 400px);
}
:deep(.el-select__wrapper) {
  background-color: #e8e8e5 !important;
}
.content {
  width: calc(100vw - 192px);
  align-items: normal;

  background: linear-gradient(
      rgba(255, 255, 255, 0.75),
      rgba(255, 255, 255, 0.85)
    ),
    url("@/assets/img/login_images/menuBg.jpg") no-repeat 0% 20% / cover;
  background-size: 100% 100%;
}
.menuBox {
  padding: 2vh 2vw;
  font-size: 20px;
  margin: 10px 15px;
  letter-spacing: 2px;
  width: calc((100% / 5) - 30px);
  min-width: 11vw;
  position: relative;
  background-color: #ffffff;
  border-radius: 20px;
  height: calc((100vh / 4) - 40px);
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.menuBox span {
  position: absolute;
  left: 25px;
  bottom: 15px;
  font-size: 18px;
}
.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.2);
}
.cover-content {
  background-color: #f4f4f4;
  padding: 40px;
  border-radius: 25px;
  width: 40vw;
}
.itemBox {
  padding: 15px 20px;
  border-radius: 10px;
  margin: 5px;
  background-color: #e8e8e5;
  cursor: pointer;
}
.spcailInput {
  background-color: #e8e8e5;
  padding: 10px;
  flex: 1;
  width: 100%;
  border: none;
  border-radius: 5px;
  font-size: 22px;
}
.btn {
  font-size: 20px;
  margin: 40px 20px 0px 20px;
  letter-spacing: 2px;
  border-radius: 5px;
  background-color: #e8e8e5;
  padding: 10px 20px;
  cursor: pointer;
}
.choosedItem {
  position: absolute;
  left: 15%;
  top: 30%;
  padding: 40px;
  background-color: #f4f4f4;
  font-size: 23px;
  border-radius: 25px;
}
.choosedMenuList {
  position: fixed;
  right: 5%;
  bottom: 25%;
  width: 300px;
  padding: 40px;
  background-color: #f4f4f4;
  border-radius: 25px;
}

// left
.order-container {
  width: 100%;
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 8px 0;
}

.order-list {
  margin-top: 10px;
  padding-top: 10px;
  background-color: #ffffff;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  overflow: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.item-name {
  flex: 1;
  // max-width: 100px;
}

.item-actions {
  display: flex;
  align-items: center;
}

.item-actions button {
  padding: 5px;
  margin: 0 5px;
}

.item-price {
  margin-left: 10px;
  width: 32px;
  white-space: nowrap;
}

.total {
  padding: 20px;
  text-align: right;
  font-weight: bold;
  background-color: #ffffff;
  font-size: 21px;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  background-color: #ffffff;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.actions button {
  flex: 1;
  margin: 0px 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}
.backBtn {
  background-color: #dfdcdc;
  padding: 5px 20px;
  border-radius: 5px;
  font-size: 16px;
  letter-spacing: 1px;
  cursor: pointer;
}
.customLabel {
  font-size: 22px;
  margin-right: 25px;
  white-space: nowrap;
  width: 80px;
}
</style>