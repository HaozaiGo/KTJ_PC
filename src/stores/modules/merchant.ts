import { defineStore } from "pinia"
export const merchant = defineStore("merchants", {
  // 其他配置...
  state: () => ({ isAdmin: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})