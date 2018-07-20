<template>
  <el-aside width="200px">
    <aside-user></aside-user>

    <el-menu default-active="/home" background-color="#00142a" text-color="#fff" active-text-color="#409eff" unique-opened collapse-transition router>
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
  import asideUser from "../asideuser/";

  export default {
    name: "asideMenu",
    components: {
      asideUser,
    },
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
