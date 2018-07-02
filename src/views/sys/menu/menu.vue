<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-btn-group">
        <el-button v-waves type="primary" @click="handleCreateMenu">新增菜单</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 树形列表 start -->
      <el-table :data="formatMenuTreeData" ref="menuTable" height="calc(100% - 80px)" tooltip-effect="dark" :row-style="showRow" v-loading="listLoading">
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

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" v-waves @click="handleModifyMenu(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-waves @click="deleteMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 树形列表 end -->

      <!-- 新增修改菜单 start -->
      <el-dialog :title="textMap[menuDialogStatus]" :visible.sync="menuDialogFormVisible">

        <el-form :model="menuForm" :rules="menuRules" ref="menuForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="父级菜单" prop="parentId">
                <el-input v-model="menuForm.parentId" placeholder="请输入父级菜单" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限标识" prop="permission">
                <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单类型" prop="type">
                <el-input v-model="menuForm.type" placeholder="请输入菜单类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单排序" prop="sort">
                <el-input v-model="menuForm.sort" placeholder="请输入菜单排序" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="请求方法" prop="method">
                <el-input v-model="menuForm.method" placeholder="请输入请求方法" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求链接" prop="url">
                <el-input v-model="menuForm.url" placeholder="请输入请求链接" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="前端URL" prop="path">
                <el-input v-model="menuForm.path" placeholder="请输入前端URL" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="VUE页面" prop="component">
                <el-input v-model="menuForm.component" placeholder="请输入VUE页面" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelMenuForm('menuForm')">取 消</el-button>
          <el-button v-waves type="primary" v-if=" menuDialogStatus == 'createMenu' " @click="createMenu('menuForm')">确 定</el-button>
          <el-button v-waves type="primary" v-else @click="modifyMenu('menuForm')">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改菜单 start -->
    </div>
  </el-container>
</template>
<script>

  import waves from "@/directive/waves/index.js"; //按钮水波纹效果
  import { treeList, find, save, modify, del } from "@/api/sys/menu";
  import { treeToArray } from "@/utils/util";
  import '@/styles/treeTable.scss';

  export default {
    name: "menu",
    directives: {
      waves
    },
    data() {
      return {
        listLoading: false,  //页面是否在加载
        menuDialogFormVisible: false, //是否显示菜单 dialog
        menuDialogStatus: "", //menu dialog 状态 新增或者修改菜单
        textMap: {  //显示文字
          createMenu: "新增菜单",
          modifyMenu: "修改菜单"
        },
        treeDate: [
          { id: 0, name: '首页', type: '菜单', icon: '无', sort: '1', permission: 'home', method: 'GET', url: '/home', path: '/home', component: 'home.vue'},
          { id: 1, name: '系统设置', type: '菜单', icon: '无', sort: '2', permission: 'sys', method: 'GET', url: '', path: '', component: '', children: [
            { id: 2, name: '用户管理', type: '菜单', icon: '无', sort: '3', permission: 'sys_user', method: 'GET', url: '/sys/user', path: '/sys/user', component: 'user/user.vue' },
            { id: 3, name: '角色管理', type: '菜单', icon: '无', sort: '2', permission: 'sys', method: 'GET', url: '', path: '', component: ''},
          ]},
        ],
        menuForm: {   //menu form
          name: "",
          permission: "",
          path: "",
          url: "",
          method: "",
          parentId: "",
          icon: "",
          component: "",
          sort: "",
          type: ""
        },
        menuRules: {  //menu form rule

        }
      }
    },
    computed: {
      /**
       * 将数据转换为树形表格数据对象
       */
      formatMenuTreeData: function() {
        let tmpTreeData = Array.isArray(this.treeDate) ? this.treeDate : [this.treeDate];
        return treeToArray(tmpTreeData, false);
      }
    },
    created() {
      this.menuTreeList();
    },
    methods: {
      /**
       * 菜单树形表格数据
       */
      menuTreeList(){
        this.listLoading = true;
      },
      /**
       * 删除菜单
       */
      deleteMenu(row){
        this.$confirm( "此操作将永久删除该菜单(菜单名称:" + row.name + "), 是否继续?", "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        ).then(() => {
          del(row.id).then(( result ) => {
            this.menuTreeList();
            this.$notify({ title: "成功", message: "删除成功", type: "success", duration: 2000 });
          });
        });
      },
      /**
       * 新增菜单 dialog
       */
      handleCreateMenu(){
        this.restMenuForm();
        this.menuDialogStatus = "createMenu";
        this.menuDialogFormVisible = true;
      },
      /**
       * 新增菜单信息
       * @param formName
       */
      createMenu(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            save(this.menuForm).then(() => {
              this.cancelMenuForm(formName);
              this.menuTreeList();
              this.$notify({ title: "成功", message: "创建成功", type: "success", duration: 2000 });
            });
          }
        })
      },
      /**
       * 修改菜单 dialog
       * @param formName
       */
      handleModifyMenu( row ){
        this.restMenuForm();

        find( row.id ).then( data => {
          this.menuForm = data.result;

          this.menuDialogStatus = "modifyMenu";
          this.menuDialogFormVisible = true;
        });
      },
      /**
       * 修改菜单信息
       * @param formName
       */
      modifyMenu(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            modify(this.menuForm).then(() => {
              this.cancelMenuForm(formName);
              this.menuTreeList();
              this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
            });
          }
        })
      },
      /**
       * 关闭menu dialog
       * @param formName
       */
      cancelMenuForm(formName){
        this.menuDialogFormVisible = false;
        this.restMenuForm();
        this.$refs[formName].resetFields();
      },
      /**
       * 充值菜单form数据
       */
      restMenuForm(){
        this.menuForm = {
          name: "",
          permission: "",
          path: "",
          url: "",
          method: "",
          parentId: "",
          icon: "",
          component: "",
          sort: "",
          type: ""
        }
      },
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
