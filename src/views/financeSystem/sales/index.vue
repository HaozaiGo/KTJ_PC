<template>
  <div class="content">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTab">
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
          <div class="flex-sb" style="margin: 10px">
            <div class="flex">
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
            <div
              class="mainBtn flex-c"
              @click="innerAccount(1)"
              v-if="TabIdx === 0"
            >
              一键入账
            </div>
            <div class="mainBtn flex-c" @click="printForm" v-if="TabIdx === 1">
              打印报表
            </div>
          </div>

          <el-table
            :data="dataList"
            style="width: 100%; margin: 10px 0"
            row-key="id"
            default-expand-all
            :height="tableHeight"
            :row-style="{ background: 'transparent' }"
          >
            <el-table-column prop="nickName" label="销售人员" sortable>
            </el-table-column>
            <el-table-column prop="inAccountTime" label="时间" sortable />
            <el-table-column prop="storeName" label="入驻商铺" sortable />
            <el-table-column prop="score" label="评级" sortable />
            <el-table-column prop="amount" label="结算金额" sortable />
            <el-table-column prop="inAccountTime" label="纳入账单" sortable />
            <el-table-column
              :label="
                TabIdx === 0 ? '操作' : TabIdx === 1 ? '结算状态' : '特殊处理'
              "
              width="140"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="TabIdx === 0"
                  @click="innerAccountOne(scope.row)"
                >
                  入账
                </el-button>
                <span v-if="TabIdx === 1">{{
                  scope.row.settleStatusLabel
                }}</span>
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
      <el-tab-pane label="出纳" name="2" style="padding-left: 20px">
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

        <p style="font-size: 22px">结算数据</p>
        <div class="flex-sb" style="margin: 20px 0">
          <div class="statistics rel">
            <div class="flex-sr">
              <div
                class="grade"
                v-for="(item1, idx1) in firstBox.score"
                :key="idx1"
              >
                <div>{{ idx1.split("level")[1] }}</div>
                <div class="gradeNum">{{ item1 }}</div>
              </div>
            </div>
            <div class="bottomTotal flex" style="align-items: center">
              <div style="width: 50%; padding-left: 30px">总数据：</div>
              <div style="font-size: 24px">{{ firstBox.total }}</div>
            </div>
          </div>
          <div class="statistics rel">
            <div class="flex-sr">
              <div class="grade">
                <div
                  style="font-size: 18px; white-space: nowrap; height: 44px"
                  class="flex-c"
                >
                  普通销售
                </div>
                <div class="gradeNum">{{ cashierTotalData.number }}</div>
              </div>
            </div>
            <div class="bottomTotal flex" style="align-items: center">
              <div style="width: 50%; padding-left: 30px">上月人数：</div>
              <div style="font-size: 24px">{{ cashierTotalData.number }}</div>
            </div>
          </div>
          <div class="statistics rel">
            <div class="flex-sr">
              <div class="grade">
                <div
                  style="font-size: 18px; white-space: nowrap; height: 44px"
                  class="flex-c"
                >
                  已结算
                </div>
                <div class="gradeNum">{{ cashierTotalData.amount }}</div>
              </div>
            </div>
            <div class="bottomTotal flex" style="align-items: center">
              <div style="width: 50%; padding-left: 30px">总金额：</div>
              <div style="font-size: 24px">{{ cashierTotalData.amount }}</div>
            </div>
          </div>
          <div class="statistics rel">
            <div class="flex-sr">
              <div class="grade">
                <div
                  style="font-size: 18px; white-space: nowrap; height: 44px"
                  class="flex-c"
                >
                  特殊处理人员
                </div>
                <div class="gradeNum">
                  {{ cashierTotalData.specialHandleNumber }}
                </div>
              </div>
            </div>
            <div class="bottomTotal flex" style="align-items: center">
              <div style="width: 50%; padding-left: 30px">总累计：</div>
              <div style="font-size: 24px">
                {{ cashierTotalData.failAmount }}
              </div>
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
          <div class="flex-sb" style="margin: 10px">
            <div class="flex">
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

            <div
              class="mainBtn flex-c"
              @click="handleExportForm"
              v-if="TabIdx === 1"
            >
              {{ multipleSelection.length > 0 ? "导出当前" : "一键导出" }}
            </div>
          </div>

          <el-table
            :data="dataList"
            style="width: 100%; margin: 10px 0"
            row-key="id"
            default-expand-all
            :height="tableHeight"
            :row-style="{ background: 'transparent' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45" />
            <el-table-column prop="nickName" label="销售人员" sortable>
            </el-table-column>
            <el-table-column prop="inAccountTime" label="时间" sortable />
            <el-table-column prop="storeName" label="入驻商铺" sortable />
            <el-table-column prop="score" label="评级" sortable />
            <el-table-column prop="amount" label="结算金额" sortable />
            <el-table-column prop="inAccountTime" label="纳入账单" sortable />
            <el-table-column prop="bankNo" label="银行账户" sortable />
            <el-table-column prop="bankName" label="开户行" sortable />
            <el-table-column prop="specialHandle" label="特殊备注" sortable />
            <el-table-column label="特殊处理" width="140">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="TabIdx === 1 || TabIdx === 2"
                  @click="setRemark(scope.row)"
                >
                  编辑
                </el-button>
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
    </el-tabs>

    <el-dialog
      v-model="dialogVisible"
      title="特殊处理"
      width="600"
      align-center
    >
      <el-input v-model="remark" placeholder="请填写特殊处理"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSpecailHandle">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getSaleAmount,
  getSaleList,
  getSaleScore,
  cashierSaleData,
  innerAccountApi,
  exportExcel,
  settleApi,
  specialHandler,
  exportExcelAccountant,
} from "@/api/project/financeSystem/sales.js";
import { ref, reactive, inject, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { exportResponseData } from "@/utils/expXlxs";
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
const cashierTotalData = ref({}); //出纳结算数据
const firstBox = ref({});
const multipleSelection = ref([]);
const dialogVisible = ref(false);
const remark = ref("");
const remarkRow = ref({});

const confirmSpecailHandle = async () => {
  const body = {
    performanceId: remarkRow.value.performanceId,
    specialHandle: remark.value,
  };
  const res = await specialHandler(body);

  if (res.code === 0) {
    ElMessage({
      message: res.data.msg,
      type: "success",
    });
    dialogVisible.value = false;
    getSaleListFinance();
  }
};
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};
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
// 入账
const innerAccount = async (allIn) => {
  const body = {
    isAllIn: allIn,
  };
  const res = await innerAccountApi(body);
  if (res.code === 0) {
    ElMessage({
      message: res.data.msg,
      type: "success",
    });
    getSaleListFinance();
  }
};

// 打印报表 会记使用
const printForm = async () => {
  const body = {
    settleStatus: "WAIT_SETTLE",
  };
  const res = await exportExcelAccountant(body);

  exportResponseData(res, "对账报表");
};
const handleExportForm = async () => {
  var body;
  if (multipleSelection.value.length > 0) {
    body = {
      settleStatus: "WAIT_SETTLE",
      ids: multipleSelection.value.map((item) => item.performanceId),
    };
  } else {
    body = {
      settleStatus: "WAIT_SETTLE",
    };
  }

  const res = await exportExcel(body);

  ElMessageBox.confirm("是否确定全部完成结算?", "注意！", {
    confirmButtonText: "确定",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(async () => {
      if (multipleSelection.value.length > 0) {
        const ids = multipleSelection.value.map((item) => item.performanceId);
        const res = await settleApi({ ids: ids });
        if (res.code === 0) {
          ElMessage({
            type: "success",
            message: "结算成功",
          });
        }
      } else {
        const body = {
          settleStatus: TabIdx.value === 1 ? "WAIT_SETTLE" : "FINISH",
          pageSize: 999,
        };
        const res1 = await getSaleList(body);
        console.log("-----", res1);
        const ids = res1.rows.map((item) => item.performanceId);
        const res = await settleApi({ ids });
        if (res.code === 0) {
          ElMessage({
            type: "success",
            message: "结算成功",
          });
        }
      }
    })
    .catch(() => {
      // 处理取消逻辑
    });

  exportResponseData(res, "待结算");
};

const setRemark = (row) => {
  console.log(row);

  remarkRow.value = row;
  dialogVisible.value = true;
};

const innerAccountOne = async (row) => {
  console.log(row);
  const body = {
    isAllIn: 0,
    performanceId: row.performanceId,
  };
  const res = await innerAccountApi(body);
  if (res.code === 0) {
    ElMessage({
      message: res.data.msg,
      type: "success",
    });
    getSaleListFinance();
  }
};

const handleClickTab = (e) => {
  if (activeName.value === "1") {
    console.log(e);
    getCashierTotal();
  }
};
const handleSearch = async (e) => {
  getSaleListFinance(e);
  getSaleAmountFinance(e);
};

const getCashierTotal = async () => {
  const res = await cashierSaleData();
  if (res.code === 0) {
    cashierTotalData.value = res.data;
    firstBox.value = res.data.total;
  }
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
    width: fit-content;
    min-width: 50px;
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
:deep(.el-table--fit) {
  background-color: transparent;
}
:deep(.el-table__header thead tr th) {
  background: #dcd4bf;
  border: 1px solid #dcd4bf;
  border-bottom: none !important;
}
</style>