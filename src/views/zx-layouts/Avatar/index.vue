<template>
  <div class="avatarddddd flex-c">
    <el-dropdown
      placement="bottom"
      @command="handleCommand"
      v-if="role === 'merchant'"
    >
      <span style="color: #000" class="flex-c">
        <el-icon size="15"><Shop /></el-icon>
        {{ storeName || "切换分店" }}
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, idx) in ShopOptions"
            :key="idx"
            :command="item"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div
      :title="'客服'"
      style="float: left; cursor: pointer; display: flex; align-items: center"
      @click="callUs"
      v-if="role === 'merchant'"
    >
      <el-icon color="#000"><User /></el-icon>
      <span style="color: #000">客服</span>
    </div>
    <div
      :title="'退出'"
      style="float: left; display: flex; cursor: pointer; align-items: center"
      @click="logout"
    >
      <el-icon color="#000"><SwitchButton /></el-icon>
      <span style="color: #000">退出</span>
    </div>
    <!-- 重置密码 -->
    <el-dialog
      v-dialogDrag
      title="修改密码"
      width="500px"
      :visible.sync="resetPasswdFormVisible"
      :modal="false"
    >
      <el-form
        :model="resetPasswdForm"
        :rules="resetPasswdRules"
        ref="resetPasswdRules"
        :inline="true"
      >
        <el-form-item
          label="重置密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            placeholder="默认888888"
            show-password
            clearable
            v-model="resetPasswdForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          icon="iconfont iconbianji"
          @click="changePass('resetPasswdRules')"
          >确 定</el-button
        >
        <el-button
          type="danger"
          plain
          icon="iconfont iconquxiao"
          @click="resetPasswdFormVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { rules } from "@/utils/rules";
import { gerShopOption } from "@/api/project/foreign/employee.js";
export default {
  name: "Avatar",
  data() {
    return {
      ShopOptions: [],
      storeName: "",
      formLabelWidth: "80px",
      resetPasswdFormVisible: false,
      myInfoDialog: false,
      infoData: {},
      fileList: [],
      resetPasswdForm: {
        password: "888888",
      },
      resetPasswdRules: {
        password: rules.password(),
      },

      role: "", //系统角色
    };
  },
  computed: {},
  mounted() {
    this.role = window.localStorage.getItem("role");
    if (this.role === "merchant") {
      //商家端才有的切换商家店铺
      this.getShopOption();
    }
  },
  methods: {
    handleCommand(e) {
      console.log(e);
      localStorage.setItem(
        "storeId",
        JSON.stringify({ storeId: e.storeId, name: e.name })
      );
      this.storeName = e.name;
    },
    async getShopOption() {
      const res = await gerShopOption();
      if (res.code === 0) {
        this.ShopOptions = res.data;

        const storageStoreId = localStorage.getItem("storeId");
        if (storageStoreId) {
          this.storeName = JSON.parse(storageStoreId).name;
        } else {
          localStorage.setItem(
            "storeId",
            JSON.stringify({
              storeId: res.data[0].storeId,
              name: res.data[0].name,
            })
          );
          this.storeName = res.data[0].name;

        }
      }
    },

    callUs() {
      this.$router.push("/foreign/callUs");
    },
    logout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("storeId");
      window.localStorage.removeItem("routes");
      this.$emit("logout")
      if (this.role === "platform") {
        this.$router.replace(`/login`);
      } else {
        this.$router.replace("/signup");
      }
    },

    changePass(formName) {
      this.$refs[formName].validate((valid) => {
        let body;
        if (valid) {
          let body = {
            userId: this.infoData.userId,
            userName: this.infoData.userName,
            password: this.resetPasswdForm.password,
          };
          resetPwd(body).then((res) => {
            if (res.code == 200) {
              this.$baseMessage(res.msg, "success");
              localStorage.clear(); //清空token
              window.location.href = "/mrbs/login";
            } else {
              this.$baseMessage(res.msg, "error");
            }
            this.resetPasswdFormVisible = false;
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avatarddddd {
  padding-bottom: 8px;
  padding-left: 10px;
  > * {
    margin-top: 9px;
    margin-right: 10px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>