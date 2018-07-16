<template>
  <el-container>
    <div class="main-container">

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
      <el-dialog :title="textMap[menuDialogStatus]" :visible.sync="menuDialogFormVisible">

        <el-form :model="menuForm" :rules="menuRules" ref="menuForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="父级菜单" prop="parentId">
                <el-input v-model="menuForm.parentName" placeholder="请输入父级菜单" @focus="handleMenuTree()" readonly/>
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
          <el-button v-waves type="primary" v-if=" menuDialogStatus == 'createMenu' " @click="createMenu('menuForm')">确 定</el-button>
          <el-button v-waves type="primary" v-else @click="modifyMenu('menuForm')">修 改</el-button>
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
<script src="./menu.js"></script>

<style lang="scss">
  .el-tree{
    height: 400px;
    overflow-y: scroll;
  }
</style>
