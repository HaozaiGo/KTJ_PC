<template>
  <div class="content">
    <div class="groupBuyData">
      <div class="mainBtnTitle">团购数据</div>
      <PieChart></PieChart>
    </div>

    <div class="mainBtnTitle">套餐管理</div>
    <div class="flex-sb" style="padding: 20px 20px 20px 0">
      <div>
        <span style="display: inline-block; margin-right: 30px">选择门店</span>
        <el-select
          v-model="storeId"
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
      </div>

      <div
        class="mainBtn flex-c"
        style="cursor: pointer"
        @click="drawer = true"
      >
        <el-icon :size="18"><Plus /></el-icon>
        <span>创建单个套餐</span>
      </div>
    </div>

    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane
        label="已上线"
        name="first"
        style="padding-left: 20px"
      ></el-tab-pane>
      <el-tab-pane label="审核中" name="second"></el-tab-pane>
      <el-tab-pane label="草稿（暂存）" name="third"></el-tab-pane>
      <el-tab-pane label="已下线" name="fourth"></el-tab-pane>
      <el-tab-pane label="全部" name="fourth"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData.row"
      style="width: 100%; margin: 10px 0"
      row-key="id"
      default-expand-all
      ref="tableDom"
      :height="tableHeight - 300"
    >
      <el-table-column prop="name" label="套餐名称" sortable />

      <el-table-column label="上架状态" width="160">
        <template #default="scope">
          <div>
            <el-switch
              v-model="scope.row.onlineStatus"
              @change="switchChange(scope.row)"
              active-value="1"
              inactive-value="0"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="审核状态" sortable width="180" />
      <el-table-column prop="endTime" label="已售" sortable width="180" />
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="edit(scope.row)">
            修改信息
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

    <el-drawer
      v-model="drawer"
      direction="rtl"
      :with-header="false"
      :size="drawerWidth"
      :modal="false"
    >
      <div>
        <div
          class="flex-c"
          style="width: fit-content; font-size: 21px; margin-bottom: 10px"
          @click="drawer = false"
        >
          <el-icon><ArrowLeftBold /></el-icon>
          <span>返回</span>
        </div>
        <!-- 可滚动区域 -->
        <div class="overFlowView">
          <div class="mainBtnTitle">适用门店</div>
          <el-select
            v-model="form.storeId"
            filterable
            placeholder="请选择门店"
            style="width: 250px; margin-top: 10px"
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
          <div class="flex" style="margin: 35px 0px">
            <div style="margin-right: 35px">
              <div class="mainBtnTitle" style="margin-bottom: 10px">
                套餐名称
              </div>
              <el-input
                placeholder="请输入套餐名称"
                style="width: 250px"
                v-model="form.name"
              ></el-input>
            </div>
            <div>
              <div class="mainBtnTitle" style="margin-bottom: 10px">
                套餐描述
              </div>
              <el-input
                placeholder="请描述该套餐"
                style="width: 400px"
                v-model="form.des"
              ></el-input>
            </div>
          </div>
          <div class="mainBtnTitle">套餐详情</div>

          <div class="mainBtn flex-c" style="cursor: pointer; margin-top: 10px">
            <el-icon :size="18"><Plus /></el-icon>
            <span>创建分类</span>
          </div>
          <!-- 分类总览 -->
          <div
            style="padding: 20px; border: 1px solid #c1c1c1; margin-top: 25px"
          >
            <el-table
              :data="tableData.row"
              style="width: 100%; margin: 10px 0"
              row-key="id"
              default-expand-all
              ref="tableDom"
            >
              <!-- :height="tableHeight - 300" -->
              <el-table-column prop="name" label="分类名称" sortable />

              <el-table-column label="菜品数量" width="160"> </el-table-column>
              <el-table-column prop="startTime" label="价格共计" width="180" />
              <el-table-column label="操作" width="240">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="edit(scope.row)"
                  >
                    修改信息
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right">
              共 <span style="margin: 0 8px; display: inline-block">5</span>项
              <span style="margin-left: 10px; display: inline-block">¥300</span>
            </div>
          </div>
          <!-- 备注 -->
          <div class="flex" style="margin-top: 25px">
            <div class="mainBtnTitle" style="width: 65px; margin-right: 10px">
              备注
            </div>
            <el-input
              v-model="form.remark"
              placeholder="请输入需要备注的内容，最多不超过50字"
              style="width: 100%"
            ></el-input>
          </div>
          <!-- 定价和时效 -->
          <div class="flex" style="margin-top: 35px">
            <div style="flex: 1">
              <div class="mainBtnTitle" style="padding: 3px 25px;">定价</div>
              <p style="text-align: center">目前套餐总价：¥300</p>
              <div class="pricing flex-sr">
                <div>
                  平台售价
                  <el-input style="display: block"></el-input>
                </div>
                <div>
                  结算价
                  <el-input style="display: block"></el-input>
                </div>
                <div>
                  费率
                  <el-input style="display: block"></el-input>
                </div>
              </div>
            </div>
            <div style="flex: 1">
              <div class="mainBtnTitle" style="padding: 3px 25px;">时效</div>
              <p style="height: 24px;"></p>
              <div class="pricing flex-sr" style="margin-top: 10px;">
              
                <div>
                  卷有效期
                  <el-input style="display: block"></el-input>
                </div>
                <div>
                  使用时间
                  <el-input style="display: block"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import PieChart from "./components/PieChart.vue";
import { ref, reactive, onMounted, inject, computed } from "vue";
import { gerShopOption } from "@/api/project/foreign/employee.js";
defineOptions({
  name: "groupSetting",
  isRouter: true,
});
onMounted(async () => {
  getShopOption();
});
const form = reactive({
  storeId: "",
  name: "",
  des: "",
  remark: "",
});
const drawer = ref(false);
const storeId = ref(""); //最外面的查询门店
const ShopOptions = ref([]);
const activeName = ref("");
const tableData = reactive({
  row: [],
  total: 0,
});
const drawerWidth = computed(() => {
  return window.innerWidth - 165;
});
const tableHeight = inject("$com").tableHeight();
const changePageSize = () => {};
const storeIdChange = () => {};
const handleClick = () => {};
const getShopOption = async () => {
  const res = await gerShopOption();
  if (res.code === 0) {
    ShopOptions.value = res.data;
    storeId.value = res.data[0].storeId;
    getList();
  }
};

const getList = () => {};
</script>

<style lang="scss" scoped>
.pricing {
  width: calc(100% - 80px);
  border: 1px solid #c1c1c1;
  margin: 20px;
  padding: 20px 20px 30px 20px;
  div {
    text-align: center;
  }
}
:deep(.el-tabs__item.is-active) {
  background-color: #cdbca6 !important;
  color: #ffffff !important;
  border-radius: 8px 8px 0 0;
}
:deep(.el-tabs__active-bar) {
  display: none;
}
:deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
  padding-right: 20px !important;
}
:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 20px !important;
}
.groupBuyData {
  height: 270px;
}
.overFlowView {
  height: calc(100vh - 80px);
  overflow-y: scroll;
}
.overFlowView::-webkit-scrollbar {
  display: none;
}
</style>