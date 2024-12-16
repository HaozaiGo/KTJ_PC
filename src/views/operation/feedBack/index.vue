<template>
  <div class="content" style="padding-bottom: 60px">
    <el-table
      :data="tableData.row"
      style="width: 100%; margin: 10px 0"
      row-key="id"
      border
      default-expand-all
      v-loading="state.loading"
      :height="tableHeight + 120"
    >
      <el-table-column prop="nickName" label="用户昵称" sortable />
      <el-table-column prop="createTime" label="发起时间" sortable />
      <el-table-column prop="readByName" label="阅读平台人员昵称" sortable />
      <el-table-column prop="isReadLabel" label="是否已阅读" sortable />

      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="check(scope.row)">
            查看
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="delFeedBack(scope.row)"
          >
            删除
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

    <el-dialog
      v-model="dialogVisible"
      title="查看用户反馈"
      width="700"
      align-center
    >
      <div>{{ feedBackContent }}</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" type="primary"
            >确定</el-button
          >
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getUserFeedBackList,
  checkFeedBack,
  deleteFeedBack,
} from "@/api/project/operation/feedBack.js";
import { reactive, onMounted, ref, inject } from "vue";

defineOptions({
  name: "feed-Back",
  isRouter: true,
});
const tableHeight = inject("$com").tableHeight();
const dialogVisible = ref(false);
const feedBackContent = ref("");
const state = reactive({
  loading: false,
});
const tableData = reactive({
  row: [],
  total: 0,
});
const query = reactive({
  pageNum: 1,
});
onMounted(() => {
  getList();
});

const getList = async () => {
  const res = await getUserFeedBackList({ pageNum: query.pageNum });
  if (res.code === 0) {
    tableData.row = res.rows;
    tableData.total = res.total;
  }
};
const check = async (item) => {
  console.log(item);
  const res = await checkFeedBack(item.feedbackId);
  if (res.code === 0) {
    feedBackContent.value = res.data.content;
  }
  dialogVisible.value = true;
};
const delFeedBack = async (item) => {
  const res = await deleteFeedBack(item.feedbackId);
  if (res.code === 0) {
    getList();
  }
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
</script>

<style lang="scss" scoped>
</style>