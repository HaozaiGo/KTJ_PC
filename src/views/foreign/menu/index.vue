<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col :xs="2" :sm="6">
        <el-select
          v-model="tasteData.form.storeId"
          placeholder="选择店铺"
          style="width: 220px; margin-right: 20px"
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
          style="margin-bottom: 15px"
        >
          添加菜式类型
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addTaste">添加口味</el-dropdown-item>
              <el-dropdown-item @click="deleteTaste">删除口味</el-dropdown-item>
              <el-dropdown-item @click="editTaste">修改口味</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          @close="handleClose"
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
            @click="addTaste1"
            type="primary"
            style="margin-bottom: 20px"
          >
            添加口味信息
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
                        :src="item.imgUrl"
                        class="image multi-content"
                        style="max-width: 100%"
                      />
                      <div style="padding: 14px">
                        <span>{{ item.name }}</span>
                        <div class="bottom card-header">
                          <div class="time">{{ currentDate }}</div>
                          <el-button text class="button"
                            >Operation button</el-button
                          >
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
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tasteData.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import { getTasteList } from "@/api/project/operation/taste.js";
import { getLists } from "@/api/project/foreign/shopInfo.js";
import {
  getTypeList,
  addMenuTypeApi,
  deleteMenuTypeApi,
  editMenuTypeApi,
} from "@/api/project/foreign/menu.js";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "F-menus",
  isRouter: true,
});
onMounted(async () => {
  await getStoreList();

  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
const rules = {
  name: { required: true, message: "请输入口味名称", trigger: "blur" },
};
const ruleFormRef = ref(null);
const StoreOptions = ref([]);
const tableHeight = inject("$com").tableHeight();
const loading = ref(true);
const tasteData = reactive({
  dialogVisible: false,
  dialogVisible1: false,
  status: "add",
  form: {
    name: "",
    storeId: "",
  },
  form1: {
    name: "",
    typeId: "",
  },
  leftData: [],
  rightData: [
    {
      imgUrl:
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
      name: "Deer",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
      name: "Horse",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
      name: "Mountain Lion",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
      name: "Deer",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
      name: "Horse",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
      name: "Mountain Lion",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
      name: "Mountain Lion",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
      name: "Deer",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
      name: "Horse",
    },
    {
      imgUrl:
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
      name: "Mountain Lion",
    },
  ],
  selected: {}, //选中的
});
const getList = async () => {
  const res = await getTypeList();
  if (res.code === 0) {
    tasteData.leftData = res.rows;
    tasteData.selected = tasteData.leftData[0];
  }
};
const handleSelect = (e) => {
  tasteData.selected = tasteData.leftData[e];
  getList1();
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
</style>