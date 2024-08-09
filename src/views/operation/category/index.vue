<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.name"
        style="width: 200px"
        placeholder="类目名称"
      />
      <el-button type="primary" icon="Search" @click="getList()"
        >搜索</el-button
      >
    </div>
    <div>
      <el-button type="primary" icon="Plus" round size="small" @click="add"
        >新增</el-button
      >
      <el-table
        :data="list"
        style="width: 100%; margin: 20px 0"
        row-key="typeId"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        :max-height="tableHeight"
      >
        <el-table-column prop="name" label="类目名称" sortable />
        <el-table-column prop="sort" label="排序" sortable />
        <el-table-column prop="statusLabel" label="状态" sortable />
        <el-table-column prop="createTime" label="创建时间" sortable />

        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleAdd(scope.row)"
              >新增</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="添加菜单"
      width="620"
      align-center
    >
      <el-form
        :model="formData.data"
        class="demo-form-inline"
        label-width="80px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="上级类目" prop="parentId">
          <el-tree-select
            v-model="formData.data.parentId"
            :data="typeList"
            :render-after-expand="false"
            style="width: 280px"
            node-key="id"
            :props="{ children: 'children', label: 'label' }"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="类目名称" prop="name">
          <el-input
            v-model="formData.data.name"
            placeholder="输入类目名称"
            clearable
            style="width: 280px"
        /></el-form-item>

        <el-form-item label="显示排序" prop="sort">
          <el-input-number
            v-model="formData.data.sort"
            :min="1"
            :max="100"
            @change="handleChange"
            style="width: 168px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.data.status">
            <el-radio
              :value="item.dictValue"
              v-for="(item, index) in menuDeptList"
              :key="index"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group></el-form-item
        >
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
import { reactive, onMounted, ref, inject } from "vue";
import {
  getCategoryList,
  getSelectTree,
  addtype,
  deleteType,
  editType,
} from "@/api/project/merchant/category.js";
import { ElMessageBox } from "element-plus";
defineOptions({
  name: "C-ategory",
  isRouter: true,
});
const rules = {
  parentId: [
    {
      required: true,
      message: "请选择上级类目",
      trigger: "change",
    },
  ],
  name: [
    {
      required: true,
      message: "请输入类目名称",
      trigger: "change",
    },
  ],
  sort: [
    {
      required: true,
      message: "请选择显示顺序",
      trigger: "change",
    },
  ],
};
const tableHeight = inject("$com").tableHeight();
const menuDeptList = ref([]);
const query = reactive({
  name: "",
});
const state = ref("add");
const dialogVisible = ref(false);
class formDatas {
  parentId = "";
  name = "";
  sort = 1;
  status = "1";
}
const formData = reactive({
  data: new formDatas(),
});
const list = ref([]);
const typeList = ref([]);
const getList = async () => {
  const res = await getCategoryList(query);
  if (res.code === 0) {
    list.value = res.data;
  }
};
const getSelectTreeList = async () => {
  const res = await getSelectTree();
  if (res.code === 0) {
    typeList.value = [{ id: 0, children: res.data, label: "主类目" }];
  }
};
const handleDelete = async (row) => {
  ElMessageBox.confirm("确定删除所选数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteType(row.typeId);
      getList();
    })
    .catch((action) => {
    });
};
const handleComfirm = async () => {
  if (state.value === "add") {
    await addtype(formData.data);
    getSelectTreeList();
  } else {
    await editType(formData.data);
  }
  dialogVisible.value = false;
  getList();
};
const handleAdd = (row) => {
  formData.data = { ...row };
  dialogVisible.value = true;
};
const add = () => {
  state.value = "add";
  formData.data = new formDatas();
  dialogVisible.value = true;
};
const handleEdit = (row) => {
  formData.data = { ...row };
  dialogVisible.value = true;
  state.value = "edit";
};
onMounted(() => {
  getList();
  getSelectTreeList();
  inject("$com")
    .getDict("sys_normal_disable")
    .then((res) => {
      menuDeptList.value = res.data[0].list;
    });
});
</script>

<style lang="scss" scoped>
</style>