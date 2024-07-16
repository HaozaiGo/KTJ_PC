<template>
  <div class="user-list">
    <UserItem
      v-for="user in users"
      :key="user.roomId"
      :user="user"
      :has-new-message="Number(user.readStatus)"
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
  props:{
    users: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
   
    }
  },
  methods: {
    selectUser(user) {
      
      this.$emit('userSelected', user)
      user.readStatus = false // 清除新消息标记
    }
  }
}
</script>

<style scoped>
.user-list {
  margin-right: 15px;
  min-width: 250px;
  max-width: 300px;
  /* border-right: 1px solid #e0e0e0; */
  overflow-y: auto;
  background-color: #fff;
}
</style>
