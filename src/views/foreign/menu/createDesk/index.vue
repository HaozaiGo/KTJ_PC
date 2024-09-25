<template>
  <div>
    <div class="content rel">
      <div class="tabs flex-sb">
        <div class="left flex">
          <div
            v-for="(item, idx) in TabsList"
            :key="idx"
            class="tabSty flex-c"
            @click="tabChange(item, idx)"
            :class="{ tabActiveSty: idx === TabIdx }"
          >
            {{ item.typeName }}
          </div>
        </div>
        <div class="right flex-c">
          <div class="flex-c">
            <div
              v-for="(item1, idx1) in statusOptions"
              :key="idx1"
              class="flex-c"
              style="margin-right: 8px"
            >
              <span
                class="statusTips"
                :class="[getTableClass(item1.dictValue)]"
              ></span>
              <span class="statusName"> {{ item1.dictLabel }}</span>
            </div>
          </div>
          <div class="tabSty flex-c" @click="linkToManagement">桌台管理</div>
        </div>
      </div>

      <div class="container" :style="`height:${tableHeight + 110}px`">
        <div class="grid">
          <div
            v-for="(table, index) in tableData.row"
            :key="index"
            :class="['table', getTableClass(table.realStatus)]"
            @click="handleShowDeskStatus(table, index)"
          >
            <p style="font-size: 24px">{{ table.tableNo }}</p>
            <p v-if="table.peopleQty">
              <el-icon><Avatar /></el-icon>{{ table.peopleQty }}人
            </p>
          </div>
        </div>

        <clickInSize
          v-model="showInSize"
          :deskItem="tableData.choosedDesk"
          :canClearDesk="canClearDesk"
        ></clickInSize>
      </div>
    </div>

    <!-- 人数选择器 -->
    <div class="whiteBg" v-if="peopleSelect">
      <div class="peopleContainer center">
        <el-icon
          size="30"
          color="#000"
          style="position: absolute; left: 20px; top: 20px; cursor: pointer"
          @click="peopleSelect = false"
        >
          <Close />
        </el-icon>
        <h2>就餐人数</h2>
        <div class="input-box">{{ diners }}</div>
        <div class="keypad">
          <button
            v-for="number in arrivePerson"
            :key="number"
            @click="addNumber(number)"
          >
            {{ number }}
          </button>
        </div>
        <button class="clear-btn" @click="addNumber(0)">0</button>
        <button class="start-btn" @click="handleConfirmPeople">开台</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject, onUnmounted } from "vue";
import {
  getLists,
  getTabLists,
  changeTableStatusToWait,
} from "@/api/project/foreign/createDesk.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import clickInSize from "./clickInSize.vue";
const router = useRouter();
defineOptions({
  name: "create-desk",
  isRouter: true,
});
const canClearDesk = ref(false);
const showInSize = ref(false); // 点击后显示的组件
const peopleSelect = ref(false);
const arrivePerson = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const TabsList = ref([]);
const TabIdx = ref(0);
const statusOptions = ref([]);
const tableHeight = inject("$com").tableHeight();
const ws = ref(null);
const wsClose = ref(false);
const url = ref(null);
const query = reactive({
  storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
  pageNum: 1,
  pageSize: 999,
  typeId: "",
});
const diners = ref("");
const tableData = reactive({
  row: [],
  total: 0,
  form: { peopleQty: null, idx: null, color: "", name: "" },
  choosedDesk: {},
});
const tabChange = (item, idx) => {
  TabIdx.value = idx;
  query.typeId = item.typeId;
  getList();
};

const getTableClass = (status) => {
  switch (status) {
    case "WAIT_SETTLE":
      return "waitSettle"; // 红色
    case "WAIT_UNDER":
      return "waitUnder"; // 绿色
    case "WAIT_CLEAN":
      return "waitClean"; // 蓝色清台
    case "PRE_SETTLE":
      return "preSettle"; // 浅黄色
    case "BOOK":
      return "booking";
    default:
      return "available"; // 默认白色
  }
};
const addNumber = (item) => {
  diners.value += item;
};
const handleShowDeskStatus = (item) => {
  console.log(item);
  canClearDesk.value = false;
  tableData.choosedDesk = item;

  // 选择人数
  if (item.realStatus === "FREE_TIME") {
    peopleSelect.value = true;
    diners.value = "";
  } else if (item.realStatus === "WAIT_UNDER") {
    showInSize.value = true;
    canClearDesk.value = true;
  } else if (item.realStatus === "WAIT_SETTLE") {
    showInSize.value = true;
  } else if (item.realStatus === "PRE_SETTLE") {
    showInSize.value = true;
    canClearDesk.value = true;
  } else if (item.realStatus === "WAIT_CLEAN") {
    showInSize.value = true;
    canClearDesk.value = true;
  }
};

const handleConfirmPeople = async () => {
  if (diners.value === "") {
    return ElMessage.error("请选择就餐人数");
  }
  peopleSelect.value = false;
  //  修改桌台状态--变为待下单
  const res = await changeTableStatusToWait({
    isInitTime: 1,
    peopleQty: diners.value,
    storeId: tableData.choosedDesk.storeId,
    tableNo: tableData.choosedDesk.tableNo,
  });
  // getList();

  router.push({
    name: "Add-menus",
    query: {
      peopleQty: diners.value,
      storeId: tableData.choosedDesk.storeId,
      tableNo: tableData.choosedDesk.tableNo,
    },
  });
};

const linkToManagement = () => {
  router.push({ name: "desk-Management" });
};

const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.row = res.rows;
    tableData.total = res.total;
  }
};

const openSocket = () => {
  ws.value = new WebSocket(
    `${url.value}/store/api/ws/table/handle/monitor/${query.storeId}`
  );
  ws.value.onmessage = function (event) {
    try {
      const data = JSON.parse(event.data);
      console.log(data);

      tableData.row = data;
    } catch (err) {
      console.log(err);
      getList();
    }
  };
  // 重连
  ws.value.onclose = function (event) {
    if (!wsClose.value) {
      console.log("重连台号List");
      openSocket();
    } else {
      console.log("正常关闭");
    }
  };
  ws.value.onerror = function (event) {
    console.log("error");
    openSocket();
  };
};

const getTabList = async () => {
  const res = await getTabLists({ storeId: query.storeId });
  if (res.code === 0) {
    TabsList.value = res.rows;
    TabsList.value.unshift({ typeName: "全部", typeId: "" });
  }
};

onMounted(async () => {
  getTabList();
  url.value = inject("$com").socketUrl;
  inject("$com")
    .getStoreDict("bill_table_real_status")
    .then((res) => {
      statusOptions.value = res.data[0].list;

      openSocket();
    });
});
onUnmounted(() => {
  wsClose.value = true;
  ws.value.close();
});
</script>

<style scoped>
.container {
  padding: 20px;
  overflow-y: scroll;
  margin-top: 20px;
  position: relative;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  min-width: 150px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}

.available {
  background-color: white;
}

.waitSettle {
  background-color: #f65f30;
}

.waitUnder {
  background-color: #95af7d;
}
.booking {
  background-color: #b0a07e;
}

.waitClean {
  background-color: #b8e8f2;
}
.preSettle {
  background-color: #dbd48a;
}
.tabSty {
  width: 7vw;
  margin: 0 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 40px;
  color: #ffffff;
  background-color: #a2a19c;
  cursor: pointer;
}
.statusTips {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.arriveBox {
  padding: 10px 0;
  border: 1px solid #a18d6c;
  background-color: #a18d6c;
  width: calc((100% / 4) - 40px);
  border-radius: 16px;
  text-align: center;
  margin: 10px;
  cursor: pointer;
}
.activeSty {
  background-color: #8b6244 !important;
  border: 1px solid #ffffff !important;
  color: #000 !important;
}
.tabActiveSty {
  color: #ffffff !important;
  font-size: 18px;
  font-weight: bold;
  background-color: #53482e !important;
}

.peopleContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #bda472;
  padding: 20px 20px 40px 20px;
  border-radius: 15px;
  width: 350px;
  overflow: hidden;
}
.input-box {
  border: 2px solid #000;
  padding: 7px;
  width: 100%;
  text-align: center;
  margin-top: 10px;
  font-size: 20px;
  border-radius: 8px;
  height: 52px;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 0px;
}

button {
  background-color: #bda472;
  border: none;
  padding: 35px;
  font-size: 23px;
  cursor: pointer;
}

button:active {
  background-color: #b08060;
}

.clear-btn {
  color: #000;
  width: 82px;
}

.start-btn {
  background-color: #fff;
  padding: 10px 20px;
  font-size: 18px;
  position: absolute;
  bottom: 0;
  width: 350px;
}
</style>