<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.name"
        style="width: 200px"
        placeholder="分账方"
      />
      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-button type="primary" icon="Plus" round size="small" @click="add"
        >新增</el-button
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
        <el-table-column prop="storeId" label="商家ID" sortable />
        <el-table-column prop="orderTypeLabels" label="分账类型" sortable />
        <el-table-column prop="account" label="接收方账号" sortable />
        <el-table-column prop="name" label="分账接收方全称" sortable>
        </el-table-column>
        <el-table-column prop="rate" label="分账比例" sortable />
        <el-table-column
          prop="relationTypeLabel"
          label="与分账方的关系类型"
          sortable
        />
        <el-table-column prop="typeLabel" label="接收方类型" sortable />
        <el-table-column prop="createTime" label="创建时间" sortable />
        <el-table-column label="操作" width="220">
          <template #default="scope">
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
      title="添加分账比例"
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
        <el-form-item label="分账比例">
          <div class="flex">
            <el-select
              v-model="formData.data.orderTypes"
              placeholder="选择分账类型"
              style="width: 300px"
              multiple
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
            <el-input v-model="formData.data.rate" placeholder="输入分账比例" style="width:200px">
              <template #append>%</template>
            </el-input>
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
import { reactive, onMounted, ref, toRefs, inject } from "vue";
import {
  subAccountList,
  addAccountList,
  deleteAccount,
} from "@/api/project/merchant/manageMerchant.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "Sub-Account",
  isRouter: true,
});
const route = useRoute();
const multipleSelection = ref([]);
const tableHeight = inject("$com").tableHeight();
const query = reactive({
  name: "",
  pageNum: 1,
});
class Data {
  rate = "";
  storeId = "";
  orderTypes = "";
}
let formData = reactive({
  data: new Data(),
});
const formRef = ref(null);
const rules = {
  rate: [
    {
      required: true,
      message: "请输入分账比例",
      trigger: "change",
    },
  ],
};
const dialogVisible = ref(false);
const tableData = ref({
  row: [],
  total: 0,
});
const options = ref([]); //分账类型
const storeId = ref("");
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
const add = () => {
  formData = reactive({ data: new Data() });
  formData.data.storeId = storeId.value;
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
      const res = await deleteAccount(item.receiverId);
      if (res.code === 0) {
        getList();
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
      formData.data.rate = formData.data.rate / 100;
      formData.data.orderTypes = formData.data.orderTypes.join(",");
      await addAccountList(formData.data);
      getList();
      dialogVisible.value = false;
    } else {
      ElMessage({
        type: "error",
        message: "新增失败！",
      });
      return false;
    }
  });
};

const getList = async () => {
  const body = Object.assign(query, { storeId: storeId.value });
  const res = await subAccountList(body);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};

onMounted(async () => {
  storeId.value = route.query.storeId;
  getList();
  inject("$com")
    .getDict("bill_order_type")
    .then((res) => {
      options.value = res.data[0].list;
    });
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