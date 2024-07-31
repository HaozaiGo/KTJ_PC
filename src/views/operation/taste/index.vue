<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col :xs="2" :sm="5">
        <el-dropdown
          size="default"
          split-button
          type="primary"
          style="margin-bottom: 15px"
        >
          追加口味/更多操作
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addTaste">添加口味</el-dropdown-item>
              <el-dropdown-item @click="deleteTaste">删除口味</el-dropdown-item>
              <el-dropdown-item @click="editTaste">修改口味</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          @close="handleClose"
        >
          <el-menu-item
            :index="String(index)"
            v-for="(item, index) in tasteData.leftData"
            :key="index"
          >
            <!-- <el-icon><document /></el-icon> -->
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="22" :sm="19">
        <div>
          <el-button @click="addTaste1" type="primary" style="margin-bottom: 20px">
            添加口味信息
          </el-button>

        
          <div>
            <el-tag
              v-for="(tag, index) in tasteData.rightData"
              :key="tag.name"
              closable
              :type="
                index % 4 === 0
                  ? 'success'
                  : index % 4 === 1
                  ? 'info'
                  : index % 4 === 2
                  ? 'danger'
                  : index % 4 === 3
                  ? 'warning'
                  : 'primary'
              "
              size="large"
              style="margin-right: 15px"
              @close="handleTagClose(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 一级口味 -->
    <el-dialog
      v-model="tasteData.dialogVisible"
      :title="tasteData.status === 'add' ? '添加口味' : '修改口味'"
      width="500"
    >
      <el-form
        :model="tasteData.form"
        label-width="auto"
        style="max-width: 600px"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-form-item label="口味名称" prop="name">
          <el-input v-model="tasteData.form.name"> </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tasteData.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 二级口味 -->
    <el-dialog
      v-model="tasteData.dialogVisible1"
      title="添加口味信息"
      width="500"
    >
      <el-form
        :model="tasteData.form1"
        label-width="auto"
        style="max-width: 600px"
        :rules="rules"
        ref="ruleFormRef1"
      >
        <el-form-item label="口味信息" prop="name">
          <el-input v-model="tasteData.form1.name"> </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tasteData.dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm1"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  addTasteApi,
  editTasteApi,
  getTasteList,
  deleteTasteApi,
  addTasteInfo,
  getTasteInfoList,
  deleteTasteInfo,
} from "@/api/project/operation/taste.js";
import { reactive, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "T-aste",
  isRouter: true,
});

const ruleFormRef = ref(null);
const ruleFormRef1 = ref(null);
const rules = {
  name: { required: true, message: "请输入口味名称", trigger: "blur" },
};
const tasteData = reactive({
  dialogVisible: false,
  dialogVisible1: false,
  status: "add",
  form: {
    name: "",
  },
  form1: {
    name: "",
    typeId: "",
  },
  leftData: [],
  rightData: [],
  selected: {}, //选中的
});

onMounted(async () => {
  await getList();
  getList1();
});
const handleSelect = (e) => {
  tasteData.selected = tasteData.leftData[e];
  getList1();
};
const handleClose = () => {};
const handleTagClose = async (e) => {
  console.log(e);
  const res = await deleteTasteInfo(e.tasteId);
  if (res.code === 0) {
    getList1();
  }
};

const addTaste = () => {
  tasteData.status = "add";
  tasteData.dialogVisible = true;
  tasteData.form.name = "";
};
const addTaste1 = () => {
  tasteData.dialogVisible1 = true;
  tasteData.form1.name = "";
};
const editTaste = () => {
  tasteData.status = "edit";
  tasteData.dialogVisible = true;
  tasteData.form.name = tasteData.selected.name;
};

const handleComfirm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (tasteData.status === "add") {
        const res = await addTasteApi(tasteData.form);
        if (res.code === 0) {
          tasteData.dialogVisible = false;
          getList();
        }
      } else {
        const res = await editTasteApi({
          typeId: tasteData.selected.typeId,
          name: tasteData.form.name,
        });
        if (res.code === 0) {
          tasteData.form.name = "";
          tasteData.dialogVisible = false;
          getList();
        }
      }
    }
  });
};
const handleComfirm1 = () => {
  if (!ruleFormRef1.value) return;
  ruleFormRef1.value.validate(async (valid) => {
    if (valid) {
        tasteData.form1.typeId = tasteData.selected.typeId;
        const res = await addTasteInfo(tasteData.form1);
        if (res.code === 0) {
          tasteData.dialogVisible1 = false;
          getList1();
        }
    }
  });
};
const getList = async () => {
  const res = await getTasteList();
  if (res.code === 0) {
    tasteData.leftData = res.rows;
    tasteData.selected = tasteData.leftData[0];
  }
};
const getList1 = async () => {
  const res = await getTasteInfoList({ typeId: tasteData.selected.typeId });
  if (res.code === 0) {
    tasteData.rightData = res.rows;
  }
};
const deleteTaste = () => {
  ElMessageBox.confirm("是否确定删除此口味？", "提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteTasteApi(tasteData.selected.typeId);
      getList();
    })
    .catch((e) => {
      console.log(e);
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>

<style lang="scss" scoped>
</style>