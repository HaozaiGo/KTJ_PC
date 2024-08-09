<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.facilityName"
        style="width: 200px"
        placeholder="设施名称"
      />
      <el-select
        v-model="query.status"
        filterable
        placeholder="状态"
        style="width: 200px"
        clearable
        @change="storeIdChange"
      >
        <el-option
          v-for="item in stateOptions"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        />
      </el-select>

      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-button type="primary" icon="Plus" round size="small" @click="add"
        >新增</el-button
      >
      <el-button
        type="success"
        icon="EditPen"
        round
        size="small"
        @click="
          edit(multipleSelection.length === 1 ? multipleSelection[0] : '')
        "
        :disabled="multipleSelection.length != 1"
        >修改</el-button
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
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="facilityName" label="设施名称" sortable />
        <el-table-column prop="icon" label="图标" sortable />
        <el-table-column prop="createBy" label="创建人" sortable />

        <el-table-column label="状态" width="180">
          <template #default="scope">
            <div>
              <el-switch
                v-model="scope.row.status"
                @change="switchChange(scope.row)"
                active-value="1"
                inactive-value="0"
              />
            </div>
          </template>
        </el-table-column>
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
      :title="state === 'add' ? '添加设施' : '编辑设施'"
      width="700"
      align-center
    >
      <el-form
        :inline="true"
        :model="formData.data"
        class="demo-form-inline"
        label-width="80px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="设施名称" prop="facilityName">
          <el-input
            v-model="formData.data.facilityName"
            placeholder="输入设施名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input
            v-model="formData.data.icon"
            placeholder="输入图标"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="formData.data.status"
            placeholder="选择设施状态"
            clearable
          >
            <el-option
              v-for="(item, index) in stateOptions"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
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
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, toRefs, inject } from "vue";

import {
  getLists,
  addFacility,
  deleteFacility,
  editFacility,
  setStatus,
} from "@/api/project/merchant/facility.js";
import { ElMessageBox, ElMessage } from "element-plus";

defineOptions({
  name: "F-acility",
  isRouter: true,
});
const multipleSelection = ref([]);
const stateOptions = ref([]);
const query = reactive({
  facilityName: "",
  status: "",
  pageNum: 1,
});
let formData = reactive({
  data: {
    facilityName: "",
    icon: "",
    status: "",
  },
});
const formRef = ref(null);
const rules = {
  facilityName: [
    {
      required: true,
      message: "请输入设施名称",
      trigger: "change",
    },
  ],
  icon: [
    {
      required: true,
      message: "请输入图标",
      trigger: "change",
    },
  ],
};
const storeIdChange = (e) => {
  if (e) {
    query.status = e;
  }
};
const dialogVisible = ref(false);
const state = ref("add");
const tableData = ref({
  row: [],
  total: 0,
});
const add = () => {
  formData = reactive({
    data: {
      status: "1",
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
        const facilityIds = multipleSelection.value.map((x) => x.facilityId);

        const res = await deleteFacility(facilityIds.toString());
        getList();
      } else {
        const res = await deleteFacility(item.facilityId);
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
};
const handleComfirm = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (state.value === "add") {
        await addFacility(formData.data);
      } else {
        await editFacility(formData.data);
      }
      getList();
      dialogVisible.value = false;
    }
  });
};
// 开关
const switchChange = async (item) => {
  await setStatus({
    status: item.status === "1" ? 1 : 0,
    facilityId: item.facilityId,
  });
};

const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
const getStateList = () => {
  inject("$com")
    .getDict("bill_status")
    .then((res) => {
      stateOptions.value = res.data[0].list;
    });
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
onMounted(async () => {
  getList();
  getStateList();
});
</script>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
</style>