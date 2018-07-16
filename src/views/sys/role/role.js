import { mapGetters } from "vuex";
import { list, find, save, modify, del, checkCode, checkName } from "@/api/sys/role";
import { treeList } from "@/api/sys/menu";
import { findMenuByRole, modifyAuth } from  "@/api/sys/roleMenu";

export default {
  name: "role",
  data () {
    /**
     * 校验角色名称是否存在
     * @param rule
     * @param value
     * @param callback
     */
    var validName = ( rule, value, callback ) => {
      var id = this.roleForm.id ? this.roleForm.id : null;
      checkName( id, value ).then(data => {
        if( data.result ) callback(new Error('角色名称已存在'))
        else callback()
      });
    };
    /**
     * 校验角色编码是否存在
     * @param rule
     * @param value
     * @param callback
     */
    var validCode = ( rule, value, callback ) => {
      var id = this.roleForm.id ? this.roleForm.id : null;
      checkCode( id, value ).then(data => {
        if( data.result ) callback(new Error('角色编码已存在'))
        else callback()
      });
    }

    return {
      listLoading: false,  //页面是否在加载
      treeLoading: false,
      roleDialogFormVisible: false, //是否显示角色 dialog
      roleTableData: null,   //角色列表数据
      roleDialogStatus: "", //role dialog 状态 新增或者修改角色
      textMap: {  //显示文字
        createRole: "新增角色",
        modifyRole: "修改角色"
      },
      search: {
        key: "name",
        value: ""
      },
      listTotal: null,  //角色列表总条数
      listQuery: {  //角色列表分页条件
        current: 1,
        size: 10
      },
      roleForm: {   //role form
        name: "",
        code: "",
        remark: ""
      },
      roleRules: {  //role form rule
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: "请输入角色编码", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
          { validator: validCode, trigger: 'blur' }
        ],
        remark: [
          { max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
        ]
      },
      mainStyle: "width: 100%",
      authorizeStyle: "display: none;",
      menuTreeProps: {
        children: "children",
        label: "name"
      },
      menuTreeDate: [],
      authorizeRole: null,
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.initPermissions();
    this.roleList();
    this.menuTreeList();
  },
  methods: {
    /**
     * 初始化按钮权限
     */
    initPermissions(){
      this.sys_role_save = this.permissions["sys_role_save"];
      this.sys_role_modify = this.permissions["sys_role_modify"];
      this.sys_role_delete = this.permissions["sys_role_delete"];
      this.sys_role_menu = this.permissions["sys_role_menu"];
    },
    /**
     * 角色列表数据
     */
    roleList(){
      this.listLoading = true;
      list(this.listQuery).then(data => {
        this.listTotal = data.total;
        this.roleTableData = data.rows;

        this.listLoading = false;
      });
    },
    menuTreeList(){
      this.treeLoading = true;

      treeList().then(data => {
        this.menuTreeDate = data.result;

        this.treeLoading = false;
      });
    },
    /**
     * 分页插件——每页数量变化
     */
    handleSizeChange( val ){
      this.listQuery.size = val;
      this.roleList();
    },
    /**
     * 分页插件——当前页变化
     */
    handleCurrentChange( val ){
      this.listQuery.current = val;
      this.roleList();
    },
    /**
     * 搜索角色信息
     */
    searchRole(){
      this.listQuery[this.search.key] = this.search.value;
      this.roleList();
    },
    /**
     * 重置检索内容
     */
    restSearch(){
      this.search.value = "";
      this.searchRole();
    },
    /**
     * 删除角色
     * @param row
     */
    deleteRole( row ){
      this.$confirm( "此操作将永久删除该角色(角色名:" + row.name + "), 是否继续?", "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      ).then(() => {
        del(row.id).then(( result ) => {
          this.roleList();
          this.$notify({ title: "成功", message: "删除成功", type: "success", duration: 2000 });
        });
      });
    },
    /**
     * 显示新增角色dialog
     */
    handleCreateRole(){
      this.restRoleForm();
      this.roleDialogStatus = "createRole";
      this.roleDialogFormVisible = true;
    },
    /**
     * 新增角色
     * @param formName
     */
    createRole(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          save(this.roleForm).then(() => {
            this.cancelRoleForm(formName);
            this.roleList();
            this.$notify({ title: "成功", message: "创建成功", type: "success", duration: 2000 });
          });
        }
      })
    },
    /**
     * 修改角色 dialog
     * @param row
     */
    handleModifyRole( row ){
      this.restRoleForm();

      find( row.id ).then( data => {
        this.roleForm = data.result;

        this.roleDialogStatus = "modifyRole";
        this.roleDialogFormVisible = true;
      });
    },
    /**
     * 修改角色
     * @param formName
     */
    modifyRole(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          modify(this.roleForm).then(() => {
            this.cancelRoleForm(formName);
            this.roleList();
            this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
          });
        }
      })
    },
    /**
     * role dialog
     * @param formName
     */
    cancelRoleForm(formName){
      this.roleDialogFormVisible = false;
      this.restRoleForm();
      this.$refs[formName].resetFields();
    },
    /**
     * 重置roleForm
     */
    restRoleForm(){
      this.roleForm = {
        name: "",
        code: "",
        remark: ""
      }
    },
    /**
     * 角色授权tab
     * @param row
     */
    authorizeTag( row ){
      this.mainStyle = "animation:divShow 1s;-webkit-animation:divShow 1s;";
      this.authorizeStyle = "animation:tagShow 1s;-webkit-animation:tagShow 1s; padding: 20px 30px 0px 50px; ";

      this.treeLoading = true;
      this.authorizeRole = row;
      this.$refs.menuTree.setCheckedKeys([]);

      findMenuByRole(row.id).then((data) => {
        this.$refs.menuTree.setCheckedKeys(Array.isArray(data.result) ? data.result : [data.result]);
        this.treeLoading = false;
      });
    },
    /**
     * 更新角色权限
     */
    roleAuthorize(){
      this.treeLoading = true;

      modifyAuth( this.authorizeRole.code, this.authorizeRole.id, this.$refs.menuTree.getCheckedKeys() ).then(() => {
        this.treeLoading = false;
        this.$notify({ title: "成功", message: "授权成功", type: "success", duration: 2000 });
      });
    },
    /**
     * 关闭授权tab
     */
    closeAuthorize(){
      this.mainStyle = "animation:divHidden 1s;-webkit-animation:divHidden 1s; width: 100%";
      this.authorizeStyle = "animation:tagHidden 1s;-webkit-animation:tagHidden 1s; display: none;";
    }
  }
};
