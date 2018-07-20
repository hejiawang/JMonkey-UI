<template>
  <el-dropdown>
      <span class="el-dropdown-link">
        <el-row>
          <img v-if="userInfo.photo" :src="website.filePath + userInfo.photo">
          <img src="../../../assets/img/userDefaule.png" v-else>
        </el-row>
        <el-row style="text-align: center">
          <span>
            <template v-if="userInfo.realName">{{userInfo.realName}}</template>
            <template v-else>{{userInfo.username}}</template>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </el-row>
      </span>
    <el-dropdown-menu style="width: 100px;" slot="dropdown">
      <el-dropdown-item>个人信息</el-dropdown-item>
      <el-dropdown-item>修改密码</el-dropdown-item>
      <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  import store from '@/store';
  import { mapGetters } from "vuex";

  export default {
    name: "asideUser",
    computed: {
      ...mapGetters(["website"]),
      ...mapGetters(["userInfo"]),
    },
    methods: {
      logout() {
        this.$confirm("此操作将退出系统, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        });
      }
    }
  }
</script>
<style lang="scss">
  .el-dropdown {
    margin-left: 50px;
    margin-bottom: 20px;
    display: inline-block;
    position: relative;
    font-size: 14px;
    img {
      height: 100px;
      width: 100px
    }
    span {
      color: white;
    }
  }
</style>
