<template>
  <div class="chat-window" v-if="selectedUser">
    <div class="chat-header">{{ selectedUser.name }}</div>
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
    };
  },
  watch: {
    selectedUser(newVal) {
      if (newVal) {
        // Reset the messages or load messages for the selected user
        this.messages = [
          { id: 1, text: "Hello", sender: "user" },
          { id: 2, text: "Hi, how can I help you?", sender: "bot" },
        ];
        // 模拟新消息到来
        // setTimeout(() => {
        //   this.$emit("newMessage", newVal.id);
        //   this.messages.push({
        //     id: this.messages.length + 1,
        //     text: "You have a new message!",
        //     sender: "bot",
        //   });
        // }, 5000);
      }
    },
  },
  methods: {
    sendMessage(message) {
      this.messages.push({
        id: this.messages.length + 1,
        text: message,
        sender: "user",
      });
      // 模拟机器人回复
      setTimeout(() => {
        this.messages.push({
          id: this.messages.length + 1,
          text: "This is an automated response.",
          sender: "bot",
        });
      }, 1000);
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
