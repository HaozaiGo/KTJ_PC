<template>
  <div class="chat-input">
    <input
      v-model="newMessage"
      @keyup.enter="send"
      placeholder="请输入信息"
    />
    <button @click="send">发送</button>
  </div>
</template>

<script>
export default {
  name: "ChatInput",
  data() {
    return {
      newMessage: "",
    };
  },
  methods: {
    send() {
      if (this.newMessage.trim()) {
        this.$emit("sendMessage", this.newMessage);
        this.newMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}
.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chat-input button {
  padding: 10px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
}
</style>
