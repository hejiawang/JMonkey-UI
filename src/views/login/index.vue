<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <div class="login-info text-white animated fadeInLeft">
      <h2 class="login-info-title">{{website.info.title}}</h2>
      <ul class="login-info-list">
        <li class="login-info-item" v-for="(item,index) in website.info.list" :key="index">
          <i class="el-icon-check"></i>&nbsp;{{item}}
        </li>
      </ul>
    </div>
    <div class="login-border animated fadeInRight">
      <div class="login-main">
        <h4 class="login-title"> JMonkey 管理系统模板
          <top-theme></top-theme>
        </h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户密码" name="user">
            <userLogin></userLogin>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  import '../../assets/css/iconfont/iconfont.css'
  import userLogin from "./userlogin";
  import topTheme from "../../components/layout/top-theme";

  export default {
    name: "login",
    components: {
      userLogin,
      topTheme
    },
    computed: {
      ...mapGetters(["website"])
    },
    data() {
      return {
        activeName: "user"
      };
    },
  }
</script>

<style lang="scss">
  @import '../../styles/login/index.scss';
</style>
