<template>
  <div class="user-item" @click="handleClick">
    <img
      :src="user.avatarUrl ? filePath + user.avatarUrl : defalutAvatar"
      alt="avatar"
      class="avatar"
    />
    <div class="user-info">
      <div class="user-name">{{ user.nickName }}</div>
      <div v-if="hasNewMessage" class="new-message-indicator"></div>
    </div>
  </div>
</template>

<script>
import defalutAvatar from "@/assets/img/commonPic/avatar.png";
export default {
  name: "UserItem",
  data() {
    return {
      filePath: localStorage.getItem("filePath"),
      defalutAvatar,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    hasNewMessage: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit("click", this.user);
    },
  },
  mounted() {
    // console.log(this.hasNewMessage);
  },
};
</script>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}
.user-item:hover {
  background-color: #f9f9f9;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-name {
  font-size: 16px;
  color: #333;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.new-message-indicator {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>
