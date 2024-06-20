<template>
  <div style="margin-bottom: 20px">
    <el-input
      v-model="state.position"
      style="width: 300px; margin-right: 30px"
    ></el-input>
    <el-button type="primary" @click="comfirm">确认位置</el-button>
  </div>
  <div id="map" style="width: 100%; height: calc(100% - 55px)"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
const emit = defineEmits(["merchantPosition"]);
const state = reactive({
  position: "",
  latlng: {},
  citys: "",
  districts: "",
  provinces: "",
  street: "",
  streetNumber: "",
});
const map = ref(null);

const initMap = () => {
  map.value = new BMapGL.Map("map");
  var point = new BMapGL.Point(113.168613, 23.074579);
  map.value.centerAndZoom(point, 15);
  // 添加标注
  var marker = new BMapGL.Marker(point);
  map.value.addOverlay(marker);
  // 开启鼠标滚轮缩放
  map.value.enableScrollWheelZoom(true);

  getClickLocation(map.value);
  autoLocation(map.value);
};

// 自动获取定位
const autoLocation = (map) => {
  var geolocation = new BMapGL.Geolocation();
  geolocation.getCurrentPosition(function (r) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      var mk = new BMapGL.Marker(r.point);
      map.addOverlay(mk);
      map.panTo(r.point);
      // alert("您的位置：" + r.point.lng + "," + r.point.lat);
    } else {
      console.log("failed" + this.getStatus());
    }
  });
  // 开启SDK辅助定位
  //geolocation.enableSDKLocation();
};

const getClickLocation = (map) => {
  var geoc = new BMapGL.Geocoder();

  map.addEventListener("click", function (e) {
    map.clearOverlays();
    var pt = e.latlng;
    var marker = new BMapGL.Marker(new BMapGL.Point(pt.lng, pt.lat));
    map.addOverlay(marker);

    geoc.getLocation(pt, function (rs) {
      // console.log(rs);
      var addComp = rs.addressComponents;
      state.position =
        addComp.province +
        ", " +
        addComp.city +
        ", " +
        addComp.district +
        ", " +
        addComp.street +
        ", " +
        addComp.streetNumber;
      state.latlng = rs.point;
      state.citys = addComp.city;
      state.districts = addComp.district;
      state.provinces = addComp.province;
      state.street = addComp.street;
      state.streetNumber = addComp.streetNumber;
    });
  });
};
const comfirm = () => {
  // console.log(emit);
  emit("merchantPosition", state);
};

onMounted(() => {
  initMap();
  console.log("init");
});
</script>

<style lang="scss" scoped>
</style>