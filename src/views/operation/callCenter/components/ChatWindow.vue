<template>
  <div class="chat-window" v-if="selectedUser">
    <div class="chat-header">{{ selectedUser.nickName }}</div>
    <MessageList :messages="messages" />
    <ChatInput @sendMessage="sendMessage" />
  </div>
  <div v-else class="chat-placeholder">
    <!-- Please select a user to start chatting. -->
    请选择一个要回复的客户
  </div>
</template>

<script>
import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import { getChatRoomContent } from "@/api/project/operation/callCenter.js";
import common from "@/utils/common";
import { encryptMessage } from "@/utils/encrypt.js";
export default {
  props: {
    selectedUser: {
      type: Object,
      required: false,
    },
  },
  components: {
    MessageList,
    ChatInput,
  },
  data() {
    return {
      messages: [],
      ws: null,
      customerId: null,
    };
  },
  watch: {
    selectedUser(newVal) {
      if (newVal) {
        this.customerId = newVal.customerId;
        console.log(newVal);
        this.getRoomMessage();
        this.openWebSocket();
        // this.messages = [
        //   { id: 1, text: "Hello", sender: "user" },
        //   { id: 2, text: "Hi, how can I help you?", sender: "bot" },
        // ];
      }
    },
  },
  methods: {
    // 获取对应room的信息
    async getRoomMessage() {
      const res = await getChatRoomContent({
        roomId: this.selectedUser.roomId,
        pageSize: 20,
      });
      if (res.code === 0) {
        this.messages = res.rows;
      }
    },
    // 打开websockeet
    openWebSocket() {
      const url = common.socketUrl;
      var that = this;
      this.ws = new WebSocket(`wss://${url}/ws/cs/message`);

      // 监听消息
      this.ws.addEventListener("message", function (event) {
        try {
          var data = event.data;
    
          // 新消息到来
          that.messages.push({
            message: data,
            messageId: that.messages[that.messages.length - 1].messageId + 1,
            type: "user",
            sendTime: new Date().toLocaleString(),
          });
        } catch (err) {
          console.log(err);
        }
      });
    },

    sendMessage(message) {
      this.messages.push({
        id: this.messages.length + 1,
        message: message,
        type: "platform",
      });

      const sendMsg = JSON.stringify({
        formId: 0,
        formType: "platform",
        toId: this.customerId,
        toType: "user",
        content: message,
      });

      console.log(sendMsg);
      // 发送消息
      this.ws.send(encryptMessage(sendMsg));
    },
  },
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 100px);
}
.chat-header {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #f5f5f5;
}
.chat-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100vh;
  color: #aaa;
}
</style>
