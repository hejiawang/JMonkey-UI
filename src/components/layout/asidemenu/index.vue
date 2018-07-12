<template>
  <el-aside width="200px">
    <el-menu default-active="/home" background-color="#00142a" text-color="#fff" active-text-color="#409eff" unique-opened collapse-transition router>
      <el-menu-item  index="/home">
        <i class="icon iconfont icon-main"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="icon iconfont icon-set"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/sys/user">用户管理</el-menu-item>
          <el-menu-item index="/sys/role">角色管理</el-menu-item>
          <el-menu-item index="/sys/menu">菜单管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航二</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-1">选项2</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
  import store from '@/store';
  import { mapGetters } from "vuex";
  import { validatenull } from "@/utils/validate";

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
          console.info(data);
        });
      }
    }
  }
</script>
