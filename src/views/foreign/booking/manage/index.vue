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
      <el-table-column label="待处理剩余时间" sortable prop="leftTime">
      </el-table-column>
      <el-table-column
        prop="book.dineStartTime"
        label="意向预订时间"
        sortable
      />
      <el-table-column label="意向预订桌台" sortable>
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
    <div class="whiteBg flex-c" v-if="showDetail" ref="detailDom">
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
          <div class="flex" style="align-items: center; margin-top: 15px">
            <div class="leftName">意向预订时间：</div>
            <div>{{ detailData.book.dineStartTime }}</div>
          </div>
          <div class="flex" style="align-items: center; margin-top: 15px">
            <div class="leftName">意向预订台桌：</div>
            <div>
              {{ detailData.tableModel.modelName }}
            </div>
          </div>
          <div class="flex" style="align-items: center; margin-top: 15px">
            <div class="leftName">人数：</div>
            <div>{{ detailData.book.peopleQty }}</div>
          </div>
          <div class="flex" style="align-items: center; margin-top: 15px">
            <div class="leftName">已支付定金：</div>
            <div>¥{{ detailData.billAmount }}</div>
          </div>
          <div class="flex" style="align-items: center; margin-top: 15px">
            <div class="leftName">订单编号：</div>
            <div>{{ detailData.orderNo }}</div>
          </div>
          <div class="flex" style="align-items: center; margin-top: 15px">
            <div class="leftName">顾客电话：</div>
            <div>{{ detailData.phone }}</div>
          </div>
        </div>
        <div v-if="step === 2" style="padding: 80px 20px 80px 20px">
          <div class="mainBtnTitle">查看桌台状态</div>
          <div>
            <p style="text-align: center; margin: 10px 0">
              {{ detailData.book.dineStartTime }}
            </p>
            <p style="text-align: center">
              意向桌台：{{ detailData.tableModel.modelName }}（{{
                detailData.tableModel.minQty
              }}～{{ detailData.tableModel.maxQty }}）人
            </p>
            <div class="chooseDesk flex-c">{{ deskPicked.tableNo }}</div>
          </div>

          <div class="mainBtnTitle">当前预约时间空闲桌台</div>
          <div style="margin: 10px 0">
            {{ detailData.tableModel.modelName }}（{{
              detailData.tableModel.minQty
            }}～{{ detailData.tableModel.maxQty }}）人
          </div>
          <div
            class="flex"
            style="flex-wrap: wrap; height: 185px; overflow-y: scroll"
          >
            <div
              class="deskBox flex-c"
              v-for="(item, idx) in canSelectDestList"
              :key="idx"
              @click="handleSelectDesk(item, idx)"
              :style="deskPickedIdx === idx ? 'background-color: #cdbca6' : ''"
            >
              {{ item.tableNo }}
            </div>
          </div>
        </div>
        <!-- 取消预约 -->
        <div v-if="step === 3" style="padding: 80px 20px 80px 20px">
          <p style="font-size: 20px">是否确定取消预订？</p>
          <p style="font-size: 20px">由于原因：</p>
          <el-input
            v-model="rejectReason"
            style="width: 100%; margin-top: 20px"
            :rows="3"
            type="textarea"
            placeholder="请输入取消预订的原因"
          />
          <div class="flex" style="flex-wrap: wrap; margin-top: 30px">
            <div
              class="whyCancel flex-c"
              @click="rejectReason = '该预约时间暂无合适桌台'"
            >
              该预约时间暂无合适桌台
            </div>
            <div
              class="whyCancel flex-c"
              @click="rejectReason = '该时间段商家暂不营业'"
            >
              该时间段商家暂不营业
            </div>
            <div
              class="whyCancel flex-c"
              @click="rejectReason = '已与顾客协商一致'"
            >
              已与顾客协商一致
            </div>
          </div>
          <p style="margin-top: 15px">
            注：该原因回复，将直接转达给顾客，请如实告知取消原因。
          </p>
        </div>
        <div class="bottomBtn flex" v-if="step === 1">
          <div class="cancelBook flex-c" @click="step = 3">取消预订</div>
          <div class="confirmBook flex-c" @click="allotDesk">
            确定预订，分配桌台
          </div>
        </div>
        <div class="bottomBtn" v-else-if="step === 2">
          <div class="confirmBook flex-c" @click="handleConfirmAccpet">
            确认分配
          </div>
        </div>
        <div class="bottomBtn" v-else-if="step === 3">
          <div class="confirmBook flex-c" @click="merchantCancel">确认取消</div>
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
import {
  merchantHandler,
  checkDeskEmptyList,
} from "@/api/project/foreign/booking.js";

import { ElMessage } from "element-plus";
defineOptions({
  name: "manage-Book",
  isRouter: true,
});
onMounted(() => {
  getList();
});
const detailDom = ref(null);
const step = ref(1);
const locale = zhCn;
const showDetail = ref(false);
const detailData = ref({}); //详情里面的内容
const rejectReason = ref(""); //商家拒绝原因
const canSelectDestList = ref([]); //可以被选择的桌台
const deskPicked = ref({}); //选择了的桌台信息
const deskPickedIdx = ref(null); //选择了的桌台idx

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
const allotDesk = async () => {
  step.value = 2;
  deskPicked.value = {};
  deskPickedIdx.value = null;
  // 检查哪些桌台可以被预订
  const body = {
    isOpenBook: "1",
    storeId: detailData.value.storeId,
    modelId: detailData.value.tableModel.modelId,
    realStatusList: `FREE_TIME,WAIT_CLEAN`,
  };
  const res = await checkDeskEmptyList(body);
  if (res.code === 0) {
    canSelectDestList.value = res.data;
  }
};
const updateTimer = (payTime, isInBusinessTime) => {
  const now = new Date().getTime();
  const elapsedTime = now - new Date(payTime).getTime(); // 计算经过的毫秒数

  const leftTime =
    isInBusinessTime === "0"
      ? 20 * 60 * 60 * 1000 - elapsedTime
      : 30 * 1000 * 60 - elapsedTime; //不在营业时间20小时 / 30分钟剩下的时间
  if (leftTime > 0) {
    // 显示结果
    // 将毫秒转换为秒、分钟和小时
    // const seconds = Math.floor((leftTime / 1000) % 60);
    const minutes = Math.floor((leftTime / (1000 * 60)) % 60);
    const hours = Math.floor((leftTime / (1000 * 60 * 60)) % 24);
    // const days = Math.floor(leftTime / (1000 * 60 * 60 * 24));
    // console.log(hours, minutes, seconds);
    // const setSeconds = seconds > 9 ? seconds : "0" + seconds;
    const setMinutes = minutes > 9 ? minutes : "0" + minutes;
    if (isInBusinessTime === "0") {
      return hours + "小时" + setMinutes;
    } else {
      return setMinutes + "分钟";
    }
  } else {
    return "00:00";
  }
};
const merchantCancel = async () => {
  if (rejectReason.value) {
    const body = {
      orderId: detailData.value.orderId,
      passStatus: "CANCEL",
      rejectReason: rejectReason.value,
    };

    const res = await merchantHandler(body);
    if (res.code === 0) {
      getList();
      showDetail.value = false;
      return ElMessage({
        message: "取消成功",
        type: "success",
        appendTo: detailDom.value,
      });
    } else {
      showDetail.value = false;
    }
  } else {
    return ElMessage({
      message: "请输入取消预订的原因！",
      type: "warning",
      appendTo: detailDom.value,
    });
  }
};
const handleConfirmAccpet = async () => {
  const body = {
    orderId: detailData.value.orderId,
    passStatus: "ACCEPT",
    tableModelId: deskPicked.value.modelId,
    tableNo: deskPicked.value.tableNo,
  };
  const res = await merchantHandler(body);
  if (res.code === 0) {
    showDetail.value = false;
    getList();
  }
};
const handleSelectDesk = (item, idx) => {
  deskPicked.value = item;
  deskPickedIdx.value = idx;
};

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
    res.rows.forEach((element) => {
      element.leftTime = updateTimer(
        element.payTime,
        element.book.isInBusinessTime
      );
    });
    tableData.row = res.rows;
    console.log(tableData.row);

    tableData.total = res.total;
  }
};
const toHandler = (item) => {
  step.value = 1;
  detailData.value = item;
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
  height: 60px;
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
  margin-top: 15px;
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