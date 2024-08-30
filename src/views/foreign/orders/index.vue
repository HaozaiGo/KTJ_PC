<template>
  <div class="content">
    <div class="search">
      <el-select
        v-model="query.storeId"
        placeholder="选择店铺"
        style="width: 200px"
      >
        <el-option
          v-for="item in StoreOptions"
          :key="item.storeId"
          :label="item.name"
          :value="item.storeId"
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

      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
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
      >
        <el-table-column prop="orderNo" label="订单编号" sortable />
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
            <el-button
              link
              type="primary"
              size="small"
              @click="orderDetail(scope.row)"
              >订单详情</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              v-if="
                scope.row.orderStatus === 'FINISH' && activeName === 'FINISH'
              "
              @click="printAgain(scope.row)"
              >再次打单</el-button
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
            人数：{{ state.orderDetailData.peopleQty }}人
          </div>
        </el-form>

        <div style="font-size: 25px">菜品</div>

        <el-table
          :data="state.orderDetailData.menuList"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="name" label="品名" />
          <el-table-column prop="unit" label="规格" width="150" />
          <el-table-column prop="qty" label="数量" width="150" />
          <el-table-column prop="price" label="单价" width="150" />
          <el-table-column prop="amount" label="小计" width="150" />
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

    <printTable
      v-if="state.showPrintTable"
      ref="printTableDom"
      :tableData="state.orderDetailData"
      style="
        position: fixed;
        left: 0;
        bottom: 0;
        transform: translate(-80mm, -80mm);
        opacity: 0;
      "
    ></printTable>
  </div>
</template>

<script setup>
import printTable from "@/components/printTable/diet.vue";
import { reactive, onMounted, ref, inject } from "vue";
import printJS from "print-js";
import {
  getLists,
  checkOrderDetail,
  getStoreLists,
  confirmOrderNo,
  checkNoDetail,
  getDeskList,
  waitToChekOrder,
  normalCheckOrder,
} from "@/api/project/foreign/order.js";

import { ElMessage } from "element-plus";
defineOptions({
  name: "foreign-Order",
  isRouter: true,
});
const printTableDom = ref(null);
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
});
const StoreOptions = ref([]);
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
// 再次打单
const printAgain = async (row) => {
  const res1 = await checkNoDetail(row.orderId);
  if (res1.code === 0) {
    state.orderDetailData = res1.data;
    state.showPrintTable = true;
    state.normalPrint = true; //开启普通打印
    state1.dialogVisible = true;
  }
};

// 出单
const handleOutBill = async () => {
  if (state.normalPrint) {
    //普通出单
    printJS({ printable: printTableDom.value.$el, type: "html" });
  } else {
    if (state.orderDetailData.type === "ONLINE_ORDER_PAY") {
      const res = await waitToChekOrder({
        orderId: state.orderDetailData.orderId,
        storeId: state.orderDetailData.storeId,
        tableNo: state1.form.tableNo,
      });
      if (res.code === 0) {
        printJS({ printable: printTableDom.value.$el, type: "html" });
      }
    } else {
      const res = await normalCheckOrder({
        orderId: state.orderDetailData.orderId,
        storeId: state.orderDetailData.storeId,
      });
      if (res.code === 0) {
        printJS({ printable: printTableDom.value.$el, type: "html" });
      }
    }
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
      const res1 = await checkNoDetail(res.data[0].orderId);
      if (res1.code === 0) {
        state.orderDetailData = res1.data;
        state.showPrintTable = true;

        state1.dialogVisible = true;
      }
    }
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
const getStoreList = async () => {
  const res = await getStoreLists();
  if (res.code === 0) {
    StoreOptions.value = res.rows;
    query.storeId = res.rows[0].storeId;
    getTableNoList();
  }
};
onMounted(async () => {
  inject("$com")
    .getStoreDict("bill_store_order_status")
    .then((res) => {
      state.billOrderTypeOptions = res.data[0].list;
      activeName.value = state.billOrderTypeOptions[0].dictValue;
      getStoreList();
      getList();
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