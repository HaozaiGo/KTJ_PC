<!-- 打印单 -->
<template>
  <div>
    <div
      style="
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        padding: 1px 0;
        width: 80mm;
      "
    >
      <div>厨房单</div>
      <!-- <div>{{ tableData.storeName }}</div> -->
    </div>

    <div
      style="
        width: 80mm;
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
        width: 80mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 1mm 0;
      "
    ></div>

    <table style="min-width: 69mm">
      <thead>
        <tr>
          <th style="min-width: 54mm; text-align: left">菜品名称</th>
          <!-- <th style="width: 12mm">规格</th> -->
          <th style="width: 12mm">数量</th>
          <!-- <th style="width: 12mm">单价</th>
          <th style="width: 12mm">小计</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData.orderMenuList" :key="index">
          <td style="width: 22mm; font-size: 22px">
            <span v-if="item.isReturnMenu === '1'">退-</span> {{ item.name }}
            <br />
            <span style="font-size: 21px">
              {{ item.tasteNeed }}
            </span>
          </td>

          <td
            style="width: 10mm; font-size: 22px; font-weight: bold"
            align="center"
          >
            {{ item.qty }}{{ item.unit }}
          </td>
        </tr>
      </tbody>
    </table>

    <div
      style="
        width: 80mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 1mm 0;
      "
    ></div>
    <!-- <div class="flex-sb" style="width: 80mm">
      <span style="display: inline-block; white-space: nowrap; flex: 1;width: 55mm;"
        >消费原价合计：</span
      >
      <span style="display: inline-block; margin-right: 10mm">{{
        tableData.billAmount
      }}</span>
    </div> -->
    <!-- <div style="width: 80mm; height: 0px; border-top: 2px dashed #000;margin: 1mm 0;"></div> -->

    <!-- <div style="margin: 1mm 0; width: 80mm" class="flex-sb">
      <span
        style="
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          width: 55mm;
          flex: 1;
        "
        >优惠后应收：</span
      >
      <span
        style="
          display: inline-block;
          font-weight: bold;
          font-size: 22px;
          margin-right: 10mm;
        "
        >{{ tableData.amount }}</span
      >
    </div> -->
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
  width: 80mm;
  height: 1mm;
  background: #000;
  /* background-color: #000; */
  /* border-top: 1px dashed #000; */
}
</style>