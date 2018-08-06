<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_user_save" v-waves type="primary" @click="handleCreateUser">新增用户</el-button>
        <el-button v-waves type="success" @click="handleImportUser">导 入</el-button>
        <el-button v-if="sys_user_export" v-waves type="warning" @click="handleExportUser" :loading="exportLoading">导 出</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 列表 start -->
      <el-table :data="userTableData" ref="userTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="listLoading">

        <el-table-column prop="photo" label="用户头像" show-overflow-tooltip >
          <template slot-scope="scope">
            <img v-if="scope.row.photo" class="userPhoto" :src="website.filePath + scope.row.photo" preview="0" :preview-text="scope.row.realName">
            <img v-else class="userPhoto" src="../../../assets/img/userDefaule.png" preview="0" :preview-text="scope.row.realName">
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名称" show-overflow-tooltip/>
        <el-table-column prop="realName" label="真实名称" show-overflow-tooltip/>
        <el-table-column prop="roleList" label="用户角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span><template v-for="roleInfo in scope.row.roleList"> {{roleInfo.name}}, </template></span>
          </template>
        </el-table-column>
        <el-table-column prop="deptList" label="归属部门" show-overflow-tooltip>
          <template slot-scope="scope">
            <span><template v-for="dept in scope.row.deptList"> {{dept.name}}, </template></span>
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
      <el-dialog :title="textMap[userDialogStatus]" :visible.sync="userDialogFormVisible" @close="cancelUserForm('userForm')" width="800px">
        <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px" v-loading="formLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户头像" prop="photo">
                <el-upload action="/upms/user/uploadPhoto" class="avatar-uploader" :show-file-list="false"
                  :on-success="handleUserPhotoSuccess" :before-upload="beforeUserPhotoUpload">
                  <img v-if="userPhotoPath" :src="userPhotoPath" class="avatar">
                  <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="用户名称" prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入用户名称" maxlength="20"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if=" userDialogStatus == 'createUser' ">
                <el-col :span="22">
                  <el-form-item label="登录密码" prop="password">
                    <el-input v-model="userForm.password" placeholder="请输入登录密码" type="password" maxlength="20"/>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center;">
                  <el-tooltip class="item" effect="light" content="默认密码：123456" placement="bottom-start">
                    <i class="el-icon-question message-info"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="userForm.realName" placeholder="请输入真实姓名" maxlength="20"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
                  </el-form-item>
                </el-col>
              </el-row>
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
          <el-button v-waves :disabled="isSubmit" type="primary" v-if=" userDialogStatus == 'createUser' " @click="createUser('userForm')">确 定</el-button>
          <el-button v-waves :disabled="isSubmit" type="primary" v-else @click="modifyUser('userForm')">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改用户 end -->

      <!-- 分配角色 start -->
      <el-dialog title="分配角色" :visible="roleDialogVisible" @open="roleDialogOpen" @close="cancelRoleDialog()">

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

      <!-- 导入用户 start -->
      <el-dialog title="导入用户" :visible="importUserDialogVisible" @close="cancelImportUserDialog()">

        <el-upload ref="importUserUpload" drag :auto-upload="false"
            action="/upms/user/importUser" :file-list="importUserFileList" :on-success="importUserSuccess"
            :on-progress="importUserProgress"
            class="import_user_upload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>

        <div slot="footer" class="dialog-footer">
          <el-tag type="warning" style="float: left">只能上传与模板一致的Excel文件，且不得超过2M</el-tag>
          <el-button v-waves @click="cancelImportUserDialog()">取 消</el-button>
          <el-button v-waves type="success" plain @click="importUserDemo()">下载模板</el-button>
          <el-button v-waves type="primary" @click="importUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 导入用户 end -->
    </div>
  </el-container>
</template>
<script>
  import { mapGetters } from "vuex";
  import { list, find, save, modify, del, checkUserName, restPasswsord, listAll as listAllUser } from "@/api/sys/user";
  import { listAll, list as roleList } from  "@/api/sys/role";
  import { saveRoles } from  "@/api/sys/userRole";
  import { validatePhone, validatenull } from  "@/utils/validate";
  import { parseTime } from "@/filters";

  export default {
    name: "user",
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
        importUserFileList: [],
        importUserDialogVisible: false, //导入用户的dialog
        exportLoading: false, //是否导出用户信息
        isSubmit: false,  //是否在提交数据
        formLoading: false, //新增修改用户表单是否正在提交
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
          birthday: "",
          photo: "",
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
          realName: { required: true, message: "请输入真实姓名", trigger: "blur" }
        },
        userPhotoPath:"",
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
    computed: {
      ...mapGetters(["permissions"]),
      ...mapGetters(["website"])
    },
    created() {
      this.initPermissions();
      this.userList();
      this.initRoleInfo();
      this.initRoleList();
    },
    methods: {
      /**
       * 初始化按钮权限
       */
      initPermissions(){
        this.sys_user_save = this.permissions["sys_user_save"];
        this.sys_user_modify = this.permissions["sys_user_modify"];
        this.sys_user_delete = this.permissions["sys_user_delete"];
        this.sys_user_restPasswsord = this.permissions["sys_user_restPasswsord"];
        this.sys_user_role = this.permissions["sys_user_role"];
        this.sys_user_export = this.permissions["sys_user_export"];
      },
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

          if(this.roleDialogVisible) this.roleDialogOpen();
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
          if( !validatenull(data.result.photo) ) this.userPhotoPath = this.website.filePath + data.result.photo;

          this.userDialogStatus = "modifyUser";
          this.userDialogFormVisible = true;
        });
      },
      /**
       * 修改用户
       * @param formName
       */
      modifyUser(formName){
        this.isSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.formLoading = true;
            modify(this.userForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelUserForm(formName);
                this.userList();
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
        this.isSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.formLoading = true;
            save(this.userForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelUserForm(formName);
                this.userList();
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
      handleErrorCallback( message ){
        this.formLoading = false, this.isSubmit = false;
        this.$notify({ title: "失败", message: message, type: "error", duration: 2000 });
      },
      /**
       * 关闭user dialog
       * @param formName
       */
      cancelUserForm(formName){
        this.userDialogFormVisible = false;
        this.formLoading = false;
        this.isSubmit = false;
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
          birthday: "",
          photo: "",
        }
        this.userPhotoPath = "";
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
      /**
       * 上传用户头像的图片条件
       * @param file
       * @returns {boolean}
       */
      beforeUserPhotoUpload(file){
        const isImg = file.type === "image/jpeg" || file.type === "image/png";
        if( !isImg ) this.$message.error('上传头像图片只能是JPG或PNG格式!');

        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) this.$message.error('上传头像图片大小不能超过 1MB!');

        return isLt1M && isImg;
      },
      /**
       * 上传用户头像成功后的回调函数
       * @param data
       * @param file
       */
      handleUserPhotoSuccess(data, file) {
        if( data.isSuccess ){
          this.userPhotoPath = this.website.filePath + data.result;
          this.userForm.photo = data.result;
        }
      },
      /**
       * 导入用户信息
       */
      handleImportUser(){
        this.importUserFileList = [];
        this.importUserDialogVisible = true;
      },
      /**
       * 关闭导入用户信息dialog
       */
      cancelImportUserDialog(){
        this.importUserFileList = [];
        this.importUserDialogVisible = false;
      },
      /**
       * 下载导入用户的excel模板
       */
      importUserDemo(){
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['用户名称', '真实姓名', '用户角色', '手机号码', '用户性别', '出生日期'];
          const jsonData = [['username', '张三', '普通用户', '13888888888', '其他', '1970-01-01']];
          excel.export_json_to_excel({ header: tHeader, data: jsonData, filename: "用户信息模板" });
        })
      },
      /**
       * 导入用户信息
       */
      importUser(){
        this.$refs.importUserUpload.submit();
      },
      /**
       * 导入用户信息成功后的回调函数
       */
      importUserSuccess( response, file, fileList ){
        console.info(this.importUserFileList.length);
      },
      importUserProgress(event, file, fileList){
        console.info(file);
      },
      /**
       * 导出用户信息
       */
      handleExportUser(){
        this.exportLoading = true;
        listAllUser().then(( data ) => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['用户名称', '真实姓名', '用户角色', '手机号码', '用户性别', '出生日期'];
            const filterVal = [ 'username', 'realName', 'roleList', 'phone', 'sex', 'birthday' ];
            const jsonData = this.formatUserJson(filterVal, data.result);
            excel.export_json_to_excel({ header: tHeader, data: jsonData, filename: "用户信息" });

            this.exportLoading = false;
          })
        });
      },
      /**
       * 格式化导出的用户信息
       * @param filterVal
       * @param jsonData
       * @returns user json info
       */
      formatUserJson( filterVal, jsonData ){
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'roleList') {
            let roleName = "";
            v[j].forEach(role => { roleName = roleName + role.name + ","; })
            return roleName
          } else if( j === 'sex' ){
            const valMap = {  Man: "男", Woman: "女",  Other: "其他" };
            return valMap[ v[j] ];
          } else if ( j === 'birthday' ){
            return parseTime( v[j], '{y}-{m}-{d}' );
          } else {
            return v[j]
          }
        }))
      }
    }
  };
</script>
<style lang="scss">
  .userPhoto {
    height: 30px;
    width: 30px
  }

  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 195px;
    line-height: 195px;
    text-align: center;
  }
  .avatar {
    width: 240px;
    height: 195px;
    display: block;
  }

  .import_user_upload {
    .el-upload {
      width: 100%;
    }
    .el-upload-dragger {
       width: 100%;
     }
  }
</style>
