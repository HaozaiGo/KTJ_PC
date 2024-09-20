<template>
  <div class="content">
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
              :class="[getTableClass(item1.color)]"
            ></span>
            <span class="statusName"> {{ item1.name }}</span>
          </div>
        </div>
        <div class="tabSty flex-c" @click="linkToManagement">桌台管理</div>
      </div>
    </div>

    <div class="container" :style="`height:${tableHeight + 30}px`">
      <div class="grid">
        <div
          v-for="(table, index) in tableData.row"
          :key="index"
          :class="['table', getTableClass(table.state)]"
          @click="handleShowDeskStatus(table, index)"
        >
          <p style="font-size: 24px">{{ table.tableNo }}</p>
          <p v-if="table.choosedArrivePersonNum">
            <el-icon><Avatar /></el-icon>{{ table.choosedArrivePersonNum }}人
          </p>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="'桌台管理'"
      width="600"
      align-center
    >
      <el-form
        :model="formData.data"
        class="demo-form-inline"
        label-width="80px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="人数" prop="tableNo">
          <div class="flex-sr" style="flex-wrap: wrap; width: 100%">
            <div
              v-for="(item, idx) in arrivePerson"
              :key="idx"
              class="arriveBox"
              @click="chooseArrivePerson(item, idx)"
              :class="{ activeSty: choosedIdx === idx }"
            >
              <text
                style="font-size: 20px; font-weight: bold; color: #ffffff"
                :style="
                  idx === arrivePerson.length - 1
                    ? 'font-size:20px;line-height:35px'
                    : ''
                "
              >
                {{ item }}
              </text>
            </div>
            <input
              type="number"
              v-model="tableData.form.choosedArrivePersonNum"
              class="arriveBox"
              style="
                height: 58px;
                color: #000;
                font-size: 21px;
                color: #ffffff;
                font-weight: bold;
                border: none;
              "
              v-if="showInput"
              focus
            />
          </div>
        </el-form-item>
        <el-form-item label="桌台状态">
          <div
            v-for="(item1, idx1) in statusOptions"
            :key="idx1"
            class="flex-c"
            style="margin-right: 8px; cursor: pointer"
            @click="changeTableStatus(item1, idx1)"
            :style="idx1 === tableData.form.idx ? ' color:#5ea5dd' : ''"
          >
            <span
              class="statusTips"
              :class="[getTableClass(item1.color)]"
            ></span>
            <span class="statusName"> {{ item1.name }}</span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleComfirm()" type="primary">确定</el-button>
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject, onUnmounted } from "vue";
import { getLists, getTabLists } from "@/api/project/foreign/createDesk.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
defineOptions({
  name: "create-desk",
  isRouter: true,
});
const arrivePerson = ref([1, 2, 3, 4, 5, 6, 7, "更多"]);
const TabsList = ref([
  { name: "全部", val: 0 },
  { name: "大厅", val: 1 },
  { name: "外摆", val: 0 },
  { name: "房间", val: 0 },
]);
const TabIdx = ref(0);
const statusOptions = ref([
  { name: "待下单", color: "reserved" },
  { name: "空桌台", color: "available" },
  { name: "待结账", color: "waitPay" },
  { name: "已预订", color: "booking" },
  { name: "待清桌", color: "cleaning" },
]);
const tableHeight = inject("$com").tableHeight();
const query = reactive({
  storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
  pageNum: 1,
  pageSize: 999,
  typeId: "",
});

let formData = reactive({
  origin: inject("$com").baseUrl,
  data: {
    tableNo: "",
  },
});

const formRef = ref(null);
const dialogVisible = ref(false);
const choosedIdx = ref(null);
const showInput = ref(false); //人数自定义
const state = ref("add");
const tableData = reactive({
  row: [],
  total: 0,
  form: { choosedArrivePersonNum: null, idx: null, color: "", name: "" },
  choosedDesk: {},
});
const tabChange = (item, idx) => {
  TabIdx.value = idx;
  query.typeId = item.typeId;
  getList();
};

const getTableClass = (status) => {
  switch (status) {
    case "waitPay":
      return "waitPay"; // 红色
    case "reserved":
      return "reserved"; // 绿色
    case "cleaning":
      return "cleaning"; // 棕色
    case "booking":
      return "booking";
    default:
      return "available"; // 默认白色
  }
};
const handleShowDeskStatus = (item) => {
  dialogVisible.value = true;
  tableData.form = {
    choosedArrivePersonNum: null,
    idx: null,
    color: "",
    name: "",
  };
  choosedIdx.value = null;
  tableData.choosedDesk = item;
};
//选择人数
const chooseArrivePerson = (item, idx) => {
  choosedIdx.value = idx;
  if (item === "更多") {
    arrivePerson.value.pop();
    showInput.value = true;
  } else {
    tableData.form.choosedArrivePersonNum = item;
  }
};
const changeTableStatus = (item, idx) => {
  tableData.form.state = item.color;
  tableData.form.name = item.name;
  tableData.form.idx = idx;
};

const handleComfirm = () => {
  tableData.choosedDesk = Object.assign(
    {},
    tableData.choosedDesk,
    tableData.form
  );
  console.log(tableData.choosedDesk);

  if (tableData.choosedDesk.state) {
    const idx = tableData.row.findIndex(
      (x) => x.tableId === tableData.choosedDesk.tableId
    );
    tableData.row.splice(idx, 1, tableData.choosedDesk);
    dialogVisible.value = false;
  }
};
const linkToManagement = () => {
  router.push({ name: "desk-Management" });
};

const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.row = res.rows;
    //从缓存中取数据
    if (res.rows.length > 0 && localStorage.getItem("tableStore")) {
      tableData.row = JSON.parse(localStorage.getItem("tableStore"));
    }
    console.log(tableData.row);

    tableData.total = res.total;
  }
};

const getTabList = async () => {
  const res = await getTabLists({ storeId: query.storeId });
  if (res.code === 0) {
    TabsList.value = res.rows;
  }
};
onMounted(async () => {
  getTabList();
  getList();
});
onUnmounted(() => {
  //放入缓存
  localStorage.setItem("tableStore", JSON.stringify(tableData.row));
});
</script>

<style scoped>
.container {
  padding: 20px;
  overflow-y: scroll;
  margin-top: 20px;
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

.waitPay {
  background-color: #f65f30;
}

.reserved {
  background-color: #95af7d;
}
.booking {
  background-color: #b0a07e;
}

.cleaning {
  background-color: #b8e8f2;
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
</style>