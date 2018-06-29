<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-btn-group">
        <el-button v-waves type="primary" @click="handleCreateRole">新增角色</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 列表 start -->
      <el-table :data="roleTableData" ref="roleTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="listLoading">

        <el-table-column prop="name" label="角色名称" show-overflow-tooltip/>
        <el-table-column prop="code" label="角色编码" show-overflow-tooltip/>
        <el-table-column prop="remark" label="角色描述" show-overflow-tooltip/>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip/>

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" v-waves @click="handleModifyRole(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-waves @click="deleteRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 列表 end -->

      <!-- 分页 start -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal" />
      <!-- 分页 end -->

      <!-- 新增修改角色 start -->
      <el-dialog :title="textMap[roleDialogStatus]" :visible.sync="roleDialogFormVisible">

        <el-form :model="roleForm" :rules="roleRules" ref="userForm" label-width="100px">

          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="roleForm.code" placeholder="请输入角色编码"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="remark">
            <el-input v-model="roleForm.remark" placeholder="请输入角色描述"></el-input>
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
  </el-container>
</template>
<script>
  import waves from "@/directive/waves/index.js"; //按钮水波纹效果
  import { list, find, save, modify, del } from "@/api/sys/role";

  export default {
    name: "role"
  };
</script>
