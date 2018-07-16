<template>
  <el-container>

    <!-- 角色 curd start -->
    <div class="main-container" :style="mainStyle">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_role_save" v-waves type="primary" @click="handleCreateRole">新增角色</el-button>

        <el-input placeholder="请输入查询内容" v-model="search.value"  class="main-search">
          <i slot="suffix" class="el-input__icon el-icon-close" @click="restSearch"></i>
          <el-select v-model="search.key" slot="prepend" placeholder="请选择">
            <el-option label="角色名称" value="name"></el-option>
            <el-option label="角色编码" value="code"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" v-waves @click="searchRole"></el-button>
        </el-input>

      </el-row>
      <!-- 功能按钮 end -->

      <!-- 列表 start -->
      <el-table :data="roleTableData" ref="roleTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="listLoading">

        <el-table-column prop="name" label="角色名称" show-overflow-tooltip/>
        <el-table-column prop="code" label="角色编码" show-overflow-tooltip/>
        <el-table-column prop="remark" label="角色描述" show-overflow-tooltip/>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.createDate | parseTime }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button v-if="sys_role_modify" size="mini" type="success" v-waves @click="handleModifyRole(scope.row)">编辑</el-button>
            <el-button v-if="sys_role_delete" size="mini" type="danger" v-waves @click="deleteRole(scope.row)">删除</el-button>
            <el-button v-if="sys_role_menu" size="mini" type="warning" v-waves @click="authorizeTag(scope.row)">授权</el-button>
            <el-button size="mini" v-waves type="info">用户</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 列表 end -->

      <!-- 分页 start -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal" />
      <!-- 分页 end -->

      <!-- 新增修改角色 start -->
      <el-dialog :title="textMap[roleDialogStatus]" :visible.sync="roleDialogFormVisible">

        <el-form :model="roleForm" :rules="roleRules" ref="roleForm" label-width="100px">

          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="roleForm.name" placeholder="请输入角色名称" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色编码" prop="code">
                <el-input v-model="roleForm.code" placeholder="请输入角色编码" maxlength="20"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="角色描述" prop="remark">
            <el-input v-model="roleForm.remark" type="textarea" :rows="2" maxlength="100"/>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelRoleForm('roleForm')">取 消</el-button>
          <el-button v-waves type="primary" v-if=" roleDialogStatus == 'createRole' " @click="createRole('roleForm')">确 定</el-button>
          <el-button v-waves type="primary" v-else @click="modifyRole('roleForm')">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改角色 end -->

    </div>
    <!-- 角色 curd end -->

    <!-- 角色授权 start -->
    <div class="main-container" :style="authorizeStyle">
      <el-card>
        <div slot="header" class="clearfix">
          <span>授权角色： <el-tag type="info" key="tag" closable @close="closeAuthorize()" v-if="authorizeRole">{{ authorizeRole.name }}</el-tag> </span>
          <el-button style="float: right; " type="primary" plain @click="roleAuthorize">确定授权</el-button>
        </div>
        <el-tree :data="menuTreeDate" node-key="id" highlight-current :props="menuTreeProps" check-strictly show-checkbox v-loading="treeLoading" ref="menuTree">
        </el-tree>
      </el-card>
    </div>
    <!-- 角色授权 end -->

  </el-container>
</template>
<script src="./role.js"></script>

<style lang="scss">
  @import './role.scss';
</style>

