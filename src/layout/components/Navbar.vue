<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-tooltip effect="dark" content="选择主题" placement="bottom">
          <theme-picker class="right-menu-item hover-effect" @change="themeChange" />
        </el-tooltip>
        <el-tooltip effect="dark" content="锁屏" placement="bottom">
          <LockScreen class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-tooltip effect="dark" content="全屏" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container" trigger="click">
        <div v-if="device == 'desktop'" class="avatar-wrapper">
          <span class="user-name">{{ name }}</span>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <div v-else class="avatar-wrapper">
          <i class="el-icon-s-operation" style="font-size:20px;position: relative;bottom: 2px;"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import ThemePicker from "@/components/ThemePicker";
import LockScreen from "@/components/LockScreen";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    ThemePicker,
    LockScreen
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "device"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push("/login");
    },
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 6px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-name {
          position: relative;
          bottom: 16px;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
