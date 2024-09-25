<!-- 打印单 -->
<template>
  <div>
    <div
      style="text-align: center; font-size: 22px; padding: 1px 0; width:100%"
    >
      <div>客单-{{ tableData.pickupWayLabel }}</div>
      <div>{{ tableData.storeName }}</div>
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
    <div style="margin: 1mm 0">人数:{{ tableData.peopleQty }}</div>
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
          <th style="min-width: 22mm; text-align: left">菜品名称</th>
          <th style="width: 10mm">规格</th>
          <th style="width: 10mm">数量</th>
          <th style="width: 12mm">单价</th>
          <th style="width: 12mm">小计</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(item, index) in tableData.orderMenuList" :key="index">
          <td style="width: 22mm">
            {{ item.name }} <br />
            <span style="font-size: 12px">
              {{ item.tasteNeed }}
            </span>
          </td>
          <td style="width: 10mm" align="center">{{ item.unit }}</td>
          <td style="width: 10mm" align="center">{{ item.qty }}</td>
          <td style="width: 12mm" align="center">{{ item.price }}</td>
          <td style="width: 12mm" align="center">{{ item.amount }}</td>
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
    <div class="flex-sb" style="width: 80mm">
      <span
        style="display: inline-block; white-space: nowrap; flex: 1; width: 55mm"
        >消费原价合计：</span
      >
      <span style="display: inline-block; margin-right: 10mm">{{
        tableData.billAmount
      }}</span>
    </div>
    <div
      style="
        width: 80mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 1mm 0;
      "
    ></div>

    <div style="margin: 1mm 0; width: 80mm" class="flex-sb">
      <span
        style="
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          width: 50mm;
        
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
    </div>
    <div v-if="needScanImg" style="width: 70mm; text-align: center">
      <img :src="imgSrc" alt="" id="imgId" style="width: 40mm; height: 40mm;margin-top: 10mm;" />
    </div>
    <p>打印时间：{{ time }}</p>
  </div>
</template>
<script>
import common from "@/utils/common";

export default {
  data() {
    return {
      time: "",
      baseUrl: common.baseUrl,

      filePath: localStorage.getItem("filePath"),
    };
  },
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
    needScanImg: {
      type: Boolean,
      default: true,
    },
    imgSrc: {
      type: String,
    },
  },
  created() {
    // if (this.needScanImg) {
    //   getQrCodePayImg({ orderId: this.tableData.orderId }).then((res) => {
    //     // console.log(res);
    //     if (res.code === 0) {
    //       this.imgSrc = this.filePath + res.data;
    //       console.log(this.imgSrc);
    //     }
    //   });
    //   // var that = this;
    //   // axios({
    //   //   method: "get",
    //   //   url: `https://bdncn.cn/store/api/store/order/store/pay/qrcode/mini?orderId=${this.tableData.orderId}`,
    //   //   responseType: "blob",
    //   // }).then(
    //   //   function (response) {
    //   //     const blob = new Blob([response.data], { type: response.data.type });
    //   //     const imgURL = URL.createObjectURL(blob); // 将 Blob 转化为可用的 URL
    //   //     console.log(imgURL);
    //   //     document.getElementById("imgId").src = imgURL;
    //   //   }
    //   // );
    // }
  },
  mounted() {
    // console.log(this.tableData);
    // console.log(this.imgSrc);

    this.time = new Date().toLocaleString();
  },
  methods: {},
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