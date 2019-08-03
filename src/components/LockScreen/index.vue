<template>
  <div>
    <span style="font-size:24px;">
      <i class="el-icon-lock" @click="handleLock"></i>
    </span>
    <el-dialog title="设置锁屏密码" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="锁屏密码" prop="password">
        <el-input
          ref="passwordInput"
          v-model="form.password"
          autocomplete="off"
          size="mini"
          placeholder="请输入锁屏密码"
          show-password
          autofocus
          @keyup.enter.native="handleLockScreen"
        ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleLockScreen" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validatenull } from "@/utils/validate";
import { mapGetters } from "vuex";
export default {
  name: "LockScreen",
  data() {
    return {
      formLabelWidth: "40px",
      dialogFormVisible: false,
      form: {
        password: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入锁屏密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["lockPasswd"])
  },
  props: [],
  methods: {
    handleLock() {
      this.dialogFormVisible = true;
    },
    handleLockScreen() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("user/setLockPassword", this.form.password)
            .then(() => {
              this.handleLock();
            });
        }
      });
    },
    handleLock() {
      if (validatenull(this.lockPasswd)) {
        this.dialogFormVisible = true;
        return;
      }
      this.$store.dispatch("user/setLock").then(() => {
        this.$router.push({ path: "/lock" });
      });
    }
  },
  components: {}
};
</script>
