<template>
  <el-aside width="200px">

    <el-dropdown style="margin-left: 50px; margin-bottom: 20px; margin-top: 10px;">
      <span class="el-dropdown-link" style="display: grid">
        <img style="height: 100px; width: 100px" src="../../../assets/img/userDefaule.png">
        <span style="color: white; text-align: center; margin-top: 10px;">超级管理员<i class="el-icon-arrow-down el-icon--right"></i></span>
      </span>
      <el-dropdown-menu style="width: 100px;" slot="dropdown">
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-menu default-active="/home" background-color="#00142a" text-color="#fff" active-text-color="#409eff" unique-opened collapse-transition router>
      <el-menu-item  index="/home">
        <i class="icon iconfont icon-main"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <template v-for="(item, index) in menu">
        <el-menu-item v-if=" item.children.length === 0 " :index="item.path">
          <i v-if="item.icon" :class="item.icon"></i> <span slot="title">{{item.name}}</span>
        </el-menu-item>

        <el-submenu v-else :index="item.id">
          <template slot="title"> <i v-if="item.icon" :class="item.icon"></i> <span>{{item.name}}</span> </template>

          <el-menu-item-group>
            <el-menu-item v-for="( child, cIndex ) in item.children" :key="child.id" :index="child.path">
              <i v-if="child.icon" :class="child.icon"></i>
              {{child.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>

    </el-menu>
  </el-aside>
</template>

<script>
  import store from '@/store';
  import { mapGetters } from "vuex";
  import { validatenull } from "@/utils/validate";
  import { initMenu } from "@/router/router";

  export default {
    name: "asideMenu",
    data() {
      return {};
    },
    computed: {
      ...mapGetters(["menu"]),
    },
    created() {
      if (validatenull(this.menu)) {
        store.dispatch("GetMenu").then(data => {
          initMenu( this.$router, data );
        });
      }
    }
  }
</script>
