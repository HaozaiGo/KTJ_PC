<template>
  <div class="loginContent">
    <div class="Box">
      <div class="left">
        <div class="centerBox">
          <img src="@/assets/img/login_images/KTJ_Logo.png" alt="" />
          <h4>帮到你商户线上经营平台</h4>
          <p></p>
        </div>
      </div>
      <div class="right">
        <el-form
          ref="ruleFormRef"
          :model="state.LoginForm"
          :rules="rules"
          label-width="auto"
        >
          <h3>账号登录</h3>
          <el-form-item prop="username">
            <el-input
              v-model="state.LoginForm.username"
              style="width: 286px"
              type="text"
              placeholder="请输入用户名"
          /></el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="state.LoginForm.password"
              style="width: 286px"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            style="width: 286px"
            :loading="state.loading"
            >登录</el-button
          >
          <!-- <input class="loginBtn" value="登录" /> -->
          <p class="no">
            更换登录方式<span
              style="
                text-decoration: underline;
                cursor: pointer;
                font-size: 14px;
              "
              >手机动态码登陆</span
            >
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive, onMounted, ref } from "vue";
import { marchentLogin, getMarchentRoute } from "@/api/common/user.js";
const router = useRouter();
const rules = reactive({
  username: [{ required: true, message: "请填写用户号", trigger: "blur" }],
  password: [{ required: true, message: "请填写密码", trigger: "blur" }],
});
const ruleFormRef = ref(null);
const state = reactive({
  loading: false,
  LoginForm: {
    username: "132564987123",
    password: "123456",
  },
});
const handleLogin = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const res = await marchentLogin(state.LoginForm);
      state.loading = true;
      if (res.code === 0) {
        //设置token
        window.localStorage.setItem("token", res.data.token);
        // window
        //获取商家路由
        const marchantRoute = await getMarchentRoute();

        window.localStorage.setItem(
          "routes",
          JSON.stringify(marchantRoute.data)
        );
        state.loading = false;
        setTimeout(() => {
          router.push("/index");
        }, 200);
      } else {
        state.loading = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
onMounted(() => {
  localStorage.clear();
});
</script>

<style lang="scss" scoped>
.loginContent {
  height: 100vh;
  background: url("https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
    no-repeat;
  background-size: 100% 120%;
}
.Box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 400px;
  display: flex;
}

.left {
  position: relative;
  width: 45%;
  height: 100%;
  background: url("https://img0.baidu.com/it/u=4234357226,4114415663&fm=253&fmt=auto&app=138&f=PNG?w=900&h=462")
    no-repeat;
  background-size: cover;
  opacity: 1;
}

.right {
  position: relative;
  width: 55%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}

.centerBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
}

.left img {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.left p {
  font-size: 14px;
  color: #fff;
}

.left h4 {
  font-size: 18px;
  color: #fff;
  margin-bottom: 10px;
}

.right form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
}

h3 {
  margin-bottom: 20px;
  color: #5f89ca;
}

input {
  width: 100%;
  height: 30px;
  border: 1px solid #5f89ca;
  background-color: transparent;
  padding-left: 10px;
  font-size: 12px;
  color: #000000;
  margin-bottom: 15px;
  outline: none;
}

.loginBtn {
  width: 100%;
  height: 35px;
  line-height: 32px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  background: #5f89ca;
  outline: none;
  border: none;
  margin-top: 10px;
}

.loginBtn:hover {
  cursor: pointer;
  background-color: deepskyblue;
}

.no {
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #000;
}

.yzmBox {
  display: flex;
  justify-content: flex-start;
}

.yzmBox input {
  width: 70%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.yzmBox .btn {
  cursor: pointer;
  width: 29%;
  background-color: #5f89ca;
  color: #ffffff;
  height: 30px;
  outline: none;
  border: 1px solid #5f89ca;
  font-size: 12px;
  margin-left: 1%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>