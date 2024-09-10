<template>
  <div class="chat-window content">
    <div class="chat-header">小帮客服</div>
    <MessageList :messages="messages" />
    <ChatInput @sendMessage="sendMessage" />
  </div>
</template>

<script>
import MessageList from "./components/MessageList.vue";
import ChatInput from "./components/ChatInput.vue";
import { merchantGetBeforeChatContent } from "@/api/project/operation/callCenter.js";
import common from "@/utils/common";
import { encryptMessage } from "@/utils/encrypt.js";
export default {
  name: "call-Us",
  isRouter: true,
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
      socketUrl: null,
      ws: null,
      staffId: null,
    };
  },
  watch: {
    selectedUser(newVal) {
      if (newVal) {
        // this.messages = [
        //   { id: 1, text: "Hello", sender: "user" },
        //   { id: 2, text: "Hi, how can I help you?", sender: "bot" },
        // ];
      }
    },
  },
  methods: {
    // 获取之前的客服聊天记录
    async getBeforeChatContent() {
      const res = await merchantGetBeforeChatContent({
        pageSize: 30,
      });
      if (res.code === 0) {
        this.messages = res.rows;
        this.setSocket();
      }
    },
    // 获取list websocket
    setSocket() {
      var that = this;
      this.socketUrl = common.socketUrl;
      this.staffId = window.localStorage.getItem("staffId");
      // 连接websocket
      this.ws = new WebSocket(
        `${this.socketUrl}/api/ws/cs/message/point/store/${this.staffId}`
      );

      // 监听消息
      this.ws.addEventListener("message", function (event) {
        try {
          var data = event.data;
          if (data === "连接成功") return;
          // 新消息到来
          that.messages.push({
            message: data,
            messageId: that.messages[that.messages.length - 1].messageId + 1,
            type: "platform",
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
        type: "store",
      });

      const sendMsg = JSON.stringify({
        formId: this.staffId,
        formType: "store",
        toId: 0,
        toType: "platform",
        content: message,
      });
      // 发送消息
      this.ws.send(encryptMessage(sendMsg));
    },
  },
  mounted() {
    this.getBeforeChatContent();
  },
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 10px) !important;
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
