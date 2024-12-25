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

      <div class="nextStep mainBtn">
        <div class="flex-c" @click="linkToProductManagement">
          <el-icon><Present /></el-icon> 商品管理<el-icon
            ><DArrowRight
          /></el-icon>
        </div>
      </div>
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
} from "@/api/project/operation/springShop.js";
import { useDraggable } from "vue-draggable-plus";
defineOptions({
  name: "spring-Shop",
  isRouter: true,
});
const router = useRouter();
const editMode = ref(false);

const el = ref();
const merchant = ref({
  name: "商家名称",
  category: "",
  phone: "",
  address: "地址信息",
});
const list = ref([]);
const chooseItemIdx = ref(null);
const categories = ref([
  { key: "1", value: "上架" },
  { key: "0", value: "下架" },
]);
onMounted(() => {
  getShopInfoApi();
  getProductTypeList();
});
const linkToProductManagement = () => {
  router.push({
    path: `/operation/springShop/productMenagement`,
  });
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
  padding: 20px;
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

