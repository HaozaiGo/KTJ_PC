<template>
  <div class="flex">
    <div class="content chat-center">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="用户粉丝" name="first">
          <UserList @userSelected="handleUserSelected" :users="users"
        /></el-tab-pane>
        <el-tab-pane label="商家" name="second">
          <UserList @userSelected="handleUserSelected" :users="merchantList" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <ChatWindow
      :selectedUser="selectedUser"
      @newMessage="handleNewMessage"
      :type="activeName === 'first' ? 'user' : 'store'"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, inject, nextTick } from "vue";
import ChatWindow from "./components/ChatWindow.vue";
import UserList from "./components/UserList.vue";
import {
  getUserList,
  updateReadStatus,
  getMerchantList,
} from "@/api/project/operation/callCenter.js";
defineOptions({
  name: "Call-center",
  isRouter: true,
});
const activeName = ref("first");
const users = ref([
  {
    id: 1,
    name: "User 1",
    avatar: "https://via.placeholder.com/40",
    hasNewMessage: false,
  },
]);
const merchantList = ref([]);
const socketUrl = ref(null);
const selectedUser = ref(null);
const handleClick = async (e) => {
  await nextTick();
  console.log(activeName.value);

  getUserListApi();
};
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
  if (activeName.value === "first") {
    const res = await getUserList();
    if (res.code === 0) {
      users.value = res.rows;
      getUserListSocket();
    }
  } else if (activeName.value === "second") {
    const res = await getMerchantList({ pageSize: 30 });
    if (res.code === 0) {
      merchantList.value = res.rows;
      getStoreListSocket();
    }
  }
};
// 获取list websocket
const getUserListSocket = () => {
  // 连接websocket
  const url = socketUrl.value;
  var ws = new WebSocket(`${url}/api/ws/cs/room/user`);
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
        users.value.push(data)
      }
    } catch (err) {
      console.log(err);
    }
  };
};
// 获取商家list websocket
const getStoreListSocket = () => {
  // 连接websocket
  const url = socketUrl.value;
  var ws = new WebSocket(`${url}/api/ws/cs/room/store`);
  // 监听消息
  ws.onmessage = function (event) {
    console.log(event);

    try {
      const data = JSON.parse(event.data);
      console.log(data);

      const replaceId = merchantList.value.findIndex(
        (user) => user.roomId === data.roomId
      );
      console.log(replaceId);
      //  列表有这个用户，更新状态
      if (replaceId !== -1) {
        merchantList.value.splice(replaceId, 1, data);
        console.log(merchantList.value);
      } else {
        merchantList.value.push(data);
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
  flex-direction: column;
}
</style>