<template>
  <div class="avatarddddd">
    <div
      :title="'客服'"
      style="
        margin-top: 9px;
        margin-right: 10px;
        float: left;
        cursor: pointer;
        display: flex;
        align-items: center;
      "
      @click="callUs"
      v-if="role === 'merchant'"
    >
      <el-icon color="#fff"><User /></el-icon>
      <span style="color: #fff">客服</span>
    </div>
    <div
      :title="'退出'"
      style="
        margin-top: 9px;
        margin-right: 10px;
        float: left;
        display: flex;
        cursor: pointer;
        align-items: center;
      "
      @click="logout"
    >
      <el-icon color="#fff"><SwitchButton /></el-icon>
      <span style="color: #fff">退出</span>
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
export default {
  name: "Avatar",
  data() {
    return {
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
    // console.log(this.role);
  },
  methods: {
    callUs() {
      this.$router.push("/foreign/callUs");
    },
    logout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("routes");
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
    onError(file, fileList) {},
    onSuccess(file, fileList) {
      if (file.code === 200) {
        this.uploadName = file.data;
        this.downloadAvatar(file.data.fileId);
        let data = {
          userId: parseInt(localStorage.getItem("user_id")),
          userName: this.infoData.userName,
          avatar: "/system/file/download/" + file.data.fileId,
        };
        this.uploadAvatar(data);
        this.$message.success("上传成功！");
      } else {
        this.$message.error("上传失败！");
        this.fileList = [];
      }
    },
    // 上传方法
    // handleRemove(file, fileList) {
    // },
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeAvatarUpload(file, fileList) {},
  },
};
</script>
<style lang="scss" scoped>
</style>

<style lang="scss">
.avatarddddd {
  padding-bottom: 8px;
  padding-left: 10px;
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