<template>
  <div :class="['message-item', message.type]">
    <div :class="['message-text', message.type]">
      {{ message.message }}
    </div>
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
  justify-content: flex-start;
}
.message-item.store {
  justify-content: flex-start;
}
.message-item.platform {
  justify-content: flex-end;
}
.message-text.platform {
  max-width: 60%;
  padding: 10px;
  border-radius: 5px;
  background-color: #e1ffc7;
}
.message-text.user {
  max-width: 60%;
  padding: 10px;
  border-radius: 5px;
  background-color: #ffffff;
}
.message-text.store {
  max-width: 60%;
  padding: 10px;
  border-radius: 5px;
  background-color: #ffffff;
}
.message-item.user .message-text {
  background-color: #ffffff;
}
.message-item.store .message-text {
  background-color: #ffffff;
}
.message-item.platform .message-text {
  background-color: #e1ffc7;
}
</style>
