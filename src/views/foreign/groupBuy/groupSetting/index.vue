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
      <div class="rel" style="height: 100%">
        <div
          class="flex-c"
          style="width: fit-content; font-size: 21px; margin-bottom: 10px"
          @click="drawerBack"
        >
          <el-icon><ArrowLeftBold /></el-icon>
          <span>返回</span>
        </div>
        <!-- 可滚动区域 -->
        <div class="overFlowView">
          <div v-show="step === 0">
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
              <div>
                <div class="mainBtnTitle" style="margin-bottom: 10px">
                  套餐名称
                </div>
                <el-input
                  placeholder="请输入套餐名称"
                  style="width: 250px"
                  v-model="form.mealName"
                ></el-input>
              </div>
              <div style="margin: 0px 32px">
                <div class="mainBtnTitle" style="margin-bottom: 10px">
                  套餐描述
                </div>
                <el-input
                  placeholder="请描述该套餐"
                  style="width: 400px"
                  v-model="form.mealDescribe"
                ></el-input>
              </div>
              <div>
                <div class="flex">
                  <div class="mainBtnTitle" style="margin: 0px 10px 10px 0px">
                    套餐简称
                  </div>
                  <span style="color: red; font-size: 12px"
                    >*如158双人套餐</span
                  >
                </div>

                <el-input
                  placeholder="请描述套餐简称"
                  style="width: 300px"
                  v-model="form.mealNickName"
                ></el-input>
              </div>
            </div>
            <div class="mainBtnTitle">套餐详情</div>

            <div
              class="mainBtn flex-c"
              style="margin: 10px 0"
              @click="step = 1"
            >
              <el-icon :size="18"><Plus /></el-icon>
              <span>创建分类</span>
            </div>
            <!-- 分类总览 -->
            <div style="padding: 20px; border: 1px solid #c1c1c1">
              <el-table
                :data="tableData.row"
                style="width: 100%; margin: 10px 0"
                row-key="id"
                default-expand-all
                ref="tableDom"
              >
                <!-- :height="tableHeight - 300" -->
                <el-table-column prop="name" label="分类名称" sortable />

                <el-table-column label="菜品数量" width="160">
                </el-table-column>
                <el-table-column
                  prop="startTime"
                  label="价格共计"
                  width="180"
                />
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
                <span style="margin-left: 10px; display: inline-block"
                  >¥300</span
                >
              </div>
            </div>
            <!-- 备注 -->
            <div class="flex" style="margin-top: 10px">
              <div class="mainBtnTitle" style="width: 70px; margin-right: 10px">
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
                <div class="mainBtnTitle" style="padding: 3px 25px">定价</div>
                <p style="text-align: center">目前套餐总价：¥300</p>
                <div class="pricing flex-sr">
                  <div>
                    平台售价
                    <el-input
                      style="display: block"
                      v-model="form.price"
                    ></el-input>
                  </div>
                  <div>
                    结算价
                    <el-input style="display: block" disabled></el-input>
                  </div>
                  <div>
                    费率
                    <el-input style="display: block" disabled></el-input>
                  </div>
                </div>
              </div>
              <div style="flex: 1">
                <div class="mainBtnTitle" style="padding: 3px 25px">时效</div>
                <p style="height: 24px"></p>
                <div
                  class="pricing flex-sr"
                  style="margin-top: 10px; width: calc(100% - 20px)"
                >
                  <div>
                    卷有效期
                    <div class="flex">
                      <el-input
                        style="width: 120px"
                        placeholder="自上架之日"
                        disabled
                      />
                      <el-input
                        v-model="form.limitDayQty"
                        style="width: 200px"
                        placeholder="最多20天内"
                        type="number"
                        max="20"
                        min="1"
                      >
                        <template #append>内有效</template>
                      </el-input>
                    </div>
                  </div>
                  <div>
                    使用时间
                    <el-input
                      style="display: block"
                      disabled
                      placeholder="营业时间内可用"
                    ></el-input>
                  </div>
                </div>
              </div>
            </div>

            <!-- 购买须知 -->
            <div class="mainBtnTitle" style="margin: 35px 0px 20px 0">
              购买须知
            </div>
            <div class="container">
              <!-- Left section -->
              <div class="left-section flex-sb" style="flex-wrap: wrap">
                <div class="form-group flex-c">
                  <label>是否需要预约</label>
                  <button
                    @click="form.isNeedBook = !form.isNeedBook"
                    class="needBookbtn"
                  >
                    {{ form.isNeedBook ? "是" : "否" }}
                  </button>
                </div>
                <div class="form-group flex-c">
                  <label>使用人数</label>
                  <el-input
                    type="number"
                    v-model="form.usePeople"
                    placeholder="不限人数"
                    style="text-align: center"
                    @change="
                      ruleList.push('使用人数不能大于' + form.usePeople + '人')
                    "
                  ></el-input>
                </div>
                <div class="form-group flex-c">
                  <label>单人限购的数量</label>
                  <el-input
                    type="number"
                    v-model="form.singleLimitBuyQty"
                    placeholder="不限数量"
                    @change="
                      ruleList.push('单人限购' + form.singleLimitBuyQty + '次')
                    "
                  />
                </div>
                <div class="form-group flex-c">
                  <label>单人起购数量</label>
                  <el-input
                    type="number"
                    v-model="form.singleNeedBuyQty"
                    placeholder="不限数量"
                    style="text-align: center"
                    @change="
                      ruleList.push(
                        '单人起购数量' + form.singleNeedBuyQty + '次'
                      )
                    "
                  />
                </div>
                <div class="form-group flex-c" style="width: 100%">
                  <label>不可用日期</label>

                  <el-select
                    v-model="form.noUseDate"
                    placeholder="全天可用"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in unavailableDaysOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>

              <!-- Middle section -->
              <div style="width: 30%; position: relative">
                <h3 style="text-align: center">使用规则</h3>
                <!-- <div
                  class="mainBtn flex-c"
                  style="cursor: pointer; position: absolute; right: 0; top: 0"
                >
                  <el-icon :size="18"><Plus /></el-icon>
                  <span>添加规则</span>
                </div> -->
                <div
                  class="middle-section"
                  style="width: 100%; margin-top: 10px"
                >
                  <div class="">
                    <label>有效期</label>
                    <div class="ruleItem">
                      2024-10-20 00:00 至 2024-10-25 23:59
                    </div>
                  </div>
                  <div class="">
                    <label>使用时间</label>
                    <div class="ruleItem">营业时间内可用</div>
                  </div>
                  <div class="">
                    <label>不可用日期</label>
                    <div class="ruleItem">{{ form.noUseDate }}</div>
                  </div>
                  <div class="">
                    <label>使用规则</label>
                    <div
                      class="ruleItem flex"
                      v-for="(item, idx) in ruleList"
                      :key="idx"
                    >
                      <el-icon
                        color="red"
                        size="18"
                        style="cursor: pointer; margin-right: 5px"
                        @click="ruleList.splice(idx, 1)"
                        ><RemoveFilled
                      /></el-icon>
                      <span>{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right section -->
              <div
                class="right-section flex"
                style="flex-direction: row; flex-wrap: wrap; align-items: start"
              >
                <div
                  v-for="(item, index) in addedRules"
                  :key="index"
                  class="addedRulesItem"
                >
                  <div>
                    <p style="font-weight: bold">
                      <el-icon><CaretBottom /></el-icon>{{ item.name }}
                    </p>
                    <div
                      v-for="(rule, idx) in item.childen"
                      :key="idx"
                      class="addedRulesChild"
                      @click="addToRuleList(rule)"
                    >
                      {{ rule }}
                    </div>
                  </div>
                </div>

                <el-button style="width: 100%" @click="dialogVisible = true"
                  >自定义规则</el-button
                >
              </div>
            </div>

            <!-- 套餐展示图 -->
            <div class="mainBtnTitle" style="margin: 35px 0px 20px 0">
              套餐展示图
            </div>
            <UploadImg
              :compress="true"
              @uploadSuccess="uploadSuccess"
              :action="true"
            ></UploadImg>
          </div>

          <div v-show="step === 1">
            <div class="mainBtnTitle">分类名称</div>
            <el-input
              placeholder="请输入套餐名称"
              style="width: 300px; margin: 10px 0 20px 0"
              v-model="form1.ruleName"
            ></el-input>

            <div
              class="mainBtn flex-c"
              @click="
                step = 2;
                getLeftMenu();
              "
            >
              <el-icon :size="18"><Plus /></el-icon>
              <span>添加菜品</span>
            </div>

            <div class="flex" style="align-items: start">
              <div style="flex: 3; padding-right: 20px">
                <div
                  class="flex"
                  style="flex-direction: row-reverse; margin-bottom: 10px"
                >
                  <button
                    class="customBtn"
                    @click="form1.isSelect = !form1.isSelect"
                    :style="
                      form1.isSelect
                        ? 'background:#ae9d87 !important'
                        : 'background:#ffffff'
                    "
                  >
                    选配
                  </button>
                  <el-button
                    plain
                    style="
                      padding: 10px 30px;
                      margin-right: 30px;
                      letter-spacing: 2px;
                    "
                    size="large"
                    >清空</el-button
                  >
                </div>
                <!-- menuSelect -->
                <div class="menuSelect">
                  <div class="menuSelectTitle flex">
                    <div style="flex: 2">菜品名称</div>
                    <div style="flex: 1; text-align: center">数量</div>
                    <div style="flex: 1; text-align: center">价格</div>
                  </div>
                  <VueDraggable ref="ell" v-model="list">
                    <div
                      v-for="item in list"
                      :key="item.id"
                      class="flex menuSelectItem"
                    >
                      <div style="flex: 2">{{ item.name }}</div>
                      <div style="flex: 1; text-align: center">
                        {{ item.num }}
                      </div>
                      <div style="flex: 1; text-align: center">
                        {{ item.price }}
                      </div>
                    </div>
                  </VueDraggable>
                </div>

                <div class="mainBtnTitle" style="margin: 35px 0 10px 0">
                  备注
                </div>
                <p class="tips">请选择需要备注的菜品</p>
                <el-input placeholder="请输入备注内容"></el-input>
              </div>
              <div style="flex: 2">
                <h3 style="text-align: center" v-if="form1.isSelect">
                  该分类可选择的数量
                </h3>
                <div
                  class="classify flex-sr"
                  style="flex-wrap: wrap"
                  v-if="form1.isSelect"
                >
                  <div
                    v-for="(item, index1) in numList"
                    :key="index1"
                    class="flex-c"
                    @click="form1.maxSelectQty = item"
                  >
                    {{ item }}
                  </div>
                  <!-- <input
                    placeholder="自定义"
                    style="
                      font-size: 22px;
                      padding: 15px 8px;
                      height: 40px;
                      width: 200px;
                      border: 1px solid #c1c1c1;
                    "
                  /> -->
                </div>
              </div>
            </div>
          </div>

          <div v-show="step === 2">
            <div class="mainBtnTitle">菜品选择</div>
            <div class="flex">
              <div
                class="leftMenuList flex"
                style="flex-direction: column; flex: 1; align-items: start"
              >
                <h2 style="text-align: center; width: 100%">菜品分类</h2>
                <div
                  v-for="(item, idx) in tasteData.leftData"
                  :key="idx"
                  class="leftMenuListItem"
                  @click="handleMenuSelect(item, idx)"
                  :style="
                    tasteData.setectIdx === idx
                      ? `background:#e0cbac`
                      : `background:#FFFFFF`
                  "
                >
                  {{ item.name }}
                  <el-icon
                    v-if="tasteData.setectIdx === idx"
                    size="20"
                    style="vertical-align: sub"
                    ><CaretRight
                  /></el-icon>
                </div>
              </div>
              <div style="flex: 1">
                <h2 style="text-align: center">菜品</h2>

                <el-tree
                  style="max-width: 600px"
                  :data="tasteData.rightData"
                  :props="defaultProps"
                  show-checkbox
                  @check-change="handleCheckChange"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div
          class="flex-sb"
          style="position: absolute; bottom: 0px; left: 0; right: 0"
          v-if="step === 0"
        >
          <el-button
            plain
            size="large"
            style="letter-spacing: 2px"
            @click="handleSave"
            >暂存/保存到草稿</el-button
          >
          <div class="mainBtn" style="line-height: 32px" @click="handleOnline">
            <span>立即上架</span>
          </div>
        </div>
        <div v-else-if="step === 1" style="text-align: right">
          <el-button plain size="large" style="padding: 10px 40px"
            >返回</el-button
          >
          <el-button plain size="large" style="padding: 10px 40px"
            >确定</el-button
          >
        </div>
        <!-- 选菜 -->
        <div v-else-if="step === 2" style="text-align: right">
          <el-button plain size="large" style="padding: 10px 40px"
            >确定</el-button
          >
        </div>
      </div>
    </el-drawer>

    <!-- 自定义规则 -->
    <el-dialog
      v-model="dialogVisible"
      title="自定义规则"
      width="500"
      align-center
    >
      <div style="margin: 30px 0">
        <span>规则名称：</span>
        <el-input
          style="width: 360px"
          placeholder="请输入自定义规则名称"
          v-model="customRule"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            plain
            size="large"
            style="padding: 10px 40px"
            @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button
            plain
            size="large"
            style="padding: 10px 40px; background-color: #f1e6d8"
            @click="comfirmCustomRule"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { VueDraggable } from "vue-draggable-plus";
import UploadImg from "@/components/uploadFile.vue";
import PieChart from "./components/PieChart.vue";
import { ref, reactive, onMounted, inject, computed } from "vue";
import { gerShopOption } from "@/api/project/foreign/employee.js";
import { ElMessage } from "element-plus";
import { getTypeList, getMenusList } from "@/api/project/foreign/menu.js";
import {
  addGroupSetting,
  editGroupSetting,
  getGroupSettingDetail,
  delGroupSetting,
  getGroupSettingList,
  onlineStatus,
} from "@/api/project/foreign/groupSetting.js";
defineOptions({
  name: "groupSetting",
  isRouter: true,
});
onMounted(async () => {
  getShopOption();
});
const defaultProps = {
  children: "children",
  label: "name",
};
const form = reactive({
  storeId: "",
  mealName: "",
  mealDescribe: "",
  mealNickName: "",
  remark: "",
  price: "",
  limitDayQty: "",
  isNeedBook: 0,
  usePeople: "",
  file: "",
  singleLimitBuyQty: "",
  singleNeedBuyQty: "",
  isOpenTimeUse: "1",
  noUseDate: "全天可用",
  ruleListJson: [], //第二层分类
});
const form1 = reactive({
  ruleName: "",
  isSelect: 0,
  mealMenuList:[], //三级菜单
  maxSelectQty: null,
});
const ell = ref(null);
const step = ref(0);
const customRule = ref("");
const dialogVisible = ref(false);
const ruleList = ref([]); //规则list
const addedRules = ref([
  {
    name: "包间",
    childen: ["包间无法使用", "包间可以使用"],
  },
  {
    name: "就餐规则",
    childen: ["仅限堂食", "仅限外带", "均可使用"],
  },
  {
    name: "用餐时间",
    childen: [
      "最长可用餐100分钟",
      "最长可用餐120分钟",
      "最长可用餐60分钟",
      "用餐时长不限制",
    ],
  },
  {
    name: "发票",
    childen: ["发票按照账单实际消费金额开具", "本单无法提供发票"],
  },
  {
    name: "秒杀",
    childen: ["秒杀卷每次仅限使用一张"],
  },
  {
    name: "酒水",
    childen: ["酒水饮料等问题,请致电商家咨询,以商家反馈为准"],
  },

  {
    name: "优惠规则",
    childen: [
      "团购用户不可同时享受商家其他优惠",
      "购买用户只能享受店内部分优惠,详情咨询商家",
    ],
  },
]); //右边的规则字典
const drawer = ref(false);
const storeId = ref(""); //最外面的查询门店
const ShopOptions = ref([]);
const activeName = ref("");
const tableData = reactive({
  row: [],
  total: 0,
});
const unavailableDaysOptions = ref([
  "全天可用",
  "周六,周日",
  "法定假节日",
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
]); //不可用日期
const tasteData = reactive({
  leftData: {},
  selected: {},
  setectIdx: 0,
});
const numList = ref([1, 2, 3, 4, 5, 6, 7, 8]); //分类数量
const list = ref([
  {
    name: "紫金酱凤爪",
    num: 1,
    price: 29,
    id: 1,
  },
  {
    name: "蒜蓉排骨",
    num: 10,
    price: 40,
    id: 2,
  },
]);

const drawerWidth = computed(() => {
  return window.innerWidth - 165;
});
const uploadSuccess = (file) => {
  console.log(file);
  form.file = file;
};
const comfirmCustomRule = () => {
  if (customRule.value != "") {
    ruleList.value.push(customRule.value);
    dialogVisible.value = false;
    customRule.value = "";
  } else {
    ElMessage.error("请输入规则名称");
  }
};
const drawerBack = () => {
  if (step.value === 0) {
    drawer.value = false;
  } else {
    step.value -= 1;
  }
};
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
const addToRuleList = (rule) => {
  ruleList.value.push(rule);
};
const getLeftMenu = async () => {
  const res = await getTypeList({
    storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
    pageSize: 50,
  });
  if (res.code === 0) {
    tasteData.leftData = res.rows;
    tasteData.selected = tasteData.leftData[0];
    getList1();
  }
};
const handleMenuSelect = (item, idx) => {
  tasteData.setectIdx = idx;
  tasteData.selected = item;
  getList1();
};
// 子菜单
const getList1 = async () => {
  try {
    const res = await getMenusList({
      typeId: tasteData.selected.typeId,
      storeId: tasteData.selected.storeId,
      pageSize: 50,
    });
    if (res.code === 0) {
      tasteData.rightData = res.rows;
    }
  } catch (e) {}
};
const handleCheckChange = (data, checked) => {
  console.log(data, checked);
};

const handleSave = async () => {
  const body = Object.assign({}, form, {
    onlineStatus: "0",
    usePeople: form.usePeople === "" ? "-1" : form.usePeople,
    singleLimitBuyQty:
      form.singleLimitBuyQty === "" ? "-1" : form.singleLimitBuyQty,
    singleNeedBuyQty:
      form.singleNeedBuyQty === "" ? "-1" : form.singleNeedBuyQty,
    useRule: ruleList.value.join(","),
  });

  const res = await addGroupSetting(body);
};

const handleOnline = async () => {
  const body = Object.assign({}, form, {
    onlineStatus: "1",
    usePeople: form.usePeople === "" ? "-1" : form.usePeople,
    singleLimitBuyQty:
      form.singleLimitBuyQty === "" ? "-1" : form.singleLimitBuyQty,
    singleNeedBuyQty:
      form.singleNeedBuyQty === "" ? "-1" : form.singleNeedBuyQty,
    useRule: ruleList.value.join(","),
  });

  const res = await addGroupSetting(body);
};
</script>

<style lang="scss" scoped>
.menuSelect {
  width: 100%;
  height: 400px;
  border: 1px solid #c1c1c1;
}
.classify {
  padding: 20px 20px 5px 20px;
  margin: 13px 20px 0px 20px;
  border: 1px solid #c1c1c1;
  width: calc(100% - 40px);
  height: 280px;
  div {
    width: calc(100% / 4 - 15px);
    height: 4vw;
    border: 1px solid #c1c1c1;
    font-size: 22px;
    font-weight: bold;
  }
}
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
  height: calc(100vh - 130px);
  overflow-y: scroll;
}
.overFlowView::-webkit-scrollbar {
  display: none;
}

.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #ddd;
}

.left-section {
  width: 30%;
  padding: 20px;
}
.middle-section,
.right-section {
  border: 1px solid #ddd;
  padding: 20px;
  width: 30%;
}

.form-group {
  margin-bottom: 20px;
  width: calc(50% - 20px);
  flex-direction: column;
}

button {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.ruleItem {
  border: 1px solid #ccc;
  padding: 3px 5px;
  margin-top: 5px;
  font-size: 13px;
  color: #565454;
  border-radius: 3px;
}
.needBookbtn {
  width: 100%;
  border: 1px solid #dcdfe6;
  background: #ffffff;
  color: #c1c1c1;
  padding: 5px 10px;
  border-radius: 3px;
}
.addedRulesItem {
  min-width: calc((100% / 3) - 15px);
  margin-left: 10px;
  .addedRulesChild {
    margin-top: 6px;
    cursor: pointer;
    padding: 4px;
    font-size: 12px;
    border-radius: 4px;
  }
  .addedRulesChild:hover {
    background-color: #e0caac;
  }
}
.customBtn {
  border: 1px solid #c1c1c1;
  background-color: #ffffff;
  padding: 10px 30px;
  letter-spacing: 2px;
  border-radius: 3px;
}
.tips {
  color: red;
  font-size: 12px;
}
.menuSelectTitle {
  div {
    padding: 15px;
  }
}
.menuSelectItem {
  padding: 10px 15px;
  border: 1px solid #c1c1c1;
  margin: 5px 10px;
}
.leftMenuListItem {
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>