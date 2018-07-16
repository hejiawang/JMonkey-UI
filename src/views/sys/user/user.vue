<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_user_save" v-waves type="primary" @click="handleCreateUser">新增用户</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 列表 start -->
      <el-table :data="userTableData" ref="userTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="listLoading">

        <el-table-column prop="username" label="用户名称" show-overflow-tooltip/>
        <el-table-column prop="realName" label="真实名称" show-overflow-tooltip/>
        <el-table-column prop="roleList" label="用户角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span><template v-for="roleInfo in scope.row.roleList"> {{roleInfo.name}}, </template></span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" show-overflow-tooltip/>
        <el-table-column prop="sex" label="用户性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="icon iconfont icon-man" v-if=" scope.row.sex == 'Man' "></i>
            <i class="icon iconfont icon-woman" v-if=" scope.row.sex == 'Woman' "></i>
            <i class="icon iconfont icon-man1" v-if=" scope.row.sex == 'Other' "></i>

            <span>{{ scope.row.sex | sexFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="出生日期" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.row.birthday">
            <i class="el-icon-time"></i>
            <span>{{scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button v-if="sys_user_modify" size="mini" type="success" v-waves @click="handleModifyUser(scope.row)">编辑</el-button>
            <el-button v-if="sys_user_delete" size="mini" type="danger" v-waves @click="deleteUser(scope.row)">删除</el-button>
            <el-button v-if="sys_user_role" size="mini" type="warning" v-waves @click="handleRole(scope.row)">角色</el-button>
            <el-button v-if="sys_user_restPasswsord" size="mini" v-waves @click="restPassword(scope.row)">密码重置</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 列表 end -->

      <!-- 分页 start -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal" />
      <!-- 分页 end -->

      <!-- 新增修改用户 start -->
      <el-dialog :title="textMap[userDialogStatus]" :visible.sync="userDialogFormVisible">
        <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名称" prop="username">
                <el-input v-model="userForm.username" placeholder="请输入用户名称" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item v-if=" userDialogStatus == 'createUser' " label="登录密码" prop="password">
                <el-input v-model="userForm.password" placeholder="请输入登录密码" type="password" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center;">
              <el-tooltip class="item" effect="light" content="默认密码：123456" placement="bottom-start" v-if=" userDialogStatus == 'createUser' ">
                <i class="el-icon-question message-info"></i>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="userForm.realName" placeholder="请输入真实姓名" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户性别" prop="sex">
                <el-radio-group v-model="userForm.sex">
                  <el-radio border label="Man">男</el-radio>
                  <el-radio border label="Woman">女</el-radio>
                  <el-radio border label="Other">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker v-model="userForm.birthday" type="date" placeholder="选择日期" style="width: 100%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="用户角色" prop="roleIdList">
            <el-select v-model="userForm.roleIdList" multiple placeholder="请选择用户角色">
              <el-option v-for="item in roleSelectListData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelUserForm('userForm')">取 消</el-button>
          <el-button v-waves type="primary" v-if=" userDialogStatus == 'createUser' " @click="createUser('userForm')">确 定</el-button>
          <el-button v-waves type="primary" v-else @click="modifyUser('userForm')">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改用户 end -->

      <!-- 分配角色 start -->
      <el-dialog title="分配角色" :visible="roleDialogVisible" class="main-dialog-table" @open="roleDialogOpen">

        <el-table :data="roleTableData" ref="roleTable" height="300px" tooltip-effect="dark" v-loading="roleListLoading" @selection-change="handleRoleSelect">
          <el-table-column type="selection" width="50"/>
          <el-table-column prop="name" label="角色名称" show-overflow-tooltip width="200"/>
          <el-table-column prop="code" label="角色编码" show-overflow-tooltip width="200"/>
          <el-table-column prop="remark" label="角色描述" show-overflow-tooltip/>
          <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.createDate | parseTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-pagination @size-change="handleRoleSizeChange" @current-change="handleRoleCurrentChange" :current-page.sync="roleListQuery.current" :page-sizes="[10,20,30,50]" :page-size="roleListQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="roleListTotal" style="float: left"/>
          <el-button v-waves @click="cancelRoleDialog()">取 消</el-button>
          <el-button v-waves type="primary" @click="saveRoles()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色 end -->
    </div>
  </el-container>
</template>
<script src="./user.js"></script>
