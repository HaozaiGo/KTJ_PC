<template>
  <div class="content">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="对账" name="1" style="padding-left: 20px">
        <div style="text-align: center">
          <el-input
            v-model="searchVal"
            style="max-width: 500px"
            placeholder="搜索员工"
            class="input-with-select"
            @change="handleSearch"
          >
            <template #prepend>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <p style="font-size: 22px">平台总入驻数据统计</p>
        <div class="flex-sb" style="margin: 20px 0">
          <div
            class="statistics rel"
            v-for="(item, idx) in statisticsList"
            :key="idx"
          >
            <div class="flex-sr">
              <div
                class="grade"
                v-for="(item1, idx1) in item.score"
                :key="idx1"
              >
                <div>{{ idx1.split("level")[1] }}</div>
                <div class="gradeNum">{{ item1 }}</div>
              </div>
            </div>
            <div class="bottomTotal flex" style="align-items: center">
              <div style="width: 50%; padding-left: 30px">
                {{
                  idx === "month"
                    ? "当月"
                    : idx === "quarter"
                    ? "最近季度"
                    : idx === "total"
                    ? "总累计"
                    : "本年度"
                }}：
              </div>
              <div style="font-size: 24px">{{ item.total }}</div>
            </div>
          </div>
        </div>
        <!-- table -->
        <div style="background-color: #dcd4bf">
          <div class="flex">
            <div
              v-for="(item, idx) in TabsList"
              :key="idx"
              class="tabSty flex-c"
              @click="tabChange(item, idx)"
              :class="{ tabActiveSty: idx === TabIdx }"
            >
              {{ item }}
            </div>
          </div>
          <div class="flex" style="margin: 10px">
            <div style="font-size: 24px; margin-right: 20px">
              ¥{{ salesTotalAmount || 0 }}
            </div>
            <div>
              共计
              <span style="display: inline-block; margin: 0 10px">{{
                dataTotal
              }}</span>
              项
            </div>
          </div>

          <el-table
            :data="dataList"
            style="width: 100%; margin: 10px 0"
            row-key="id"
            border
            default-expand-all
            :height="tableHeight"
          >
            <el-table-column prop="nickName" label="销售人员" sortable>
            </el-table-column>
            <el-table-column prop="inAccountTime" label="时间" sortable />
            <el-table-column prop="storeName" label="入驻商铺" sortable />
            <el-table-column prop="score" label="评级" sortable />
            <el-table-column prop="amount" label="结算金额" sortable />
            <el-table-column prop="inAccountTime" label="纳入账单" sortable />
            <el-table-column label="操作" width="140">
              <template #default="scope">
                <el-button link type="primary" size="small"> 入账 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="dataTotal"
            style="float: right"
            @current-change="changePageSize"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="出纳" name="2"> 232323 </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import {
  getSaleAmount,
  getSaleList,
  getSaleScore,
  cashierSaleData,
} from "@/api/project/financeSystem/sales.js";
import { ref, reactive, inject, onMounted } from "vue";
defineOptions({
  name: "Sales",
  isRouter: true,
});
const statisticsList = ref({});
const activeName = ref("1");
const searchVal = ref("");
const TabsList = ref(["待入账", "待结算", "已结算"]);
const TabIdx = ref(0);
const dataList = ref([]);
const dataTotal = ref(0);
const pageNum = ref(1);
const salesTotalAmount = ref(""); //会计待入账
const tableHeight = inject("$com").tableHeight() - 280;
const getSaleAmountFinance = async (val) => {
  var body;
  if (TabIdx.value === 0) {
    body = {
      inAccountStatus: "WAIT_IN_ACCOUNT",
      nickName: val,
    };
  } else {
    body = {
      settleStatus: TabIdx.value === 1 ? "WAIT_SETTLE" : "FINISH",
      nickName: val,
    };
  }
  const res = await getSaleAmount(body);
  if (res.code === 0) salesTotalAmount.value = res.data;
};
const getSaleListFinance = async (val) => {
  var body;
  if (TabIdx.value === 0) {
    body = {
      inAccountStatus: "WAIT_IN_ACCOUNT",
      nickName: val,
    };
  } else {
    body = {
      settleStatus: TabIdx.value === 1 ? "WAIT_SETTLE" : "FINISH",
      nickName: val,
    };
  }

  const res = await getSaleList(body);
  if (res.code === 0) {
    dataList.value = res.rows;
    dataTotal.value = res.total;
  }
};
const getScoreFinance = async () => {
  const res = await getSaleScore();
  if (res.code === 0) {
    statisticsList.value = res.data;
  }
};
const handleSearch = async (e) => {
  getSaleListFinance(e);
  getSaleAmountFinance(e);
};

const tabChange = (item, idx) => {
  TabIdx.value = idx;
  getSaleListFinance();
  getSaleAmountFinance();
};
const changePageSize = (e) => {
  pageNum.value = e;
  getSaleListFinance();
};
onMounted(() => {
  getSaleAmountFinance();
  getSaleListFinance();
  getScoreFinance();
});
</script>

<style lang="scss" scoped>
.tabSty {
  width: 6vw;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 40px;
  color: #000;
  background-color: transparent;
  border: 1px solid #000;
  cursor: pointer;
}
.tabActiveSty {
  color: #000 !important;
  font-size: 18px;
  font-weight: bold;
  background-color: #f1e6d8 !important;
  border: 1px solid #f1e6d8;
}
.statistics {
  width: calc((100% / 4) - 40px);
  background-color: #dcd4bf;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
  .bottomTotal {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f1e6d8;
    height: 40px;
  }
}
.grade {
  width: calc((100% / 4) - 20px);
  font-size: 28px;
  text-align: center;
  padding: 20px 0;
  .gradeNum {
    background-color: #f1e6d8;
    border-radius: 8px;
    width: 50px;
    margin: 0 auto;
  }
}
:deep(.el-tabs__item.is-active) {
  background-color: #cdbca6 !important;
  color: #ffffff !important;
  border-radius: 8px 8px 0 0;
}
:deep(.el-tabs__active-bar) {
  display: none;
}
:deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
  padding-right: 20px !important;
}
:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 20px !important;
}
</style>