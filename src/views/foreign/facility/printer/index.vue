<template>
  <div class="printer-interface" :style="`height:${tableHeight - 240}px`">
    <!-- Printer Info -->
    <div
      class="printer-connected"
      v-for="(item, idx) in state.printerLists"
      :key="idx"
    >
      <img
        src="@/assets/img/merchant/printer.jpg"
        alt="Printer"
        class="printer-icon"
      />
      <div class="printer-details">
        <h3>{{ item.printerName }}</h3>
        <p>{{ item.printerType }}</p>
        <p>{{ item.remark }}</p>
        <p>IP: {{ item.printerIp }}</p>

        <div class="printer-actions">
          <el-button type="warning" plain @click="handleActionClick"
            >菜品配置</el-button
          >
          <el-button @click="handlePrintTest" plain>打印测试单</el-button>
        </div>
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
      title="新增打印机"
      width="700"
      align-center
    >
      <el-form :model="state.form" label-width="auto">
        <el-form-item label="打印机名称（别名)">
          <el-input v-model="state.form.printerName" style="width: 300px" />
        </el-form-item>
        <el-form-item label="打印机型号">
          <el-input v-model="state.form.printerType" style="width: 300px" />
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
} from "@/api/project/foreign/printer.js";
import { reactive, onMounted, ref, inject } from "vue";
import getLodop from "@/utils/LodopFuncs.js";
defineOptions({
  name: "Printer",
  isRouter: true,
});
const tree = ref(null);
const statusOption = ref([]);
const printWayOption = ref([]);
const state = reactive({
  dialogVisible: false,
  form: {},
  storeId: "",
  menuDatas: [],
  printerLists: [],
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
onMounted(() => {
  state.storeId = JSON.parse(localStorage.getItem("storeId")).storeId;
  inject("$com")
    .getStoreDict("bill_print_way,sys_yes_no")
    .then((res) => {
      printWayOption.value = res.data[0].list;
      statusOption.value = res.data[1].list;
    });

  getAllMenuList();
  getList();
});
const handleNext = () => {
  if (state.form.printWay === "ALL") {
    // 整单 直接新增
    const v = handleAddPrinter();
  } else {
    state.dialogVisible = false;
    settingPrinterMenu.dialogVisible = true;
  }
};
const settingPrinterMenu = reactive({
  dialogVisible: false,
});
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
const handleActionClick = () => {
  settingPrinterMenu.dialogVisible = true;
};
const handlePrintTest = () => {
  // 获取打印机list
    let LODOP = getLodop();
    console.log("11", LODOP);
    let count = LODOP.GET_PRINTER_COUNT();
    let arr = [];
    for (var i = 0; i < count; i++) {
      let obj = {};
      obj.value = LODOP.GET_PRINTER_NAME(i);
      obj.label = LODOP.GET_PRINTER_NAME(i);
      arr.push(obj);
    }
    console.log("打印机列表", arr);
    // this.PrintNamelist = arr;

    LODOPOBJ.value = LODOP;
  
};
const addPrinter = () => {
  state.form = new Printer({
    printerName: "",
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

  state.form.printerIp = `${state.form.ip1}.${state.form.ip2}.${state.form.ip3}.${state.form.ip4}`;

  const body = Object.assign({}, state.form, {
    storeId: state.storeId,
  });
  const res = await addPrinterApi(body);

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
  padding: 40px;
  height: fit-content !important;
  border-radius: 15px;
}

.printer-icon {
  width: 100px;
  height: auto;
}

.printer-details {
  margin-left: 40px;
}

.printer-actions {
  margin-top: 30px;
}

.printer-actions button {
  margin: 5px;
  padding: 8px 16px;
}
.add-printer {
  height: 252px;
  width: 434px;
  background-color: #ffffff;
  border-radius: 15px;
  cursor: pointer;
}
</style>