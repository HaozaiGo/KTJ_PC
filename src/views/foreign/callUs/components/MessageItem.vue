<template>
  <div :class="['message-item', message.type]">
    <div class="message-text">{{ message.message }}</div>
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
.message-item.store {
  justify-content: flex-end;
}
.message-item.platform {
  justify-content: flex-start;
}
.message-text {
  max-width: 60%;
  padding: 10px;
  border-radius: 5px;
  background-color: #e1ffc7;
}
.message-item.store .message-text {
  background-color: #dcf8c6;
}
.message-item.platform .message-text {
  background-color: #fff;
}
</style>
