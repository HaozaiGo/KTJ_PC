<template>
  <div class="content">
    <el-tabs
      v-model="tasteData.activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <div :style="`height: ${tableHeight + 10}px;`" style="overflow-y: auto">
        <el-tab-pane
          :label="item.name"
          :name="item.typeId"
          v-for="(item, idx) in tasteData.leftData"
          :key="idx"
        >
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(item1, idx1) in tasteData.rightData"
              :key="idx1"
              class="menuBox"
              @click="handleClick1(item1)"
            >
              {{ item1.name }} &nbsp; {{ item1.price }}元/{{ item1.unit }}
            </div>
          </div>
        </el-tab-pane>
      </div>
    </el-tabs>

    <div class="cover" v-if="tasteNeed.showCover">
      <div class="cover-content center">
        <h2 style="text-align: center; margin-bottom: 30px">菜品备注</h2>

        <div class="flex-c" style="justify-content: space-between">
          <div style="font-size: 22px; margin-right: 25px; white-space: nowrap">
            口味要求
          </div>
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(item, index) in tasteNeed.need"
              :key="index"
              class="itemBox"
              @click="handleChoose(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div style="font-size: 22px; margin-right: 25px; white-space: nowrap">
            特殊要求
          </div>
          <div class="flex" style="flex-wrap: wrap">
            <div
              v-for="(item, index) in tasteNeed.priceDetail"
              :key="index"
              class="itemBox"
              @click="handleChoose1(item)"
            >
              {{ item.size }} {{ item.price }}元
            </div>
          </div>
        </div>

        <div
          class="flex-c"
          style="justify-content: space-between; margin-top: 15px"
        >
          <div style="font-size: 22px; margin-right: 25px; white-space: nowrap">
            特殊备注
          </div>
          <input type="text" class="spcailInput" />
        </div>
        <div style="text-align: right">
          <button class="btn">适用全单</button>
          <button class="btn" @click="comfirm">确定/跳过</button>
        </div>
      </div>

      <div class="choosedItem">
        {{ tasteNeed.tasteItem.name }}
      </div>

      <div class="choosedMenuList">
        <h3>新增单</h3>
        <div class="flex-c" style="flex-wrap: wrap">
          <span style="font-size: 18px; font-weight: bold">
            {{ tasteNeed.tasteItem.name }}：
          </span>
          <div v-for="(item1, idx1) in tasteNeed.choosingList" :key="idx1">
            {{ item1 }}、
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { reactive, onMounted, ref, inject, nextTick } from "vue";
import {
  getTypeList,
  getMenusList,
  getMenusDetail,
} from "@/api/project/foreign/menu.js";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "Add-menu",
  isRouter: true,
});
const tableHeight = inject("$com").tableHeight();
const router = useRouter();
const route = useRoute();
const orderId = ref(null);
const tasteNeed = reactive({
  tasteItem: {}, //选中项
  showCover: false,
  need: [], //口味
  priceDetail: [], //规格
  choosingList: [],
});
onMounted(() => {
  console.log(route.query.orderId);
  if (route.query.orderId) {
    orderId.value = route.query.orderId;
  }
  getList();
});
const tasteData = reactive({
  activeName: "",
  leftData: [],
  selected: {},
  rightData: [], //子菜单
  finalChoose: {},
});

const comfirm = () => {
  tasteNeed.tasteItem.tasteNeed = tasteNeed.choosingList.join(",");
  console.log(tasteNeed.tasteItem);

  handleFinish(tasteNeed.tasteItem)
  
};
const handleChoose = (item) => {
  console.log(item);
  tasteNeed.choosingList.push(item);
};
const handleChoose1 = (item) => {
  tasteNeed.choosingList.push(item.size + " " + item.price + "元");
};

const getList = async () => {
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
      tasteData.activeName = tasteData.selected.typeId;
    }
  } catch (e) {}
};

const handleClick1 = async (item) => {
  console.log(item);
  tasteNeed.tasteItem = item;
  const res = await getMenusDetail({
    storeId: JSON.parse(localStorage.getItem("storeId")).storeId,
    menuId: item.menuId,
  });
  // 如果有设置规格口味
  if (res.data.ElTabstasteNeed || res.data.priceDetail) {
    tasteNeed.need = res.data.tasteNeed.split(",");
    tasteNeed.priceDetail = JSON.parse(res.data.priceDetail);

    tasteNeed.showCover = true;
    return;
  }

  handleFinish(item);
};

// 完成加餐并跳转
const handleFinish = (item) => {
  tasteData.finalChoose = {
    coverUrl: item.coverUrl,
    isSpecial: item.isSpecial,
    oldPrice: item.oldPrice,
    tasteNeed: item.tasteNeed,
    name: item.name,
    price: item.price,
    typeId: item.typeId,
    menuId: item.menuId,
    unit: item.unit,
    amount: item.price,
    qty: 1,
  };

  router.push({
    name: `foreign-Order`,
    query: {
      addMenu: JSON.stringify(tasteData.finalChoose),
      orderId: orderId.value,
    },
  });
};

const handleClick = (e) => {
  console.log(e.index);

  tasteData.selected = tasteData.leftData[e.index];
  getList1();
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  width: calc(100vw - 230px);
}
.menuBox {
  padding: 40px;
  font-size: 24px;
  margin: 10px 15px;
  letter-spacing: 2px;
  width: calc((100% / 5) - 30px);
  min-width: 250px;
  // min-width: fit-content;
  background-color: #f4f4f4;
  border-radius: 20px;
  height: calc((100vh / 4) - 40px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.2);
}
.cover-content {
  background-color: #f4f4f4;
  padding: 40px;
  border-radius: 25px;
  width: 40vw;
}
.itemBox {
  padding: 15px 20px;
  border-radius: 10px;
  margin: 5px;
  background-color: #e8e8e5;
  cursor: pointer;
}
.spcailInput {
  background-color: #e8e8e5;
  padding: 10px;
  flex: 1;
  width: 100%;
  border: none;
  border-radius: 5px;
  font-size: 22px;
}
.btn {
  font-size: 20px;
  margin: 40px 20px 0px 20px;
  letter-spacing: 2px;
  border-radius: 5px;
  background-color: #e8e8e5;
  padding: 10px 20px;
  cursor: pointer;
}
.choosedItem {
  position: absolute;
  left: 15%;
  top: 25%;
  padding: 40px;
  background-color: #f4f4f4;
  font-size: 23px;
  border-radius: 25px;
}
.choosedMenuList {
  position: fixed;
  right: 5%;
  bottom: 25%;
  width: 300px;
  padding: 40px;
  background-color: #f4f4f4;
  border-radius: 25px;
}
</style>