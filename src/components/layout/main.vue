<template>
  <el-container>

    <el-header>Header</el-header>

    <el-container>
      <!-- 菜单 start -->
      <aside-menu></aside-menu>
      <!-- 菜单 end -->

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
  import asideMenu from "./asidemenu/";

  export default {
    name: "main",
    components: {
      asideMenu
    },
    created(){
      this.$router.push("/home");
    }
  };
</script>
