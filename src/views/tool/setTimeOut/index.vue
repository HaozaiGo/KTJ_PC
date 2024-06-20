<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.jobName"
        style="width: 200px"
        placeholder="任务名称"
      />
      <el-input
        v-model="query.jobGroup"
        style="width: 200px"
        placeholder="任务组名"
      />
      <el-select
        v-model="query.status"
        placeholder="任务状态"
        style="width: 200px"
        clearable
      >
        <el-option
          v-for="item in statusList"
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
      <el-button
        type="info"
        icon="Notebook"
        round
        size="small"
        @click="handleClick"
        >日志</el-button
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
        <el-table-column prop="jobId" label="字典编号" sortable />
        <el-table-column prop="jobName" label="任务名称" sortable />
        <el-table-column l prop="jobGroup" label="任务组名" sortable>
        </el-table-column>
        <el-table-column prop="invokeTarget" label="调用目标字符串" sortable />
        <el-table-column
          prop="cronExpression"
          label="cron执行表达式"
          sortable
        />
        <el-table-column label="状态" width="120">
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
              @click="runOnce(scope.row)"
            >
              执行一次
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
      :title="state === 'add' ? '添加任务' : '编辑任务'"
      width="700"
      align-center
    >
      <el-form
        :inline="true"
        :model="formData.data"
        class="demo-form-inline"
        label-width="100px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="formData.data.jobName"
            placeholder="输入任务名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="任务分组" prop="jobGroup">
          <el-input
            v-model="formData.data.jobGroup"
            placeholder="输入任务分组"
            clearable
          />
        </el-form-item>
        <el-form-item label="调用方法" prop="invokeTarget">
          <el-input
            v-model="formData.data.invokeTarget"
            placeholder="输入调用方法"
            style="width: 500px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input
            v-model="formData.data.cronExpression"
            placeholder="输入cron表达式"
            style="width: 500px"
          >
            <template #append>
              <div @click="handleCreate" style="cursor: pointer">
                生成表达式
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="执行策略" prop="dictType">
          <el-radio-group v-model="formData.data.misfirePolicy" size="large">
            <el-radio-button label="默认" value="0" />
            <el-radio-button label="立即触发执行" value="1" />
            <el-radio-button label="触发一次执行" value="2" />
            <el-radio-button label="不触发立即执行" value="3" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否并发" prop="concurrent">
          <el-radio-group v-model="formData.data.concurrent" size="large">
            <el-radio-button
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="(item, index) in concurrentList"
              :key="index"
            />
          </el-radio-group>
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
      title="Cron表达式生成器"
      width="750"
      align-center
    >
      <CrontTab @fill="comfirmFill" @hide="dialogVisible1 = false"></CrontTab>
    </el-dialog>
  </div>
</template>

<script setup>
import CrontTab from "@/components/Crontab/index.vue";
import { reactive, onMounted, ref, toRefs, inject } from "vue";
import {
  getLists,
  addTimeOut,
  deleteTimeOut,
  editTimeOut,
  setStatus,
  runOnceApi,
} from "@/api/project/system/setTimeOut.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
defineOptions({
  name: "Set-TimeOut",
  isRouter: true,
});
const tableHeight = inject("$com").tableHeight();
const multipleSelection = ref([]);
const statusList = ref([]);
const concurrentList = ref([]);
const query = reactive({
  status: "",
  jobName: "",
  jobGroup: "",
  pageNum: 1,
});
class Data {
  jobName = "";
  jobGroup = "";
  cronExpression = "";
  invokeTarget = "";
  misfirePolicy = "0";
}
const switchChange = async (item) => {
  await setStatus({
    status: item.status === "1" ? 1 : 0,
    jobId: item.jobId,
  });
};

const runOnce = async (item) => {
  const res = await runOnceApi(item);
};
const handleClick = (e) => {
  router.push({
    path: `/tool/setTimeOut/log`,
    query: { dictType: e.dictType },
  });
};
let formData = reactive({
  data: new Data(),
});
const formRef = ref(null);
const rules = {
  jobName: [
    {
      required: true,
      message: "请输入任务名称",
      trigger: "change",
    },
  ],
  invokeTarget: [
    {
      required: true,
      message: "请输入调用目标字符串",
      trigger: "change",
    },
  ],
  cronExpression: [
    {
      required: true,
      message: "请输入执行表达式",
      trigger: "change",
    },
  ],
};
const dialogVisible = ref(false);
const dialogVisible1 = ref(false);

const state = ref("add");
const tableData = ref({
  row: [],
  total: 0,
});
const changePageSize = (e) => {
  // console.log(e);
  query.pageNum = e;
  getList();
};
const add = () => {
  formData = reactive({ data: new Data() });
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
        const dictIds = multipleSelection.value.map((x) => x.jobId);
        const res = await deleteTimeOut(dictIds.toString());
        getList();
      } else {
        const res = await deleteTimeOut(item.jobId);
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
        await addTimeOut(formData.data);
      } else {
        await editTimeOut(formData.data);
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
const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
const handleCreate = () => {
  dialogVisible1.value = true;
};
const comfirmFill = (val) => {
  console.log(val);
  formData.data.cronExpression = val;
  dialogVisible1.value = false;
};

onMounted(async () => {
  getList();
  inject("$com")
    .getDict("sys_job_status,sys_yes_no")
    .then((res) => {
      statusList.value = res.data[0].list;
      concurrentList.value = res.data[1].list;
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