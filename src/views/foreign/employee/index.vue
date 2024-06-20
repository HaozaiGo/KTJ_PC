<template>
  <div class="content">
    <div class="search">
      <el-select
        v-model="query.storeId"
        filterable
        placeholder="请选择分店"
        style="width: 200px"
        clearable
        @change="storeIdChange"
      >
        <el-option
          v-for="item in ShopOptions"
          :key="item.storeId"
          :label="item.name"
          :value="item.storeId"
        />
      </el-select>
      <el-input
        v-model="query.nickName"
        style="width: 200px"
        placeholder="姓名"
      />
      <el-input
        v-model="query.phonenumber"
        style="width: 200px"
        placeholder="手机号码"
      />
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
        :data="tableData"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="nickName" label="姓名" sortable />
        <el-table-column prop="phonenumber" label="手机号" sortable />
        <el-table-column prop="userName" label="账号" sortable />
        <el-table-column prop="sexLabel" label="性别" sortable />
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
              @click="editPassWord(scope.row)"
            >
              修改密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="state === 'add' ? '添加员工' : '编辑员工信息'"
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
        <el-form-item label="员工昵称" prop="nickName">
          <el-input
            v-model="formData.data.nickName"
            placeholder="输入员工昵称"
            clearable
          />
        </el-form-item>

        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="formData.data.phonenumber"
            placeholder="输入手机号码"
            clearable
          />
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="formData.data.userName"
            placeholder="系统生成"
            disabled
          />
        </el-form-item>
        <el-form-item label="员工密码" prop="password">
          <el-input
            type="password"
            v-model="formData.data.password"
            placeholder="输入用户密码"
            clearable
            show-password
          />
        </el-form-item>
        <el-form-item label="用户性别">
          <el-select
            v-model="formData.data.sex"
            placeholder="选择用户性别"
            clearable
          >
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
            <el-option label="未知" value="2" />
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

    <el-dialog
      v-model="dialogVisible1"
      title="修改密码"
      width="500"
      align-center
    >
      <el-form
        :inline="true"
        :model="formData.passwordForm"
        class="demo-form-inline"
        label-width="120px"
      >
        <el-form-item label="新密码" prop="nickName">
          <el-input
            v-model="formData.passwordForm.password1"
            placeholder="输入新密码"
            clearable
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认新密码">
          <el-input
            v-model="formData.passwordForm.password"
            placeholder="确认新密码"
            clearable
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleComfirmPassWord()" type="primary"
            >确定</el-button
          >
          <el-button @click="dialogVisible1 = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, toRefs } from "vue";

import {
  getLists,
  addEmployee,
  deleteEmployee,
  editEmployee,
  EmployeePassword,
  gerShopOption,
  setStatus
} from "@/api/project/foreign/employee.js";

import { getDeptList, getRoles } from "@/api/common/user.js";
import { ElMessageBox, ElMessage } from "element-plus";

defineOptions({
  name: "E-mployee",
  isRouter: true,
});
const multipleSelection = ref([]);
const ShopOptions = ref([]);
const dialogVisible1 = ref(false);
const query = reactive({
  nickName: "",
  phonenumber: "",
  storeId: "",
});
let formData = reactive({
  data: {
    nickName: "",
    storeId: "",
    phonenumber: "",
    password: "123456",
    sex: "",
  },
  passwordForm: {
    password: "",
    password1: "",
    staffId: "",
  },
});
const formRef = ref(null);
const rules = {
  nickName: [
    {
      required: true,
      message: "请输入用户昵称",
      trigger: "change",
    },
  ],
  phonenumber: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
};
const storeIdChange = (e) => {
  if (e) {
    query.storeId = e;
    formData.data.storeId = e;
  }
};
const dialogVisible = ref(false);
const state = ref("add");
const tableData = ref([]);
const add = () => {
  formData = reactive({
    data: Object.assign(
      { password: "123456", status: "1" },
      { storeId: query.storeId }
    ),
  });
  state.value = "add";
  dialogVisible.value = true;
};
const editPassWord = (row) => {
  dialogVisible1.value = true;
  formData.passwordForm.staffId = row.staffId;
};
const handleComfirmPassWord = async () => {
  if (formData.passwordForm.password != formData.passwordForm.password1) {
    return ElMessage("请检查两次密码是否一致!");
  } else if (
    formData.passwordForm.password == "" ||
    formData.passwordForm.password1 == ""
  ) {
    return ElMessage("请输入要修改的密码");
  } else {
    const res = await EmployeePassword(formData.passwordForm);
    if (res.code === 0) {
      formData.passwordForm.password = "";
      formData.passwordForm.password1 = "";
      dialogVisible1.value = false;
    }
  }
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
        const userIds = multipleSelection.value.map((x) => x.staffId);

        const res = await deleteEmployee({
          staffIds: userIds.toString(),
          storeId: query.storeId,
        });
        getList();
      } else {
        const res = await deleteEmployee(item.staffId);
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
const handleComfirm = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (state.value === "add") {
        await addEmployee(formData.data);
      } else {
        await editEmployee(formData.data);
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
    staffId: item.staffId,
  });
};

const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value = res.rows;
  }
};

const getShopOption = async () => {
  const res = await gerShopOption();
  if (res.code === 0) {
    ShopOptions.value = res.data;
    query.storeId = res.data[0].storeId;
    formData.data.storeId = res.data[0].storeId;
    getList();
  }
};
onMounted(async () => {
  getShopOption();
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