<template>
  <div class="user-list">
    <UserItem
      v-for="user in users"
      :key="user.id"
      :user="user"
      :has-new-message="user.hasNewMessage"
      @click="selectUser(user)"
    />
  </div>
</template>

<script>
import UserItem from './UserItem.vue'

export default {
  components: {
    UserItem
  },
  data() {
    return {
      users: [
        { id: 1, name: 'User 1', avatar: 'https://via.placeholder.com/40', hasNewMessage: true },
        { id: 2, name: 'User 2', avatar: 'https://via.placeholder.com/40', hasNewMessage: false },
        { id: 3, name: 'User 3', avatar: 'https://via.placeholder.com/40', hasNewMessage: true }
      ]
    }
  },
  methods: {
    selectUser(user) {
      this.$emit('userSelected', user)
      user.hasNewMessage = false // 清除新消息标记
    }
  }
}
</script>

<style scoped>
.user-list {
  margin-right: 15px;
  width: 250px;
  /* border-right: 1px solid #e0e0e0; */
  overflow-y: auto;
  background-color: #fff;
}
</style>
