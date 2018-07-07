<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-waves type="primary" @click="handleCreateUser">新增用户</el-button>
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
            <el-button size="mini" type="success" v-waves @click="handleModifyUser(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-waves @click="deleteUser(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" v-waves @click="handleRole(scope.row)">角色</el-button>
            <el-button size="mini" v-waves @click="restPassword(scope.row)">密码重置</el-button>
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
        <el-pagination @size-change="handleRoleSizeChange" @current-change="handleRoleCurrentChange" :current-page.sync="roleListQuery.current" :page-sizes="[10,20,30,50]" :page-size="roleListQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="roleListTotal" />
        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelRoleDialog()">取 消</el-button>
          <el-button v-waves type="primary" @click="saveRoles()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色 end -->
    </div>
  </el-container>
</template>
<script>
  import waves from "@/directive/waves/index.js"; //按钮水波纹效果
  import { list, find, save, modify, del, checkUserName, restPasswsord } from "@/api/sys/user";
  import { listAll, list as roleList } from  "@/api/sys/role";
  import { saveRoles } from  "@/api/sys/userRole";
  import { validatePhone } from  "@/utils/validate";

  export default {
    name: "user",
    directives: {
      waves
    },
    data () {
      /**
       * 校验手机号
       * @param rule
       * @param value
       * @param callback
       */
      var validPhone = ( rule, value,callback ) => {
        if (!value){
          callback(new Error('请输入手机号码'))
        } else if (!validatePhone(value)){
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      };
      /**
       * 校验用户名是否存在
       * @param rule
       * @param value
       * @param callback
       */
      var validUsername = ( rule, value, callback ) => {
        var id = this.userForm.id ? this.userForm.id : null;
        checkUserName( id, value ).then(data => {
          if( data.result ) callback(new Error('用户名称已存在'))
          else callback()
        });
      };

      return {
        listLoading: false,  //页面是否在加载
        userDialogFormVisible: false, //是否显示user dialog
        userTableData: null,   //用户列表数据
        userDialogStatus: "", //user dialog 状态 新增用户或者修改用户
        roleSelectIds: [],  //  分配角色时选中的角色Id list
        roleSelectListData: null, //角色信息
        roleDialogVisible: false, //分配角色dialog是否显示
        roleUserData: null, //分配角色的用户
        roleTableData: null, //角色列表数据
        roleListLoading: false, //角色列表加载
        roleListTotal: null,  //角色列表总条数
        roleListQuery: {  //角色列表分页条件
          current: 1,
          size: 10
        },
        textMap: {  //显示文字
          createUser: "新增用户",
          modifyUser: "修改用户"
        },
        listTotal: null,  //用户列表总条数
        listQuery: {  //用户列表分页条件
          current: 1,
          size: 10
        },
        userForm: { //user form
          username: "",
          password: "123456",
          realName: "",
          phone: "",
          roleIdList: [],
          sex: "Man",
          birthday: ""
        },
        userRules: {  //user form rule
          username: [
            { required: true, message: "请输入用户名称", trigger: "blur" },
            { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
            { validator: validUsername, trigger: 'blur' }
          ],
          password: [
            { required: true, message: "请输入登录密码", trigger: "blur" },
            { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
          ],
          phone: [
            { required: true, trigger: 'blur', validator: validPhone }
          ],
        }
      }
    },
    filters:{
      sexFilter( val ){
        const valMap = {
          Man: "男",
          Woman: "女",
          Other: "其他"
        };
        return valMap[val];
      }
    },
    created() {
      this.userList();
      this.initRoleInfo();
      this.initRoleList();
    },
    methods: {
      /**
       * 用户列表数据
       */
      userList(){
        this.listLoading = true;
        list(this.listQuery).then(data => {
          this.listTotal = data.total;
          this.userTableData = data.rows;

          this.listLoading = false;
        });
      },
      initRoleInfo(){
        listAll().then( data => this.roleSelectListData = Array.isArray(data.result) ? data.result : [data.result] );
      },
      /**
       * 初始化角色表格数据
       */
      initRoleList(){
        this.roleListLoading = true;
        roleList(this.roleListQuery).then( data => {
          this.roleListTotal = data.total;
          this.roleTableData = data.rows;
          this.roleListLoading = false;
        });
      },
      /**
       * 分页插件——每页数量变化
       */
      handleSizeChange( val ){
        this.listQuery.size = val;
        this.userList();
      },
      /**
       * 分页插件——当前页变化
       */
      handleCurrentChange( val ){
        this.listQuery.current = val;
        this.userList();
      },
      /**
       * 删除用户
       * @param row
       */
      deleteUser( row ){
        this.$confirm( "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?", "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        ).then(() => {
          del(row.id).then(( result ) => {
            this.userList();
            this.$notify({ title: "成功", message: "删除成功", type: "success", duration: 2000 });
          });
        });
      },
      /**
       * 密码重置
       * @param row
       */
      restPassword( row ){
        this.$confirm( "该用户(" + row.username + ")的密码将重置为'123456', 是否继续?", "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        ).then(() => {
          restPasswsord(row.id).then(( result ) => {
            this.$notify({ title: "成功", message: "密码重置成功", type: "success", duration: 2000 });
          });
        });
      },
      /**
       * 修改用户 dialog
       * @param row
       */
      handleModifyUser( row ){
        this.restUserForm();

        find( row.id ).then( data => {
          this.userForm = data.result;

          this.userDialogStatus = "modifyUser";
          this.userDialogFormVisible = true;
        });
      },
      /**
       * 修改用户
       * @param formName
       */
      modifyUser(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            modify(this.userForm).then(() => {
              this.cancelUserForm(formName);
              this.userList();
              this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
            });
          }
        })
      },
      /**
       * 显示新增用户dialog
       */
      handleCreateUser(){
        this.restUserForm();
        this.userDialogStatus = "createUser";
        this.userDialogFormVisible = true;
      },
      /**
       * 新增用户
       * @param formName
       */
      createUser(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            save(this.userForm).then(() => {
              this.cancelUserForm(formName);
              this.userList();
              this.$notify({ title: "成功", message: "创建成功", type: "success", duration: 2000 });
            });
          }
        })
      },
      /**
       * 关闭user dialog
       * @param formName
       */
      cancelUserForm(formName){
        this.userDialogFormVisible = false;
        this.restUserForm();
        this.$refs[formName].resetFields();
      },
      /**
       * 重置userForm
       */
      restUserForm(){
        this.userForm = { //user form
          username: "",
          password: "123456",
          realName: "",
          phone: "",
          roleIdList: [],
          sex: "Man",
          birthday: ""
        }
      },
      /**
       * 分配角色dialog
       */
      handleRole( row ){
        this.roleUserData = row;
        this.roleDialogVisible = true;
        this.roleListLoading = true;
      },
      /**
       * 分配角色dialog open回调
       * this.$refs.roleTable.toggleRowSelection(this.roleTableData[1]);
       */
      roleDialogOpen(){
        this.$nextTick(function () {
          this.$refs.roleTable.clearSelection();

          find( this.roleUserData.id ).then( data => {
            if( data.result.roleIdList ){
              let userRoles = Array.isArray(data.result.roleIdList) ? data.result.roleIdList : [data.result.roleIdList];
              userRoles.forEach(userRole => {
                this.$refs.roleTable.toggleRowSelection( this.roleTableData.find( d => d.id === userRole ) );
              });
            }

            this.roleListLoading = false;
          });
        });
      },
      /**
       * 选择分配的角色回调
       */
      handleRoleSelect( roles ){
        this.roleSelectIds = [];
        roles.forEach( role => this.roleSelectIds.push(role.id) );
      },
      /**
       * 设置用户角色
       */
      saveRoles(){
        this.roleListLoading = true;
        saveRoles(this.roleUserData.id, this.roleSelectIds).then(() => {
          this.roleListLoading = false;
          this.roleDialogVisible = false;
          this.userList();
          this.$notify({ title: "成功", message: "分配角色成功", type: "success", duration: 2000 });
        });
      },
      /**
       * 关闭分配角色dialog
       */
      cancelRoleDialog(){
        this.roleUserData = null;
        this.roleDialogVisible = false;
      },
      /**
       * 角色表格分页插件——每页数量变化
       */
      handleRoleSizeChange( val ){
        this.roleListQuery.size = val;
        this.initRoleList()
      },
      /**
       * 角色表格分页插件——当前页变化
       */
      handleRoleCurrentChange( val ){
        this.roleListQuery.current = val;
        this.initRoleList()
      },
    }
  };
</script>
