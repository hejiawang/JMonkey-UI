<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-btn-group">
        <el-button v-waves type="primary" >新增菜单</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 树形列表 start -->
      <el-table :data="formatMenuTreeData" ref="menuTable" height="calc(100% - 80px)" tooltip-effect="dark" :row-style="showRow">
        <el-table-column prop="name" label="名称" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>

            <span class="tree-ctrl" v-if="iconShow(scope.row)" @click="toggleExpanded(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
              <i v-else class="el-icon-minus"></i>
            </span>

            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" show-overflow-tooltip/>
        <el-table-column prop="icon" label="图标" show-overflow-tooltip/>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip/>
        <el-table-column prop="permission" label="权限" show-overflow-tooltip/>
        <el-table-column prop="method" label="请求方法" show-overflow-tooltip/>
        <el-table-column prop="url" label="请求链接" show-overflow-tooltip/>
        <el-table-column prop="path" label="前端URL" show-overflow-tooltip/>
        <el-table-column prop="component" label="VUE页面" show-overflow-tooltip/>

      </el-table>
      <!-- 树形列表 end -->


    </div>
  </el-container>
</template>
<script>

  import waves from "@/directive/waves/index.js"; //按钮水波纹效果
  import { treeToArray } from "@/utils/util";
  import '@/styles/treeTable.scss'

  export default {
    name: "menu",
    directives: {
      waves
    },
    data() {
      return {
        treeDate: [
          { id: 0, name: '首页', type: '菜单', icon: '无', sort: '1', permission: 'home', method: 'GET', url: '/home', path: '/home', component: 'home.vue'},
          { id: 1, name: '系统设置', type: '菜单', icon: '无', sort: '2', permission: 'sys', method: 'GET', url: '', path: '', component: '', children: [
            { id: 2, name: '用户管理', type: '菜单', icon: '无', sort: '3', permission: 'sys_user', method: 'GET', url: '/sys/user', path: '/sys/user', component: 'user/user.vue' },
            { id: 3, name: '角色管理', type: '菜单', icon: '无', sort: '2', permission: 'sys', method: 'GET', url: '', path: '', component: ''},
          ]},
        ]
      }
    },
    computed: {
      formatMenuTreeData: function() {
        let tmpTreeData = Array.isArray(this.treeDate) ? this.treeDate : [this.treeDate];
        return treeToArray(tmpTreeData, false);
      }
    },
    methods: {
      /**
       * 是否显示菜单树形表格展示按钮
       * @param record
       * @returns {boolean}
       */
      iconShow(record) {
        return ( record.children && record.children.length > 0)
      },
      /**
       * 控制菜单树形表格行数据展示动作
       * @param row
       * @returns {string}
       */
      showRow: function(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      /**
       * 展示/隐藏 菜单树形表格行数据
       * @param trIndex
       */
      toggleExpanded: function(trIndex) {
        const record = this.formatMenuTreeData[trIndex]
        record._expanded = !record._expanded
      },
    }
  };
</script>
