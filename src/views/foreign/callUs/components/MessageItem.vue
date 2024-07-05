<template>
  <div :class="['message-item', message.sender]">
    <div class="message-text">{{ message.text }}</div>
  </div>
</template>

<script>
export default {
  name: "messageItem",
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.message-item {
  display: flex;
  margin-bottom: 10px;
}
.message-item.user {
  justify-content: flex-end;
}
.message-item.bot {
  justify-content: flex-start;
}
.message-text {
  max-width: 60%;
  padding: 10px;
  border-radius: 5px;
  background-color: #e1ffc7;
}
.message-item.user .message-text {
  background-color: #dcf8c6;
}
.message-item.bot .message-text {
  background-color: #fff;
}
</style>
