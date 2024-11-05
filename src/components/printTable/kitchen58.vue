<!-- 打印单 -->
<template>
  <div>
    <div
      style="
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        padding: 1px 0;
        width: 58mm;
      "
    >
      <div>厨房单</div>
      <!-- <div>{{ tableData.storeName }}</div> -->
    </div>

    <div
      style="
        width: 58mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 1mm 0;
      "
    ></div>
    <div style="font-size: 20px; font-weight: bold">
      桌号:{{ tableData.tableNo }}
    </div>
    <div style="margin: 1mm 0; font-size: 20px">
      人数:{{ tableData.peopleQty }}
    </div>
    <div class="flex" style="flex-wrap: nowrap">
      <span style="font-size: 13px; white-space: nowrap; width: 10mm"
        >单号:</span
      >

      <span style="font-size: 13px"> {{ tableData.orderNo }}</span>
    </div>
    <div
      style="
        width: 58mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 1mm 0;
      "
    ></div>

    <table style="min-width: 58mm">
      <thead>
        <tr>
          <th style="min-width: 38mm; text-align: left">菜品名称</th>
          <th style="width: 20mm;text-align: left;font-size: 14px;">数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData.orderMenuList" :key="index">
          <td style="width: 38mm; font-size: 15px">
            <span v-if="item.isReturnMenu === '1'">退-</span> {{ item.name }}
            <br />
            <span style="font-size: 17px">
              {{ item.tasteNeed }}
            </span>
          </td>

          <td
            style="width: 20mm; font-size: 14px; font-weight: bold;text-align: left"
          >
            {{ item.qty }}{{ item.unit }}
          </td>
        </tr>
      </tbody>
    </table>

    <div
      style="
        width: 58mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 2mm 0;
      "
    ></div>
    <p style="font-size: 13px">时间：{{ time }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
    };
  },
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    console.log(this.tableData);
    this.time = new Date().toLocaleString();
  },
};
</script>

<style>
tbody td {
  margin: 0 auto;
}
.lineSty {
  width: 58mm;
  height: 1mm;
  background: #000;
  /* background-color: #000; */
  /* border-top: 1px dashed #000; */
}
</style>