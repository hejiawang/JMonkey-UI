import { mapGetters } from "vuex";
import { treeList, find, save, modify, del } from "@/api/sys/menu";
import { treeToArray } from "@/utils/util";
import { validateNumber } from  "@/utils/validate";
import '@/styles/treeTable.scss';

export default {
  name: "menu",
  data() {
    return {
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
     * 新增下级菜单dialog
     * @param row
     */
    handleCreateNextMenu(row){
      this.handleCreateMenu();
      this.menuForm.parentId = row.id;
      this.menuForm.parentName = row.name;
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
    }
  }
};
