<template>
  <div class="whiteBg" v-show="model">
    <div style="position: absolute; left: 200px; top: 200px" class="flex-c">
      <img
        src="@/assets/img/commonPic/back.png"
        alt=""
        style="width: 40px; height: 40px; margin-right: 10px"
      />
      <span style="font-size: 25px" @click="model = false">返回</span>
    </div>
    <div class="choosedItem center">
      <div>
        <p style="text-align: center">{{ deskItem.tableNo }}</p>

        <div class="flex-c">
          <el-icon><Avatar /></el-icon>
          <span>{{ deskItem.peopleQty }}人</span>
        </div>
      </div>
    </div>
    <div class="clickBox center">
      <div class="flex row1">
        <div
          style="border-right: 1px solid #000; border-top-left-radius: 10px"
          @click="handleClickBox('add')"
          :class="{ active: clickBoxState === 'add' }"
        >
          点菜
        </div>
        <div
          style="border-top-right-radius: 10px"
          @click="handleClickBox('refund')"
          :class="{ active: clickBoxState === 'refund' }"
        >
          退单
        </div>
      </div>
      <div class="flex">
        <div
          class="row2"
          @click="handleClickBox('pay')"
          :class="{ active: clickBoxState === 'pay' }"
          :style="props.canClearDesk?'border-bottom-right-radius: 0px;border-right:1px solid #000':'border-bottom-right-radius: 10px;'"
        >
          结账
        </div>
        <div v-if="props.canClearDesk" class="row2Clear" @click="handleClearDesk">清台</div>
      </div>
    </div>
    <!-- 结账 -->
    <el-drawer v-model="drawer" :with-header="false" direction="rtl" size="35%">
      <div class="order-summary">
        <div class="flex-sb" style="margin: 25px 0; align-items: center">
          <h2>菜品</h2>
          <div>
            共{{ orderDetail.data.menuList.length }}项
            <span
              style="
                color: #f27d43;
                margin-left: 30px;
                display: inline-block;
                font-size: 19px;
              "
              >¥{{ orderDetail.data.amount }}</span
            >
          </div>
        </div>
        <ul>
          <li v-for="(item, idx) in items" :key="idx" class="liSty">
            <span>{{ item.name }}</span>
            <span>x{{ item.qty }}</span>
            <span>¥{{ item.price }}</span>
          </li>
        </ul>
      </div>
      <!-- 支付方式 -->
      <div class="flex-sb payWayMax">
        <div style="flex: 2">
          <h3 style="text-align: center">支付方式</h3>
          <div class="flex-c payWay">
            <!-- <div >现金支付</div> -->
            <div class="activePayWay">
              <img
                src="@/assets/img/commonPic/wxpay.png"
                style="
                  width: 20px;
                  height: 20px;
                  vertical-align: sub;
                  background-color: #ffffff;
                "
              />
              微信支付
            </div>
          </div>
        </div>
        <div style="flex: 1">
          <h3 style="text-align: center">结账明细</h3>
          <div class="payDetail">
            <div>
              <span>原价</span>
              <span style="width: 80px"
                >¥{{ orderDetail.data.billAmount }}</span
              >
            </div>
            <div>
              <span>应收 </span
              ><span style="width: 80px">¥{{ orderDetail.data.amount }}</span>
            </div>
            <div>
              <span>实收</span>
              <span style="width: 80px; font-size: 20px; color: #f27d43"
                >¥{{ orderDetail.data.amount }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="confirmPay flex-c" @click="handleConfirm">确认结账</div>
    </el-drawer>

    <el-dialog
      v-model="printerWay.dialogVisible"
      title="打单方式"
      width="500"
      align-center
    >
      <el-form>
        <el-form-item label="指定打印机">
          <el-select
            v-model="printerWay.form.printerId"
            placeholder="打印机型号"
            style="width: 300px"
            @change="switchPrinter"
          >
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in printerWay.printerLists"
              :key="item.printerId"
              :label="item.printerName"
              :value="item.printerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="打印方式">
          <el-radio-group v-model="printerWay.form.method">
            <el-radio
              :value="item.dictValue"
              v-for="(item, idx) in methodOption"
              :key="idx"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="printerWay.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCustom"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <lodopPrinter :imgSrc="printerWay.imgSrc" ref="lodopPrint"></lodopPrinter>
  </div>
</template>

<script setup>
import lodopPrinter from "@/components/printTable/lodopPrinter.vue";
import { checkHasOrder,clearTable } from "@/api/project/foreign/createDesk.js";
import { ref, onMounted, reactive, inject } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  checkNoDetail,
  getSysPrinterLists,
  customPrint,
  getQrCodePayImg,
  offlineCheckOrder,
} from "@/api/project/foreign/order.js";
const router = useRouter();
const printerWay = reactive({
  dialogVisible: false,
  form: { printerId: "", method: "" },
  printerLists: [],
  needScanImg: true,
  imgSrc: "",
});
const lodopPrint = ref(null);
const filePath = localStorage.getItem("filePath");
const methodOption = ref([]);
const items = ref([]);
const model = defineModel({ default: false });
const props = defineProps({ deskItem: Object, canClearDesk: Boolean });
const clickBoxState = ref(null);
const drawer = ref(null);
const orderDetail = ref({});
const orderId = ref(null);

const handleClickBox = async (val) => {
  clickBoxState.value = val;
  if (val === "pay") {
    console.log(props.deskItem);
    // 检查是否存在订单
    const hadOrder = await checkHasOrder({
      storeId: props.deskItem.storeId,
      tableNo: props.deskItem.tableNo,
    });
    if (hadOrder.code === 0 && hadOrder.data != null) {
      orderId.value = hadOrder.data.orderId;
      orderDetail.value = await checkNoDetail(orderId.value);
      if (
        orderDetail.value.code === 0 &&
        orderDetail.value.data.menuList.length > 0
      ) {
        items.value = orderDetail.value.data.menuList;
      }
      drawer.value = true;
    } else {
      ElMessage.info("该桌台无订单,无法进行结账");
    }
  } else if (val === "add") {
    // 点菜
    console.log(props.deskItem);
    router.push({
      name: "Add-menus",
      query: {
        peopleQty: props.deskItem.peopleQty,
        storeId: props.deskItem.storeId,
        tableNo: props.deskItem.tableNo,
      },
    });
  }
};
// 获取已经配置的打印机
const getPrinterSysList = async () => {
  const res = await getSysPrinterLists({
    storeId: props.deskItem.storeId,
  });
  if (res.code === 0) {
    printerWay.printerLists = res.rows;
  }
};
const handleConfirm = () => {
  getPrinterSysList();
  printerWay.form.printerId = "";
  printerWay.dialogVisible = true;
};

//自定义打单
const handleCustom = async () => {
  // 二维码
  const res1 = await getQrCodePayImg({
    orderId: orderId.value,
  });
  if (res1.code === 0) {
    printerWay.imgSrc = filePath + res1.data;
  }

  if (printerWay.form.printerId != "") {
    const body = {
      orderId: orderId.value,
      printerId: printerWay.form.printerId,
      storeId: props.deskItem.storeId,
      method: printerWay.form.method,
    };
    const res = await customPrint(body);
    if (res.code === 0) {
      setTimeout(() => {
        const orderDetailData = Object.assign(
          {},
          orderDetail.value.data,
          res.data
        );

        // console.log("--------", orderDetailData);

        lodopPrint.value.handlePrint(orderDetailData);
        printerWay.dialogVisible = false;
        drawer.value = false;
      }, 1000);
    }
  } else {
    // 全部机一起打单
    const body = {
      method: "ALL",
      orderId: orderId.value,
      storeId: props.deskItem.storeId,
      tableNo: props.deskItem.tableNo,
    };
    const res = await offlineCheckOrder(body);
    // console.log("--------all", res);
    if (res.code === 0) {
      const printerArr = res.data;
      for (let i = 0; i < printerArr.length; i++) {
        const orderDetailData = Object.assign(
          {},
          orderDetail.value.data,
          printerArr[i]
        );
        await lodopPrint.value.asyncEvent(orderDetailData);
      }
    }
    printerWay.dialogVisible = false;
    drawer.value = false;
  }
};

const handleClearDesk = async()=>{

  const res = await clearTable({
    storeId:props.deskItem.storeId,
    tableNo:props.deskItem.tableNo,
    realStatus:"FREE_TIME"
  })
  if(res.code === 0 && res.data.length === 0){
    ElMessage.success("清台成功!")
  }
};

onMounted(() => {
  inject("$com")
    .getStoreDict("bill_print_method")
    .then((res) => {
      methodOption.value = res.data[0].list;
      printerWay.form.method = res.data[0].list[0].dictValue;
    });
});
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  position: relative;
}
.clickBox {
  width: 250px;
  height: 250px;
  border: 1px solid #000;
  border-radius: 10px;
  cursor: pointer;
}
.active {
  background-color: #bda471 !important;
}
.activePayWay {
  background-color: #bda472 !important;
  color: #ffffff !important;
}
.row1 > div {
  letter-spacing: 2px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  background-color: #ffffff;
}

.row2 {
  font-size: 22px;
  border-top: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 98px;
  font-weight: bold;
  letter-spacing: 2px;
  border-bottom-left-radius: 10px;
  
  background-color: #ffffff;
  flex: 1;
}
.row2Clear{
  flex: 1;
  font-size: 22px;
  border-top: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 98px;
  font-weight: bold;
  letter-spacing: 2px;
  border-bottom-right-radius: 10px;
  background-color: #ffffff;
}
.choosedItem {
  width: 160px;
  height: 160px;
  border-radius: 10px;
  transform: translate(-400px, -120px);
  background-color: #f55e31;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 21px;
}

.order-summary {
  background-color: #f8f8f8;
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.liSty {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}
.payWayMax {
  border-radius: 15px;
  border: 1px solid #000;
  position: absolute;
  bottom: 80px;
  width: calc(100% - 40px);
  padding: 20px 0;
}
.payWay > div {
  margin: 10px 5px;
  border: 1px solid #ccc;
  padding: 5px 20px;
  border-radius: 8px;
  cursor: pointer;
}
.payDetail > div {
  display: flex;
  justify-content: space-between;
}
.confirmPay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  font-size: 24px;
  letter-spacing: 2px;
  font-weight: bold;
  background: #bda471;
}
</style>