
<!-- 该组件还没使用 -->
<template>
  <div class="img-container">
    <template v-if="imgList.length">
      <div
        v-for="(url, index) in imgList"
        :key="url + index"
        class="single-image-show"
      >
        <img :src="url" alt="" />
        <div class="image-operation">
          <span @click="removeSingleImage(url)">删除</span>
          <span @click="viewImage(url)">查看</span>
        </div>
      </div>
    </template>
    <el-upload
      :file-list="imgList"
      ref="selfUpload"
      v-if="imgList.length < limit"
      class="upload-demo"
      action="#"
      :accept="accept"
      :list-type="listType"
      :multiple="isMultiple"
      :limit="limit"
      :drag="drag"
      :show-file-list="false"
      :http-request="uploadFileRequest"
      :before-upload="computedBeforeUpload"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :on-progress="handleUploadProgress"
    >
      <template v-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <slot name="tip"></slot>
        </div>
      </template>
      <i
        v-else-if="'picture-card'"
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
    <slot></slot>
  </div>
</template>
  
  <script>
// import { uploadFile } from "@/api/common/util";

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },

    customBeforeUpload: {
      // 上传前函数
      type: Function,
      default: null,
    },
    limit: {
      type: Number,
      default: 5,
    },
    accept: {
      type: String,
      default: "*",
    },
    listType: {
      type: String,
      default: "picture-card",
    },
    drag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    imgList: {
      get() {
        return this.value;
      },
      set(newList) {
        this.$emit("input", newList);
      },
    },
    computedBeforeUpload() {
      return this.customBeforeUpload || this.defaultBeforeUpload;
    },
    isMultiple() {
      return this.limit - this.imgList.length >= 2;
    },
  },
  inject: ["showImages"],
  methods: {
    defaultBeforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error("上传文件大小不能超过 20MB!");
        return false;
      }

      return true;
    },
    removeSingleImage(url) {
      console.log(url);
      const updatedList = this.imgList.filter((item) => item !== url);
      console.log(updatedList);
      this.imgList.shift();
      // this.imgList = updatedList;
    },
    viewImage(url) {
      this.showImages([url]);
      // this.$emit('view-image', imgBase64)
    },
    async uploadFileRequest({ file, onSuccess, onError }) {
      console.log(this.imgList.length, this.limit, file);
      if (this.imgList.length >= this.limit) {
        this.$message.error(`最多只能上传 ${this.limit} 个文件`);
        console.log("中断");
        return; // 阻止文件上传
      }
      console.log("继续执行");

      await this.uploadSingleFile(file, onSuccess, onError);
    },
    async uploadSingleFile(file, onSuccess, onError) {
      let formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("storeId", 3);

      try {
        // const res = await uploadFile(formData, {
        //   fileAttribute: "image",
        //   fileType: "screenshot",
        // });
        // if (res.code === 0) {
        //   onSuccess(this.imgList);
        // }
        console.log(this.imgList);
      } catch (error) {
        onError(error);
      }
    },
    /** 文件上传成功函数 */
    handleUploadSuccess(response) {
      console.log(response);
      if (response) {
        // const imgUrls = response.data.map((file) => file.srcUrl);
        this.imgList.push(
          "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        );
        console.log(this.imgList);
        // imgUrls.forEach(imgUrl => {
        //   if ( (!this.imgList.some(basePath => basePath === imgUrl) ) || this.imgList.length === 0 ) {
        //     this.imgList = [...this.imgList, imgUrl]
        //   }
        // })
      }
    },
    handleExceed(files, fileList) {
      console.log(this.limit, fileList, 111, files);

      this.$message.error(`最多只能上传 ${this.limit} 个文件`);
    },
    handleUploadError() {
      this.$message.error("上传失败");
    },
    handleUploadProgress(event) {
      console.log(event, "上传进度：");
      // console.log(`上传进度：${Math.round((event.loaded / event.total) * 100)}%`)
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.single-image-show {
  position: relative;
  width: 148px;
  height: 148px;
  margin-bottom: 20px;
  img {
    height: 100%;
    width: 100%;
    border-radius: 3px;
  }
  margin-right: 20px;
  .image-operation {
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 2px;
    width: 100%;
    height: 36px;
    > span {
      flex: 1;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
      &:first-child {
        background-color: #454545;
        opacity: 0.6;
        border-radius: 0px 0px 0px 3px;
      }
      &:last-child {
        background-color: #0f2484;
        opacity: 0.6;
        border-radius: 0px 0px 3px 0px;
      }
    }
  }
}

.file-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 3px;
  background: #fafafa;
  cursor: pointer;
}
</style>
  