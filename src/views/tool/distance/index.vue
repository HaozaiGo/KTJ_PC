<template>
  <div>
    <h1>Distance</h1>

    <div id="container"></div>

    <div class="flex box">
      <div>启始地点：</div>
      <div><el-input v-model="state.startPointLong"></el-input></div>
      <div><el-input v-model="state.startPointLat"></el-input></div>
    </div>
    <div class="flex box">
      <div>终点地点：</div>
      <div><el-input v-model="state.endPointLong"></el-input></div>
      <div><el-input v-model="state.endPointLat"></el-input></div>
      <!-- <el-button type="primary" @click="getDistance">确定</el-button> -->
    </div>
    <div class="box">
      两点距离：{{ mapDistance }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
defineOptions({
  name: "Dis-tance",
  isRouter: true,
});
const mapDistance = ref("");
const state = reactive({
  distance: "",
  startPointLong: "",
  startPointLat: "",
  endPointLong: "",
  endPointLat: "",
});
watch(
  () => state.endPointLat,
  (endPointLat) => {
    console.log(endPointLat);
    getDistance();
    // 仅当 state.someObject 被替换时触发
  }
);

const getDistance = () => {
  // 百度地图API功能
  // TODO: 计算两点距离
  var map = new BMapGL.Map("container"); // 创建Map实例

  var myP1 = new BMapGL.Point(state.startPointLong, state.startPointLat); //起点
  var myP2 = new BMapGL.Point(state.endPointLong, state.endPointLat); //终点

  mapDistance.value = map.getDistance(myP1, myP2).toFixed(4) + "米"; //获取两点距离
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.box{
 margin: 10px;
}
</style>