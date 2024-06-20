<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.name"
        style="width: 200px"
        placeholder="店铺名称"
      />
      <el-input
        v-model="query.address"
        style="width: 200px"
        placeholder="店铺地址"
      />

      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-button
        type="success"
        icon="EditPen"
        round
        size="small"
        @click="
          edit(multipleSelection.length === 1 ? multipleSelection[0] : '')
        "
        :disabled="multipleSelection.length != 1"
        >修改</el-button
      >

      <el-table
        :data="tableData.row"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="name" label="店铺名称" sortable />
        <el-table-column prop="logo" label="店铺logo" sortable>
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="formData.origin + scope.row.logo"
              :fit="fit"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" sortable />
        <el-table-column prop="phone" label="店铺电话" sortable />
        <el-table-column prop="price" label="店铺均价" sortable />
        <el-table-column prop="score" label="人气分值" sortable />
        <el-table-column label="店铺状态" width="120">
          <template #default="scope">
            <div>
              <el-switch
                v-model="scope.row.onlineStatus"
                @change="switchChange(scope.row)"
                active-value="1"
                inactive-value="0"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="营业开始时间" sortable />
        <el-table-column prop="endTime" label="营业结束时间" sortable />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="edit(scope.row)"
            >
              修改信息
            </el-button>
            <el-button link type="primary" size="small">查看评论</el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="uploadAlbum(scope.row)"
              >上传相册</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="tableData.total"
        style="float: right"
        @current-change="changePageSize"
      />
    </div>

    <el-drawer
      v-model="formData.drawer"
      title="修改店铺信息"
      direction="rtl"
      size="40%"
    >
      <el-form
        :inline="true"
        :model="formData.data"
        class="demo-form-inline"
        label-width="120px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input
            v-model="formData.data.name"
            placeholder="输入店铺名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="店铺类型">
          <el-input
            v-model="formData.data.mainStoreTypeNames"
            placeholder="输入店铺类型"
            disabled
          />
        </el-form-item>
        <el-form-item label="店铺电话" prop="phone">
          <el-input
            v-model="formData.data.phone"
            placeholder="输入店铺电话"
            clearable
          />
        </el-form-item>
        <el-form-item label="店铺均价" prop="price">
          <el-input
            v-model="formData.data.price"
            placeholder="输入店铺均价"
            clearable
          />
        </el-form-item>
        <el-form-item label="店铺设施" prop="facilities">
          <el-select
            v-model="formData.data.facilities"
            placeholder="请选择店铺设施"
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in FacilityList"
              :key="index"
              :label="item.facilityName"
              :value="item.facilityId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="linkMan">
          <el-input
            v-model="formData.data.linkMan"
            placeholder="输入联系人"
            clearable
          />
        </el-form-item>
        <el-form-item label="联系人手机号" prop="linkPhone">
          <el-input
            v-model="formData.data.linkPhone"
            placeholder="输入联系人手机号"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.data.email"
            placeholder="输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="店铺地址" prop="address">
          <el-input
            v-model="formData.data.address"
            placeholder="点击选择店铺地址"
            @focus="innerDrawer = true"
            style="width: 29vw"
          />
        </el-form-item>
        <el-form-item label="营业开始时间" prop="startTime">
          <el-time-select
            v-model="formData.data.startTime"
            style="width: 200px"
            :max-time="formData.data.endTime"
            class="mr-4"
            placeholder="营业开始时间"
            start="00:00"
            step="00:30"
            end="24:00"
          />
        </el-form-item>
        <el-form-item label="营业结束时间" prop="endTime">
          <el-time-select
            v-model="formData.data.endTime"
            style="width: 200px"
            :min-time="formData.data.startTime"
            placeholder="营业结束时间"
            start="00:00"
            step="00:30"
            end="24:00"
          />
        </el-form-item>
        <el-form-item label="封面图" prop="coverUrl">
          <UploadFile
            @uploadSuccess="uploadSuccess"
            @updateFile="updateFile"
            :action="true"
            projectId="coverUrl"
            :fileList="[
              {
                name: '封面图',
                url: formData.data.coverUrl,
              },
            ]"
          ></UploadFile>
        </el-form-item>
        <el-form-item label="店铺Logo" prop="logo" style="width: 90%">
          <UploadFile
            @uploadSuccess="uploadSuccess"
            @updateFile="updateFile"
            :action="true"
            projectId="logo"
            :fileList="[
              {
                name: '店铺Logo',
                url: formData.data.logo,
              },
            ]"
          ></UploadFile>
        </el-form-item>
      </el-form>

      <el-drawer
        v-model="innerDrawer"
        title="店铺位置"
        :append-to-body="true"
        size="60%"
        :destroy-on-close="true"
        @close="drawerClose"
      >
        <myMap @merchantPosition="merchantPosition"></myMap>
        <!-- <div @click="innerDrawer = false">关闭</div> -->
      </el-drawer>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="formData.drawer = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 相册 -->
    <el-dialog v-model="formData.dialogVisible" title="上传相册" width="700">
      <div>
        <uploadFileLists
          :action="formData.origin + '/store/images'"
          :data="{ storeId: formData.data.storeId }"
          :fileList="formData.fileListAlbum"
          @remove="removeAlbum"
          @upLoadSuccess="upLoadSuccess"
        ></uploadFileLists>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formData.dialogVisible = false"> 确定</el-button>
          <el-button type="primary" @click="formData.dialogVisible = false">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, toRefs, inject, nextTick } from "vue";
import UploadFile from "@/components/uploadFile.vue";
import myMap from "@/components/myMap.vue";
import uploadFileLists from "@/components/uploadFileLists.vue";
import {
  getLists,
  editShopInfo,
  getFacilityList,
  getShopDetail,
  setStatus,
  getShopAlbums,
  deleteShopAlbums,
} from "@/api/project/foreign/shopInfo.js";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";

defineOptions({
  name: "Shop-Info",
  isRouter: true,
});
const multipleSelection = ref([]);
const FacilityList = ref([]);
const query = reactive({
  name: "",
  address: "",
  pageNum: 1,
});
const innerDrawer = ref(false);
let formData = reactive({
  origin: inject("$com").baseUrl + "/api",
  drawer: false,
  innerDrawer: false,
  dialogVisible: false,
  fileListAlbum: [], //相册回显
  data: {
    name: "",
    address: "",
    provinces: "",
    districts: "",
    citys: "",
    phone: "",
    logo: "",
    price: "",
    fileNames: [],
    files: [],
    facilities: [],
    linkMan: "",
    linkPhone: "",
    startTime: "",
    endTime: "",
    latitude: "",
    longitude: "", //经度
    storeId: "",
  },
});
const formRef = ref(null);
const rules = {
  name: [
    {
      required: true,
      message: "请输入店铺名称",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入店铺电话",
      trigger: "change",
    },
  ],
  price: [
    {
      required: true,
      message: "请输入店铺均价",
      trigger: "change",
    },
  ],
  address: [
    {
      required: true,
      message: "请选择地址",
      trigger: "change",
    },
  ],
  facilities: [
    {
      required: true,
      message: "请选择店铺设施",
      trigger: "change",
    },
  ],
  linkMan: [
    {
      required: true,
      message: "请选择联系人",
      trigger: "change",
    },
  ],
  linkPhone: [
    {
      required: true,
      message: "请选择联系人手机号",
      trigger: "change",
    },
  ],
  startTime: [
    {
      required: true,
      message: "请选择营业开始时间",
      trigger: "change",
    },
  ],
  endTime: [
    {
      required: true,
      message: "请选择营业结束时间",
      trigger: "change",
    },
  ],
  coverUrl: [
    {
      required: true,
      message: "请上传封面图",
      trigger: "change",
    },
  ],
  logo: [
    {
      required: true,
      message: "请上传店铺logo",
      trigger: "change",
    },
  ],
};
const tableData = ref({
  row: [],
  total: 0,
});

// 上传相册
const uploadAlbum = async (item) => {
  formData.dialogVisible = true;
  formData.data.storeId = item.storeId;

  // 查看之前上传的图
  const res = await getShopAlbums({ storeId: item.storeId });
  if (res.code === 0) {
    formData.fileListAlbum = res.data.map((x) => {
      return { url: formData.origin + x.imageUrl, imageId: x.imageId };
    });
  }
};
const upLoadSuccess = async () => {
  const res = await getShopAlbums({ storeId: formData.data.storeId });
  if (res.code === 0) {
    formData.fileListAlbum = res.data.map((x) => {
      return { url: formData.origin + x.imageUrl, imageId: x.imageId };
    });
  }
};

// 编辑
const edit = async (item) => {
  const editData = await getShopDetail(item.storeId);

  formData.data = { ...formData.data, ...editData.data };

  formData.data.facilities = formData.data.facilities.split(",");
  formData.data.facilities = formData.data.facilities.map(Number);
  formData.drawer = true;
};
// 删除
const removeAlbum = async (item) => {
  console.log(item);
  const res = await deleteShopAlbums(item);
};
//checkbox
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
const handleComfirm = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      const formDataBody = new FormData();
      for (let [k, v] of Object.entries(formData.data)) {
        if (k === "files") {
          if (v.length === 0) {
            formDataBody.append("files", []);
          } else {
            v.forEach((item) => {
              formDataBody.append("files", item);
            });
          }
        } else if (v == null) {
          continue;
        } else {
          formDataBody.append(k, v);
        }
      }
      await editShopInfo(formDataBody);
      getList();
      formData.drawer = false;
    }
  });
};
// 开关
const switchChange = async (item) => {
  await setStatus({
    status: item.onlineStatus === "1" ? 1 : 0,
    storeId: item.storeId,
  });
};

const merchantPosition = async (e) => {
  console.log(e);
  formData.data.latitude = e.latlng.lat;
  formData.data.longitude = e.latlng.lng;
  formData.data.address = e.position;
  formData.data.citys = e.citys;
  formData.data.districts = e.districts;
  formData.data.provinces = e.provinces;
  await nextTick();
  innerDrawer.value = false;
};
const drawerClose = () => {
  innerDrawer.value = false;
};

const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
const uploadSuccess = (file, projectId) => {
  // console.log(file);
  const loadingInstance = ElLoading.service({
    text: "正在上传",
    background: "rgba(0,0,0,.2)",
  });
  formData.data.fileNames.push(projectId);
  formData.data.files.push(file);
  formData.data[projectId] = projectId;
  loadingInstance.close();
};
const updateFile = (uploadFiles, projectId) => {
  // console.log(projectId);
  for (let [k, v] of Object.entries(formData.data)) {
    if (k == projectId) {
      formData.data[k] = "";
    }
  }
  formData.data.fileNames.shift();
  formData.data.files.shift();
};

const getFacilityOption = async () => {
  const res = await getFacilityList();
  FacilityList.value = res.data;
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
onMounted(async () => {
  getFacilityOption();
  getList();
});
</script>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}
</style>