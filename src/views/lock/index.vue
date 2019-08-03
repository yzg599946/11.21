<template>
  <div class="lock-container pull-height">
    <div class="lock-form animated bounceInDown">
      <div class="animated" :class="{'shake':passwdError,'bounceOut':pass}">
        <h3 class="text-white">{{name}}</h3>
        <el-input
          placeholder="请输入锁屏密码"
          type="password"
          class="input-with-select animated"
          v-model="passwd"
          @keyup.enter.native="handleLogin"
        >
          <el-button slot="append" @click="handleLogin" style="padding-right:36px;font-size:20px;">
              <i class="el-icon-unlock" class-name="international-icon"></i>
          </el-button>
          <el-button slot="append" @click="handleLogout" style="font-size:22px;">
              <i class="el-icon-switch-button" class-name="international-icon"></i>
          </el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "lock",
  data() {
    return {
      passwd: "",
      passwdError: false,
      pass: false
    };
  },
  created() {},
  mounted() {
    this.timeClock();
  },
  computed: {
    ...mapState({
      name: state => state.user.name
    }),
    ...mapGetters(["tag", "lockPasswd"])
  },
  props: [],
  methods: {
    handleLogout() {
      this.$confirm("是否注销登陆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("user/logout").then(() => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch(() => {
          return false;
        });
    },
    handleLogin() {
      if (this.passwd !== this.lockPasswd) {
        this.passwd = "";
        this.$message({
          message: "解锁密码错误,请重新输入",
          type: "error"
        });
        this.passwdError = true;
        setTimeout(() => {
          this.passwdError = false;
        }, 1000);
        return;
      }
      this.pass = true;
      this.$store.dispatch("user/clearLock").then(() => {
        this.$router.push("/homepage");
      });
    },
    timeClock() {}
  }
};
</script>

<style lang="scss">
.lock-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.lock-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://lhtpic01.oss-cn-shenzhen.aliyuncs.com/common/lockLogin.png");
  background-size: cover;
}
.lock-form {
  width: 300px;
}
</style>