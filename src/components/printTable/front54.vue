<!-- 打印单 -->
<template>
  <div>
    <div
      style="text-align: center; font-size: 22px; padding: 1px 0; width: 100%"
    >
      <div>客单-{{ tableData.pickupWayLabel }}</div>
      <div>{{ tableData.storeName }}</div>
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
    <div style="margin: 1mm 0">人数:{{ tableData.peopleQty }}</div>
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
        <tr style="font-size: 12px">
          <th style="min-width: 25mm; text-align: left">菜品名称</th>
          <th style="width: 11mm">规格</th>
          <th style="width: 11mm">数量</th>
          <th style="width: 11mm">单价</th>
          <th style="width: 11mm">小计</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData.orderMenuList" :key="index">
          <td style="width: 26mm;font-size: 12px;">
            {{ item.name }} <br />
            <span style="font-size: 12px">
              {{ item.tasteNeed }}
            </span>
          </td>
          <td style="width: 11mm;font-size: 12px" align="center">{{ item.unit }}</td>
          <td style="width: 11mm;font-size: 12px" align="center">{{ item.qty }}</td>
          <td style="width: 11mm;font-size: 12px" align="center">{{ item.realPrice }}</td>
          <td style="width: 11mm;font-size: 12px" align="center">{{ item.amount }}</td>
        </tr>
      </tbody>
    </table>

    <div
      style="
        width: 58mm;
        height: 0px;
        border-top: 2px dashed #000;
        margin: 1mm 0;
      "
    ></div>
    <div
      style="margin: 1mm 0; width: 58mm"
      class="flex-sb"
      v-if="needBottomPrice"
    >
      <span
        style="
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          width: 30mm;
        "
        >合计：</span
      >
      <span
        style="
          display: inline-block;
          font-weight: bold;
          font-size: 22px;
          margin-right: 10mm;
        "
        >{{ Number(totalPrice).toFixed(2) }}</span
      >
    </div>
    <div v-if="needScanImg" style="width: 48mm; text-align: center">
      <img
        :src="imgSrc"
        alt=""
        id="imgId"
        style="width: 30mm; height: 30mm; margin-top: 5mm"
      />
    </div>
    <p  style="font-size: 12px">时间：{{ time }}</p>
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
    needBottomPrice: {
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
    console.log(this.tableData);
    // console.log(this.imgSrc);

    this.time = new Date().toLocaleString();
  },
  computed: {
    totalPrice() {
      const priceList = this.tableData.orderMenuList.map((x) => x.amount);
      return priceList.reduce((pre, cur) => {
        return pre + cur;
      }, 0);
    },
  },
  methods: {},
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