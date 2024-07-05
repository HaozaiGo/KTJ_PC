<template>
  <div class="content chat-center">
    <UserList @userSelected="handleUserSelected" :users="users" />
    <ChatWindow :selectedUser="selectedUser" @newMessage="handleNewMessage" />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import ChatWindow from "./components/ChatWindow.vue";
import UserList from "./components/UserList.vue";
import {
  getUserList,
  updateReadStatus,
} from "@/api/project/operation/callCenter.js";
defineOptions({
  name: "Call-center",
  isRouter: true,
});
const users = ref([
  {
    id: 1,
    name: "User 1",
    avatar: "https://via.placeholder.com/40",
    hasNewMessage: false,
  },
]);
const socketUrl = ref(null);
const selectedUser = ref(null);
const handleUserSelected = (user) => {
  // console.log(user);
  selectedUser.value = user;
  // 更新状态
  updateReadStatus(user.roomId);
};
const handleNewMessage = (userId) => {
  // console.log(userId);
  const user = users.value.find((u) => u.id === userId);

  if (user && (!selectedUser.value || selectedUser.value.id !== userId)) {
    user.hasNewMessage = true;
  }
};
const getUserListApi = async () => {
  const res = await getUserList();

  if (res.code === 0) {
    users.value = res.rows;
    getUserListSocket();
  }
};
// 获取list websocket
const getUserListSocket = () => {
  // 连接websocket
  const url = socketUrl.value;
  var ws = new WebSocket(`ws://${url}/ws/cs/room`);
  // console.log(ws);
  // 监听消息
  ws.onmessage = function (event) {
    console.log(event);

    try {
      const data = JSON.parse(event.data);
      console.log(data);

      const replaceId = users.value.findIndex(
        (user) => user.roomId === data.roomId
      );
      console.log(replaceId);
      //  列表有这个用户，更新状态
      if (replaceId !== -1) {
        users.value.splice(replaceId, 1, data);
        console.log(users.value);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };
};

onMounted(() => {
  getUserListApi();
  // console.log(`the component is now mounted.`);
  socketUrl.value = inject("$com").socketUrl;
});
</script>

<style lang="scss" scoped>
.chat-center {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
</style>