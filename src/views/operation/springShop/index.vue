<template>
  <div class="content">
    <!-- 定位、营业时间、是否上架、联系电话 -->
    <div class="merchant-info">
      <el-page-header content="商家基本信息" />

      <el-card class="info-card">
        <el-row>
          <!-- 基本信息卡片 -->
          <el-col :span="12">
            <div class="card-header" style="margin-bottom: 15px">基本信息</div>

            <div v-if="!editMode" class="shopInfo">
              <p>营业时间：{{ merchant.id }}</p>
              <p>定位经度：{{ merchant.category }}</p>
              <p>定位纬度：{{ merchant.category }}</p>
              <p>是否上架：{{ merchant.category }}</p>
            </div>
            <div v-else class="inputSty">
              <el-input
                v-model="merchant.name"
                placeholder="营业时间："
              ></el-input>
              <el-input
                v-model="merchant.name"
                placeholder="定位经度："
              ></el-input>
              <el-input
                v-model="merchant.name"
                placeholder="定位纬度："
              ></el-input>
              <el-select v-model="merchant.category" placeholder="是否上架">
                <el-option
                  v-for="category in categories"
                  :key="category"
                  :label="category"
                  :value="category"
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
              <el-button type="primary" @click="saveChanges">
                {{ editMode ? "保存" : "编辑" }}</el-button
              >
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

      <el-card>
        <div class="flex">
          <div
            class="flex flex-col gap-2 p-4 w-300px h-300px m-auto bg-gray-500/5 rounded"
            ref="el"
          >
            <div
              v-for="item in list"
              :key="item.id"
              class="h-30 bg-gray-500/5 rounded p-3 cursor-move"
            >
              {{ item.name }}
            </div>
          </div>
          <preview-list :list="list" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import { useDraggable } from "vue-draggable-plus";
defineOptions({
  name: "spring-Shop",
  isRouter: true,
});

const editMode = ref(false);
const el = ref();
const merchant = ref({
  name: "商家名称",
  id: "123456",
  category: "餐饮",
  phone: "12345678901",
  email: "example@example.com",
  address: "地址信息",
});

const list = ref([
  {
    name: "Joao",
    id: 1,
  },
  {
    name: "Jean",
    id: 2,
  },
  {
    name: "Johanna",
    id: 3,
  },
  {
    name: "Juan",
    id: 4,
  },
]);
const categories = ref(["餐饮", "零售", "服务"]);
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
const saveChanges = () => {
  editMode.value = !editMode.value;
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
</style>

