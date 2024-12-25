<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col :xs="2" :sm="6">
        <el-page-header
          content="商品管理"
          icon="Back"
          title="返回"
          @back="navigatorBack"
        />

        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          @close="handleClose"
          :style="`height:${tableHeight}px;overflow: auto;margin-top:20px`"
        >
          <el-menu-item
            :index="String(index)"
            v-for="(item, index) in tasteData.leftData"
            :key="index"
          >
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="22" :sm="18">
        <div>
          <el-button
            @click="addMenus"
            type="primary"
            style="margin-bottom: 20px"
          >
            添加商品
          </el-button>

          <div>
            <!-- 菜单 -->
            <div>
              <el-skeleton
                style="display: flex; gap: 8px"
                :loading="loading"
                animated
                :count="4"
              >
                <template #template>
                  <div style="flex: 1; flex-wrap: wrap">
                    <el-skeleton-item variant="image" style="height: 240px" />
                    <div style="padding: 14px">
                      <el-skeleton-item variant="h3" style="width: 50%" />
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          justify-items: space-between;
                          margin-top: 16px;
                          height: 16px;
                        "
                      >
                        <el-skeleton-item
                          variant="text"
                          style="margin-right: 16px"
                        />
                        <el-skeleton-item variant="text" style="width: 30%" />
                      </div>
                    </div>
                  </div>
                </template>
                <template #default>
                  <div
                    class="flex tableHeight"
                    :style="{ height: tableHeight + 'px' }"
                  >
                    <el-card
                      v-for="item in tasteData.rightData"
                      :key="item.name"
                      :body-style="{ padding: '0px', marginBottom: '1px' }"
                      style="
                        width: calc((100% / 4) - 20px);
                        margin: 0px 10px 10px 0px;
                      "
                    >
                      <img
                        :src="filePath + item.coverUrl"
                        class="image multi-content"
                        style="height: 200px; width: 294px"
                      />
                      <div style="padding: 14px">
                        <span style="font-size: 20px; font-weight: bold">{{
                          item.name
                        }}</span>
                        <div class="bottom card-header flex-sb">
                          <div class="money">
                            {{ item.price || "多规格" }}
                            <span
                              style="
                                font-size: 14px;
                                margin: 0 5px;
                                display: inline-block;
                              "
                              v-if="item.price"
                              >¥/{{ item.unit }}</span
                            >
                          </div>
                          <div style="white-space: pre">
                            <el-button
                              text
                              class="button"
                              @click="handleEditMenu(item)"
                              ><el-icon size="23"><Edit /></el-icon
                            ></el-button>
                            <el-button
                              text
                              class="button"
                              @click="handleDelMenu(item)"
                              ><el-icon size="23"><DeleteFilled /></el-icon
                            ></el-button>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 菜品 -->
    <el-dialog
      v-model="tasteData.dialogVisible1"
      :title="tasteData.status1 === 'add' ? '添加商品' : '修改商品'"
      width="800"
    >
      <el-form
        :model="tasteData.form1"
        label-width="auto"
        style="max-width: 750"
        :rules="rules1"
        ref="ruleFormRef1"
      >
        <el-form-item label="商品封面" prop="coverUrl">
          <uploadFile
            :action="true"
            :compress="true"
            @uploadSuccess="uploadSuccess"
            ref="uploadFileRef"
            :fileList="tasteData.fileList"
          ></uploadFile>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="tasteData.form1.name" style="width: 250px">
          </el-input>
        </el-form-item>
        <div>
          <el-form-item label="现价" prop="price">
            <el-input
              v-model="tasteData.form1.price"
              style="max-width: 250px"
              placeholder="输入现价"
              type="number"
            >
              <template #append>¥</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="库存数" prop="realQty">
          <el-input v-model="tasteData.form1.realQty" style="width: 250px">
          </el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select
            v-model="tasteData.form1.unit"
            placeholder="选择单位"
            style="width: 250px"
          >
            <el-option
              v-for="item in unitOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-radio-group v-model="tasteData.form1.isNice">
            <el-radio
              :value="item.dictValue"
              v-for="(item, index) in yesOrNoList"
              :key="index"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否在售">
          <el-radio-group v-model="tasteData.form1.salesStatus">
            <el-radio
              :value="item.dictValue"
              v-for="(item, index) in saleStatus"
              :key="index"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否运费">
          <el-radio-group v-model="tasteData.form1.isShippingFee">
            <el-radio
              :value="item.dictValue"
              v-for="(item, index) in yesOrNoList"
              :key="index"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格信息" prop="specDetail">
          <el-input v-model="tasteData.form1.specDetail"> </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tasteData.dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm1"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import uploadFile from "@/components/uploadFile.vue";
import {
  productTypeList,
  productList,
  addGoodsApi,
  showBackGood,
  editGoodApi,
  delGood,
} from "@/api/project/operation/springShop.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
defineOptions({
  name: "Ours-productMenagement",
  isRouter: true,
});
onMounted(async () => {
  inject("$com")
    .getDict("bill_store_menu_unit,sys_yes_no,bill_sales_status")
    .then((res) => {
      unitOptions.value = res.data[0].list;
      yesOrNoList.value = res.data[1].list;
      saleStatus.value = res.data[2].list;
    });
  getList();
  setTimeout(() => {
    loading.value = false;
  }, 900);
});
const rules1 = {
  name: { required: true, message: "请输入商品名称", trigger: "blur" },
  price: { required: true, message: "请输入现价", trigger: "blur" },
};
const filePath = localStorage.getItem("filePath");
const ruleFormRef1 = ref(null);
const uploadFileRef = ref();
const unitOptions = ref([]);
const yesOrNoList = ref([]);
const saleStatus = ref([]);
const tableHeight = inject("$com").tableHeight();
const loading = ref(true);
const tasteData = reactive({
  dialogVisible1: false,
  status1: "add",
  form1: {
    name: "",
    price: "",
    storeId: "",
    unit: "",
    realQty: "",
    salesQty: "",
    typeId: "",
    file: "",
    coverUrl: "",
    salesStatus: "",
    specDetail: "",
    salesStatus: "",
    isShippingFee: "",
  },
  leftData: [],
  rightData: [],
  fileList: [],
  selected: {}, //选中的
});
class Form1 {
  name = "";
  price = "";
  storeId = "";
  unit = "";
  realQty = "";
  salesQty = "";
  typeId = "";
  file = null;
  coverUrl = "";
  specDetail = "";
  salesStatus = "";
  isNice = "0";
  salesStatus = "1"; //在售情况
  isShippingFee = "0";
}
const handleDelMenu = (row) => {
  ElMessageBox.confirm("是否确定删除此商品？", "提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await delGood(row.goodsId);
      getList1();
    })
    .catch((e) => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const navigatorBack = () => {
  router.back();
};
const handleClose = (e) => {};
const handleEditMenu = async (row) => {
  tasteData.status1 = "edit";
  console.log(row);

  const res = await showBackGood(row.goodsId);
  tasteData.form1 = { ...res.data };
  const url = row.coverUrl;
  tasteData.fileList = [{ url: url }];
  tasteData.dialogVisible1 = true;
};
const getList = async () => {
  const res = await productTypeList({
    pageSize: 50,
  });
  if (res.code === 0) {
    tasteData.leftData = res.rows;
    tasteData.selected = tasteData.leftData[0];
    getList1();
  }
};
const handleSelect = (e) => {
  tasteData.selected = tasteData.leftData[e];
  getList1();
};
const addMenus = async () => {
  tasteData.form1 = new Form1();
  tasteData.status1 = "add";
  tasteData.fileList = [];
  tasteData.dialogVisible1 = true;
  // console.log(tasteData.form1);
};
const uploadSuccess = (file) => {
  tasteData.form1.file = file;
};
const handleComfirm1 = () => {
  if (!ruleFormRef1.value) return;
  ruleFormRef1.value.validate(async (valid) => {
    if (valid) {
      tasteData.form1.storeId = tasteData.selected.storeId;
      tasteData.form1.typeId = tasteData.selected.typeId;
      const formData = new FormData();

      for (let key in tasteData.form1) {
        if (tasteData.form1[key] === null) {
          continue;
        }
        formData.append(key, tasteData.form1[key]);
      }
      if (tasteData.status1 === "add") {
        const res = await addGoodsApi(formData);
        if (res.code === 0) {
          tasteData.dialogVisible1 = false;
          getList1();
        }
      } else {
        const res = await editGoodApi(formData);
        if (res.code === 0) {
          tasteData.dialogVisible1 = false;
          getList1();
        }
      }
    }
  });
};
const getList1 = async () => {
  try {
    const res = await productList({
      typeId: tasteData.selected.typeId,
      storeId: tasteData.selected.storeId,
      pageSize: 50,
    });
    if (res.code === 0) {
      tasteData.rightData = res.rows;
    }
  } catch (e) {}
};
</script>

<style lang="scss" scoped>
.tableHeight {
  flex-wrap: wrap;
  overflow-y: auto;
}
.money {
  font-size: 20px;
  white-space: nowrap;
}
</style>