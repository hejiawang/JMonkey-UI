<template>
  <el-container>
    <div class="main-container sys-menu-class">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_menu_save" v-waves type="primary" @click="handleCreateMenu">新增菜单</el-button>
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
        <el-table-column prop="type" label="类型" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.type | menuTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <i :class="scope.row.icon" v-if="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <el-input v-if="scope.row.sortEdit" :ref="scope.row.id" v-model.number="scope.row.sort" size="small" style="width: 70px" @keyup.enter.native="handleModifySort(scope.row)" @blur="handleModifySort(scope.row)" />
            <el-button v-else size="small" v-waves style="width: 70px" @click="modifySort(scope.row)">{{scope.row.sort}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限" show-overflow-tooltip/>
        <el-table-column prop="method" label="请求方法" show-overflow-tooltip width="100"/>
        <el-table-column prop="url" label="请求链接" show-overflow-tooltip/>
        <el-table-column prop="path" label="前端URL" show-overflow-tooltip/>
        <el-table-column prop="component" label="VUE页面" show-overflow-tooltip/>

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button v-if="sys_menu_modify" size="mini" type="success" v-waves @click="handleModifyMenu(scope.row)">编辑</el-button>
            <el-button v-if="sys_menu_delete" size="mini" type="danger" v-waves @click="deleteMenu(scope.row)">删除</el-button>
            <el-button v-if="sys_menu_save && scope.row.type == 'Menu' " size="mini" type="warning" v-waves @click="handleCreateNextMenu(scope.row)">新增下级菜单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 树形列表 end -->

      <!-- 新增修改菜单 start -->
      <el-dialog :title="textMap[menuDialogStatus]" :visible.sync="menuDialogFormVisible" @close="cancelMenuForm('menuForm')">

        <el-form :model="menuForm" :rules="menuRules" ref="menuForm" label-width="100px" v-loading="formLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
          <el-row>
            <el-col :span="12">
              <el-form-item label="父级菜单" prop="parentId">
                <el-input v-model="menuForm.parentName" placeholder="请输入父级菜单" @focus="handleMenuTree()" readonly>
                  <i slot="suffix" class="el-input__icon el-icon-close" @click="restParentMenu"></i>
                </el-input>
                <el-input v-model="menuForm.parentId" type="hidden" style="display: none"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="menuForm.name" placeholder="请输入菜单名称" minlength="1" maxlength="6"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="权限标识" prop="permission">
                <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center;">
              <el-tooltip class="item" effect="light" content="例：sys_user_save" placement="bottom-start">
                <i class="el-icon-question message-info"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="11">
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center;">
              <el-tooltip class="item" effect="light" content="建议阿里图标，例：icon iconfont icon-main" placement="bottom-start">
                <i class="el-icon-question message-info"></i>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="menuForm.type">
                  <el-radio border label="Menu">菜单</el-radio>
                  <el-radio border label="Button">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单排序" prop="sort">
                <el-input-number v-model="menuForm.sort" :min="1" :max="10000" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="请求方法" prop="method">
                <el-select v-model="menuForm.method" filterable placeholder="请选择">
                  <el-option  key="Get" label="Get" value="Get" />
                  <el-option  key="Post" label="Post" value="Post" />
                  <el-option  key="Put" label="Put" value="Put" />
                  <el-option  key="Delete" label="Delete" value="Delete" />
                </el-select>
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
          <el-button v-waves :disabled="isSubmit" type="primary" v-if=" menuDialogStatus == 'createMenu' " @click="createMenu('menuForm')">确 定</el-button>
          <el-button v-waves :disabled="isSubmit" type="primary" v-else @click="modifyMenu('menuForm')">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改菜单 start -->

      <!-- 选择父级菜单 start -->
      <el-dialog title="父级菜单" :visible.sync="menuDialogTreeVisible" width="500px">
        <el-tree :data="treeDate" node-key="id" highlight-current :props="treeProps" @node-click="getParentMenu">
        </el-tree>
      </el-dialog>
      <!-- 选择父级菜单 end -->
    </div>
  </el-container>
</template>
<script>
  import { mapGetters } from "vuex";
  import { treeList, find, save, modify, del } from "@/api/sys/menu";
  import { treeToArray } from "@/utils/util";
  import { validateNumber } from  "@/utils/validate";
  import '@/styles/treeTable.scss';

  export default {
    name: "menu",
    data() {
      return {
        isSubmit: false,  //是否在提交数据
        formLoading: false, //新增修改菜单表单是否正在提交
        listLoading: false,  //页面是否在加载
        menuDialogTreeVisible: false,  //父级菜单树dislog
        menuDialogFormVisible: false, //是否显示菜单 dialog
        menuDialogStatus: "", //menu dialog 状态 新增或者修改菜单
        menuSortTemp : 1, //临时记录菜单排序
        textMap: {  //显示文字
          createMenu: "新增菜单",
          modifyMenu: "修改菜单"
        },
        treeProps: {
          children: "children",
          label: "name"
        },
        treeDate: [],
        menuForm: {   //menu form
          name: "",
          permission: "",
          path: "",
          url: "",
          method: "Get",
          parentId: "",
          parentName: "",
          icon: "",
          component: "",
          sort: 1,
          type: "Menu"
        },
        menuRules: {  //menu form rule
          name: [
            { required: true, message: "请输入菜单名称", trigger: "blur" },
            { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(["permissions"]),
      /**
       * 将数据转换为树形表格数据对象
       */
      formatMenuTreeData: function() {
        let tmpTreeData = Array.isArray(this.treeDate) ? this.treeDate : [this.treeDate];
        let treeArray = treeToArray(tmpTreeData, false);
        return treeArray.map(v => {
          this.$set(v, 'sortEdit', false);
          return v
        });
      }
    },
    filters:{
      menuTypeFilter( val ){
        const valMap = {
          Menu: "菜单",
          Button: "按钮"
        };
        return valMap[val];
      }
    },
    created() {
      this.initPermissions();
      this.menuTreeList();
    },
    methods: {
      /**
       * 初始化按钮权限
       */
      initPermissions(){
        this.sys_menu_save = this.permissions["sys_menu_save"];
        this.sys_menu_modify = this.permissions["sys_menu_modify"];
        this.sys_menu_delete = this.permissions["sys_menu_delete"];
      },
      /**
       * 菜单树形表格数据
       */
      menuTreeList(){
        this.listLoading = true;

        treeList().then(data => {
          this.treeDate = data.result;
          this.listLoading = false;
        });
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
        this.isSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.formLoading = true;
            save(this.menuForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelMenuForm(formName);
                this.menuTreeList();
                this.$notify({ title: "成功", message: "创建成功", type: "success", duration: 2000 });
              } else {
                this.handleErrorCallback(data.message);
              }
            });
          } else {
            this.isSubmit = false;
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
        this.isSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.formLoading = true;
            modify(this.menuForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelMenuForm(formName);
                this.menuTreeList();
                this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
              } else {
                this.handleErrorCallback(data.message);
              }
            });
          } else {
            this.isSubmit = true;
          }
        })
      },
      /**
       * 新增下级菜单dialog
       * @param row
       */
      handleCreateNextMenu(row){
        this.handleCreateMenu();
        this.menuForm.parentId = row.id;
        this.menuForm.parentName = row.name;
      },
      handleErrorCallback( message ){
        this.formLoading = false, this.isSubmit = false;
        this.$notify({ title: "失败", message: message, type: "error", duration: 2000 });
      },
      /**
       * 关闭menu dialog
       * @param formName
       */
      cancelMenuForm(formName){
        this.menuDialogFormVisible = false;
        this.formLoading = false;
        this.isSubmit = false;
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
          method: "Get",
          parentId: "",
          parentName: "",
          icon: "",
          component: "",
          sort: 1,
          type: "Menu"
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
      showRow(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      /**
       * 展示/隐藏 菜单树形表格行数据
       * @param trIndex
       */
      toggleExpanded(trIndex) {
        const record = this.formatMenuTreeData[trIndex]
        record._expanded = !record._expanded
      },
      /**
       * 显示父级菜单树
       */
      handleMenuTree() {
        this.menuDialogTreeVisible = true;
      },
      /**
       * 设置父菜单数据
       * @param data
       */
      getParentMenu(data){
        this.menuDialogTreeVisible = false;

        this.menuForm.parentId = data.id;
        this.menuForm.parentName = data.name;
      },
      /**
       * 显示修改菜单排序input
       * @param row
       */
      modifySort( row ){
        this.formatMenuTreeData.forEach(function (menu) { menu.sortEdit = false; })
        this.menuSortTemp = row.sort;
        row.sortEdit = true;

        this.$nextTick(_ => { this.$refs[row.id].$refs.input.focus(); });
      },
      /**
       * 修改菜单排序
       * @param row
       */
      handleModifySort(row){
        if( !validateNumber(row.sort) || row.sort == this.menuSortTemp || row.sort > 10000 ) row.sort = this.menuSortTemp;
        else modify({id: row.id, sort: row.sort}).then(() => { this.menuTreeList(); });

        row.sortEdit = false;
      },
      /**
       * 重置父级菜单
       */
      restParentMenu(){
        this.menuForm.parentName = '';
        this.menuForm.parentId = '';
      }
    }
  };
</script>

<style lang="scss">
  .sys-menu-class .el-tree{
    height: 400px;
    overflow-y: scroll;
  }

  .sys-menu-class .el-table__body-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
