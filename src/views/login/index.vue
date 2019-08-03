<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">隆辉腾管理系统</h3>
      </div>
      <el-alert
        v-if="checkLogin"
        :title="checkLoginMsg"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="verification" class="verify-item">
        <span class="svg-container">
          <svg-icon icon-class="verify" />
        </span>
        <el-input
          class="verify-input"
          ref="verification"
          v-model="loginForm.verification"
          placeholder="验证码"
          name="verification"
          type="text"
          tabindex="3"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <el-button
          class="verify-button"
          type="danger"
          round
          size="mini"
          :disabled="verifyButtonFlag"
          @click.native.prevent="handleGetVerifyCode"
        >{{verifyButtonText}}</el-button>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登陆</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getVerifyCode, sina } from "@/api/user";
import { clearTimeout, clearInterval } from "timers";

export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码至少6位数"));
      } else {
        callback();
      }
    };
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validateVerification = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        verification: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        verification: [
          { required: true, trigger: "blur", validator: validateVerification }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      timecount: 60,
      verifyButtonText: "获取验证码",
      verifyButtonFlag: false,
      checkLogin: false,
      checkLoginMsg: "等待管理员确认中"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    checkLoginVal() {
      return this.$store.getters.status;
    }
  },
  watch: {
    checkLoginVal(newVal, oldVal) {
      this.checkLogin = newVal;
    }
  },
  created() {
    this.fastLogin();
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              // this.$router.push({ path: this.redirect || "/" });
              this.$router.push({ path: "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message.error("请输入登陆信息");
          return false;
        }
      });
    },
    handleGetVerifyCode() {
      if (this.loginForm.username == "") {
        this.$message.error("请先输入用户名");
        return;
      }
      getVerifyCode({ username: this.loginForm.username });
      this.time();
    },
    time() {
      this.verifyButtonFlag = true;
      this.verifyButtonText = this.timecount + "秒后重新获取";
      this.timecount = this.timecount - 1;
      if (this.timecount == 0) {
        this.verifyButtonFlag = false;
        this.verifyButtonText = "点击重新获取";
        this.timecount = 60;
        return;
      }
      setTimeout(this.time, 1000);
    },
    fastLogin() {
      if (this.$store.getters.token) {
        if (this.$store.getters.token.indexOf("true") > -1) {
          // if (this.$store.getters.loginStatus) {
          this.$store.dispatch("user/fastLogin", { index: "fast" }).then(() => {
            this.$router.push({ path: "/" });
          });
          // }
        }
      }
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("https://lhtpic01.oss-cn-shenzhen.aliyuncs.com/common/bg-pattern.png"),
    linear-gradient(to left, #328944, #247cdc);
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .verify-input {
    width: 30%;
  }

  .verify-button {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    float: right;
    margin: 12px 5px;
  }
}
</style>
