<template>
  <div class="content">
    <div class="search">
      <el-select
        v-model="query.storeId"
        placeholder="选择店铺"
        style="width: 220px; margin-right: 20px"
      >
        <el-option
          v-for="item in StoreOptions"
          :key="item.storeId"
          :label="item.name"
          :value="item.storeId"
        />
      </el-select>

      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-button type="primary" icon="Plus" round size="small" @click="add"
        >新增</el-button
      >
      <el-button
        type="primary"
        icon="Plus"
        round
        size="small"
        @click="handleManageDesk"
        >管理桌台类型</el-button
      >
      <el-button
        type="danger"
        icon="Delete"
        round
        size="small"
        :disabled="multipleSelection.length === 0"
        @click="deleteUser"
        >删除</el-button
      >
      <el-table
        :data="tableData.row"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
        :max-height="tableHeight"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="tableNo" label="桌号" sortable />
        <el-table-column prop="typeName" label="桌台类型" sortable />

        <el-table-column prop="createBy" label="创建人" sortable />

        <el-table-column prop="createTime" label="创建时间" sortable />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="edit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteUser(scope.row)"
              >删除</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="showScanCode(scope.row)"
            >
              生成二维码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="tableData.total"
        style="float: right"
        @current-change="changePageSize"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="state === 'add' ? '添加桌号' : '编辑桌号'"
      width="700"
      align-center
    >
      <el-form
        :model="formData.data"
        class="demo-form-inline"
        label-width="80px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="桌号名称" prop="tableNo">
          <el-input
            v-model="formData.data.tableNo"
            placeholder="输入桌号名称"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="桌号类型">
          <el-select v-model="formData.data.typeId" style="width: 300px">
            <el-option
              v-for="(item, index) in typeIdList"
              :key="index"
              :label="item.typeName"
              :value="item.typeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleComfirm()" type="primary">确定</el-button>
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 管理台类型 -->
    <el-dialog
      v-model="manageDesk.dialogVisible"
      title="桌台类型"
      width="600"
      align-center
    >
      <el-tabs
        v-model="manageDesk.editableTabsValue"
        type="card"
        editable
        class="demo-tabs"
        @edit="handleTabsEdit"
      >
        <el-tab-pane
          v-for="(item, index) in manageDesk.editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          名称:<el-input
            v-model="item.tabName"
            placeholder="请输入桌台类型"
            @change="handleTabsEditName(item, index)"
            style="width: 200px"
          ></el-input>
          <el-button style="margin-left: 10px" @click="handleAdd(item, index)"
            >新增</el-button
          >
          <el-button @click="handleEdit(item, index)">修改</el-button>
          <el-button @click="handleDel(item, index)">删除</el-button>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="manageDesk.dialogVisible = false">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 二维码 -->
    <el-dialog v-model="ScanCode.dialogVisible" title="桌台二维码" width="500">
      <div style="width: 100%; text-align: center">
        <div style="font-size: 20px">{{ ScanCode.tableNo }}</div>
        <el-image
          :src="`${origin}/store/api/store/table/qrcode/mini?tableId=${ScanCode.tableId}`"
          style="width: 280px; height: 280px"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ScanCode.dialogVisible = false">取消</el-button>
          <a
            :href="`${origin}/store/api/store/table/qrcode/mini?tableId=${ScanCode.tableId}`"
            download="桌台二维码.png"
            target="_blank"
            style="
              color: #409eff;
              font-size: 12px;
              margin-left: 13px;
              padding: 8px 15px;
              border: 1px solid #ccc;
              border-radius: 5px;
            "
            >下载</a
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, toRefs, inject } from "vue";
import {
  getLists,
  getStoreListsApi,
  addDesk,
  editDesk,
  deleteDesk,
  getTabLists,
  addTab,
  deleteTab,
  editTab,
} from "@/api/project/foreign/createDesk.js";
import { ElMessageBox, ElMessage } from "element-plus";
defineOptions({
  name: "desk-Management",
  isRouter: true,
});
const tableHeight = inject("$com").tableHeight();
const multipleSelection = ref([]);
const StoreOptions = ref([]);
const typeIdList = ref([]);
const origin = inject("$com").baseUrl;
const manageDesk = reactive({
  dialogVisible: false,
  editableTabsValue: 0,
  originTabs: [], //原始数据
  editableTabs: [
    {
      title: "新桌台类型",
      name: null,
      tabName: "",
    },
  ],
});
const query = reactive({
  storeId: "",
  pageNum: 1,
});
let formData = reactive({
  data: {
    tableNo: "",
    typeId: "",
  },
});
const ScanCode = reactive({
  dialogVisible: false,
  tableId: "",
  tableNo: "",
});
const formRef = ref(null);
const rules = {
  tableNo: [
    {
      required: true,
      message: "请输入桌号名称",
      trigger: "change",
    },
  ],
};

const dialogVisible = ref(false);
const state = ref("add");
const tableData = ref({
  row: [],
  total: 0,
});
const showScanCode = (row) => {
  ScanCode.dialogVisible = true;
  ScanCode.tableId = row.tableId;
  ScanCode.tableNo = row.tableNo;
};
const add = () => {
  formData = reactive({
    data: {
      status: "1",
      typeId: typeIdList.value.length > 0 ? typeIdList.value[0].typeId : "",
    },
  });
  state.value = "add";
  dialogVisible.value = true;
};
// 编辑
const edit = (item) => {
  formData.data = { ...item };
  state.value = "edit";
  dialogVisible.value = true;
};
// 删除
const deleteUser = async (item) => {
  ElMessageBox.confirm("确定删除所选数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      if (multipleSelection.value.length >= 1) {
        const tableIds = multipleSelection.value.map((x) => x.tableId);

        const res = await deleteDesk({
          tableIds: tableIds.toString(),
          storeId: query.storeId,
        });
        getList();
      } else {
        const res = await deleteDesk({
          tableIds: item.tableId,
          storeId: query.storeId,
        });
        if (res.code === 0) {
          getList();
        }
      }
    })
    .catch((action) => {
      console.log(action);
    });
};
//checkbox
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
};
const getStoreList = async () => {
  const res = await getStoreListsApi();
  if (res.code === 0) {
    StoreOptions.value = res.rows;
    query.storeId = res.rows[0].storeId;
    getList();
  }
};
const handleComfirm = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (state.value === "add") {
        const body = Object.assign({ storeId: query.storeId }, formData.data);
        await addDesk(body);
      } else {
        const body = Object.assign({ storeId: query.storeId }, formData.data);

        await editDesk(body);
      }
      getList();
      dialogVisible.value = false;
    }
  });
};

const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};

const handleManageDesk = () => {
  manageDesk.dialogVisible = true;

  // 获取tablist
  getTabList();
};
const getTabList = async () => {
  const res = await getTabLists({ storeId: query.storeId });
  if (res.code === 0) {
    const resArr = res.rows.map((item, index) => {
      item.title = item.typeName;
    });
    console.log(resArr);

    manageDesk.originTabs = res.rows;
    manageDesk.editableTabs = manageDesk.originTabs.slice(0);
  }
};

const handleAdd = async (item, index) => {
  const res = await addTab({
    storeId: query.storeId,
    typeName: item.tabName,
  });
  if (res.code === 0) {
    getTabList();
  }
};
const handleEdit = async (item, index) => {
  console.log(item);

  const res = await editTab({
    storeId: item.storeId,
    typeId: item.typeId,
    typeName: item.tabName,
  });
  if (res.code === 0) {
    getTabList();
  }
};
const handleDel = (item, index) => {
  console.log(item);
  ElMessageBox.confirm("确定删除所选台号类型?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteTab(item.typeId);
      getTabList();
    })
    .catch((action) => {
      console.log(action);
    });
};

const handleTabsEdit = async (e) => {
  if (e) {
    // 删除
  } else {
    const newTabName = `${++manageDesk.originTabs.length}`;
    manageDesk.editableTabs.push({
      title: "新桌台类型",
      name: newTabName,
      tabName: "",
    });
    console.log(manageDesk.editableTabs);

    manageDesk.editableTabsValue = newTabName;
  }
};
const getTabListFirst = async () => {
  const res = await getTabLists({ storeId: query.storeId });
  if (res.code === 0) {
    typeIdList.value = res.rows;
  }
};

const handleTabsEditName = (item, idx) => {};
onMounted(async () => {
  await getStoreList();
  getTabListFirst();
});
</script>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>