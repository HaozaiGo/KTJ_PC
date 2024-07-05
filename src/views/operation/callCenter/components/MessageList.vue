<template>
  <div class="message-list">
    <MessageItem
      v-for="message in messages"
      :key="message.messageId"
      :message="message"
    />
  </div>
</template>

<script>
import MessageItem from "./MessageItem.vue";

export default {
  name: "MessageList",
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  components: {
    MessageItem,
  },
};
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
}
</style>
