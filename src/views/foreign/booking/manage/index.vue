<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.orderNo"
        style="width: 200px; margin-right: 20px"
        placeholder="订单尾号后六位"
        clearable
        @keyup.enter="getList"
      />
      <el-config-provider :locale="locale">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
          :locale="locale"
        />
      </el-config-provider>
      <el-button
        type="primary"
        icon="Search"
        @click="getList"
        style="margin-left: 15px"
        >搜索</el-button
      >
    </div>

    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane
        label="预订单待处理"
        name="WAIT_ACCEPT"
        style="padding-left: 20px"
      ></el-tab-pane>
      <el-tab-pane label="待核销" name="WAIT_CONFIRM"></el-tab-pane>
      <el-tab-pane label="已完成" name="FINISH"></el-tab-pane>
      <el-tab-pane label="已取消" name="CANCEL"></el-tab-pane>
    </el-tabs>

    <el-table
      :data="tableData.row"
      style="width: 100%; margin: 10px 0"
      row-key="id"
      default-expand-all
      ref="tableDom"
      :height="tableHeight"
    >
      <el-table-column prop="orderNo" label="订单编号" sortable />
      <el-table-column label="待处理剩余时间" width="160"> </el-table-column>
      <el-table-column
        prop="book.dineStartTime"
        label="意向预订时间"
        sortable
        width="180"
      />
      <el-table-column label="意向预订桌台" sortable width="180">
        <template #default="scope">
          {{ scope.row.tableModel.modelName }}({{
            scope.row.tableModel.minQty
          }}
          ~ {{ scope.row.tableModel.maxQty }}人)
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="toHandler(scope.row)"
          >
            去处理
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="toHandlerBookMoney(scope.row)"
          >
            处理定金
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="tableData.total"
      :default-page-size="20"
      style="float: right"
      @current-change="changePageSize"
    />

    <!-- 详情处理 -->
    <div class="whiteBg flex-c" v-if="showDetail">
      <div class="handler rel">
        <div
          class="flex-c"
          style="position: absolute; left: 40px; top: 20px; z-index: 999"
          @click="handleBacker"
        >
          <el-icon size="26" color="#000"><ArrowLeftBold /></el-icon>
          <div style="font-size: 26px">返回</div>
        </div>
        <div v-if="step === 1" style="padding: 80px 20px 80px 20px">
          <div class="handler_title">确认处理</div>
          <div class="flex"><div class="leftName">意向预订时间：</div></div>
          <div class="flex"><div class="leftName">意向预订台桌：</div></div>
          <div class="flex"><div class="leftName">人数：</div></div>
          <div class="flex"><div class="leftName">已支付定金：</div></div>
          <div class="flex"><div class="leftName">订单编号：</div></div>
          <div class="flex"><div class="leftName">顾客电话：</div></div>
        </div>
        <div v-if="step === 2" style="padding: 80px 20px 80px 20px">
          <div class="mainBtnTitle">查看桌台状态</div>
          <div>
            <p style="text-align: center; margin: 10px 0">2024/11/20</p>
            <p style="text-align: center">意向桌台：大圆台（6～8）人</p>
            <div class="chooseDesk flex-c">A01</div>
          </div>

          <div class="mainBtnTitle">当前预约时间空闲桌台</div>
          <div style="margin: 20px 0">大圆台（6～8）人</div>
          <div class="flex">
            <div class="deskBox flex-c">A01</div>
          </div>
        </div>
        <!-- 取消预约 -->
        <div v-if="step === 3" style="padding: 80px 20px 80px 20px">
          <p style="font-size: 20px">是否确定取消预订？</p>
          <p style="font-size: 20px">由于原因：</p>
          <el-input
            v-model="textarea"
            style="width: 100%; margin-top: 20px"
            :rows="3"
            type="textarea"
            placeholder="请输入取消预订的原因"
          />
          <div class="flex" style="flex-wrap: wrap; margin-top: 30px">
            <div class="whyCancel flex-c">该预约时间暂无合适桌台</div>
            <div class="whyCancel flex-c">该时间段商家暂不营业</div>
            <div class="whyCancel flex-c">已与顾客协商一致</div>
          </div>
          <p style="margin-top: 15px">
            注：该原因回复，将直接转达给顾客，请如实告知取消原因。
          </p>
        </div>
        <div class="bottomBtn flex" v-if="step === 1">
          <div class="cancelBook flex-c" @click="step = 3">取消预订</div>
          <div class="confirmBook flex-c" @click="step = 2">
            确定预订，分配桌台
          </div>
        </div>
        <div class="bottomBtn" v-else-if="step === 2">
          <div class="confirmBook flex-c">确认分配</div>
        </div>
        <div class="bottomBtn" v-else-if="step === 3">
          <div class="confirmBook flex-c">确认取消</div>
        </div>
      </div>
    </div>

    <!-- 定金处理 -->
    <div class="whiteBg flex-c" v-if="showBackMoney">
      <div class="handler rel">
        <div
          class="flex-c"
          style="position: absolute; left: 40px; top: 20px; z-index: 999"
          @click="showBackMoney = false"
        >
          <el-icon size="26" color="#000"><ArrowLeftBold /></el-icon>
          <div style="font-size: 26px">返回</div>
        </div>
        <div style="padding: 80px 20px 80px 20px">
          <div class="handler_title">确认处理</div>
          <div class="flex"><div class="leftName">用户取消：</div></div>
          <div class="flex"><div class="leftName">待退定金：</div></div>
          <div class="flex"><div class="leftName">可退定金：</div></div>
          <div style="padding-left: 72px; color: #c1c1c1; font-size: 13px">
            （可退定金为用户实际支付的定金金额，请按实际情况操作！）
          </div>
          <p style="margin-top: 30px">请输入需操作退款的金额</p>
          <el-input
            v-model="textarea"
            style="width: 100%; margin-top: 20px"
            :rows="3"
            type="textarea"
            placeholder="请输入需操作退款的金额"
          />

          <p style="color: #fe5050">
            注：一旦确认退款后，将无法撤销，请谨慎操作！
          </p>

          <div class="flex" style="margin-top: 30px; flex-wrap: wrap">
            <div class="whyCancel flex-c">退¥100（100%）</div>
          </div>
        </div>

        <div class="bottomBtn">
          <div class="confirmBook flex-c">确认操作退款取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ref, reactive, onMounted, inject, computed, nextTick } from "vue";
import { getLists } from "@/api/project/foreign/order.js";
defineOptions({
  name: "manage-Book",
  isRouter: true,
});
onMounted(() => {
  getList();
});
const step = ref(1);
const locale = zhCn;
const showDetail = ref(false);
const showBackMoney = ref(false);
const activeName = ref("WAIT_ACCEPT");
const tableHeight = inject("$com").tableHeight();
const time = ref([]);
const query = reactive({
  orderNo: "",
});
const tableData = reactive({
  row: [],
  total: 0,
});

const getList = async () => {
  console.log(time.value);

  const body = Object.assign({}, query, {
    type: "BOOK_PAY",
    orderStatus: activeName.value,
  });

  if (time.value) {
    body.payStartTime = time.value[0];
    body.payEndTime = time.value[1];
  }

  const res = await getLists(body);
  if (res.code === 0) {
    tableData.row = res.rows;
    tableData.total = res.total;
  }
};
const toHandler = () => {
  showDetail.value = true;
};
const toHandlerBookMoney = () => {
  showBackMoney.value = true;
};
const handleBacker = () => {
  if (step.value > 1) {
    step.value = 1;
  } else {
    showDetail.value = false;
  }
};
const changePageSize = () => {};
const handleClick = async () => {
  await nextTick();
  getList();
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";

.chooseDesk {
  height: 70px;
  border: 2px solid #bbb6b6;
  margin: 30px 0;
  font-size: 28px;
}
.deskBox {
  height: 40px;
  width: 95px;
  font-size: 18px;
  border: 1px solid #000;
  margin-right: 15px;
}
.whyCancel {
  height: 40px;
  padding: 10px 20px;
  width: fit-content;
  font-size: 18px;
  border: 1px solid #000;
  margin-right: 15px;
}
.bottomBtn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  .cancelBook {
    flex: 1;
    background-color: #d6c7b8;
    height: 100%;
    font-size: 26px;
  }
  .confirmBook {
    flex: 1;
    background-color: $base-color-main;
    height: 100%;
    font-size: 26px;
  }
}

.handler {
  height: 75vh;
  width: 800px;
  background-color: #ffffff;
  .handler_title {
    padding: 20px 40px;
    background-color: $base-color-main;
    width: fit-content;
    color: #ffffff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    font-size: 24px;
    letter-spacing: 2px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin-bottom: 30px;
  }
}
.leftName {
  width: 160px;
  text-align: right;
  margin-top: 15px;
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