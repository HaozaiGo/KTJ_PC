<template>
  <div class="content">
    <!-- 定位、营业时间、是否上架、联系电话 -->
    <div class="merchant-info">
      <el-page-header content="商家基本信息" icon="" title=" " />

      <el-card class="info-card">
        <el-row>
          <!-- 基本信息卡片 -->
          <el-col :span="12">
            <div class="card-header" style="margin-bottom: 15px">基本信息</div>

            <div v-if="!editMode" class="shopInfo">
              <p>营业时间：{{ merchant.startTime }} ~ {{ merchant.endTime }}</p>
              <p>定位经度：{{ merchant.longitude }}</p>
              <p>定位纬度：{{ merchant.latitude }}</p>
              <p>优惠力度：{{ merchant.discount }}%</p>
              <p>是否营业：{{ merchant.onlineStatus === "1" ? "是" : "否" }}</p>
            </div>
            <div v-else class="inputSty">
              <div class="flex">
                <el-input
                  v-model="merchant.startTime"
                  placeholder="营业开始时间："
                ></el-input>
                <el-input
                  v-model="merchant.endTime"
                  placeholder="营业结束时间："
                ></el-input>
              </div>

              <el-input
                v-model="merchant.longitude"
                placeholder="定位经度："
              ></el-input>
              <el-input
                v-model="merchant.latitude"
                placeholder="定位纬度："
              ></el-input>
              <el-input v-model="merchant.discount" placeholder="优惠力度："
                ><template #append>%</template></el-input
              >
              <el-select v-model="merchant.onlineStatus" placeholder="是否上架">
                <el-option
                  v-for="(category, index) in categories"
                  :key="index"
                  :label="category.value"
                  :value="category.key"
                />
              </el-select>
            </div>
          </el-col>

          <!-- 联系方式卡片 -->
          <el-col :span="12">
            <div
              class="card-header"
              style="margin-left: 25px; margin-bottom: 12px"
            >
              商家名称：帮到你自营商城（春节限定）
              <div class="mainBtn" @click="saveChanges">
                {{ editMode ? "保存" : "编辑" }}
              </div>
            </div>
            <div v-if="!editMode" class="shopInfo" style="margin-left: 25px">
              <p>联系号码：{{ merchant.phone }}</p>
              <p>地址：{{ merchant.address }}</p>
            </div>
            <div v-else style="margin-left: 25px" class="inputSty">
              <el-input
                v-model="merchant.phone"
                placeholder="电话号码"
              ></el-input>

              <el-input
                v-model="merchant.address"
                placeholder="地址"
              ></el-input>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header
        content="自营商品分类列表"
        icon=""
        title=" "
        style="margin-bottom: 20px"
      />

      <el-card>
        <div class="flex-sb">
          <div class="flex" style="flex: 1">
            <div class="flex" ref="el">
              <div
                v-for="(item, idx) in list"
                :key="idx"
                class="productBox"
                @click="chooseItem(item, idx)"
                :style="
                  chooseItemIdx === idx
                    ? 'background:#a32e21;color:#FFF;border:2px solid #000'
                    : ''
                "
              >
                <div v-if="item.editSatus">
                  <el-input
                    v-model="item.name"
                    style="width: 120px"
                    size="small"
                    @blur="finishEditProductType(item)"
                  />
                </div>
                <div v-else>
                  {{ item.name }}
                </div>
              </div>
            </div>
            <preview-list :list="list" />
          </div>

          <div class="flex">
            <div class="mainBtn" @click="handleAddType">新增</div>
            <div
              class="mainBtn"
              style="margin: 5px 10px"
              @click="handleDelType"
            >
              删除
            </div>
            <div class="mainBtn" @click="handleChangeProductType">保存</div>
          </div>
        </div>
      </el-card>

      <el-page-header
        content="自营商品订单信息"
        icon=""
        title=" "
        style="margin: 20px 0"
      />
      <el-card>
        <el-table
          :data="tableData.list"
          style="width: 100%; margin: 10px 0"
          row-key="id"
          border
          default-expand-all
          @selection-change="handleSelectionChange"
          :max-height="tableHeight"
        >
          <el-table-column prop="orderNo" label="订单编号" sortable />
          <el-table-column prop="payTime" label="下单时间" sortable />
          <el-table-column prop="billAmount" label="优惠前的价" sortable />
          <el-table-column prop="amount" label="优惠后的价" sortable />
          <el-table-column prop="phone" label="手机号" sortable />
          <el-table-column prop="bookTime" label="提货时间" sortable />
          <el-table-column prop="isRefund" label="是否退款" sortable>
            <template #default="scope">
              <span>{{ scope.row.isRefund === "0" ? "否" : "是" }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="备注" sortable />
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="getDetail(scope.row)"
              >
                查看详情
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="moneyBackToUser(scope.row)"
                >退款</el-button
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
      </el-card>

      <div class="nextStep mainBtn">
        <div class="flex-c" @click="linkToProductManagement">
          <el-icon><Present /></el-icon> 商品管理<el-icon
            ><DArrowRight
          /></el-icon>
        </div>
      </div>

      <el-dialog
        v-model="dialogVisible"
        title="查看订单详情"
        width="800"
        align-center
      >
        <div>
          用户名称：{{ OrderDetail.nickName }}
          <el-table
            :data="OrderDetail.goodsList"
            style="width: 100%; margin: 10px 0"
            row-key="id"
            border
            default-expand-all
            :max-height="tableHeight"
          >
            <el-table-column prop="coverUrl" label="商品图" sortable>
              <template #default="scope">
                <el-image
                  style="width: 80px; height: 80px"
                  :src="filePath + scope.row.coverUrl"
                  fit="fill"
                />
              </template>
            </el-table-column>
            <el-table-column prop="typeName" label="商品类型" sortable />
            <el-table-column prop="name" label="商品名称" sortable />
            <el-table-column prop="price" label="单价" sortable />
            <el-table-column prop="realPrice" label="折后价" sortable />
            <el-table-column prop="qty" label="数量" sortable />
            <el-table-column prop="specDetail" label="规格" sortable />
          </el-table>
        </div>
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
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import { useRouter } from "vue-router";
import {
  getShopInfo,
  editInfo,
  productTypeList,
  editProductTypeList,
  getOrderList,
  getOrderDetail,
  backToUser,
} from "@/api/project/operation/springShop.js";
import { useDraggable } from "vue-draggable-plus";
import { ElMessageBox } from "element-plus";
defineOptions({
  name: "spring-Shop",
  isRouter: true,
});
const router = useRouter();
const editMode = ref(false);
const dialogVisible = ref(false);
const tableData = ref({
  list: [],
  total: 0,
  pageNum: 1,
});
const el = ref();
const merchant = ref({
  name: "商家名称",
  category: "",
  phone: "",
  address: "地址信息",
});
const list = ref([]);
const tableHeight = inject("$com").tableHeight() + 80;
const OrderDetail = ref({});
const chooseItemIdx = ref(null);
const filePath = localStorage.getItem("filePath");
const categories = ref([
  { key: "1", value: "上架" },
  { key: "0", value: "下架" },
]);
onMounted(() => {
  getShopInfoApi();
  getProductTypeList();
  getList();
});
const moneyBackToUser = (row) => {
  console.log(row);

  ElMessageBox.confirm("确定退款?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await backToUser({
        orderId: row.orderId,
        reason: "商家退款",
      });
      if (res.code === 0) {
        getList();
      }
    })
    .catch((action) => {
      console.log(action);
    });
};
const getDetail = async (row) => {
  const res = await getOrderDetail(row.orderId);
  if (res.code === 0) OrderDetail.value = res.data;
  dialogVisible.value = true;
};
const changePageSize = (e) => {
  tableData.value.pageNum = e;
  getList();
};
const linkToProductManagement = () => {
  router.push({
    path: `/operation/springShop/productMenagement`,
  });
};
const getList = async () => {
  const res = await getOrderList({
    pageNum: tableData.value.pageNum,
  });
  if (res.code === 0) {
    tableData.value.list = res.rows;
    tableData.value.total = res.total;
  }
};
const getShopInfoApi = async () => {
  const res = await getShopInfo();
  if (res.code === 0) {
    merchant.value = res.data;
    merchant.value.discount = merchant.value.discount * 100;
  }
};
const getProductTypeList = async () => {
  const res = await productTypeList();
  if (res.code === 0) {
    list.value = res.rows;
  }
};
const handleAddType = () => {
  list.value.push({
    name: "",
    editSatus: true,
    storeId: merchant.value.storeId,
  });
};
const handleDelType = () => {
  list.value.splice(chooseItemIdx.value, 1);
};
const chooseItem = (item, idx) => {
  chooseItemIdx.value = idx;
};
// 修改完成商品类型
const handleChangeProductType = async () => {
  const res = await editProductTypeList(list.value);
};

// 完成新增修改Input
const finishEditProductType = (item) => {
  item.editSatus = false;
};

const { start } = useDraggable(el, list, {
  animation: 150,
  ghostClass: "ghost",
  onStart() {
    console.log("start");
  },
  onUpdate() {
    console.log("update");
  },
});
const saveChanges = async () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    const updateDiscount = merchant.value.discount / 100;
    const res = await editInfo(
      Object.assign({}, merchant.value, { discount: updateDiscount })
    );
  }
};
</script>

<style lang="scss" scoped>
.merchant-info {
  height: calc(100vh - 140px);
  padding: 20px;
  overflow-y: scroll;
}
.info-card {
  margin: 20px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
.inputSty > * {
  margin-bottom: 15px;
}
.shopInfo {
  font-size: 17px;
}
.productBox {
  padding: 10px 30px;
  margin: 10px 15px;
  background-color: #a42f22;
  color: #fddcb2;
  border-radius: 12px;
  letter-spacing: 2px;
  border: 2px solid #a42f22;
  font-size: 20px;
}
.nextStep {
  position: fixed;
  bottom: 40px;
  right: 40px;
  font-size: 22px;
}
</style>

