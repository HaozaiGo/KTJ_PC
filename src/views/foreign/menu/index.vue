<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col :xs="2" :sm="6">
        <el-select
          v-model="tasteData.form.storeId"
          placeholder="选择店铺"
          style="max-width: 350px; min-width: 150px; margin-bottom: 20px"
        >
          <el-option
            v-for="item in StoreOptions"
            :key="item.storeId"
            :label="item.name"
            :value="item.storeId"
          />
        </el-select>
        <el-dropdown
          size="default"
          split-button
          type="primary"
          style="margin-bottom: 15px; margin-right: 15px"
        >
          添加菜式类型
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addTaste">添加菜式</el-dropdown-item>

              <el-dropdown-item @click="deleteTaste">删除菜式</el-dropdown-item>
              <el-dropdown-item @click="editTaste">修改菜式</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="teaPosition.dialogVisible = true" type="primary">
          设置茶位
        </el-button>

        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          @close="handleClose"
          :style="`height:${tableHeight}px;overflow: auto`"
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
            添加菜品
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
                            <span
                              :style="
                                item.isSpecial === '1'
                                  ? 'color:red'
                                  : 'color:#000'
                              "
                            >
                              {{ item.isSpecial === "1" ? "特价" : "" }}
                            </span>
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
                            <span
                              style="
                                text-decoration: line-through;
                                font-size: 16px;
                              "
                            >
                              {{ item.oldPrice }}</span
                            >
                            <span
                              style="
                                font-size: 14px;
                                margin: 0 5px;
                                display: inline-block;
                              "
                              v-if="item.oldPrice"
                              >¥</span
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
    <!-- left菜单名 -->
    <el-dialog
      v-model="tasteData.dialogVisible"
      :title="tasteData.status === 'add' ? '添加菜式类型' : '修改菜式类型'"
      width="500"
    >
      <el-form
        :model="tasteData.form"
        label-width="auto"
        style="max-width: 600px"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-form-item label="菜式类型" prop="name">
          <el-input v-model="tasteData.form.name"> </el-input>
        </el-form-item>
        <!-- test -->
        <!-- <el-form-item>
          <testUpload @input="testArr"></testUpload>
         </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tasteData.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 菜品 -->
    <el-dialog
      v-model="tasteData.dialogVisible1"
      :title="tasteData.status === 'add' ? '添加菜品' : '修改菜品'"
      width="800"
    >
      <el-form
        :model="tasteData.form1"
        label-width="auto"
        style="max-width: 750"
        :rules="rules1"
        ref="ruleFormRef1"
      >
        <el-form-item label="菜式封面" prop="coverUrl">
          <uploadFile
            :action="true"
            :compress="true"
            @uploadSuccess="uploadSuccess"
            ref="uploadFileRef"
            :fileList="tasteData.fileList"
          ></uploadFile>
        </el-form-item>
        <el-form-item label="菜式名称" prop="name">
          <el-input v-model="tasteData.form1.name" style="width: 250px">
          </el-input>
        </el-form-item>
        <div class="flex" >
          <el-form-item label="是否特价" prop="isSpecial">
            <el-radio-group v-model="tasteData.form1.isSpecial">
              <el-radio
                :value="item.dictValue"
                v-for="(item, index) in yesOrNoList"
                :key="index"
                >{{ item.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否由商家落单" style="margin-left: 15px;">
            <el-radio-group v-model="tasteData.form1.isOnlyShow">
              <el-radio
                :value="item.dictValue"
                v-for="(item, index) in yesOrNoList"
                :key="index"
                >{{ item.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="flex" >
          <el-form-item label="含有多个规格" prop="isSpec">
            <el-radio-group v-model="tasteData.form1.isSpec">
              <el-radio
                :value="item.dictValue"
                v-for="(item, index) in yesOrNoList"
                :key="index"
                >{{ item.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否售罄" style="margin-left: 15px;">
            <el-radio-group v-model="tasteData.form1.salesStatus">
              <el-radio
                :value="item.dictValue"
                v-for="(item, index) in yesOrNoList"
                :key="index"
                >{{ item.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item
          label="设置多个规格"
          prop="priceDetail"
          v-if="Number(tasteData.form1.isSpec)"
        >
          <el-tabs
            v-model="tasteData.form1.size"
            type="border-card"
            class="demo-tabs"
            @tab-click="handleClick"
          >
            <el-tab-pane
              :label="item.dictLabel"
              :name="item.dictValue"
              v-for="(item, index) in typeSizeOptions"
              :key="index"
            >
              <el-form-item label="现价">
                <el-input
                  v-model="tasteData.form1.priceDetail[index].price"
                  style="max-width: 250px"
                  placeholder="输入现价"
                  type="number"
                >
                  <template #append>¥</template>
                </el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <div v-else>
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

          <el-form-item label="原价" prop="oldPrice">
            <el-input
              v-model="tasteData.form1.oldPrice"
              style="max-width: 250px"
              placeholder="输入原价"
              type="number"
            >
              <template #append>¥</template>
            </el-input>
          </el-form-item>
        </div>

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
        <el-form-item label="口味选择" prop="tasteNeed">
          <el-cascader
            v-model="tasteData.form1.tasteNeedNoHandle"
            :options="CascaderOptions"
            @change="handleChange"
            :props="{ multiple: true }"
            style="width: 100%"
            placeholder="选择口味"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="tasteData.form1.remark"> </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tasteData.dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm1"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 茶位 -->
    <el-dialog
      v-model="teaPosition.dialogVisible"
      :title="'添加茶位'"
      width="500"
    >
      <el-form
        :model="teaPosition.form"
        label-width="auto"
        style="max-width: 600px"
        :rules="rules"
        ref="teaPositionRef"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="teaPosition.form.name" style="max-width: 250px">
          </el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            v-model="teaPosition.form.price"
            style="max-width: 250px"
            placeholder="输入现价"
            type="number"
          >
            <template #append>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="teaPosition.form.unit"
            style="max-width: 250px"
            placeholder="位"
            disabled
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="teaPosition.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleComfirmTeaPostion">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import { getLists } from "@/api/project/foreign/shopInfo.js";
import uploadFile from "@/components/uploadFile.vue";
import {
  getTypeList,
  addMenuTypeApi,
  deleteMenuTypeApi,
  editMenuTypeApi,
  getMenusList,
  addMenuApi,
  deleteMenuApi,
  editMenuApi,
  getTasteList,
  getMenusDetail,
  addTeaPosition,
} from "@/api/project/foreign/menu.js";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "F-menus",
  isRouter: true,
});
onMounted(async () => {
  inject("$com")
    .getStoreDict("bill_store_menu_unit,sys_yes_no,bill_store_menu_spec")
    .then((res) => {
      unitOptions.value = res.data[0].list;
      yesOrNoList.value = res.data[1].list;
      typeSizeOptions.value = res.data[2].list;
    });
  await getStoreList();
  getCascaderOptions();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
const rules = {
  name: { required: true, message: "请输入口味名称", trigger: "blur" },
};
const rules1 = {
  name: { required: true, message: "请输入菜式名称", trigger: "blur" },
  price: { required: true, message: "请输入现价", trigger: "blur" },
};
const filePath = localStorage.getItem("filePath");
const typeSizeOptions = ref([]); //规格
const yesOrNoList = ref([]);
const ruleFormRef = ref(null);
const ruleFormRef1 = ref(null);
const uploadFileRef = ref();
const StoreOptions = ref([]);
const unitOptions = ref([]);
const CascaderOptions = ref([]);
const tableHeight = inject("$com").tableHeight();
const loading = ref(true);
const tasteData = reactive({
  dialogVisible: false,
  dialogVisible1: false,
  status: "add",
  status1: "add",
  form: {
    name: "",
    storeId: "",
  },
  form1: {
    name: "",
    oldPrice: null,
    price: "",
    storeId: "",
    unit: "",
    tasteNeedNoHandle: [],
    tasteNeed: [],
    typeId: "",
    file: "",
    coverUrl: "",
    isSpecial: "",
    isSpec: "",
    size: "",
    priceDetail: [],
    remark: "",
    isOnlyShow: "",
    salesStatus: "",
  },
  leftData: [],
  rightData: [],
  fileList: [],
  selected: {}, //选中的
});
class Form1 {
  name = "";
  oldPrice = null;
  price = "";
  storeId = "";
  unit = unitOptions.value[0].dictValue;
  tasteNeedNoHandle = [];
  tasteNeed = [];
  typeId = "";
  file = null;
  coverUrl = "";
  isSpecial = "0";
  isSpec = "0"; //是否使用规格
  isOnlyShow = "0";
  salesStatus = "0";
  size = typeSizeOptions.value[0].dictValue;
  priceDetail = typeSizeOptions.value.map((x) => {
    return { price: "", size: x.dictValue };
  });
}
const teaPosition = reactive({
  form: {
    name: "普通茶位",
    price: "",
    storeId: "",
    unit: "位",
    isSpec: "0",
    isSpecial: "0",
    isTeaPosition: "1",
  },
  dialogVisible: false,
});
const handleComfirmTeaPostion = async () => {
  const body = Object.assign({}, teaPosition.form, {
    // typeId: tasteData.selected.typeId,
    storeId: tasteData.selected.storeId,
  });
  const res = await addTeaPosition(body);
  if (res.code === 0) {
    teaPosition.dialogVisible = false;
    getList();
  }
};
const handleDelMenu = (row) => {
  ElMessageBox.confirm("是否确定删除此菜品？", "提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteMenuApi({
        storeId: tasteData.selected.storeId,
        menuIds: row.menuId,
      });
      getList1();
    })
    .catch((e) => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const handleChange = (e) => {
  console.log(e);
  tasteData.form1.tasteNeed = e.map((x) => x[1]).join(",");
};
const handleClick = (e) => {
  console.log(e);
};
const handleClose = (e) => {};
const getCascaderOptions = async () => {
  const res = await getTasteList();
  if (res.code === 0) {
    CascaderOptions.value = res.data;
  }
};
const handleEditMenu = async (row) => {
  tasteData.status1 = "edit";
  // console.log(row);

  const res = await getMenusDetail({
    menuId: row.menuId,
    storeId: tasteData.selected.storeId,
  });
  res.data.size = typeSizeOptions.value[0].dictValue;
  res.data.priceDetail = res.data.priceDetail
    ? JSON.parse(res.data.priceDetail)
    : typeSizeOptions.value.map((x) => {
        return { price: "", size: x.dictValue };
      });
  res.data.tasteNeedNoHandle = res.data.tasteNeed;
  tasteData.form1 = { ...res.data };
  // console.log(tasteData.form1)
  const url = row.coverUrl;
  tasteData.fileList = [{ url: url }];
  tasteData.dialogVisible1 = true;
};
const getList = async () => {
  const res = await getTypeList({
    storeId: tasteData.form.storeId,
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
const handleComfirm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (tasteData.status === "add") {
        const res = await addMenuTypeApi(tasteData.form);
        if (res.code === 0) {
          tasteData.dialogVisible = false;
          getList();
        }
      } else {
        const res = await editMenuTypeApi({
          storeId: tasteData.selected.storeId,
          name: tasteData.form.name,
          typeId: tasteData.selected.typeId,
        });
        if (res.code === 0) {
          tasteData.dialogVisible = false;
          getList();
        }
      }
    }
  });
};

const handleComfirm1 = () => {
  if (!ruleFormRef1.value) return;
  ruleFormRef1.value.validate(async (valid) => {
    if (valid) {
      tasteData.form1.priceDetail = JSON.stringify(tasteData.form1.priceDetail);
      tasteData.form1.storeId = tasteData.selected.storeId;
      tasteData.form1.typeId = tasteData.selected.typeId;
      const formData = new FormData();

      for (let key in tasteData.form1) {
        if (tasteData.form1[key] === null) {
          continue;
        }
        if (key === "isSpec" && tasteData.form1[key] === "0") {
          // 不选规格的情况
          tasteData.form1.priceDetail = "";
        }
        formData.append(key, tasteData.form1[key]);
      }
      if (tasteData.status1 === "add") {
        const res = await addMenuApi(formData);
        if (res.code === 0) {
          tasteData.dialogVisible1 = false;
          getList1();
        }
      } else {
        const res = await editMenuApi(formData);
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
    const res = await getMenusList({
      typeId: tasteData.selected.typeId,
      storeId: tasteData.selected.storeId,
      pageSize: 50,
    });
    if (res.code === 0) {
      tasteData.rightData = res.rows;
    }
  } catch (e) {}
};
const getStoreList = async () => {
  const res = await getLists();
  if (res.code === 0) {
    StoreOptions.value = res.rows;
    tasteData.form.storeId = res.rows[0].storeId;
    getList();
  }
};
const addTaste = () => {
  tasteData.status = "add";
  tasteData.dialogVisible = true;
  tasteData.form.name = "";
};
const deleteTaste = () => {
  ElMessageBox.confirm("是否确定删除此菜式类型？", "提醒", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteMenuTypeApi({
        storeId: tasteData.selected.storeId,
        typeIds: tasteData.selected.typeId,
      });
      getList();
    })
    .catch((e) => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const editTaste = () => {
  tasteData.status = "edit";
  tasteData.dialogVisible = true;
  tasteData.form.name = tasteData.selected.name;
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