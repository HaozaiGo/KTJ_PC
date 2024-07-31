<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.name"
        style="width: 200px"
        placeholder="商家名称"
      />
      <el-input
        v-model="query.address"
        style="width: 200px"
        placeholder="商家地址"
      />
      <el-input
        v-model="query.phone"
        style="width: 200px"
        placeholder="商家电话"
      />
      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-button type="primary" icon="Plus" round size="small" @click="add"
        >新增商家</el-button
      >
      <el-button
        type="success"
        icon="View"
        round
        size="small"
        @click="
          edit(multipleSelection.length === 1 ? multipleSelection[0] : '')
        "
        :disabled="multipleSelection.length != 1"
        >查看信息</el-button
      >
      <el-button
        type="danger"
        icon="Delete"
        round
        size="small"
        :disabled="multipleSelection.length === 0"
        @click="deleteUser"
        >删除</el-button
      >
      <el-button
        type="primary"
        icon="Plus"
        round
        size="small"
        @click="
          Discounts.dialogVisible = true;
          Discounts.settingAll = true;
        "
        :disabled="multipleSelection.length === 0"
        >设置优惠</el-button
      >
      <el-table
        :data="tableData.row"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
        :max-height="tableHeight"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="name" label="商家名称" sortable />
        <el-table-column prop="logo" label="商家logo" sortable>
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="formData.origin + scope.row.logo"
              :fit="fit"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" sortable />
        <el-table-column prop="phone" label="商家电话" sortable />
        <el-table-column prop="price" label="商家均价" sortable width="110" />
        <el-table-column prop="score" label="人气分值" sortable width="110" />
        <!-- <el-table-column
          prop="commentCount"
          label="被评论数"
          sortable
          width="110"
        /> -->
        <el-table-column
          prop="followCount"
          label="被关注数"
          sortable
          width="110"
        />
        <el-table-column
          prop="mainStoreTypeNames"
          label="商铺类型"
          sortable
          width="130"
        />
        <el-table-column
          prop="commentCount"
          label="签约状态"
          sortable
          width="110"
        />
        <el-table-column label="商家上线" width="120">
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
        <el-table-column label="平台上线" width="120">
          <template #default="scope">
            <div>
              <el-switch
                v-model="scope.row.ptOnlineStatus"
                @change="switchOnlineChange(scope.row)"
                active-value="1"
                inactive-value="0"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="120">
          <template #default="scope">
            <div>
              <el-switch
                v-model="scope.row.ptStatus"
                @change="switchFinalChange(scope.row)"
                active-value="1"
                inactive-value="0"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <div>
              <el-button
                link
                type="primary"
                size="small"
                @click="edit(scope.row)"
              >
                商家信息
              </el-button>
              <el-button link type="primary" size="small">查看评论</el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="setting(scope.row)"
                >商家配置</el-button
              >
            </div>
            <div>
              <el-button
                link
                type="primary"
                size="small"
                @click="seeMerchantData(scope.row)"
              >
                商家资料
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="checkAlbum(scope.row)"
              >
                商家相册
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="showScanCode(scope.row)"
              >
                二维码
              </el-button>
            </div>
            <div>
              <el-button
                link
                type="primary"
                size="small"
                @click="setSubAccount(scope.row)"
              >
                设置分账
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="setDiscounts(scope.row)"
              >
                设置优惠
              </el-button>
            </div>
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
    <!-- 设置优惠 -->

    <el-dialog v-model="Discounts.dialogVisible" title="设置优惠" width="500">
      <el-form :model="Discounts" label-width="auto" style="max-width: 450px">
        <el-form-item label="优惠力度">
          <el-input
            v-model="Discounts.discount"
            style="width: 200px"
            type="number"
            ><template #append>%</template></el-input
          >
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="Discounts.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="comfirmDiscount"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer
      v-model="formData.drawer"
      :title="formData.state === 'add' ? '新增商家' : '查看商家信息'"
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
        <el-form-item label="商家名称" prop="name">
          <el-input
            v-model="formData.data.name"
            placeholder="输入商家名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商家类型">
          <el-cascader
            v-model="formData.data.mainStoreTypeId"
            :options="formData.options"
            @change="handleChange"
            :props="{
              value: 'id',
            }"
            :show-all-levels="false"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="商家电话" prop="phone">
          <el-input
            v-model="formData.data.phone"
            placeholder="输入商家电话"
            clearable
          />
        </el-form-item>
        <el-form-item label="商家均价" prop="price">
          <el-input
            v-model="formData.data.price"
            placeholder="输入商家均价"
            clearable
          />
        </el-form-item>
        <el-form-item label="商家设施" prop="facilities">
          <el-select
            v-model="formData.data.facilities"
            placeholder="请选择商家设施"
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
        <el-form-item label="商家地址" prop="address">
          <el-input
            v-model="formData.data.address"
            placeholder="点击选择商家地址"
            @focus="innerDrawer = true"
            style="width: 29vw"
          />
        </el-form-item>
        <el-form-item label="营业开始时间" prop="startTime">
          <el-time-select
            v-model="formData.data.startTime"
            style="width: 200px"
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
            :fileList="formData.data.coverUrlList"
          ></UploadFile>
        </el-form-item>
        <el-form-item label="商家Logo" prop="logo" style="width: 90%">
          <UploadFile
            @uploadSuccess="uploadSuccess"
            @updateFile="updateFile"
            :action="true"
            projectId="logo"
            :fileList="formData.data.logoList"
          ></UploadFile>
        </el-form-item>
      </el-form>

      <el-drawer
        v-model="innerDrawer"
        title="商家位置"
        :append-to-body="true"
        size="60%"
        :destroy-on-close="true"
        @close="drawerClose"
      >
        <myMap @merchantPosition="merchantPosition"></myMap>
      </el-drawer>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="formData.drawer = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="formData.dialogVisible" title="商家配置" width="500">
      <el-form
        :model="formData.settingForm"
        label-width="auto"
        style="max-width: 450px"
      >
        <el-form-item label="微信商户号">
          <el-input v-model="formData.settingForm.wxMchId" />
        </el-form-item>

        <el-form-item label="是否开通微信支付">
          <el-radio-group
            v-model="formData.settingForm.wxPayStatus"
            class="ml-4"
          >
            <el-radio
              v-for="(item, index) in formData.wxPayStatusOption"
              :key="index"
              :value="item.dictValue"
            >
              {{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否开通分账模式">
          <el-radio-group
            v-model="formData.settingForm.wxShareStatus"
            class="ml-4"
          >
            <el-radio
              v-for="(item, index) in formData.wxShareStatusOption"
              :key="index"
              :value="item.dictValue"
            >
              {{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="formData.settingForm.createTime" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formData.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="comfirmSetting"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="formData.dialogVisible1"
      title="查看商家资料"
      width="1100"
      align-center
    >
      <div>
        <el-descriptions class="margin-top" title="" :column="3" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">营业执照的商户名称</div>
            </template>
            {{ formData.checkData.businessMerchantName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">营业执照法人名称</div>
            </template>
            {{ formData.checkData.businessLegalName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">注册号/统一社会信用代码</div>
            </template>
            {{ formData.checkData.businessLicenseNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">银行卡号</div>
            </template>
            {{ formData.checkData.bankNo }}
          </el-descriptions-item>
      
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证人名称</div>
            </template>
            {{ formData.checkData.identityName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证号</div>
            </template>
            {{ formData.checkData.identityNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">有效时间</div>
            </template>
            {{ formData.checkData.identityLimit }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">营业执照</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api' + formData.checkData.businessLicenseUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                '/api' + formData.checkData.businessLicenseUrl,
              ]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证正面</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api' + formData.checkData.identityPositiveUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                '/api' + formData.checkData.identityPositiveUrl,
              ]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证反面</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api' + formData.checkData.identityNegativeUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                '/api' + formData.checkData.identityNegativeUrl,
              ]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">许可证</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api' + formData.checkData.permitUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="['/api' + formData.checkData.permitUrl]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">银行卡</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api' + formData.checkData.bankUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="['/api' + formData.checkData.bankUrl]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">其他证件</div>
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleComfirm()" type="primary"
            >修改商家资料</el-button
          >
          <el-button @click="formData.dialogVisible1 = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 商家相册 -->
    <el-dialog
      v-model="formData.albumsDialogVisible"
      title="查看商家相册"
      width="700"
    >
      <div>
        <el-image
          v-for="(item, index) in formData.albumsList"
          :key="index"
          style="width: 150px; height: 150px; margin-right: 15px"
          :src="formData.origin + item.imageUrl"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[formData.origin + item.imageUrl]"
          :initial-index="4"
          fit="cover"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formData.albumsDialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="formData.albumsDialogVisible = false"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 二维码 -->
    <el-dialog v-model="ScanCode.dialogVisible" title="商家二维码" width="500">
      <div style="width: 100%; text-align: center">
        <el-image
          :src="`${formData.origin}/bill/store/qrcode/mini?storeId=${ScanCode.storeId}`"
          style="width: 280px; height: 280px"
        />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ScanCode.dialogVisible = false">取消</el-button>
          <a
            :href="`${formData.origin}/bill/store/qrcode/mini?storeId=${ScanCode.storeId}`"
            download="商家二维码.png"
            target="_blank"
            style="color: #409eff; font-size: 12px; margin-left: 13px;padding: 8px 15px;border: 1px solid #ccc ;border-radius: 5px;"
            >下载</a
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, toRefs, inject, nextTick } from "vue";
import UploadFile from "@/components/uploadFile.vue";
import myMap from "@/components/myMap.vue";
import {
  getLists,
  addStop,
  deleteStop,
  getFacilityList,
  getShopDetail,
  setStoreStatus,
  getTypeOptions,
  setShopOnlineStatus,
  setShopStatus,
  shopConfigSetting,
  getShopConfig,
  checkMerchantData,
  checkAlbums,
  discountAPI,
  editShopInfo
} from "@/api/project/merchant/manageMerchant.js";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
defineOptions({
  name: "manage-Merchant",
  isRouter: true,
});
const Discounts = reactive({
  dialogVisible: false,
  discount: null,
  storeId: "",
  settingAll: false,
});
const ScanCode = reactive({
  dialogVisible: false,
  storeId: "",
});
const multipleSelection = ref([]);
const FacilityList = ref([]);
const query = reactive({
  name: "",
  address: "",
  phone: "",
  pageNum: 1,
});
const innerDrawer = ref(false);
class newFormData {
  name = "";
  address = "";
  provinces = "";
  districts = "";
  citys = "";
  phone = "";
  logo = "";
  coverUrl = "";
  price = "";
  fileNames = [];
  files = [];
  facilities = [];
  linkMan = "";
  linkPhone = "";
  startTime = "";
  endTime = "";
  latitude = "";
  longitude = ""; //经度
  storeId = "";
  mainStoreTypeId = "";
  coverUrlList = [];
  logoList = [];
}
class settingFormData {
  wxMchId = ""; //微信商户号
  wxPayStatus = ""; //是否开通微信支付
  wxShareStatus = ""; //是否开通分账模式
}
let formData = reactive({
  origin: inject("$com").baseUrl + "/api",
  drawer: false,
  innerDrawer: false,
  dialogVisible: false,
  dialogVisible1: false,
  albumsDialogVisible: false,
  albumsList: [],
  state: "add",
  data: {},
  options: [],
  wxPayStatusOption: [],
  wxShareStatusOption: [],
  settingForm: new settingFormData(), //配置
  checkData: {}, //查看商家资料
});
const tableHeight = inject("$com").tableHeight();
const formRef = ref(null);
const rules = {
  name: [
    {
      required: true,
      message: "请输入商家名称",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入商家电话",
      trigger: "change",
    },
  ],
  price: [
    {
      required: true,
      message: "请输入商家均价",
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
      message: "请选择商家设施",
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
      message: "请上传商家logo",
      trigger: "change",
    },
  ],
};
const tableData = ref({
  row: [],
  total: 0,
});
const showScanCode = (row) => {
  ScanCode.dialogVisible = true;
  ScanCode.storeId = row.storeId;
};
const comfirmDiscount = async () => {
  if (Discounts.settingAll) {
    const storeIds = multipleSelection.value.map((x) => x.storeId);
    const res = await discountAPI({
      discount: Discounts.discount / 100,
      storeIds: storeIds,
    });
    if (res.code === 0) {
      Discounts.dialogVisible = false;
    }
  } else {
    const res = await discountAPI({
      discount: Discounts.discount / 100,
      storeIds: [Discounts.storeId],
    });
    if (res.code === 0) {
      Discounts.dialogVisible = false;
    }
  }
  getList();
};
const setDiscounts = (row) => {
  console.log(row);
  Discounts.discount = row.discount * 100;
  Discounts.dialogVisible = true;
  Discounts.storeId = row.storeId;
};
const setting = async (item) => {
  const res = await getShopConfig(item.storeId);
  if (res.code === 0) {
    formData.settingForm = { ...res.data };
  }
  formData.dialogVisible = true;
};
// 查看商家资料
const seeMerchantData = async (item) => {
  const res = await checkMerchantData(item.storeId);
  if (res.code === 0 && res.data) {
    formData.checkData = res.data;
  }
  formData.dialogVisible1 = true;
};
const setSubAccount = (e) => {
  router.push({
    path: `/merchant/manageMerchant/subAccount`,
    query: { storeId: e.storeId },
  });
};
const checkAlbum = async (item) => {
  const res = await checkAlbums({ storeId: item.storeId });
  if (res.code === 0) {
    if (res.data.length === 0) {
      ElMessage({
        message: "该商家没有上传相册！",
        type: "warning",
      });
    } else {
      formData.albumsList = res.data;
      formData.albumsDialogVisible = true;
    }
  }
};
// 新增
const add = async () => {
  formData.state = "add";
  formData.drawer = true;
  formData.data = new newFormData();
};

// 编辑
const edit = async (item) => {
  formData.state = "check";
  const editData = await getShopDetail(item.storeId);

  formData.data = { ...formData.data, ...editData.data };
  try {
    formData.data.facilities = formData.data.facilities.split(",");
    formData.data.facilities = formData.data.facilities.map(Number);
  } catch (e) {
    console.log(e);
  }

  formData.data.coverUrlList = editData.data.coverUrl
    ? [
        {
          name: "封面图",
          url: formData.data.coverUrl,
        },
      ]
    : [];
  formData.data.logoList = editData.data.logo
    ? [
        {
          name: "封面图",
          url: formData.data.logo,
        },
      ]
    : [];

  console.log(formData.data.logoList);
  formData.drawer = true;
};
// 删除
const deleteUser = async (item) => {
  ElMessageBox.confirm("确定删除所选数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      if (multipleSelection.value.length >= 1) {
        const storeIds = multipleSelection.value.map((x) => x.storeId);
        const res = await deleteStop(storeIds.toString());
        getList();
      }
    })
    .catch((action) => {
      console.log(action);
    });
};
//checkbox
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
const handleComfirm = () => {
  // if (formData.state === "check") {
  //   formData.drawer = false;
  // }
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
      if (formData.state === "check") {
        const res1 = await editShopInfo(formDataBody);
        if (res1.code === 0) formData.drawer = false;
      } else {
        const res = await addStop(formDataBody);
        if (res.code === 0) formData.drawer = false;
      }
      getList();
    }
  });
};
// 开关
const switchChange = async (item) => {
  await setStoreStatus({
    status: item.onlineStatus === "1" ? 1 : 0,
    storeId: item.storeId,
  });
};
// 平台上线状态
const switchOnlineChange = async (item) => {
  await setShopOnlineStatus({
    ptOnlineStatus: item.ptOnlineStatus === "1" ? 1 : 0,
    storeId: item.storeId,
  });
};
const switchFinalChange = async (item) => {
  await setShopStatus({
    ptStatus: item.ptStatus === "1" ? 1 : 0,
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
const comfirmSetting = async () => {
  const res = await shopConfigSetting(formData.settingForm);
  if (res.code === 0) {
    formData.dialogVisible = false;
  }
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
const handleChange = (value) => {
  console.log(value);
  formData.data.mainStoreTypeId = value.pop();
};
const getOption = async () => {
  const res = await getTypeOptions();
  if (res.code === 0) formData.options = res.data;
};

const getWxPayStatusOption = () => {
  inject("$com")
    .getDict("bill_status,bill_open_status")
    .then((res) => {
      formData.wxPayStatusOption = res.data[0].list;
      formData.settingForm.wxPayStatus = res.data[0].list[0].dictValue;
      formData.wxShareStatusOption = res.data[1].list;
      formData.settingForm.wxShareStatus = res.data[1].list[0].dictValue;
    });
};

onMounted(async () => {
  getOption();
  getWxPayStatusOption();
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