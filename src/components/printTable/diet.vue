<!-- 打印单 -->
<template>
  <div>
    <div
      style="text-align: center; font-size: 22px; padding: 1px 0; width: 80mm"
    >
      <div>预结单-{{ tableData.pickupWayLabel }}</div>

      <div>{{ tableData.storeName }}</div>
    </div>

    <hr />
    <div style="font-size: 20px; font-weight: bold">
      桌号:{{ tableData.tableNo }}
    </div>
    <div>人数:{{ tableData.peopleQty }}</div>
    <div>单号:{{ tableData.orderNo }}</div>
    <hr />
    <table style="min-width: 69mm">
      <thead>
        <tr>
          <th style="min-width: 25mm; text-align: left">菜品名称</th>
          <th style="width: 10mm">规格</th>
          <th style="width: 12mm">数量</th>
          <th style="width: 12mm">单价</th>
          <th style="width: 12mm">小计</th>
        </tr>
      </thead>
      <tbody align="center" valign="center">
        <tr v-for="(item, index) in tableData.menuList" :key="index">
          <td>{{ item.name }}</td>
          <td style="width: 10mm">{{ item.unit }}</td>
          <td style="width: 12mm">{{ item.qty }}</td>
          <td style="width: 12mm">{{ item.price }}</td>
          <td style="width: 12mm">{{ item.amount }}</td>
        </tr>
      </tbody>
    </table>

    <hr />
    <div class="flex-sb">
      <span style="display: inline-block; white-space: nowrap; width: 60mm"
        >消费原价合计：</span
      >
      <span style="display: inline-block">{{ tableData.billAmount }}</span>
    </div>
    <hr />
    <div style="margin-bottom: 2mm">
      <span
        style="
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          width: 60mm;
        "
        >优惠后应收：</span
      >
      <span style="display: inline-block; font-weight: bold; font-size: 22px">{{
        tableData.amount
      }}</span>
    </div>
    <p>打印时间：{{ time }}</p>
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
</style>