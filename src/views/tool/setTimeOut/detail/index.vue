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
      <el-date-picker
        v-model="query.time"
        type="daterange"
        range-separator="To"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :size="size"
        value-format="YYYY-MM-DD"
        @change="timeChange"
      />
      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-button
        type="danger"
        icon="Delete"
        round
        size="small"
        @click="clearAll"
        >清空</el-button
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
        <el-table-column prop="jobLogId" label="日志编码" sortable />
        <el-table-column prop="jobName" label="任务名称" sortable />
        <el-table-column prop="jobGroup" label="任务组名" sortable>
        </el-table-column>
        <el-table-column prop="invokeTarget" label="调用目标字符串" sortable />
        <el-table-column
          prop="jobMessage"
          label="日志信息"
          sortable
          width="300"
        />
        <el-table-column prop="statusLabel" label="执行状态" sortable />
        <el-table-column prop="createTime" label="执行时间" sortable />
        <el-table-column label="操作" width="120">
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
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, toRefs, inject } from "vue";
import {
  getLogList,
  deleteLogs,
  clearAllLogs,
} from "@/api/project/system/setTimeOut.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "Time-OutLog",
  isRouter: true,
});

const route = useRoute();
const multipleSelection = ref([]);
const statusList = ref([
  { dictLabel: "正常", dictValue: 0 },
  { dictLabel: "失败", dictValue: 1 },
]);
const clearAll = async () => {
  const res = await clearAllLogs();
};
const tableHeight = inject("$com").tableHeight();
const query = reactive({
  jobName: "",
  jobGroup: "",
  pageNum: 1,
  beginTime: "",
  endTime: "",
  time: [],
});

const timeChange = (e) => {
  query.beginTime = e[0];
  query.endTime = e[1];
};

const tableData = ref({
  row: [],
  total: 0,
});
const dictType = ref("");
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
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
        const jobLogIds = multipleSelection.value.map((x) => x.jobLogId);
        const res = await deleteLogs(jobLogIds.toString());
        getList();
      } else {
        const res = await deleteLogs(item.jobLogId);
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
const getList = async () => {
  // const body = Object.assign(query, { dictType: dictType.value });
  const res = await getLogList(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};

onMounted(async () => {
  dictType.value = route.query.dictType;
  getList();
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