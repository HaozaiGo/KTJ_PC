<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.nickName"
        style="width: 200px"
        placeholder="用户昵称"
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
        :max-height="tableHeight"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="userName" label="账号" sortable />
        <el-table-column prop="nickName" label="用户昵称" sortable />
        <el-table-column prop="deptName" label="部门" sortable />
        <el-table-column prop="roleNames" label="角色" sortable />
        <el-table-column prop="phonenumber" label="手机号" sortable />
        <el-table-column prop="email" label="邮箱" sortable />
        <el-table-column prop="createTime" label="创建时间" sortable />
        <el-table-column prop="isPlanManLabel" label="是否推荐人" sortable />

        <el-table-column label="状态">
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
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="state === 'add' ? '添加用户' : '编辑用户'"
      width="700"
      align-center
    >
      <el-form
        :inline="true"
        :model="formData.data"
        class="demo-form-inline"
        label-width="90px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="用户昵称" prop="nickName">
          <el-input
            v-model="formData.data.nickName"
            placeholder="输入用户昵称"
            clearable
          />
        </el-form-item>
        <el-form-item label="归属部门">
          <el-tree-select
            v-model="formData.data.deptId"
            :data="deptList"
            :render-after-expand="false"
            placeholder="选择归属部门"
            node-key="id"
          />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            v-model="formData.data.phonenumber"
            placeholder="输入手机号码"
            clearable
            style="width: 200px"
          >
            <template #prepend> 86 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="formData.data.email"
            placeholder="输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="formData.data.userName"
            placeholder="输入账号"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
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
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            multiple
            v-model="formData.data.roleIds"
            placeholder="选择角色"
            clearable
            @change="handleChangeRole"
          >
            <el-option
              :label="item.roleName"
              :value="item.roleId"
              v-for="(item, index) in rolesList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.data.status">
            <el-radio value="1">正常</el-radio>
            <el-radio value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐人" style="margin-left: 72px">
          <el-radio-group v-model="formData.data.isPlanMan">
            <el-radio
              v-for="(item, idx) in yesOrNo"
              :key="idx"
              :value="item.dictValue"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankNo" v-if="showBankInfo">
          <el-input
            v-model="formData.data.bankNo"
            placeholder="输入银行账号"
            clearable
          />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName" v-if="showBankInfo">
          <el-input
            v-model="formData.data.bankName"
            placeholder="输入开户行"
            clearable
          />
        </el-form-item>
        <el-form-item label="开户地" prop="bankAddress" v-if="showBankInfo">
          <el-input
            v-model="formData.data.bankAddress"
            placeholder="输入开户地"
            clearable
          />
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
  getSystemUsers,
  addUser,
  deleteSystemUser,
  statusChange,
  editUser,
  getAuthRole,
} from "@/api/project/system/system.js";
import { getDeptList, getRoles } from "@/api/common/user.js";
import { ElMessageBox, ElMessage } from "element-plus";

defineOptions({
  name: "U-ser",
  isRouter: true,
});
const yesOrNo = ref([]);
const tableHeight = inject("$com").tableHeight();
const deptList = ref([]);
const multipleSelection = ref([]);
const showBankInfo = ref(false);
const rolesList = ref([]); //角色list
const query = reactive({
  nickName: "",
  phonenumber: "",
});
let formData = reactive({
  data: {
    nickName: "",
    deptId: "",
    phonenumber: "",
    email: "",
    userName: "",
    password: "123456",
    sex: "",
    roleIds: [],
    status: "1",
    isPlanMan: "",
    bankNo: "",
    bankName: "",
    bankAddress: "",
  },
});
const formRef = ref(null);
const handleChangeRole = (e) => {
  if (e.includes(8)) {
    showBankInfo.value = true;
  } else {
    showBankInfo.value = false;
  }
};
const rules = {
  nickName: [
    {
      required: true,
      message: "请输入用户昵称",
      trigger: "change",
    },
  ],
  userName: [
    {
      required: true,
      message: "请输入账号",
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
  bankNo: [
    {
      required: true,
      message: "请输入银行账号",
      trigger: "change",
    },
  ],
};
const dialogVisible = ref(false);
const state = ref("add");
const tableData = ref([]);
const add = () => {
  formData = reactive({ data: { password: "123456", status: "1" } });
  state.value = "add";
  dialogVisible.value = true;
  showBankInfo.value = false;
};

//获取授权角色
const getAuthRoles = async (item) => {
  const res = await getAuthRole(item.userId);
  formData.data.roleIds = res.data.roleIds;
  if (res.data.roleIds.includes(8)) {
    showBankInfo.value = true;
  } else {
    showBankInfo.value = false;
  }
};

// 编辑
const edit = async (item) => {
  formData.data = { ...item };
  await getAuthRoles(item);

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
        const userIds = multipleSelection.value.map((x) => x.userId);
        const res = await deleteSystemUser(userIds.toString());
        getList();
      } else {
        const res = await deleteSystemUser(item.userId);
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
        formData.data.phonenumber = "86" + formData.data.phonenumber;
        await addUser(formData.data);
      } else {
        formData.data.phonenumber = "86" + formData.data.phonenumber;
        await editUser(formData.data);
      }
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
// 开关
const switchChange = async (item) => {
  await statusChange({
    status: item.status === "1" ? 1 : 0,
    userId: item.userId,
  });
};

const getList = async () => {
  const res = await getSystemUsers(query);
  if (res.code === 0) {
    tableData.value = res.rows;
  }
};

onMounted(async () => {
  getList();
  inject("$com")
    .getDict("sys_yes_no")
    .then((res) => {
      yesOrNo.value = res.data[0].list;
    });

  const dept = await getDeptList();
  if (dept.code === 0) {
    deptList.value = dept.data;
  }
  const roles = await getRoles();
  if (roles.code === 0) {
    rolesList.value = roles.data;
  }
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