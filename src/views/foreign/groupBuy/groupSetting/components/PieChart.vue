<!-- 饼图 -->
<template>
  <div :id="id" :class="className" :style="{ height, width }"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { formatter } from "element-plus";
import { ref, onMounted, onActivated, markRaw } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "pieChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});
const options = {
  grid: {
    left: "10%",
    right: "10%",
    bottom: "10%",
    containLabel: true,
  },

  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      label: {
        show: true,
        position: "center",
        formatter: " {c}\n 总单量",
        fontSize: 16,
        lineHeight: 24,
      },
      radius: [60, 85],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 1,
        color: function (params: any) {
          //自定义颜色
          const colorList = ["#68be89", "#67C23A", "#E6A23C", "#F56C6C"];
          return colorList[params.dataIndex];
        },
      },
      data: [{ value: 26, name: "总单量" }],
    },
  ],
};

const chart = ref<any>("");

onMounted(() => {
  chart.value = markRaw(
    echarts.init(document.getElementById(props.id) as HTMLDivElement)
  );

  chart.value.setOption(options);

  window.addEventListener("resize", () => {
    chart.value.resize();
  });
});

onActivated(() => {
  if (chart.value) {
    chart.value.resize();
  }
});
</script>
