<template>
  <el-upload
    v-model:file-list="waitFileList"
    class="avatar-uploader"
    :on-change="onUpload"
    multiple
    :auto-upload="false"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="limitNum"
    :on-exceed="handleExceed"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    <template #tip>
      <div class="el-upload__tip" v-if="showTip">
        支持jpg/jpeg/png；图片大小不能超过10M；文件大小不超过20M；最多上传{{
          limitNum
        }}个文件
      </div>
    </template>
  </el-upload>
  <!--文件预览及下载-->
  <!-- <div class="previewDownload">
    <el-link
      :underline="false"
      type="primary"
      style="margin-right: 10px"
      v-for="item in fileList"
      :key="item.id"
      @click.prevent="downloadFile(item.url, item.name)"
      >下载</el-link
    >
  </div> -->
</template>
<script setup>
import { ref, watch, inject, onMounted,defineExpose } from "vue";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import common from "@/utils/common";
const props = defineProps({
  // 需要自己设置action 外部的接口上传
  action: {
    default: false,
    type: Boolean,
  },
  // 开启压缩
  compress: {
    default: false,
    type: Boolean,
  },
  upLoadOne: {
    default: true,
    type: Boolean,
  },
  limitNum: {
    default: 5,
    type: Number,
  },
  type: {
    default: 1,
    type: Number,
  },
  projectId: {
    default: "",
    type: String,
  },
  fileList: {
    default: () => {
      return [];
    },
    type: Array,
  },
  showTip: {
    default: false,
    type: Boolean,
  },
});
const filePath = localStorage.getItem("filePath");
let waitFileList = ref([]);
waitFileList.value = props.fileList;

onMounted(() => {
  baseUrl.value = inject("$com").baseUrl;
  role.value = inject("$com").role;
});

watch(
  () => props.fileList,
  () => {
    console.log("props.fileList====>", props.fileList);

    waitFileList.value = props.fileList;
    if (props.fileList.length >= 1) {
      imageUrl.value = filePath + props.fileList[0].url;
      console.log(imageUrl.value);
    } else {
      imageUrl.value = "";
    }
  }
);
const baseUrl = ref("");
const role = ref("");
const emits = defineEmits(["uploadSuccess", "updateFile"]);
const imageUrl = ref("");
// 回显图
if (props.fileList.length >= 1) {
  imageUrl.value = filePath + props.fileList[0].url;
} else {
  imageUrl.value = "";
}
// 上传图片
const onUpload = async (file, fileList) => {
  console.log(file);
  console.log(fileList);
  let rawFile = file.raw;
  imageUrl.value = URL.createObjectURL(file.raw);
  if (
    (rawFile.type == "image/jpeg" && rawFile.size / 1024 / 1024 > 5) ||
    (rawFile.type == "image/png" && rawFile.size / 1024 / 1024 > 5) ||
    (rawFile.type == "image/jpg" && rawFile.size / 1024 / 1024 > 5)
  ) {
    ElMessage.error("图片大小不能超过5MB!");
    fileList.splice(-1, 1); //移除当前超出大小的文件
    return false;
  } else if (rawFile.size / 1024 / 1024 > 70) {
    
    ElMessage.error("文件大小不能超过70MB!");
    fileList.splice(-1, 1); //移除当前超出大小的文件
    return false;
  } else {
    console.log("上传");

    try {
      if (props.upLoadOne && fileList.length > 1) {
        fileList.splice(0, 1);
      }
      if (props.action) {
        if (props.compress) {
          // 压缩图片
          common.compress(rawFile, function (val) {
            let newfile = new window.File([val], file.name, {
              type: file.type,
            });
            // console.log(newfile);
            // console.log('----压缩');
            // newfile.uid = file.uid;
            emits("uploadSuccess", newfile, props.projectId);
          });
        } else {
          emits("uploadSuccess", rawFile, props.projectId);
        }
      } else {
        const loadingInstance = ElLoading.service({
          text: "正在上传",
          background: "rgba(0,0,0,.2)",
        });

        loadingInstance.close();
        // const res = await uploadFileApi(rawFile, props.projectId, props.type);
        console.log("上传success");
      }
    } catch (error) {
      fileList.splice(-1, 1); //移除当前超出大小的文件
      console.log(error);
      ElMessage.warning(`图片上传失败`);
    }
  }
  return true;
};
// 清空图片
const clearImg = () => {
  imageUrl.value = "";
};

const handleRemove = (file, uploadFiles) => {
  console.log(file);
  console.log(uploadFiles);
  if (props.upLoadOne) {
    imageUrl.value = "";
  }
  emits("updateFile", uploadFiles, props.projectId);
};

const handlePreview = (uploadFile) => {
  // console.log(uploadFile);
};

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is ${props.limitNum}, you selected ${
      files.length
    } files this time, add up to ${files.length + uploadFiles.length} totally`
  );
};

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`确定移除 ${uploadFile.name}文件 ?`).then(
    () => true,
    () => false
  );
};
defineExpose({
  clearImg
})
</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
}
.previewDownload {
  margin-top: 80px;
  margin-left: 50px;
  display: flex;
  flex-direction: column;

  .el-link {
    height: 40px;
  }
}
</style>