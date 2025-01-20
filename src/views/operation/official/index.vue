<template>
  <div class="content">
    <!-- 定位、营业时间、是否上架、联系电话 -->
    <div class="merchant-info">
      <el-page-header content="官网配置" icon="" title=" " />

      <el-card class="info-card">
        <el-row>
          <!-- 基本信息卡片 -->
          <el-col :span="22">
            <div class="card-header" style="margin-bottom: 15px">基本信息</div>

            <div v-if="!editMode" class="shopInfo">
              <p>公司简介：{{ merchant.introduce }}</p>
              <div style="margin-top: 30px">
                <span>帮到你APP：{{ merchant.ourAppName }}</span>
                <uploadFile action @uploadSuccess="uploadSuccess"></uploadFile>
              </div>
              <div>
                <span>帮到你商家APP：{{ merchant.storeAppName }}</span
                ><uploadFile
                  action
                  @uploadSuccess="uploadMerchantSuccess"
                ></uploadFile>
              </div>
            </div>
            <div v-else class="inputSty">
              <div class="flex">
                <el-input
                  v-model="merchant.introduce"
                  placeholder="输入公司简介："
                  type="textarea"
                  :rows="5"
                ></el-input>
              </div>
            </div>
          </el-col>

          <!-- 联系方式卡片 -->
          <el-col :span="2">
            <div class="mainBtn" @click="saveChanges">
              {{ editMode ? "保存" : "编辑" }}
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-page-header
        content="广告轮播图"
        icon=""
        title=" "
        style="margin-bottom: 20px"
      />

      <el-card>
        <div class="flex-sb">
          <div class="flex" style="flex: 1">
            <div class="flex" ref="el">
              <div
                v-for="(item, idx) in merchant.coverUrlsList"
                :key="idx"
                class="productBox"
                @click="chooseItem(item, idx)"
                :style="chooseItemIdx === idx ? 'border:2px solid #000' : ''"
              >
                <div v-if="item.editSatus">
                  <uploadFile
                    action
                    @uploadSuccess="uploadbannerSuccess"
                  ></uploadFile>
                </div>
                <div v-else>
                  <el-image
                    fit="cover"
                    :src="filePath + item.url"
                    class="img"
                  />
                </div>
              </div>
            </div>
            <preview-list :list="list" />
          </div>

          <div class="flex">
            <div class="mainBtn" @click="handleAddType">新增</div>
            <div
              class="mainBtn"
              style="margin: 5px 10px"
              @click="handleDelType"
            >
              删除
            </div>
          </div>
        </div>
      </el-card>

      <el-page-header
        content="产品列表"
        icon=""
        title=" "
        style="margin: 20px 0"
      />

      <el-card>
        <div class="flex-sb">
          <div class="flex" style="flex: 1">
            <el-card
              style="max-width: 320px; margin-right: 20px"
              v-for="(item, idx) in productionsList"
              :key="idx"
              @click="chooseProductItem(item, idx)"
              :style="
                productIdx === idx
                  ? 'border:1px solid #000'
                  : 'border:1px solid #FFF'
              "
            >
              <template #header>{{ item.title }}</template>
              <img
                :src="filePath + item.image"
                style="width: 275px; height: 270px"
              />
            </el-card>
          </div>

          <div class="flex">
            <div class="mainBtn" @click="handleAddProduct">新增</div>
            <div
              class="mainBtn"
              @click="handleEditProduct"
              style="margin: 5px 10px"
            >
              编辑
            </div>
            <div class="mainBtn" @click="handleDelProduct">删除</div>
          </div>
        </div>
      </el-card>

      <el-dialog
        v-model="centerDialogVisible"
        title="新增公司产品"
        width="600"
        align-center
      >
        <el-form label-width="80px">
          <el-form-item label="标题"
            ><el-input
              placeholder="输入标题："
              v-model="production.title"
            ></el-input>
          </el-form-item>

          <el-form-item label="封面图">
            <uploadFile
              action
              @uploadSuccess="uploadProductSuccess"
              :fileList="fileList"
            ></uploadFile
          ></el-form-item>
          <el-form-item label="详情内容"
            ><el-input
              placeholder="输入详情内容："
              v-model="production.value"
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer flex" style="justify-content: flex-end">
            <el-button @click="centerDialogVisible = false">取消</el-button>

            <div
              class="mainBtn"
              style="margin: 0px 10px"
              @click="handleConfirmAdd"
            >
              确定
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import { useRouter } from "vue-router";
import uploadFile from "@/components/uploadFile.vue";

import {
  getOfficialInfo,
  saveIntrodution,
  uploadApk,
  uploadMerchantApk,
  uploadBannerFile,
  delBanner,
  addDynamics,
  eidtDynamics,
  delProductListApi,
  getProductListApi,
} from "@/api/project/operation/official.js";
import { useDraggable } from "vue-draggable-plus";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "official",
  isRouter: true,
});
const production = ref({
  title: "",
  value: "",
  file: null,
});
const router = useRouter();
const editMode = ref(false);
const el = ref();
const merchant = ref({});
const productionsList = ref([]);
const list = ref([]);
const tableHeight = inject("$com").tableHeight() + 80;
const chooseItemIdx = ref(null);
const filePath = localStorage.getItem("filePath");
const pickedImg = ref("");
const centerDialogVisible = ref(false);
const productIdx = ref(null);
const productionObj = ref(null);
const productStatus = ref("add");
const fileList = ref([]);
onMounted(() => {
  getShopInfoApi();
  getProductList();
});

const getProductList = async () => {
  const res = await getProductListApi();
  if (res.code === 0) {
    productionsList.value = res.rows;
  }
};
const handleEditProduct = () => {
  if (productionObj.value) {
    productStatus.value = "edit";
    centerDialogVisible.value = true;
    production.value = { ...productionObj.value };
    production.value.file = productionObj.value.image;
  } else {
    ElMessage.error("请先选择产品");
  }
};
const handleAddProduct = () => {
  centerDialogVisible.value = true;
  productStatus.value = "add";
  fileList.value = [];
  production.value = {
    title: "",
    value: "",
    file: null,
  };
};
const handleDelProduct = () => {
  ElMessageBox.confirm("是否确定删除?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "提示",
  })
    .then(async () => {
      const res = await delProductListApi(productionObj.value.id);
      if (res.code === 0) {
        getProductList();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const handleConfirmAdd = async () => {
  const formDataBody = new FormData();
  formDataBody.append("title", production.value.title);
  formDataBody.append("value", production.value.value);
  formDataBody.append("file", production.value.file);
  if (productStatus.value === "add") {
    const res = await addDynamics(formDataBody);
    if (res.code === 0) {
      centerDialogVisible.value = false;
      getProductList();
    }
  } else {
    formDataBody.append("id", productionObj.value.id);
    const res = await eidtDynamics(formDataBody);
    if (res.code === 0) {
      centerDialogVisible.value = false;
      getProductList();
    }
  }
};

const uploadSuccess = async (rawFile) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const formDataBody = new FormData();
  formDataBody.append("file", rawFile);
  const res = await uploadApk(formDataBody);
  if (res.code === 0) {
    loading.close();
    getShopInfoApi();
  }
};
const uploadMerchantSuccess = async (rawFile) => {
  console.log(rawFile);
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const formDataBody = new FormData();
  formDataBody.append("file", rawFile);
  const res = await uploadMerchantApk(formDataBody);
  if (res.code === 0) {
    loading.close();
    getShopInfoApi();
  }
};
const uploadbannerSuccess = async (rawFile) => {
  console.log(rawFile);
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const formDataBody = new FormData();
  formDataBody.append("file", rawFile);
  const res = await uploadBannerFile(formDataBody);
  if (res.code === 0) {
    loading.close();
    getShopInfoApi();
  }
};
const uploadProductSuccess = async (rawFile) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  production.value.file = rawFile;
  loading.close();
};

const getShopInfoApi = async () => {
  const res = await getOfficialInfo();
  if (res.code === 0) {
    merchant.value = res.data;
    const ourApp = merchant.value.apk ? merchant.value.apk.split("/") : [];
    merchant.value.ourAppName = ourApp[ourApp.length - 1];
    const storeApk = merchant.value.storeApk
      ? merchant.value.storeApk.split("/")
      : [];
    merchant.value.storeAppName = storeApk[storeApk.length - 1];
    merchant.value.coverUrlsList = merchant.value.coverUrls
      ? merchant.value.coverUrls.split(",").map((x) => {
          return {
            url: x,
            editSatus: false,
          };
        })
      : [];
    console.log(merchant.value.coverUrlsList);
  }
};
const handleAddType = () => {
  merchant.value.coverUrlsList.push({
    url: "",
    editSatus: true,
  });
};
const handleDelType = async () => {
  console.log(pickedImg.value);
  const res = await delBanner(pickedImg.value);
  if (res.code === 0) {
    getShopInfoApi();
  }
};
const chooseProductItem = (item, idx) => {
  console.log(item);
  productIdx.value = idx;
  productionObj.value = item;
  fileList.value = [{ url: productionObj.value.image }];
};
const chooseItem = (item, idx) => {
  console.log(item);
  pickedImg.value = item.url;
  chooseItemIdx.value = idx;
};
const { start } = useDraggable(el, list, {
  animation: 150,
  ghostClass: "ghost",
  onStart() {
    console.log("start");
  },
  onUpdate() {
    console.log("update");
  },
});
const saveChanges = async () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    const res = await saveIntrodution({ introduce: merchant.value.introduce });
    if (res.code === 0) {
      getShopInfoApi();
    }
  }
};
</script>

<style lang="scss" scoped>
.merchant-info {
  height: calc(100vh - 140px);
  padding: 20px;
  overflow-y: scroll;
}
.info-card {
  margin: 20px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
.inputSty > * {
  margin-bottom: 15px;
}
.shopInfo {
  font-size: 17px;
}
.productBox {
  margin: 10px 15px;
  color: #fddcb2;
  font-size: 20px;
  border: 2px solid #fff;
  .img {
    max-width: 300px;
    max-height: 178px;
  }
}
.nextStep {
  position: fixed;
  bottom: 40px;
  right: 40px;
  font-size: 22px;
}
</style>

