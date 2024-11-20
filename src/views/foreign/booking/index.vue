<template>
  <div class="content">
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
        />
      </div>
    </div>

    <div class="flex-sb">
      <div class="mainBtnTitle">套餐管理</div>
      <div class="mainBtn flex-c" @click="handleEdit">
        <el-icon size="20" style="margin-right: 6px"><EditPen /></el-icon
        >修改/编辑
      </div>
    </div>

    <div class="flex">
      <div>
        <div class="mainBtnTitle" style="margin: 10px 0">定金</div>
        <el-input
          v-model="input1"
          style="width: 250px"
          placeholder="请输入定金"
        >
          <template #prepend>¥</template>
        </el-input>
      </div>
      <div style="margin: 0 25px">
        <div class="mainBtnTitle" style="margin: 10px 0">最低消费</div>
        <el-input
          v-model="input1"
          style="width: 250px"
          placeholder="请输入最低消费金额"
        >
          <template #prepend>¥</template>
        </el-input>
      </div>
      <div>
        <div class="mainBtnTitle" style="margin: 10px 0">房间茶位</div>
        <el-input
          v-model="input1"
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

        <div class="flex" style="flex-wrap: wrap;padding: 10px;">
          <div
            v-for="(item, idx1) in canbookTime"
            :key="idx1"
            class="timeBox flex-c"
            style="margin: 10px 15px;background-color: #d7c7b7;border: 1px solid #d7c7b7;"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div>
        <div class="totalInfo_Row flex-c" style="width: 100%">
          <el-icon size="20" style="margin-right: 3px" v-show="editStatus"
            ><EditPen
          /></el-icon>
          桌型配置
        </div>
      </div>
      <div>
        <div class="totalInfo_Row flex-sb" style="width: 100%">
          <div class="flex-c">
            <el-icon size="20" style="margin-right: 3px" v-show="editStatus"
              ><EditPen
            /></el-icon>
            <span>取消规定</span>
          </div>
          <span>取消费用</span>
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
              <div class="mainBtnTitle">可预约时段</div>
              <span style="color: red; margin-left: 10px; font-size: 12px"
                >该配置不影响营业时间</span
              >
            </div>
            <div class="flex" style="margin: 15px 0 15px 0">
              <el-time-picker
                v-model="cusTime[0].startTime"
                arrow-control
                placeholder="开放预约起始时间"
                style="width: 180px"
                :disabled-seconds="disabledSeconds"
                value-format="HH:mm:ss"
              />
              <span style="margin: 0 20px">至</span>

              <el-time-picker
                v-model="cusTime[0].endTime"
                arrow-control
                placeholder="开放预约结束时间"
                style="width: 180px"
                :disabled-seconds="disabledSeconds"
                value-format="HH:mm:ss"
              />

              <el-time-picker
                v-model="cusTime[1].startTime"
                arrow-control
                placeholder="开放预约起始时间"
                style="width: 180px; margin-left: 20px"
                :disabled-seconds="disabledSeconds"
                value-format="HH:mm:ss"
              />
              <span style="margin: 0 20px">至</span>

              <el-time-picker
                v-model="cusTime[1].endTime"
                arrow-control
                placeholder="开放预约结束时间"
                style="width: 180px"
                :disabled-seconds="disabledSeconds"
                value-format="HH:mm:ss"
              />
            </div>
          </div>

          <div style="flex: 1">
            <div class="mainBtnTitle">留座时间</div>
            <div class="flex">
              <div
                class="timingBox flex-c"
                @click="changeTimeLine(30)"
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
                @click="changeTimeLine(60)"
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
                @click="changeTimeLine(60)"
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

        <div class="flex" style="flex-wrap: wrap">
          <div
            v-for="(item, idx1) in autoComputedTimeLine"
            :key="idx1"
            class="timeBox flex-c"
          >
            {{ item }}
          </div>
        </div>

        <div class="doneBtn" style="line-height: 32px" @click="handleOnline">
          <span>完成</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed, nextTick } from "vue";
import PieChart from "../groupBuy/groupSetting/components/PieChart.vue";
import { getShopInfo } from "@/api/project/foreign/booking.js";
defineOptions({
  name: "Booking",
  isRouter: true,
});
const openService = ref(false);
const editStatus = ref(false);
const bookingDrawer = ref(false);
const canbookTime = ref(); //可预约时间
const shopInfo = ref({});
const openTime = ref([]); //营业时间
const cusTime = ref([
  { startTime: "", endTime: "" },
  { startTime: "", endTime: "" },
]); //自定义时间

const timeLine = ref(30); //时间间隔
const timeType = ref("default"); //时间类型
const deskStayTime = ref(60); //留座时间

const disabledSeconds = () => {
  let arr = [];
  for (let i = 1; i <= 59; i++) {
    arr.push(i);
  }
  return arr;
};
const handleEdit = () => {
  editStatus.value = !editStatus.value;
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
  console.log(s1, s2);

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
      const timeLine = openTime.value.map((x) => {
        const intervalTime = getHour(x.start + ":00", x.end + ":00");
        return halfHour(x.start.split(":")[0]).slice(0, intervalTime * 2);
      });
      canbookTime.value = timeLine.flat();
      return timeLine.flat();
    } else if (timeLine.value === 60) {
      const timeLine = openTime.value.map((x) => {
        const intervalTime = getHour(x.start + ":00", x.end + ":00");
        return oneHour(x.start.split(":")[0]).slice(0, intervalTime);
      });
      canbookTime.value = timeLine.flat();
      return timeLine.flat();
    }
  } else {
    console.log(cusTime.value);
    if (timeLine.value === 30) {
      const timeLine = cusTime.value.map((x) => {
        const intervalTime = getHour(x.startTime, x.endTime);
        return halfHour(x.startTime.split(":")[0]).slice(0, intervalTime * 2);
      });
      console.log(timeLine);
      canbookTime.value = timeLine.flat();
      return timeLine.flat();
    } else if (timeLine.value === 60) {
      const timeLine = cusTime.value.map((x) => {
        const intervalTime = getHour(x.startTime, x.endTime);
        return oneHour(x.startTime.split(":")[0]).slice(0, intervalTime);
      });
      canbookTime.value = timeLine.flat();
      return timeLine.flat();
    }
  }
});
onMounted(() => {});
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
</style>