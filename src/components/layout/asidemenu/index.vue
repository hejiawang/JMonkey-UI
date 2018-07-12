<template>
  <el-aside width="200px">
    <el-menu default-active="/home" background-color="#00142a" text-color="#fff" active-text-color="#409eff" unique-opened collapse-transition router>
      <el-menu-item  index="/home">
        <i class="icon iconfont icon-main"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <!--<el-submenu index="1">
        <template slot="title">
          <i class="icon iconfont icon-set"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/sys/user">用户管理</el-menu-item>
          <el-menu-item index="/sys/role">角色管理</el-menu-item>
          <el-menu-item index="/sys/menu">菜单管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>-->

      <template v-for="(item, index) in menu">
        <el-menu-item v-if=" item.children.length === 0 " :index="item.path">
          <i v-if="item.icon" :class="item.icon"></i> <span slot="title">{{item.name}}</span>
        </el-menu-item>

        <el-submenu v-else :index="menu.id">
          <template slot="title"> <i v-if="item.icon" :class="item.icon"></i> <span>{{item.name}}</span> </template>

          <el-menu-item-group>
            <el-menu-item v-for="( child, index ) in item.children" :key="child.id" :index="child.path">
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
