<template>
  <div class="content">
    <div class="search">
      <el-input
        v-model="query.storeName"
        style="width: 200px"
        placeholder="店铺名称"
      />
      <el-input
        v-model="query.phone"
        style="width: 200px"
        placeholder="手机号"
      />

      <el-date-picker
        v-model="query.applyTime"
        type="date"
        placeholder="申请时间"
        size="default"
      />
      <el-select
        v-model="query.approveStatus"
        placeholder="审批状态"
        style="width: 200px"
      >
        <el-option
          v-for="item in options"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        />
      </el-select>
      <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
    </div>

    <div>
      <el-table
        :data="tableData.row"
        style="width: 100%; margin: 10px 0"
        row-key="id"
        border
        default-expand-all
        v-loading="state.loading"
      >
        <el-table-column
          prop="storeName"
          label="店铺名称"
          sortable
          width="180"
        />
        <el-table-column
          prop="businessMerchantName"
          label="营业执照的商户名称"
          sortable
        />
        <el-table-column
          prop="mainStoreTypeNames"
          label="主商铺类型"
          sortable
          width="150"
        />
        <el-table-column prop="phone" label="手机号" sortable width="150" />
        <el-table-column prop="linkMan" label="联系人" sortable width="120" />
        <el-table-column
          prop="applyTime"
          label="申请时间"
          sortable
          width="130"
        />
        <el-table-column
          prop="approveTime"
          label="审批时间"
          sortable
          width="130"
        />
        <el-table-column prop="reason" label="不通过原因" sortable />
        <el-table-column prop="approveStatusLabel" label="状态" width="100">
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="check(scope.row)"
            >
              审核
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteUser(scope.row)"
              >删除</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="comeIn(scope.row)"
            >
              特约进件
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="checkInStatus(scope.row)"
            >
              进件状态
            </el-button>
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

    <el-dialog
      v-model="dialogVisible"
      title="商家审核"
      width="1000"
      align-center
    >
      <div>
        <el-descriptions class="margin-top" title="" :column="3" border>
          <template #extra>
            <el-button type="primary">通知商家</el-button>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><House /></el-icon>
                店铺名称
              </div>
            </template>
            {{ state.checkData.storeName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                联系人
              </div>
            </template>
            {{ state.checkData.linkMan }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <iphone />
                </el-icon>
                手机号
              </div>
            </template>
            {{ state.checkData.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <location />
                </el-icon>
                店铺地址
              </div>
            </template>
            {{ state.checkData.storeAddress
            }}<el-tag size="small">选择地址</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <office-building />
                </el-icon>
                省市区
              </div>
            </template>
            {{ state.checkData.provinces }}/{{ state.checkData.citys }}/{{
              state.checkData.districts
            }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><Message /></el-icon>邮箱
              </div>
            </template>
            {{ state.checkData.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">营业执照的商户名称</div>
            </template>
            {{ state.checkData.businessMerchantName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">营业执照法人名称</div>
            </template>
            {{ state.checkData.businessLegalName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">注册号/统一社会信用代码</div>
            </template>
            {{ state.checkData.businessLicenseNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">银行卡号</div>
            </template>
            {{ state.checkData.bankNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">主商铺类型</div>
            </template>
            {{ state.checkData.mainStoreTypeNames }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">副商铺类型</div>
            </template>
            {{ state.checkData.deputyStoreTypeNames }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证人名称</div>
            </template>
            {{ state.checkData.identityName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证号</div>
            </template>
            {{ state.checkData.identityNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">申请时间</div>
            </template>
            {{ state.checkData.applyTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">店铺封面图</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api/api' + state.checkData.coverUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="['/api/api' + state.checkData.coverUrl]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">身份证正面</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api/api' + state.checkData.identityPositiveUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                '/api/api' + state.checkData.identityPositiveUrl,
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
              :src="'/api/api' + state.checkData.identityNegativeUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[
                '/api/api' + state.checkData.identityNegativeUrl,
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
              :src="'/api/api' + state.checkData.permitUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="['/api/api' + state.checkData.permitUrl]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">银行卡</div>
            </template>
            <el-image
              style="width: 150px; height: 100px"
              :src="'/api/api' + state.checkData.bankUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="['/api/api' + state.checkData.bankUrl]"
              fit="cover"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">其他证件</div>
            </template>
          </el-descriptions-item>
        </el-descriptions>
        <el-radio-group
          v-model="state.setCheck.approveStatus"
          style="margin-top: 20px"
        >
          <el-radio
            v-for="(item, index) in state.setCheckOptions"
            :key="index"
            :value="item.dictValue"
            >{{ item.dictLabel }}</el-radio
          >
        </el-radio-group>
        <el-input
          v-model="state.setCheck.reason"
          style="width: 500px; display: block; margin-top: 20px"
          :rows="3"
          type="textarea"
          placeholder="审核备注"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleComfirm()" type="primary">审核</el-button>
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="state.dialogVisible1" title="查看进件状态" width="900">
      <el-descriptions class="margin-top" :column="3" size="Default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">业务申请编号</div>
          </template>
          {{ state.comeInStuteData.businessCode }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">微信支付申请单号</div>
          </template>
          {{ state.comeInStuteData.applymentId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">特约商户号</div>
          </template>
          {{ state.comeInStuteData.subMchid }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">超级管理员签约链接</div>
          </template>
          <el-image
            style="width: 100px; height: 100px"
            :src="state.comeInStuteData.signUrl"
            :fit="fit"
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">申请单状态</div>
          </template>
          {{ state.comeInStuteData.applymentState }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">申请状态描述</div>
          </template>
          {{ state.comeInStuteData.applymentStateMsg }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">驳回原因详情</div>
          </template>
          {{ state.comeInStuteData.auditDetail[0].rejectReason }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getLists,
  checkInfo,
  passCheck,
  deleteRow,
  comeInApi,
  checkComeStatus,
} from "@/api/project/merchant/settledPlatform.js";
defineOptions({
  name: "settled-Platform",
  isRouter: true,
});
const options = ref([]); //审批状态
const query = reactive({
  storeName: "",
  phone: "",
  applyTime: "",
  approveStatus: "",
  pageNum: 1,
});
const dialogVisible = ref(false);

const tableData = ref({
  row: [],
  total: 0,
});
const check = async (row) => {
  state.setCheck.applyId = row.applyId;
  state.setCheck.approveStatus = "";
  state.setCheck.reason = "";
  const res = await checkInfo(state.setCheck.applyId);
  if (res.code === 0) {
    state.checkData = res.data;
  }
  dialogVisible.value = true;
};
const state = reactive({
  loading: false,
  dialogVisible1: false,
  checkData: {},
  setCheck: {
    applyId: "",
    approveStatus: "",
    reason: "",
  },
  setCheckOptions: [],
  comeInStuteData: {}, //进件状态
});
const comeIn = async (row) => {
  state.loading = false;
  const res = await comeInApi({ applyId: row.applyId });
  state.loading = true;
};
const handleComfirm = async () => {
  if (state.setCheck.approveStatus === "") {
    ElMessage({
      type: "warning",
      message: `请选择审核结果！`,
    });
  } else {
    const res = await passCheck(state.setCheck);
    if (res.code === 0) {
      dialogVisible.value = false;
      getList();
    }
  }
};
const checkInStatus = async (row) => {
  const res = await checkComeStatus({
    applyId: row.applyId,
    applymentId: row.applymentId,
  });
  if (res.code === 0) {
    state.comeInStuteData = res.data;
  }
  state.dialogVisible1 = true;
};
const changePageSize = (e) => {
  query.pageNum = e;
  getList();
};
const getList = async () => {
  const res = await getLists(query);
  if (res.code === 0) {
    tableData.value.row = res.rows;
    tableData.value.total = res.total;
  }
};
const deleteUser = (row) => {
  ElMessageBox.confirm("确定删除所选数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteRow(row.applyId);
      getList();
    })
    .catch((action) => {
      console.log(action);
    });
};

onMounted(async () => {
  inject("$com")
    .getDict("bill_approve_status,bill_approve_status")
    .then((res) => {
      options.value = res.data[0].list;
      const idx = res.data[0].list.findIndex((x) => x.isDefault === "1");
      query.approveStatus = res.data[0].list[idx].isDefault;

      state.setCheckOptions = res.data[1].list;
      getList();
    });
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