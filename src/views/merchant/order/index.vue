<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.orderNo"
        style="width: 200px"
        placeholder="订单编号"
      />
      <el-input
        v-model="query.phone"
        style="width: 200px"
        placeholder="买家手机号"
      />

      <el-date-picker
        v-model="query.orderTime"
        type="date"
        placeholder="下单时间"
        size="default"
        value-format="YYYY-MM-DD"
      />

      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
      <div style="margin-top: 10px;">
        <el-input
          v-model="query.nickName"
          style="width: 200px"
          placeholder="商家名称"
        />
        <el-input
          v-model="query.tradeType"
          style="width: 200px"
          placeholder="交易类型"
        />
        <el-select
          v-model="query.payStatus"
          placeholder="支付状态"
          style="width: 220px"
          clearable
        >
          <el-option
            v-for="item in state.setCheckOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </div>
    </div>

    <div>
      <el-table
        :data="tableData.row"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        :max-height="tableHeight"
      >
        <el-table-column prop="orderId" label="订单ID" sortable width="180" />
        <el-table-column prop="orderNo" label="订单编号" sortable  width="150"/>
        <el-table-column prop="storeName" label="商家名称" sortable  width="150" />
        <el-table-column prop="amount" label="支付金额" sortable width="120"  />
        <el-table-column
          prop="orderTime"
          label="下单时间"
          sortable
          width="200"
        />
        <el-table-column
          prop="payStatusLabel"
          label="支付状态"
          sortable
          width="150"
        />
        <el-table-column prop="payTime" label="支付时间" sortable width="200" />
        <el-table-column prop="payType" label="订单支付类型" sortable width="150" />
        <el-table-column prop="phone" label="买家手机号" sortable width="150" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="check(scope.row)"
            >
              更新状态
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="orderDetail(scope.row)"
              >订单详情</el-button
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
            <div class="cell-item">订单ID</div>
          </template>
          {{ state.orderDetailData.orderId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">订单编号</div>
          </template>
          {{ state.orderDetailData.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">微信支付订单号</div>
          </template>
          {{ state.orderDetailData.transactionId }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">商家名称</div>
          </template>
          {{ state.orderDetailData.storeName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">子商户号</div>
          </template>
          {{ state.orderDetailData.subMchid }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">支付金额</div>
          </template>
          {{ state.orderDetailData.amount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">买家昵称</div>
          </template>
          {{ state.orderDetailData.nickName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">买家手机号</div>
          </template>
          {{ state.orderDetailData.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">交易类型</div>
          </template>
          {{ state.orderDetailData.tradeType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">交易状态</div>
          </template>
          {{ state.orderDetailData.tradeState }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">交易状态描述</div>
          </template>
          {{ state.orderDetailData.tradeStateDesc }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">微信手续费</div>
          </template>
          {{ state.orderDetailData.wxRateAmount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">微信手续费率</div>
          </template>
          {{ state.orderDetailData.wxRate }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">解冻状态</div>
          </template>
          {{ state.orderDetailData.unfreezeStatusLabel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">是否分账</div>
          </template>
          {{ state.orderDetailData.profitSharingLabel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">支付时间</div>
          </template>
          {{ state.orderDetailData.payTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">下单时间</div>
          </template>
          {{ state.orderDetailData.orderTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">银行类型</div>
          </template>
          {{ state.orderDetailData.bankType }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import {
  getLists,
  checkInfo,
  checkOrderDetail,
} from "@/api/project/merchant/order.js";
defineOptions({
  name: "O-rder",
  isRouter: true,
});
const query = reactive({
  orderNo: "",
  nickName: "",
  phone: "",
  tradeType: "",
  orderTime: "",
  payStatus: "",
  pageNum: 1,
});

const tableData = ref({
  row: [],
  total: 0,
});
const state = reactive({
  dialogVisible1: false,
  setCheckOptions: [],
  orderDetailData: {},
});
const check = async (row) => {
  const res = await checkInfo(row.orderId);

  getList();
};
const tableHeight = inject("$com").tableHeight();
const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
const orderDetail = async (row) => {
  const res = await checkOrderDetail(row.orderId);
  if (res.code === 0) {
    state.orderDetailData = res.data;
  }
  state.dialogVisible1 = true;
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
onMounted(async () => {
  inject("$com")
    .getDict("bill_pay_status")
    .then((res) => {
      state.setCheckOptions = res.data[0].list;
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