<!-- 上传图片回显picture-card -->
<template>
  <div>
    <el-upload
      v-model:file-list="props.fileList"
      :action="props.action"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :headers="header"
      :data="props.data"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <!-- <img w-full :src="dialogImageUrl" alt="Preview Image" /> -->
      <el-image style="max-width: 100%" :src="dialogImageUrl" fit="cover" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadProps, UploadUserFile } from "element-plus";
const emit = defineEmits(["remove", "upLoadSuccess"]);
const props = defineProps({
  fileList: {
    type: Array,
    default: () => [],
  },
  action: {
    type: String,
    default: "",
  },
  // 传参
  data: {
    type: Object,
    default: () => {},
  },
});
const handleSuccess = () => {
  emit("upLoadSuccess");
};
const header = ref({
  Authorization: "Bearer " + window.localStorage.getItem("token"),
});
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove: UploadProps["onRemove"] = (
  uploadFile: any,
  uploadFiles
) => {
  console.log(uploadFile, uploadFiles);
  emit("remove", uploadFile.imageId);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>

<style scoped>
</style>