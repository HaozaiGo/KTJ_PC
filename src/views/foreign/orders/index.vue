<template>
  <div class="content">
    <div class="search">
      <el-select
        v-model="query.tableNo"
        placeholder="台号"
        style="width: 200px"
        clearable
      >
        <el-option
          v-for="item in state1.tableNoOptions"
          :key="item.tableNo"
          :label="item.tableNo"
          :value="item.tableNo"
        />
      </el-select>

      <el-input
        v-model="query.orderNo"
        style="width: 200px"
        placeholder="订单编号"
        clearable
        @keyup.enter="getList"
      />

      <el-date-picker
        v-model="query.orderTime"
        type="date"
        placeholder="下单时间"
        size="default"
        value-format="YYYY-MM-DD"
      />

      <el-button
        type="primary"
        icon="Search"
        @click="getList"
        style="margin-left: 15px"
        >搜索</el-button
      >
      <el-button type="primary" icon="Checked" @click="checkCode"
        >核销</el-button
      >
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane
        :label="item.dictLabel"
        :name="item.dictValue"
        v-for="(item, index) in state.billOrderTypeOptions"
        :key="index"
      ></el-tab-pane>
    </el-tabs>

    <div>
      <el-table
        :data="tableData.row"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        :max-height="tableHeight - 30"
      >
        <el-table-column prop="orderNo" label="订单编号" sortable />
        <el-table-column prop="tableNo" label="台号" sortable />
        <el-table-column prop="typeLabel" label="订单类型" sortable />
        <el-table-column
          prop="orderTime"
          label="下单时间"
          sortable
          width="180"
        />
        <el-table-column prop="amount" label="支付金额" sortable />

        <el-table-column
          prop="payStatusLabel"
          label="支付状态"
          sortable
          width="150"
        />

        <el-table-column prop="pickupWayLabel" label="就餐方式" sortable />

        <el-table-column label="操作" width="220">
          <template #default="scope">
            <!-- <el-button
              link
              type="primary"
              size="small"
              @click="orderDetail(scope.row)"
              >订单详情</el-button
            > -->

            <el-button
              link
              type="primary"
              size="small"
              v-if="
                scope.row.type === 'SCAN_ORDER_PAY' ||
                scope.row.type === 'SCAN_ORDER_UNDER'
              "
              @click="printAll(scope.row)"
              >打单</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              v-if="
                scope.row.type === 'SCAN_ORDER_PAY' ||
                scope.row.type === 'SCAN_ORDER_UNDER'
              "
              @click="printAgain(scope.row)"
              >结账</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              v-if="scope.row.orderStatus === 'FINISH'"
              @click="printAgain(scope.row)"
              >再次打单</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteOrder(scope.row)"
              v-if="scope.row.orderStatus != 'FINISH'"
              >删除订单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="tableData.total"
        style="float: right"
        @current-change="changePageSize"
      />
      <img src="" alt="" />
    </div>

    <el-dialog v-model="state.dialogVisible1" title="查看订单状态" width="1000">
      <el-descriptions class="margin-top" :column="3" size="Default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">商家名称</div>
          </template>
          {{ state.orderDetailData.storeName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">订单编号</div>
          </template>
          {{ state.orderDetailData.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">订单状态</div>
          </template>
          {{ state.orderDetailData.orderStatus }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">支付金额</div>
          </template>
          {{ state.orderDetailData.amount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">买家手机号</div>
          </template>

          <span style="line-height: 20px" v-if="!showPhoneNum"
            >***********<el-button
              plain
              size="small"
              @click="showPhoneNum = true"
              >显示</el-button
            ></span
          >

          <span v-show="showPhoneNum"> {{ state.orderDetailData.phone }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">交易状态</div>
          </template>
          {{ state.orderDetailData.tradeStateDesc }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">支付时间</div>
          </template>
          {{ state.orderDetailData.payTime }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">支付类型</div>
          </template>
          {{ state.orderDetailData.payTypeLabel }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 核销订单详情 -->
    <el-dialog
      v-model="state1.dialogVisible"
      title="查看订单"
      width="1000"
      align-center
    >
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
            人数：{{ state.orderDetailData.peopleQty }}人
          </div>
        </el-form>

        <div style="font-size: 25px">菜品</div>
        <el-button type="primary" @click="addMenu">追加菜品</el-button>

        <el-table
          :data="state.orderDetailData.menuList"
          stripe
          style="width: 100%"
          :max-height="tableHeight - 50"
        >
          <el-table-column prop="name" label="品名">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-icon
                  size="20"
                  color="red"
                  style="cursor: pointer"
                  v-if="state.editMenuIdx === scope.$index"
                  @click="deleteMenu(scope.row)"
                  ><Remove
                /></el-icon>
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="规格" width="100" />
          <el-table-column prop="qty" label="数量" width="110">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-icon
                  size="20"
                  color="red"
                  style="cursor: pointer"
                  v-if="state.editMenuIdx === scope.$index"
                  @click="updateMenu(scope.row, 'del')"
                  ><Remove
                /></el-icon>
                <span style="margin: 0px 10px">{{ scope.row.qty }}</span>
                <el-icon
                  size="20"
                  color="#408bfb"
                  style="cursor: pointer"
                  v-if="state.editMenuIdx === scope.$index"
                  @click="updateMenu(scope.row, 'add')"
                  ><CirclePlus
                /></el-icon>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="price" label="单价" width="150" />
          <el-table-column prop="amount" label="小计" width="150" />
          <el-table-column label="操作" width="270">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="editMenu(scope)"
                >修改菜品</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="deleteMenu(scope.row)"
                >删除菜品</el-button
              >
              <!-- <el-button
                link
                type="primary"
                size="small"
                @click="deleteMenu(scope.row)"
                >退款</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>

        <div style="font-size: 16px; font-weight: bold; margin-top: 20px">
          合计：¥{{ state.orderDetailData.billAmount }} &ensp;&ensp;
          优惠后实收：¥{{ state.orderDetailData.amount }}
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state1.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleOutBill"> 出单 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 核销 -->
    <el-dialog
      v-model="state1.dialogVisible1"
      title="核销"
      width="600"
      align-center
    >
      <el-form inline style="margin: 30px 0; text-align: center">
        <el-form-item label="取餐码">
          <el-input
            v-model="state1.code"
            style="width: 260px"
            placeholder="填写取餐码"
            @keyup.enter="confirmCheckCode"
          />
          <el-input
            style="opacity: 0; height: 0; width: 0; display: inline-block"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="confirmCheckCode"
            >核销</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 如果核销有多条记录 -->
    <el-dialog
      v-model="state1.dialogVisible2"
      title="核对用户"
      width="650"
      align-center
    >
      <el-table :data="state1.tableData" style="width: 100%" height="300">
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="confirmStatusLabel" label="核销状态" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column fixed="right" label="操作" min-width="80">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="large"
              @click.prevent="checkCodeSecond(scope.row)"
            >
              核销
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 自定义出单方式 -->
    <el-dialog
      v-model="printerWay.dialogVisible"
      title="自定义打单方式"
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
        <el-form-item label="底部二维码" v-show="false">
          <el-radio-group v-model="printerWay.form.needScan">
            <el-radio value="1">结账二维码</el-radio>
            <el-radio value="0">不需要二维码</el-radio>
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

    <printTable
      v-if="state.showPrintTable"
      ref="printTableDom"
      :tableData="state.orderDetailData"
      :needScanImg="printerWay.needScanImg"
      :imgSrc="printerWay.imgSrc"
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

import { reactive, onMounted, ref, inject, nextTick } from "vue";
import getLodop from "@/utils/LodopFuncs.js";
import {
  getLists,
  checkOrderDetail,
  confirmOrderNo,
  checkNoDetail,
  getDeskList,
  waitToChekOrder,
  customPrint,
  getSysPrinterLists,
  beforePayCheckOrder,
  offlineCheckOrder,
  deleteOrderApi,
  AddOrderInsideMenu,
  updateOrderInsideMenu,
  deleteOrderInsideMenu,
} from "@/api/project/foreign/order.js";
import { getQrCodePayImg } from "@/api/project/foreign/order";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "foreign-Order",
  isRouter: true,
});

const route = useRoute();
const router = useRouter();
const tableHeight = inject("$com").tableHeight();
const filePath = localStorage.getItem("filePath");
const printTableDom = ref(null);
const kitchenTableDom = ref(null);
const showPhoneNum = ref(false);
const query = reactive({
  orderNo: "",
  nickName: "",
  phone: "",
  tradeType: "",
  orderTime: "",
  payStatus: "",
  pageNum: 1,
  storeId: "",
  tableNo: "",
});
const methodOption = ref([]);
const activeName = ref("");
const tableData = ref({
  row: [],
  total: 0,
});
const state = reactive({
  dialogVisible1: false,
  billOrderTypeOptions: [], //支付类型
  orderDetailData: {}, //核销单详细
  showPrintTable: false,
  normalPrint: false,
  editMenuIdx: null, //修改的菜品idx
  addMenuData: {}, //追加的菜品
});
const state1 = reactive({
  dialogVisible: false,
  dialogVisible1: false,
  dialogVisible2: false,
  code: "",
  tableNoOptions: [], //台号list
  form: {
    checked: "",
    tableNo: "", //台号
  },
  tableData: [], //如果有多条核销的记录
});
const printerWay = reactive({
  dialogVisible: false,
  printerLists: [], //配置了的打印机
  needScanImg: false,
  imgSrc: "", //二维码图片
  form: {
    printerId: "",
    needScan: "0",
    method: "",
  },
});
const printerOption = ref([]);
const LODOPOBJ = ref(null);
const deleteOrder = (item) => {
  ElMessageBox.confirm(
    `确定删除台号：${item.tableNo}单号为${item.orderNo}的订单？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const res = await deleteOrderApi({
        storeId: item.storeId,
        orderIds: item.orderId,
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const editMenu = (item) => {
  console.log(item.$index);
  state.editMenuIdx = item.$index;
};

// 加菜
const addMenu = () => {
  router.push({
    path: `/foreign/orders/addMenu`,
    query: { orderId: state.orderDetailData.orderId },
  });
};

//更新菜品
const updateMenu = async (item, type) => {
  console.log(item);

  if (type === "add") {
    item.qty++;
    const body = Object.assign({}, item, {
      storeId: state.orderDetailData.storeId,
    });
    const res = await updateOrderInsideMenu(body);
    showOrderDetail(state.orderDetailData.orderId);
  } else {
    if (item.qty > 1) {
      item.qty--;
      const body = Object.assign({}, item, {
        storeId: state.orderDetailData.storeId,
      });
      const res = await updateOrderInsideMenu(body);
      showOrderDetail(state.orderDetailData.orderId);
    } else {
      deleteMenu(item);
    }
  }
};

// 删除菜品
const deleteMenu = (item) => {
  console.log(item);
  ElMessageBox.confirm(`确定删除${item.name}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const body = Object.assign({}, item, {
        storeId: state.orderDetailData.storeId,
        orderId: state.orderDetailData.orderId,
      });
      const res = await deleteOrderInsideMenu(body);

      const res1 = await checkNoDetail(state.orderDetailData.orderId);
      if (res1.code === 0) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        state.orderDetailData = res1.data;
      }
      getList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const switchPrinter = (e) => {
  printerWay.needScanImg = true;
  const find = printerWay.printerLists.find((x) => {
    return x.printerId === e;
  });
  console.log(find);
  if (find.printerType === "KITCHEN") {
    printerWay.needScanImg = false;
  }
};
// 再次打单
const printAgain = async (row) => {
  showOrderDetail(row.orderId);
  state.normalPrint = true; //开启普通打印 -- 再次重复打单
};

//显示订单详情
const showOrderDetail = async (id) => {
  const res = await checkNoDetail(id);
  if (res.code === 0) {
    state.orderDetailData = res.data;
    state1.form.tableNo = res.data.tableNo; //回显台号
    state1.dialogVisible = true;
  }
};

// 全流程先付 后付打单
const printAll = async (row) => {
  showOrderDetail(row.orderId);
  state.normalPrint = false;
};
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
//自定义打单
const handleCustom = async () => {
  console.log(state.orderDetailData);

  const body = {
    orderId: state.orderDetailData.orderId,
    printerId: printerWay.form.printerId,
    storeId: state.orderDetailData.storeId,
    method: printerWay.form.method,
  };
  const res = await customPrint(body);
  if (res.code === 0) {
    console.log(printerWay.form.needScan);
    // 支付结账 有二维码
    printerWay.needScanImg = true;
    const res1 = await getQrCodePayImg({
      orderId: state.orderDetailData.orderId,
    });
    if (res1.code === 0) {
      printerWay.imgSrc = filePath + res1.data;
    }

    setTimeout(() => {
      state.orderDetailData = Object.assign(
        {},
        state.orderDetailData,
        res.data
      );
      handlePrint(state.orderDetailData);
    }, 2000);
  }
};
// 获取已经配置的打印机
const getPrinterSysList = async () => {
  const res = await getSysPrinterLists({
    storeId: state.orderDetailData.storeId,
  });
  if (res.code === 0) {
    printerWay.printerLists = res.rows;
    printerWay.form.printerId = res.rows[0].printerId;
  }
};

// 出单
const handleOutBill = async () => {
  // 自定义打单
  if (state.normalPrint) {
    getPrinterSysList();
    printerWay.dialogVisible = true;
  } else {
    if (state.orderDetailData.type === "ONLINE_ORDER_PAY") {
      // 线上核销出单
      const res = await waitToChekOrder({
        orderId: state.orderDetailData.orderId,
        storeId: state.orderDetailData.storeId,
        tableNo: state1.form.tableNo,
        method: "ALL",
      });
      if (res.code === 0) {
        const printerArr = res.data;
        for (let i = 0; i < printerArr.length; i++) {
          const obj = Object.assign({}, printerArr[i], {
            tableNo: state1.form.tableNo,
          });
          await asyncEvent(obj);
        }
      }
    } else if (state.orderDetailData.type === "SCAN_ORDER_PAY") {
      // 先付
      const body = {
        method: "ALL",
        orderId: state.orderDetailData.orderId,
        storeId: state.orderDetailData.storeId,
        tableNo: state.orderDetailData.tableNo,
      };

      const res = await beforePayCheckOrder(body);
      if (res.code === 0) {
        const printerArr = res.data;
        for (let i = 0; i < printerArr.length; i++) {
          await asyncEvent(printerArr[i]);
        }
        // printJS({ printable: printTableDom.value.$el, type: "html" });
      }
    } else if (state.orderDetailData.type === "SCAN_ORDER_UNDER") {
      // 后付
      const body = {
        method: "ALL",
        orderId: state.orderDetailData.orderId,
        storeId: state.orderDetailData.storeId,
        tableNo: state.orderDetailData.tableNo,
      };
      const res = await offlineCheckOrder(body);
      if (res.code === 0) {
        const printerArr = res.data;
        for (let i = 0; i < printerArr.length; i++) {
          await asyncEvent(printerArr[i]);
        }
      }
    }
  }
};
const asyncEvent = async (ele) => {
  return new Promise((resolve) => {
    setTimeout(
      (e) => {
        console.log(e);
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
  console.log(data);

  state.showPrintTable = true;
  const res = printerOption.value.find((x) => x.label === data.printerModel);
  // console.log("-------找到打印机", res);

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
          80;
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
    state1.dialogVisible = false;
    // debugger;
  }
};

// 核销
const checkCode = () => {
  state1.code = "";
  state1.dialogVisible1 = true;
  state.normalPrint = false;
};
// 检查二次核销
const checkCodeSecond = async (row) => {
  const res1 = await checkNoDetail(row.orderId);
  if (res1.code === 0) {
    state.orderDetailData = res1.data;
    state.showPrintTable = true;

    state1.dialogVisible = true;
  }
};
const confirmCheckCode = async (row) => {
  const res = await confirmOrderNo({
    storeId: query.storeId,
    pickupNo: state1.code,
  });
  if (res.code === 0 && res.data.length > 0) {
    state1.tableData = res.data;
    if (res.data.length > 1) {
      // 如果有多条核销单
      state1.dialogVisible2 = true;
    } else {
      showOrderDetail(res.data[0].orderId);
      state.showPrintTable = true;
    }
  } else if (res.code === 0) {
    ElMessage({
      message: "核销成功！",
      type: "success",
    });
    state1.code = "";
    state1.dialogVisible1 = false;
  } else {
    state1.code = "";
    ElMessage({
      message: "输入的取餐码有误，请重新输入！",
      type: "warning",
    });
  }
};
const getList = async () => {
  const body = Object.assign({}, query, { orderStatus: activeName.value });
  const res = await getLists(body);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
//获取台号
const getTableNoList = async () => {
  const res = await getDeskList({ storeId: query.storeId });
  if (res.code === 0) {
    state1.tableNoOptions = res.rows;
  }
};
const orderDetail = async (row) => {
  const res = await checkOrderDetail(row.orderId);
  if (res.code === 0) {
    state.orderDetailData = res.data;
  }
  showPhoneNum.value = false;
  state.dialogVisible1 = true;
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
const handleClick = (e) => {
  try {
    const val = e.props.name;
    activeName.value = val;
    query.pageNum = 1;
    getList();
  } catch (e) {
    console.log(e);
  }
};
const getStoreId = async () => {
  const storeId = JSON.parse(localStorage.getItem("storeId")).storeId;
  query.storeId = storeId;
};
// 新增订单里面的菜品
const addOrderMenus = async (row) => {
  const body = Object.assign({}, row, {
    storeId: state.orderDetailData.storeId,
    orderId: state.orderDetailData.orderId,
  });

  const res = await AddOrderInsideMenu(body);
  if (res.code === 0) {
    showOrderDetail(state.orderDetailData.orderId);
  }
};

onMounted(async () => {
  console.log(route.query.orderId);

  console.log(route.query.addMenu);

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

  inject("$com")
    .getStoreDict("bill_store_order_status,bill_print_method")
    .then(async (res) => {
      state.billOrderTypeOptions = res.data[0].list;
      activeName.value = state.billOrderTypeOptions[0].dictValue;
      methodOption.value = res.data[1].list;
      printerWay.form.method = res.data[1].list[0].dictValue;
      getStoreId();
      getList();
      getTableNoList();

      if (route.query.addMenu) {
        await showOrderDetail(route.query.orderId);
        state1.dialogVisible = true;
        state.addMenuData = JSON.parse(route.query.addMenu);
        console.log(state.orderDetailData.menuList);
        console.log(state.addMenuData);

        addOrderMenus(state.addMenuData);
        // state.orderDetailData.menuList.push(state.addMenuData);
      }
    });
});
</script>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
</style>