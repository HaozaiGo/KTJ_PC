<template>
  <div class="login-container">
    <div class="logo">
      <img
        src="@/assets/img/login_images/Logo.png"
        alt="logo"
        style="width: 220px; height: 230px"
      />
      <div>
        <img
          src="@/assets/img/login_images/text.png"
          alt="logo"
          style="width: 400px; height: 150px; margin-left: 40px"
        />
      </div>
    </div>
    <div class="login-box">
      <div class="tab">
        <div :class="{ active: isAccountLogin }" @click="isAccountLogin = true">
          账号密码登录
        </div>
        <div
          :class="{ active: !isAccountLogin }"
          @click="isAccountLogin = false"
        >
          手机验证登录
        </div>
      </div>
      <div v-if="isAccountLogin">
        <!-- <el-form
          ref="ruleFormRef"
          :model="state.LoginForm"
          :rules="rules"
          label-width="auto"
        >
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
        </el-form> -->
        <input type="text" placeholder="账号" v-model="account" />
        <input
          type="password"
          placeholder="密码"
          v-model="password"
          @keyup.enter="login"
        />
        <button @click="login">登录</button>
      </div>
      <div v-else>
        <input type="text" placeholder="手机号" v-model="phone" />
        <input type="text" placeholder="验证码" v-model="code" />
        <button @click="login">登录</button>
      </div>
      <div class="register">
        <a>注册账号 免费入驻</a>
      </div>
    </div>

    <!-- 底部备案号 -->
    <div class="beian">
      <div style="text-align: center">
        <div class="flex contact" style="justify-content: center;margin-bottom: 10px;">
          <div>
            <p style="font-size: 16px;color: #000;font-weight: bold;">联系邮箱</p>
            <p>bdnc1c@qq.com</p>
          </div>
          <div>
            <p style="font-size: 16px;color: #000;font-weight: bold;">商家咨询请致电</p>
            <p>15363821692</p>
          </div>
        </div>
        <a style="color: #000;margin-right: 10px;" >
          佛山市魁腾蛟科技有限公司
        </a>
        <a style="color: #000" href="https://beian.miit.gov.cn/">
          ICP备案/许可证号： 粤ICP备2024277904号
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { marchentLogin, getMarchentRoute } from "@/api/common/user.js";
export default {
  data() {
    return {
      isAccountLogin: true,
      account: "132564987123",
      password: "123456",
      phone: "",
      code: "",

      state: {
        loading: false,
        LoginForm: {
          username: "",
          password: "",
        },
      },
    };
  },
  methods: {
    async login() {
      if (this.isAccountLogin) {
        console.log("Account:", this.account);
        console.log("Password:", this.password);
        if (this.account == "" || this.password == "") {
          this.$message.error("账号或密码不能为空");
          return;
        }
        try {
          this.state.LoginForm.username = this.account;
          this.state.LoginForm.password = this.password;

          const res = await marchentLogin(this.state.LoginForm);
          this.state.loading = true;
          if (res.code === 0) {
            //设置token
            window.localStorage.setItem("token", res.data.token);
            //获取商家路由
            const marchantRoute = await getMarchentRoute();

            window.localStorage.setItem(
              "routes",
              JSON.stringify(marchantRoute.data)
            );
            window.localStorage.setItem("role", "merchant");
            this.state.loading = false;
            setTimeout(() => {
              this.$router.push("/home");
            }, 200);
          } else {
            this.state.loading = false;
          }
        } catch (e) {
          this.$message.error("账号或密码错误");
        }
      } else {
        console.log("Phone:", this.phone);
        console.log("Code:", this.code);
      }
    },
  },
};
</script>

<style scoped>
.contact div{
  border-left: 1px dotted #ccc;
  border-right: 1px dotted #ccc;
  padding: 0px 20px;
}
.beian {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  a{
    font-size: 12px;
  }
}
.login-container {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  /* background-color: #ebcc9d; */
  background-color: #d9ead39e;
  height: 100vh;
  justify-content: center;
}

.logo {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
  transform: translateX(-130px);
}

.logo img {
  height: 100px;
}

.logo h1 {
  font-size: 32px;
  margin: 10px 0;
}

.logo p {
  font-size: 24px;
  color: #000;
}

.login-box {
  background-color: #fff;
  padding: 80px 50px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-width: 22vw;
}

.tab {
  display: flex;
  justify-content: space-around;
  margin-bottom: 29px;
  font-size: 21px;
}

.tab button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
}
.tab div {
  padding: 0px 10px;
}
.tab div.active {
  border-bottom: 2px solid #000;

  font-weight: bold;
}
.tab div:hover {
  /* background-color: #d9ead3; */
  cursor: pointer;
}

.login-box input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 17px;
  margin-bottom: 18px;
}

.login-box button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  border: none;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;
}

.register {
  text-align: center;
  margin-top: 20px;
}

.register a {
  color: #4caf50;
  text-decoration: none;
}
</style>
