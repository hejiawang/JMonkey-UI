<template>
  <el-container>

    <el-header>Header</el-header>

    <el-container>

      <el-aside width="200px">
        <el-menu default-active="/home"
                 background-color="#00142a"
                 text-color="#fff"
                 active-text-color="#409eff"
                 unique-opened
                 collapse-transition
                 router>
          <el-menu-item  index="/home">
            <i class="el-icon-location"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
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

      <el-container>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>JMonkey</el-breadcrumb-item>
          <el-breadcrumb-item>XX</el-breadcrumb-item>
        </el-breadcrumb>
        <el-main>
          <transition name="el-zoom-in-top">
            <router-view />
          </transition>
        </el-main>
      </el-container>

      <el-footer height="35px">Footer</el-footer>

    </el-container>

  </el-container>
</template>
<script>
  export default {
    name: "main",
    created(){
      this.$router.push("/home");
    }
  };
</script>
