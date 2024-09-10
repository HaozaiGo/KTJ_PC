<template>
  <div class="printer-interface" :style="`height:${tableHeight - 240}px`">
    <!-- Printer Info -->
    <div
      class="printer-connected"
      v-for="(item, idx) in state.printerLists"
      :key="idx"
      @click="handlePrinterClick(item, idx)"
      :class="{ active: state.printerIdx === idx }"
    >
      <el-icon
        style="position: absolute; right: 60px; top: 20px; cursor: pointer"
        size="20"
        v-if="state.printerIdx === idx"
        @click="handleEditPrinter(item, idx)"
        ><EditPen
      /></el-icon>
      <el-icon
        style="position: absolute; right: 20px; top: 20px; cursor: pointer"
        size="20"
        v-if="state.printerIdx === idx"
        @click="handleDeletePrinter(item, idx)"
        ><Delete
      /></el-icon>
      <img
        src="@/assets/img/merchant/printer.jpg"
        alt="Printer"
        class="printer-icon"
      />
      <div class="printer-details">
        <h3>{{ item.printerName }}</h3>
        <p>{{ item.printerModel }}</p>
        <p>{{ item.printerTypeLabel }}</p>
        <p>IP: {{ item.printerIp }}</p>
        <p>{{ item.remark }}</p>
      </div>
      <div class="printer-actions">
        <el-button type="warning" plain @click="handleActionClick(item)"
          >菜品配置</el-button
        >
        <el-button @click="handlePrintTest(item)" plain>打印测试单</el-button>
      </div>
    </div>

    <!-- Add Printer -->
    <div class="add-printer flex-c" @click="addPrinter">
      <div>
        <img
          src="@/assets/img/merchant/printerIcon.png"
          alt=""
          style="width: 100px; height: 92px; display: block"
        />

        <h4 style="margin-top: 10px; text-align: center; color: #e0a66c">
          添加打印机
        </h4>
      </div>
    </div>

    <el-dialog
      v-model="state.dialogVisible"
      :title="state.status === 'add' ? '新增打印机' : '编辑打印机'"
      width="700"
      align-center
    >
      <el-form :model="state.form" label-width="auto">
        <el-form-item label="打印机名称（别名)">
          <el-input v-model="state.form.printerName" style="width: 300px" />
        </el-form-item>
        <el-form-item label="打印机型号">
          <el-select
            v-model="state.form.printerModel"
            placeholder="打印机型号"
            style="width: 300px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="打印机类型">
          <el-radio-group v-model="state.form.printerType">
            <el-radio
              :value="item.dictValue"
              v-for="(item, idx) in printerTypeOption"
              :key="idx"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打印方式">
          <el-radio-group v-model="state.form.printWay">
            <el-radio
              :value="item.dictValue"
              v-for="(item, idx) in printWayOption"
              :key="idx"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="state.form.ip1" style="width: 100px">
            <template #append>.</template>
          </el-input>
          <el-input v-model="state.form.ip2" style="width: 100px">
            <template #append>.</template>
          </el-input>
          <el-input v-model="state.form.ip3" style="width: 100px">
            <template #append>.</template>
          </el-input>
          <el-input v-model="state.form.ip4" style="width: 70px"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.form.remark" style="width: 500px" />
        </el-form-item>
        <el-form-item label="是否启动">
          <el-radio-group v-model="state.form.status">
            <el-radio
              :value="item.dictValue"
              v-for="(item, idx) in statusOption"
              :key="idx"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleNext"> 下一步 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 配置菜品对应打印机 -->
    <el-dialog
      v-model="settingPrinterMenu.dialogVisible"
      title="菜品配置"
      width="700"
      align-center
    >
      <el-tree
        style="max-width: 600px"
        :data="state.menuDatas"
        :props="defaultProps"
        show-checkbox
        @check-change="handleCheckChange"
        ref="tree"
        node-key="menuId"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="
              settingPrinterMenu.dialogVisible = false;
              state.dialogVisible = true;
            "
            v-if="!settingPrinterMenu.setting"
            >上一步</el-button
          >
          <el-button type="primary" @click="handleAddPrinter"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {
  addPrinterApi,
  getStoreAllMenuLists,
  getLists,
  deletePrinterApi,
  editPrinterApi,
} from "@/api/project/foreign/printer.js";
import { reactive, onMounted, ref, inject } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import getLodop from "@/utils/LodopFuncs.js";
defineOptions({
  name: "Printer",
  isRouter: true,
});
const tree = ref(null);
const statusOption = ref([]);
const printWayOption = ref([]);
const options = ref([]); //打印机型号
const printerTypeOption = ref([]);
const state = reactive({
  status: "add",
  dialogVisible: false,
  form: {},
  storeId: "",
  menuDatas: [],
  printerLists: [],
  printerIdx: null,
  // menuChoosedList: [],
});
const defaultProps = {
  children: "menuList",
  label: "name",
};
class Printer {
  constructor(data) {
    this.data = data;
  }
}
const settingPrinterMenu = reactive({
  setting: false,
  dialogVisible: false,
  choosedItem: {},
});
onMounted(() => {
  state.storeId = JSON.parse(localStorage.getItem("storeId")).storeId;
  inject("$com")
    .getStoreDict("bill_print_way,sys_yes_no,bill_printer_type")
    .then((res) => {
      printWayOption.value = res.data[0].list;
      statusOption.value = res.data[1].list;
      printerTypeOption.value = res.data[2].list;
    });

  getAllMenuList();
  getList();
  setTimeout(() => {
    var agent = navigator.userAgent.toLowerCase();
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
      console.log("这是windows32位系统");
      getPrinterOption();
    }
    if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
      console.log("这是windows64位系统");
      getPrinterOption();
    }
    if (isMac) {
      console.log("这是mac系统");
    }
  }, 1000);
});
const handlePrinterClick = (item, idx) => {
  state.printerIdx = idx;
};
const getPrinterOption = () => {
  let LODOP = getLodop();

  let count = LODOP.GET_PRINTER_COUNT();
  let arr = [];
  for (var i = 0; i < count; i++) {
    let obj = {};
    obj.value = LODOP.GET_PRINTER_NAME(i);
    obj.label = LODOP.GET_PRINTER_NAME(i);
    arr.push(obj);
  }

  options.value = arr;
  console.log("打印机列表", arr);
};
const handleEditPrinter = (item, idx) => {
  state.status = "edit";

  state.form = { ...item };
  state.form.ip1 = item.printerIp.split(".")[0];
  state.form.ip2 = item.printerIp.split(".")[1];
  state.form.ip3 = item.printerIp.split(".")[2];
  state.form.ip4 = item.printerIp.split(".")[3];
  state.dialogVisible = true;
};

const handleDeletePrinter = (item, idx) => {
  ElMessageBox.confirm("确定删除该打印机配置?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deletePrinterApi(item.printerId);
      if (res.code === 0) {
        getList();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const handleNext = () => {
  if (state.form.printWay === "ALL") {
    // 整单 直接新增
    const v = handleAddPrinter();
  } else {
    state.dialogVisible = false;
    settingPrinterMenu.dialogVisible = true;
  }
};

const tableHeight = inject("$com").tableHeight();

const handleCheckChange = (node, arr, choosed) => {
  const keys = tree.value.getCheckedKeys();
  state.form.menuList = keys.filter((item) => !!item);
  state.form.menuList = state.form.menuList.map((item) => {
    return { menuId: item };
  });
  console.log(state.form.menuList);
};
const getAllMenuList = async () => {
  const res = await getStoreAllMenuLists({
    storeId: state.storeId,
  });

  if (res.code === 0) {
    state.menuDatas = res.data;
  }
};
const handleActionClick = (item) => {
  // 菜品配置
  settingPrinterMenu.choosedItem = item;
  settingPrinterMenu.setting = true;
  settingPrinterMenu.dialogVisible = true;
  state.status = "edit";
};
const handlePrintTest = (item) => {
  console.log(item);

  // 获取打印机list
  LODOP.PRINT_INIT(`测试打单${item.printerModel}`);

  const res = options.value.find((x) => x.label === item.printerModel);
  console.log(res);

  if (res) {
    LODOP.SET_PRINTER_INDEXA(item.printerModel);
    LODOP.ADD_PRINT_TEXT(10, 10, "80mm", "30mm", `测试打印机${res.value}`);
    LODOP.PRINT();
  }
};
const addPrinter = () => {
  state.status = "add";
  state.form = new Printer({
    printerName: "",
    printerModel: "",
    printerType: "",
    printWay: "",
    ip1: "192",
    ip2: "168",
    ip3: "1",
    ip4: "",
    printerIp: "",
    remark: "",
    status: "",
    menuList: [],
  });
  state.dialogVisible = true;
};
const handleAddPrinter = async () => {
  console.log(state.form);
  // 菜品配置
  if (settingPrinterMenu.setting) {
    for (let i in settingPrinterMenu.choosedItem) {
      if (i != "menuList") {
        state.form[i] = settingPrinterMenu.choosedItem[i];
      }
    }
    state.form.ip1 = settingPrinterMenu.choosedItem.printerIp.split(".")[0];
    state.form.ip2 = settingPrinterMenu.choosedItem.printerIp.split(".")[1];
    state.form.ip3 = settingPrinterMenu.choosedItem.printerIp.split(".")[2];
    state.form.ip4 = settingPrinterMenu.choosedItem.printerIp.split(".")[3];
  }

  state.form.printerIp = `${state.form.ip1}.${state.form.ip2}.${state.form.ip3}.${state.form.ip4}`;
  const body = Object.assign({}, state.form, {
    storeId: state.storeId,
  });
  var res;
  if (state.status == "add") {
    res = await addPrinterApi(body);
  } else {
    res = await editPrinterApi(body);
  }
  if (res.code === 0) {
    state.dialogVisible = false;
    settingPrinterMenu.dialogVisible = false;
    getList();
  }
};

const getList = async () => {
  const res = await getLists({ storeId: state.storeId });
  if (res.code === 0) {
    state.printerLists = res.rows;
  }
};
</script>

<style scoped lang="scss">
.active {
  border: 1px solid #e0a66c !important;
}
.printer-interface {
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;

  padding: 20px;
  > div {
    margin: 20px;
  }
}

.printer-connected {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  cursor: pointer;
  border: 1px solid #ffffff;
  padding: 40px 60px;
  height: fit-content !important;
  border-radius: 15px;
  min-height: 254px;
}

.printer-icon {
  width: 100px;
  height: auto;
}

.printer-details {
  margin-left: 40px;
}

.printer-actions {
  position: absolute;
  right: 18px;
  bottom: 20px;
}

.printer-actions button {
  margin: 5px;
  padding: 8px 16px;
}
.add-printer {
  height: 254px;
  width: 370px;
  background-color: #ffffff;
  border-radius: 15px;
  cursor: pointer;
}
</style>