<template>
  <el-container>

    <el-header>
      <headerTitle></headerTitle>
    </el-header>

    <el-container>
      <!-- 菜单 start -->
      <aside-menu></aside-menu>
      <!-- 菜单 end -->

      <el-container>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>JMonkey</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in crumbArray " :key="index" >{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-main>
          <transition name="el-zoom-in-top">
            <router-view />
          </transition>
        </el-main>
      </el-container>

      <el-footer height="35px">版权信息 &copy; 2018-2028</el-footer>

    </el-container>

  </el-container>
</template>
<script>
  import store from '@/store';
  import asideMenu from "./asidemenu/";
  import headerTitle from "./headertitle"

  export default {
    name: "main",
    components: {
      asideMenu,
      headerTitle
    },
    computed: {
      crumbArray: function () {
        return store.getters.crumb;
      }
    },
    created(){
      this.$router.push("/home");
    }
  };
</script>
