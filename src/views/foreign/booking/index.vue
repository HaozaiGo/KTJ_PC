<template>
  <div class="content" style="color: #000">
    <div class="groupBuyData flex-sb">
      <div class="flex">
        <PieChart height="180px" width="180px"></PieChart>

        <div class="totalInfo">
          <div class="flex">
            <div>
              <div class="totalInfo_Row">履约数</div>
              <div class="totalInfo_Num">38</div>
            </div>
            <div>
              <div class="totalInfo_Row">失约数</div>
              <div class="totalInfo_Num">38</div>
            </div>
          </div>
        </div>
      </div>

      <div style="height: fit-content" class="flex">
        <span
          style="
            font-size: 20px;
            letter-spacing: 2px;
            font-weight: bold;
            margin-right: 10px;
          "
          >预定服务</span
        >
        <el-switch
          v-model="openService"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ccc"
          size="large"
          @change="switchChange"
        />
      </div>
    </div>

    <div class="flex-sb">
      <div class="mainBtnTitle">套餐管理</div>
      <div class="mainBtn flex-c" @click="handleEdit">
        <el-icon size="20" style="margin-right: 6px"><EditPen /></el-icon>
        {{ editStatus ? "确定修改" : "修改/编辑" }}
      </div>
    </div>

    <div class="flex">
      <div>
        <div class="mainBtnTitle" style="margin: 10px 0">定金</div>
        <el-input
          v-model="bookAmount"
          style="width: 250px"
          placeholder="请输入定金"
          :min="1"
          type="number"
        >
          <template #prepend>¥</template>
        </el-input>
      </div>
      <div style="margin: 0 25px">
        <div class="mainBtnTitle" style="margin: 10px 0">最低消费</div>
        <el-input
          v-model="bookRule.lowExpense"
          style="width: 250px"
          placeholder="请输入最低消费金额"
        >
          <template #prepend>¥</template>
        </el-input>
      </div>
      <div>
        <div class="mainBtnTitle" style="margin: 10px 0">房间茶位</div>
        <el-input
          v-model="bookRule.roomTea"
          style="width: 250px"
          placeholder="请输入房间茶位金额"
        >
          <template #prepend>¥</template>
        </el-input>
      </div>
    </div>

    <!-- bottom -->
    <div class="flex-sb bottomBox">
      <div>
        <div
          class="totalInfo_Row flex-c"
          style="width: 100%"
          @click="showBooking"
        >
          <el-icon size="20" style="margin-right: 3px" v-show="editStatus"
            ><EditPen
          /></el-icon>
          可预约时间
        </div>

        <div>
          <div
            v-for="(item, idx1) in canbookTime"
            :key="idx1"
            class="flex"
            style="flex-wrap: wrap; padding: 10px"
          >
            <div
              v-for="(item1, idx2) in item.time"
              :key="idx2"
              class="timeBox flex-c"
              style="
                margin: 10px 15px;
                background-color: #d7c7b7;
                border: 1px solid #d7c7b7;
              "
            >
              {{ item1 }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="totalInfo_Row flex-c"
          style="width: 100%"
          @click="handleClickDeskDrawer"
        >
          <el-icon size="20" style="margin-right: 3px" v-show="editStatus"
            ><EditPen
          /></el-icon>
          桌型配置
        </div>

        <div v-for="(table, idx) in deskData.outSizeDeskData" :key="idx">
          <div class="tablePosition">{{ table.name }}</div>
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(table1, idx1) in table.outSizeList"
              :key="idx1"
              class="tableTypeSty flex-c"
            >
              <div style="font-size: 17px; text-align: center">
                <div style="font-size: 20px; font-weight: bold">
                  {{ table1.modelName }}
                </div>
                <div>({{ table1.minQty }} ～ {{ table1.maxQty }}人)</div>
                <div>{{ table1.total }}张</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="totalInfo_Row flex-sb" style="width: 100%">
          <div
            class="flex-c"
            style="margin: 0 20px; flex: 1"
            @click="handleShowRuleDrawer"
          >
            <el-icon size="20" style="margin-right: 3px" v-show="editStatus"
              ><EditPen
            /></el-icon>
            <span>取消规定</span>
          </div>
          <div style="flex: 1">
            <span style="margin: 0 20px">取消费用</span>
          </div>
        </div>

        <div>
          <div class="flex ruleRow">
            <div style="flex: 1" class="ruleRow_Box">
              预约时间前
              {{ ruleData.cancelRule.cancelChargeOneTime }} 分钟或者更早时间
            </div>
            <div style="flex: 1" class="ruleRow_Box">
              {{
                ruleData.cancelRule.cancelChargeZeroRate == 0
                  ? "免费取消"
                  : "扣除 " + ruleData.cancelRule.cancelChargeZeroRate + "%"
              }}
            </div>
          </div>
          <div class="flex ruleRow">
            <div style="flex: 1" class="ruleRow_Box">
              预约时间 {{ ruleData.cancelRule.cancelChargeOneTime }} 分钟内
            </div>
            <div style="flex: 1" class="ruleRow_Box">
              扣除 {{ ruleData.cancelRule.cancelChargeOneRate }} %
            </div>
          </div>
          <div class="flex ruleRow">
            <div style="flex: 1" class="ruleRow_Box">
              预约时间
              {{ ruleData.cancelRule.cancelChargeTwoTime }} 分钟内或超出预约时间
            </div>
            <div style="flex: 1" class="ruleRow_Box">
              扣除 {{ ruleData.cancelRule.cancelChargeTwoRate }} %
            </div>
          </div>
        </div>

        <div
          class="totalInfo_Row flex-sb"
          style="width: 100%; margin-top: 25px"
        >
          <div
            class="flex-c"
            style="margin: 0 20px; flex: 1"
            @click="handleShowRuleDrawer"
          >
            <el-icon size="20" style="margin-right: 3px" v-show="editStatus"
              ><EditPen
            /></el-icon>
            <span>延迟规定</span>
          </div>
          <div style="flex: 1">
            <span style="margin: 0 20px">延迟费用</span>
          </div>
        </div>

        <div>
          <div class="flex ruleRow">
            <div style="flex: 1" class="ruleRow_Box">
              超出最迟入座时间且在超出
              {{ ruleData.delayRule.lateChargeTime }} 分钟内入座
            </div>
            <div style="flex: 1" class="ruleRow_Box">
              {{
                ruleData.delayRule.lateInnerChargeRate === 0
                  ? "免费取消"
                  : "扣除" + ruleData.delayRule.lateInnerChargeRate + "%"
              }}
            </div>
          </div>
          <div class="flex ruleRow">
            <div style="flex: 1" class="ruleRow_Box">
              超出最迟入座时间 {{ ruleData.delayRule.lateChargeTime }} 分钟后
            </div>
            <div style="flex: 1" class="ruleRow_Box">
              扣除 {{ ruleData.delayRule.lateOutChargeRate }} %
            </div>
          </div>
          <div style="text-align: right; margin-right: 20px; margin-top: 15px">
            （并自动释放预定位置）
          </div>
        </div>
      </div>
    </div>

    <el-drawer v-model="bookingDrawer" :with-header="false" size="57%">
      <div>
        <div class="bookingTitle">预约时间配置</div>
        <div
          class="flex-c"
          style="width: fit-content; font-size: 21px; margin: 15px 0 15px 0"
          @click="bookingDrawer = false"
        >
          <el-icon><ArrowLeftBold /></el-icon>
          <span>返回</span>
        </div>
        <div class="flex" style="flex-wrap: wrap">
          <div style="flex: 1">
            <div class="mainBtnTitle">时间显示</div>
            <div class="flex">
              <div
                class="timingBox flex-c"
                @click="changeType('default')"
                :style="
                  timeType === 'default'
                    ? `background:#a98e73`
                    : `background:#FFFFFF`
                "
              >
                <div style="font-size: 15px">
                  <p>营业时间</p>
                  <p v-for="(item, idx) in openTime" :key="idx">
                    {{ item.start }} - {{ item.end }}
                  </p>
                </div>
              </div>
              <div
                class="timingBox flex-c"
                style="margin: 15px"
                @click="changeType('cus')"
                :style="
                  timeType === 'cus'
                    ? `background:#a98e73`
                    : `background:#FFFFFF`
                "
              >
                自定义
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div class="mainBtnTitle">时间分隔</div>
            <div class="flex">
              <div
                class="timingBox flex-c"
                @click="changeTimeLine(30)"
                :style="
                  timeLine === 30 ? `background:#a98e73` : `background:#FFFFFF`
                "
              >
                30分钟
              </div>
              <div
                class="timingBox flex-c"
                style="margin: 15px"
                @click="changeTimeLine(60)"
                :style="
                  timeLine === 60 ? `background:#a98e73` : `background:#FFFFFF`
                "
              >
                60分钟
              </div>
            </div>
          </div>

          <div v-if="timeType === 'cus'" style="flex: 1">
            <div class="flex" style="align-items: center">
              <div class="mainBtnTitle">开放可预约时段</div>
              <span style="color: red; margin-left: 10px; font-size: 12px"
                >该配置不影响营业时间</span
              >
            </div>
            <div class="flex" style="margin: 15px 0 15px 0">
              <el-time-picker
                v-model="cusTime[0].startTime"
                placeholder="开放预约起始时间"
                value-format="HH:mm:ss"
                style="width: 180px"
              />
              <span style="margin: 0 20px">至</span>

              <el-time-picker
                v-model="cusTime[0].endTime"
                placeholder="开放预约结束时间"
                style="width: 180px"
                value-format="HH:mm:ss"
              />

              <el-time-picker
                v-model="cusTime[1].startTime"
                placeholder="开放预约起始时间"
                style="width: 180px; margin-left: 20px"
                value-format="HH:mm:ss"
              />
              <span style="margin: 0 20px">至</span>

              <el-time-picker
                v-model="cusTime[1].endTime"
                placeholder="开放预约结束时间"
                style="width: 180px"
                value-format="HH:mm:ss"
              />
            </div>
          </div>

          <div style="flex: 1">
            <div class="mainBtnTitle">留座时间</div>
            <div class="flex">
              <div
                class="timingBox flex-c"
                @click="changeStayPositionTime(30)"
                :style="
                  deskStayTime === 30
                    ? `background:#a98e73`
                    : `background:#FFFFFF`
                "
              >
                30分钟
              </div>
              <div
                class="timingBox flex-c"
                style="margin: 15px"
                @click="changeStayPositionTime(60)"
                :style="
                  deskStayTime === 60
                    ? `background:#a98e73`
                    : `background:#FFFFFF`
                "
              >
                60分钟
              </div>
              <div
                class="timingBox flex-c"
                @click="changeStayPositionTime(90)"
                :style="
                  deskStayTime === 90
                    ? `background:#a98e73`
                    : `background:#FFFFFF`
                "
              >
                90分钟
              </div>
            </div>
          </div>
        </div>
        <div class="mainBtnTitle" style="margin: 15px 0 20px 0">可预约时段</div>

        <div>
          <div
            v-for="(item, idx1) in autoComputedTimeLine"
            :key="idx1"
            class="flex"
            style="flex-wrap: wrap"
          >
            <div
              v-for="(item1, idx2) in item.time"
              :key="idx2"
              class="timeBox flex-c"
            >
              {{ item1 }}
            </div>
          </div>
        </div>

        <div
          class="doneBtn"
          style="line-height: 32px"
          @click="bookingDrawer = false"
        >
          <span>完成</span>
        </div>
      </div>
    </el-drawer>

    <!-- 桌台管理 -->
    <el-drawer v-model="deskDrawer" :with-header="false" size="57%">
      <div class="flex">
        <div class="deskDrawerLeft">
          <div class="bookingTitle">预定桌型配置</div>
          <div
            class="flex-c"
            style="width: fit-content; font-size: 21px; margin: 15px 0 15px 0"
            @click="deskDrawer = false"
          >
            <el-icon><ArrowLeftBold /></el-icon>
            <span>返回</span>
          </div>
          <div class="mainBtnTitle">桌型显示</div>
          <el-select
            v-model="deskData.settingTarget"
            placeholder="配置"
            size="large"
            style="width: 150px; margin: 10px 0"
            @change="selectChange"
          >
            <el-option
              v-for="item in deskData.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="mainBtnTitle" style="padding: 40px 30px; font-size: 20px">
            选择桌台
          </div>
        </div>
        <div class="deskDrawerCenter">
          <div style="font-size: 18px; letter-spacing: 2px">桌台区域</div>
          <div class="flex" style="flex-direction: column">
            <div
              v-for="(item, index) in TabsList"
              :key="index"
              @click="tabChange(item, index)"
              :style="
                deskData.TabIdx === index
                  ? 'color:#a98e73;font-weight:bold'
                  : 'color:#c1c1c1'
              "
              class="typeNameSty"
            >
              {{ item.typeName }}
            </div>
          </div>
        </div>
        <div class="deskDrawerRight">
          <div
            class="bookingTitle"
            style="
              position: absolute;
              left: 55%;
              top: 0;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
            "
          >
            已选{{ hadSelectDesk }}桌
          </div>
          <div
            class="mainBtnTitle"
            style="position: absolute; right: 20px; top: 20px; font-size: 18px"
            @click="handleAllDeskSelect"
          >
            {{ allDeskSelect ? "取消全选" : "全选" }}
          </div>

          <div v-for="(table, idx) in deskData.rightDeskData" :key="idx">
            <div class="bookingTitle1">
              {{ table[0].modelName }}
              <span style="font-size: 14px">({{ table.length }}桌)</span>
            </div>
            <div class="flex" style="flex-wrap: wrap">
              <div
                v-for="(tableItem, idx1) in table"
                :key="idx1"
                class="deskSty flex-c"
                :style="
                  tableItem.isSelect
                    ? 'background-color:#a98e73'
                    : 'background-color:#FFFFFF'
                "
                @click="handleChangeSelect(tableItem, idx1)"
              >
                <div style="text-align: center">
                  {{ tableItem.tableNo }}

                  <div>（{{ tableItem.minQty }}~{{ tableItem.maxQty }}人）</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="doneBtn"
          style="line-height: 32px"
          @click="handleSelectDeskDone"
        >
          <span>完成</span>
        </div>
      </div>
    </el-drawer>

    <!-- 规则管理 -->
    <el-drawer v-model="handleRuleDrawer" :with-header="false" size="57%">
      <div>
        <div class="bookingTitle">取消/延迟配置</div>
        <div
          class="flex-c"
          style="width: fit-content; font-size: 21px; margin: 15px 0 15px 0"
          @click="handleRuleDrawer = false"
        >
          <el-icon><ArrowLeftBold /></el-icon>
          <span>返回</span>
        </div>

        <div class="mainBtnTitle_other">取消规定</div>
        <div class="ruleBox flex-c">
          <div class="flex" style="flex-direction: column; align-items: center">
            <div class="bookingTitle">前/分钟</div>

            <div>
              <el-input
                v-model="ruleData.cancelRule.cancelChargeOneTime"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>外</template>
              </el-input>
            </div>
            <div>
              <el-input
                v-model="ruleData.cancelRule.cancelChargeOneTime"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>内</template>
              </el-input>
            </div>
            <el-input
              v-model="ruleData.cancelRule.cancelChargeTwoTime"
              style="max-width: 280px; margin-top: 20px"
            >
            </el-input>
          </div>
          <div
            class="flex-c"
            style="
              height: 180px;
              width: 180px;
              border: 2px solid #000;
              margin: 0 30px;
            "
          >
            <div style="font-size: 20px; letter-spacing: 2px">
              预定时间
              <div style="font-size: 25px; text-align: center">X</div>
            </div>
          </div>
          <div class="flex" style="flex-direction: column; align-items: center">
            <div class="bookingTitle">扣除费用（%）</div>

            <div>
              <el-input
                v-model="ruleData.cancelRule.cancelChargeZeroRate"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>%</template>
              </el-input>
            </div>
            <div>
              <el-input
                v-model="ruleData.cancelRule.cancelChargeOneRate"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>%</template>
              </el-input>
            </div>
            <div>
              <el-input
                v-model="ruleData.cancelRule.cancelChargeTwoRate"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>%</template>
              </el-input>
            </div>
          </div>
        </div>

        <div class="mainBtnTitle_other" style="margin-top: 30px">延迟规定</div>
        <div class="ruleBox flex-c">
          <div class="flex" style="flex-direction: column; align-items: center">
            <div class="bookingTitle">后/分钟</div>

            <div>
              <el-input
                v-model="ruleData.delayRule.lateChargeTime"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>内</template>
              </el-input>
            </div>
            <div>
              <el-input
                v-model="ruleData.delayRule.lateChargeTime"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>外</template>
              </el-input>
            </div>
          </div>
          <div
            class="flex-c"
            style="
              height: 120px;
              width: 180px;
              border: 2px solid #000;
              margin: 30px 30px 0 30px;
            "
          >
            <div style="font-size: 20px; letter-spacing: 2px">
              预定时间
              <div style="font-size: 25px; text-align: center">X</div>
            </div>
          </div>
          <div class="flex" style="flex-direction: column; align-items: center">
            <div class="bookingTitle">扣除费用（%）</div>

            <div>
              <el-input
                v-model="ruleData.delayRule.lateInnerChargeRate"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>%</template>
              </el-input>
            </div>
            <div>
              <el-input
                v-model="ruleData.delayRule.lateOutChargeRate"
                style="max-width: 280px; margin-top: 20px"
              >
                <template #append>%</template>
              </el-input>
              <div style="text-align: right; font-size: 12px">
                并自动释放位置
              </div>
            </div>
          </div>
        </div>

        <div
          class="doneBtn"
          style="line-height: 32px"
          @click="handleRuleDrawer = false"
        >
          <span>完成</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed, nextTick } from "vue";
import PieChart from "../groupBuy/groupSetting/components/PieChart.vue";
import {
  getShopInfo,
  editBooking,
  getBookingInfo,
  bookingStatus,
} from "@/api/project/foreign/booking.js";
import { getTabLists, getLists } from "@/api/project/foreign/createDesk.js";
import { ElMessage } from "element-plus";
defineOptions({
  name: "Booking",
  isRouter: true,
});
const bookAmount = ref(null); //预定金额
const bookRule = ref({ lowExpense: null, roomTea: "" }); //预定规则
const openService = ref(false);
const editStatus = ref(false);
const bookingDrawer = ref(false);
const deskDrawer = ref(false);
const handleRuleDrawer = ref(false);
const mark = ref(""); //标记
const canbookTime = ref(); //可预约时间
const shopInfo = ref({});
const openTime = ref([]); //营业时间
const allDeskSelect = ref(true); //全选
const cusTime = ref([
  { startTime: "", endTime: "" },
  { startTime: "", endTime: "" },
]); //自定义时间
const deskData = reactive({
  options: [
    { value: "为大厅配置", label: "为大厅配置" },
    { value: "为包厢配置", label: "为包厢配置" },
  ],
  settingTarget: "为大厅配置",
  hall: { name: "为大厅配置", list: [], outSizeList: [] },
  room: { name: "为包厢配置", list: [], outSizeList: [] },
  TabIdx: 0,
  typeId: "",
  originData: [], //源数据
  rightDeskData: [],
  outSizeDeskData: [],
});
const ruleData = reactive({
  cancelRule: {
    cancelChargeOneTime: "",
    cancelChargeOneRate: "",
    cancelChargeTwoTime: "",
    cancelChargeTwoRate: "",
    cancelChargeZeroRate: "",
  },
  delayRule: {
    lateChargeTime: "",
    lateInnerChargeRate: "",
    lateOutChargeRate: "",
  },
});

const timeLine = ref(30); //时间间隔
const timeType = ref("default"); //时间类型
const deskStayTime = ref(60); //留座时间
const TabsList = ref([]); //桌台区域
const bookingInfo = ref({}); //预定信息之前的

const tabChange = (item, idx) => {
  console.log(item, idx);

  deskData.TabIdx = idx;
  deskData.typeId = item.typeId;
  filterDesk(deskData.typeId);
};

// 根据typeId对应过滤
const filterDesk = (typeId) => {
  if (typeId === "") {
    deskData.rightDeskData = settingDeskData(
      deskData.originData.filter((x) => x.mark === mark.value || !x.mark)
    );
  } else {
    const result = deskData.originData.filter(
      (x) => x.typeId === typeId && (x.mark === mark.value || !x.mark)
    );
    deskData.rightDeskData = settingDeskData(result);
  }
};

const selectChange = (e) => {
  // console.log(e);
  mark.value = e === "为大厅配置" ? "hall" : "room";
  console.log(mark.value);

  // console.log(deskData.rightDeskData);
  const flatArr = deskData.rightDeskData.flat();
  const fliterArr = flatArr.filter((x) => x.isSelect);
  //未选中的桌台
  const canChooseIds = fliterArr.map((item) => item.tableId);
  // console.log(canChooseIds);

  const result = deskData.originData.filter(
    (item) => !canChooseIds.includes(item.tableId)
  );
  deskData.rightDeskData = settingDeskData(result);
  filterDesk(deskData.typeId);
};
const changeStayPositionTime = (e) => {
  deskStayTime.value = e;
};

// 组建内部的桌台结构
const settingDeskData = (data) => {
  let newArr = new Array(20).fill().map(() => []);

  for (let i = 0, j = 0; i < data.length; i++) {
    j = data[i].modelId;
    newArr[j].push(data[i]);
  }
  return newArr.filter((x) => x.length > 0);
};
const settingDeskDataHadPick = (data) => {
  let newArr = new Array(20).fill().map(() => []);

  for (let i = 0, j = 0; i < data.length; i++) {
    j = data[i].modelId;
    if (data[i].isOpenBook === "1") {
      newArr[j].push(data[i]);
    }
  }
  return newArr.filter((x) => x.length > 0);
};

const getDeskList = async () => {
  const body = {
    storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
    pageNum: 1,
    pageSize: 999,
    typeId: deskData.typeId,
  };
  const res = await getLists(body);
  if (res.code === 0) {
    // 初始化
    res.rows.forEach((x) => (x.isSelect = true));
    deskData.originData = res.rows;
    deskData.rightDeskData = settingDeskData(res.rows.slice(0));
  }
};
const handleChangeSelect = (item, idx) => {
  // console.log(item, idx);
  item.isSelect = !item.isSelect;
  if (deskData.settingTarget === "为大厅配置") {
    if (item.isSelect) {
      item.mark = "hall";
      deskData.hall.list.push(item);
    } else {
      const idx = deskData.hall.list.findIndex(
        (x) => x.tableId === item.tableId
      );
      deskData.hall.list.splice(idx, 1);
    }
  } else {
    if (item.isSelect) {
      item.mark = "room";
      deskData.room.list.push(item);
    } else {
      const idx = deskData.room.list.findIndex(
        (x) => x.tableId === item.tableId
      );
      deskData.room.list.splice(idx, 1);
    }
  }
  console.log(deskData.hall.list, deskData.room.list);
};
const handleAllDeskSelect = () => {
  allDeskSelect.value = !allDeskSelect.value;
  for (let i = 0; i < deskData.rightDeskData.length; i++) {
    for (let j = 0; j < deskData.rightDeskData[i].length; j++) {
      deskData.rightDeskData[i][j].isSelect = allDeskSelect.value;
    }
  }
  if (allDeskSelect.value) {
    if (deskData.settingTarget === "为大厅配置") {
      deskData.hall.list = deskData.rightDeskData.flat();
    } else {
      deskData.room.list = deskData.rightDeskData.flat();
    }
  } else {
    if (deskData.settingTarget === "为大厅配置") {
      deskData.hall.list = [];
    } else {
      deskData.room.list = [];
    }
  }
};
const handleShowRuleDrawer = () => {
  if (editStatus.value) {
    handleRuleDrawer.value = true;
  }
};

// 将当前选择的桌台 放入对应的list
const putInList = () => {
  deskData.hall.outSizeList = [];
  deskData.room.outSizeList = [];

  console.log("------大厅", deskData.hall.list);
  console.log("-----包厢", deskData.room.list);

  deskData.hall.list = settingDeskData(deskData.hall.list);
  deskData.room.list = settingDeskData(deskData.room.list);

  for (let i = 0; i < deskData.hall.list.length; i++) {
    // 找到选择的桌子
    const totalArr = deskData.hall.list[i]
      .map((x) => {
        if (x.isSelect) {
          return x;
        }
      })
      .filter((x) => !!x);
    deskData.hall.outSizeList.push(
      Object.assign({}, deskData.hall.list[i][0], {
        total: totalArr.length,
      })
    );
  }

  for (let i = 0; i < deskData.room.list.length; i++) {
    // 找到选择的桌子
    const totalArr = deskData.room.list[i]
      .map((x) => {
        if (x.isSelect) {
          return x;
        }
      })
      .filter((x) => !!x);
    deskData.room.outSizeList.push(
      Object.assign({}, deskData.room.list[i][0], {
        total: totalArr.length,
      })
    );
  }

  deskData.outSizeDeskData = [deskData.hall, deskData.room];
  // console.log(deskData.outSizeDeskData);
};

const handleSelectDeskDone = () => {
  putInList();
  deskDrawer.value = false;
};

const disabledSeconds = () => {
  let arr = [];
  for (let i = 1; i <= 59; i++) {
    arr.push(i);
  }
  return arr;
};
const handleEdit = async () => {
  if (editStatus.value) {
    console.log(canbookTime.value);
    if (bookAmount.value === "0") {
      return ElMessage({
        message: "预定定金不能设置为0！",
        type: "warning",
      });
    }
    // 构建时间list

    var bookTimeLists = [];
    canbookTime.value.map((x) => {
      for (let i = 0, j = 1; i < x.time.length; i++, j++) {
        if (j < x.time.length) {
          bookTimeLists.push({
            rangeQty: x.rangeQty,
            startTime: x.time[i],
            endTime: x.time[j],
            storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
          });
        }
      }
    });
    // console.log(bookTimeLists);
    // 构建tableList

    const hallList = deskData.hall.list.flat();
    const roomList = deskData.room.list.flat();
    // 提交
    const body = {
      bookAmount: bookAmount.value,
      rule: JSON.stringify(bookRule.value),
      bookTimeList: bookTimeLists,
      tableList: [
        {
          topPosition: "HALL",
          tableIds: hallList
            .map((x) => {
              if (x.isSelect) {
                return x.tableId;
              }
            })
            .filter((x) => !!x),
        },
        {
          topPosition: "BOX",
          tableIds: roomList
            .map((x) => {
              if (x.isSelect) {
                return x.tableId;
              }
            })
            .filter((x) => !!x),
        },
      ],
      cancelChargeOneRate: ruleData.cancelRule.cancelChargeOneRate / 100,
      cancelChargeOneTime: ruleData.cancelRule.cancelChargeOneTime,
      cancelChargeTwoRate: ruleData.cancelRule.cancelChargeTwoRate / 100,
      cancelChargeTwoTime: ruleData.cancelRule.cancelChargeTwoTime,
      cancelChargeZeroRate: ruleData.cancelRule.cancelChargeZeroRate / 100,
      lateChargeTime: ruleData.delayRule.lateChargeTime,
      lateInnerChargeRate: ruleData.delayRule.lateInnerChargeRate / 100,
      lateOutChargeRate: ruleData.delayRule.lateOutChargeRate / 100,
      seatingTime: deskStayTime.value,
      storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
      isOpen: openService.value ? "1" : "0",
    };
    console.log(body);

    const res = await editBooking(body);
  }

  editStatus.value = !editStatus.value;
};
const handleClickDeskDrawer = () => {
  if (editStatus.value) {
    deskDrawer.value = true;
    deskData.hall.list = deskData.hall.list.flat();
    deskData.room.list = deskData.room.list.flat();
  }
};
const getAreaList = async () => {
  const storeId = JSON.parse(localStorage.getItem("storeId")).storeId;

  const res = await getTabLists({ storeId: storeId });
  if (res.code === 0) {
    TabsList.value = res.rows;
    // 首次加载插入deskData
    TabsList.value.unshift({ typeName: "全部", typeId: "" });
    await getDeskList();
    if (deskData.settingTarget === "为大厅配置") {
      deskData.hall.list = deskData.rightDeskData.flat();
    } else {
      deskData.room.list = deskData.rightDeskData.flat();
    }
  }
};

const changeTimeLine = (val) => {
  timeLine.value = val;
};
const changeType = (type) => {
  timeType.value = type;
};

const showBooking = async () => {
  if (editStatus.value) {
    bookingDrawer.value = true;
    const storeId = JSON.parse(localStorage.getItem("storeId")).storeId;

    const res = await getShopInfo(storeId);
    if (res.code === 0) shopInfo.value = res.data;
    // 处理营业时间
    if (res.data.endTime && res.data.startTime) {
      const startTime = res.data.startTime.split(",");
      const endTime = res.data.endTime.split(",");
      if (startTime.length === endTime.length) {
        openTime.value = [];
        for (let i = 0; i < startTime.length; i++) {
          openTime.value.push({ start: startTime[i], end: endTime[i] });
        }
      }
    }
  }
};
// 获取两端时间的间隔时长
const getHour = (s1, s2) => {
  // console.log(s1, s2);

  var reDate = /\d{4}-\d{1,2}-\d{1,2} /;
  if (s1.split(":")[0] < s2.split(":")[0]) {
    s1 = new Date((reDate.test(s1) ? s1 : "2018-1-1 " + s1).replace(/-/g, "/"));
    s2 = new Date((reDate.test(s2) ? s2 : "2018-1-1 " + s2).replace(/-/g, "/"));
    var ms = s2.getTime() - s1.getTime();
  } else {
    // 隔日的
    s1 = new Date((reDate.test(s1) ? s1 : "2018-1-1 " + s1).replace(/-/g, "/"));
    s2 = new Date((reDate.test(s2) ? s2 : "2018-1-2 " + s2).replace(/-/g, "/"));
    var ms = s2.getTime() - s1.getTime();
  }

  // console.log("ms", ms);
  if (ms < 0) return 0;
  return Math.floor(ms / 1000 / 60 / 60); //小时
};

// 半小时为间隔的func
const halfHour = (startTime) => {
  let timeArrays = new Array(96).fill("").map((item, index) => {
    if (index >= Number(startTime) * 2) {
      let startVal = (index % 48) * 30;
      let endVal = (index + 1) * 30;
      let startHour = Math.floor(startVal / 60);
      let startMinute = startVal % 60;
      let endHour = Math.floor(endVal / 60);
      let endMinute = endVal % 60;
      let startTime =
        (startHour < 10 ? "0" + startHour : startHour) +
        ":" +
        (startMinute === 0 ? "00" : startMinute);
      let endTime =
        (endHour < 10 ? "0" + endHour : endHour) +
        ":" +
        (endMinute === 0 ? "00" : endMinute);

      return startTime;
    }
  });
  return timeArrays.filter((x) => !!x);
};
const oneHour = (startTime) => {
  let timeArrays = new Array(48).fill("").map((item, index) => {
    if (index >= Number(startTime)) {
      let startVal = index * 60;
      let startHour = Math.floor(startVal / 60);
      let startMinute = startVal % 60;
      let startTime =
        (startHour < 10
          ? "0" + startHour
          : startHour > 24
          ? startHour % 24
          : startHour) +
        ":" +
        (startMinute === 0 ? "00" : startMinute);

      return startTime;
    }
  });

  return timeArrays.filter((x) => !!x);
};

//计算时间间隔
const autoComputedTimeLine = computed(() => {
  if (timeType.value === "default") {
    if (timeLine.value === 30) {
      const timeLine = openTime.value.map((x, idx) => {
        const intervalTime = getHour(x.start + ":00", x.end + ":00");
        return {
          rangeQty: idx + 1,
          time: halfHour(x.start.split(":")[0]).slice(0, intervalTime * 2),
        };
      });
      console.log(timeLine);
      canbookTime.value = timeLine;
      return timeLine;
    } else if (timeLine.value === 60) {
      const timeLine = openTime.value.map((x, idx) => {
        const intervalTime = getHour(x.start + ":00", x.end + ":00");
        return {
          rangeQty: idx,
          time: oneHour(x.start.split(":")[0]).slice(0, intervalTime),
        };
      });
      console.log(timeLine);

      canbookTime.value = timeLine;
      return timeLine;
    }
  } else {
    try {
      if (timeLine.value === 30) {
        const timeLine = cusTime.value.map((x, idx) => {
          console.log(x.startTime);
          console.log(idx);

          if (!x.startTime || !x.endTime) {
            console.log(cusTime.value);

            return {
              rangeQty: idx,
              time: [],
            };
          } else {
            const intervalTime = getHour(x.startTime, x.endTime);

            return {
              rangeQty: idx,
              time: halfHour(x.startTime.split(":")[0]).slice(
                0,
                intervalTime * 2
              ),
            };
          }
        });
        // console.log(timeLine);
        canbookTime.value = timeLine;
        return timeLine;
      } else if (timeLine.value === 60) {
        const timeLine = cusTime.value.map((x, idx) => {
          if (!x.startTime || !x.endTime) {
            console.log(cusTime.value);

            return {
              rangeQty: idx,
              time: [],
            };
          } else {
            const intervalTime = getHour(x.startTime, x.endTime);

            return {
              rangeQty: idx,
              time: oneHour(x.startTime.split(":")[0]).slice(0, intervalTime),
            };
          }
        });
        canbookTime.value = timeLine;
        return timeLine;
      }
    } catch (e) {
      console.log(e);
    }
  }
});

const hadSelectDesk = computed(() => {
  var count = 0;
  for (let i = 0; i < deskData.rightDeskData.length; i++) {
    for (let j = 0; j < deskData.rightDeskData[i].length; j++) {
      if (deskData.rightDeskData[i][j].isSelect) {
        count += 1;
      }
    }
  }
  return count;
});

//查看已经设置的数据
const checkHadSettingBooking = async () => {
  const storeId = JSON.parse(localStorage.getItem("storeId")).storeId;
  const res = await getBookingInfo(storeId);
  if (res.code === 0) {
    bookingInfo.value = res.data;
    // 回显
    bookAmount.value = bookingInfo.value.bookAmount;
    bookRule.value.lowExpense = JSON.parse(bookingInfo.value.rule).lowExpense;
    bookRule.value.roomTea = JSON.parse(bookingInfo.value.rule).roomTea;

    //处理回显时间
    const groupedData = bookingInfo.value.bookTimeList.reduce((acc, item) => {
      if (!acc[item.rangeQty]) {
        acc[item.rangeQty] = [];
      }
      acc[item.rangeQty].push(item);
      return acc;
    }, {});
    // console.log(groupedData);
    canbookTime.value = Object.values(groupedData).map((x, index) => {
      return {
        rangeQty: index,
        time: x.map((item, idx) => {
          if (idx === x.length - 1) {
            return item.startTime + "," + item.endTime;
          } else {
            return item.startTime;
          }
        }),
      };
    });
    canbookTime.value.map((x, idx) => {
      let lastItem = x.time[x.time.length - 1];
      // // 拆分最后一项
      let splitItems = lastItem.split(",");
      x.time = x.time.slice(0, -1).concat(splitItems);
    });

    //回显=规则
    ruleData.cancelRule.cancelChargeOneTime =
      bookingInfo.value.cancelChargeOneTime;
    ruleData.cancelRule.cancelChargeTwoTime =
      bookingInfo.value.cancelChargeTwoTime;
    ruleData.cancelRule.cancelChargeZeroRate =
      bookingInfo.value.cancelChargeZeroRate * 100;
    ruleData.cancelRule.cancelChargeOneRate =
      bookingInfo.value.cancelChargeOneRate * 100;
    ruleData.cancelRule.cancelChargeTwoRate =
      bookingInfo.value.cancelChargeTwoRate * 100;

    ruleData.delayRule.lateChargeTime = bookingInfo.value.lateChargeTime;
    ruleData.delayRule.lateInnerChargeRate =
      bookingInfo.value.lateInnerChargeRate * 100;
    ruleData.delayRule.lateOutChargeRate =
      bookingInfo.value.lateOutChargeRate * 100;

    //预约状态回显
    openService.value = bookingInfo.value.isOpen === "1" ? true : false;

    //桌台回显
    // deskData.outSizeDeskData
    const groupData = bookingInfo.value.tableList.reduce((acc, next) => {
      if (!acc[next.topPosition]) {
        acc[next.topPosition] = [];
      }
      acc[next.topPosition].push(next);
      return acc;
    }, {});
    console.log(groupData);

    for (const [key, value] of Object.entries(groupData)) {
      // console.log(`${key}: ${value}`);
      console.log(settingDeskData(value));
      const list = [];
      let resetDeskData = settingDeskDataHadPick(value);
      resetDeskData.map((x) => {
        list.push(Object.assign({}, x[0], { total: x.length }));
      });

      deskData.outSizeDeskData.push({
        name: key === "HALL" ? "大厅" : "包厢",
        outSizeList: list,
      });
    }
  }
};
//打开预定or not
const switchChange = async (e) => {
  // console.log(e);
  const res = await bookingStatus({
    isOpen: openService ? "1" : "0",
    storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
  });
};
onMounted(() => {
  getAreaList();
  checkHadSettingBooking();
});
</script>

<style lang="scss" scoped>
$tabColor: #d7c7b7;
$bgColor: #a98e73;
.groupBuyData {
  height: 220px;
}
.totalInfo {
  margin-left: 25px;
  border-radius: 25px;
  overflow: hidden;
}
.totalInfo_Row {
  width: 150px;
  background-color: $tabColor;
  text-align: center;
  padding: 5px 0;
  font-size: 20px;
}
.totalInfo_Num {
  background-color: $bgColor;
  font-size: 40px;
  font-weight: bold;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottomBox {
  margin-top: 20px;
  height: 50vh;
}
.bottomBox > div {
  background-color: $bgColor;
  overflow-y: scroll;

  border-radius: 25px;
  width: calc((100% / 3) - 30px);
}
.bookingTitle {
  padding: 6px 10px;
  width: fit-content;
  background-color: $tabColor;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 19px;
  letter-spacing: 2px;
}
.bookingTitle1 {
  padding: 6px 10px;
  width: fit-content;
  background-color: $tabColor;
  font-size: 18px;
  letter-spacing: 2px;
  border-radius: 10px;
  margin-top: 10px;
}
.timingBox {
  height: 100px;
  width: 150px;
  border-radius: 20px;
  border: 2px solid #3a3737;
  font-size: 25px;
}
.timeBox {
  height: 55px;
  width: 66px;
  border: 2px solid #333232;
  border-radius: 10px;
  margin: 15px 15px 15px 0;
}
.doneBtn {
  background-color: $bgColor;
  padding: 10px 50px;
  font-size: 25px;
  width: fit-content;
  position: fixed;
  right: 20px;
  bottom: 20px;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.deskDrawerLeft {
  height: calc(100vh - 40px);
  padding-right: 25px;
  border-right: 1px solid #c2c2c2;
}
.deskDrawerCenter {
  height: calc(100vh - 40px);
  padding: 0 25px;
  border-right: 1px solid #c2c2c2;
}
.typeNameSty {
  color: #c2c2c2;
  padding: 10px 0;
  font-size: 17px;
  letter-spacing: 1px;
}
.deskDrawerRight {
  position: initial;
  padding: 0 20px;
  height: calc(100vh - 140px);
  overflow-y: scroll;
  flex: 1;
  .deskSty {
    width: calc((100% / 5) - 30px);
    min-width: 90px;
    margin: 15px 15px 0 0;
    height: 80px;
    border: 1px solid #c2c2c2;
    border-radius: 10px;
  }
}
.tablePosition {
  padding: 6px 15px;
  background-color: $tabColor;
  border-radius: 8px;
  width: fit-content;
  margin: 15px 10px 10px 10px;
}
.tableTypeSty {
  padding: 12px;
  background-color: $tabColor;
  border-radius: 20px;
  width: calc((100% / 3) - 40px);
  margin: 10px;
  height: 13vh;
  min-height: 110px;
  min-width: 110px;
}
.ruleBox {
  background-color: $bgColor;
  border: 1px solid #000;
  padding: 0px 0px 30px 0px;
}
.mainBtnTitle_other {
  background-color: $bgColor;
  padding: 10px 40px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border: 1px solid #000;
  width: fit-content;
  font-size: 19px;
  letter-spacing: 1px;
}
.ruleRow {
  padding: 15px 10px 5px 10px;
  .ruleRow_Box {
    font-weight: bold;

    flex: 1;
    text-align: center;
  }
}
</style>