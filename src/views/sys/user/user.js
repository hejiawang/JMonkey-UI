import { mapGetters } from "vuex";
import { list, find, save, modify, del, checkUserName, restPasswsord } from "@/api/sys/user";
import { listAll, list as roleList } from  "@/api/sys/role";
import { saveRoles } from  "@/api/sys/userRole";
import { validatePhone } from  "@/utils/validate";

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
  computed: {
    ...mapGetters(["permissions"])
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
