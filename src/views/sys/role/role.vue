<template>
  <el-container>
    <div class="main-container" :style="mainStyle">

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
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.createDate | parseTime }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" v-waves @click="handleModifyRole(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-waves @click="deleteRole(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" v-waves @click="authorizeTag(scope.row)">授权</el-button>
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
                <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色编码" prop="code">
                <el-input v-model="roleForm.code" placeholder="请输入角色编码" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="角色描述" prop="remark">
            <el-input v-model="roleForm.remark" type="textarea" :rows="2"/>
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
    <div class="main-container" :style="authorizeStyle">
      <el-tree :data="menuTreeDate" node-key="id" highlight-current :props="menuTreeProps" show-checkbox>
      </el-tree>
    </div>
  </el-container>
</template>
<script>
  import waves from "@/directive/waves/index.js"; //按钮水波纹效果
  import { list, find, save, modify, del, checkCode, checkName } from "@/api/sys/role";
  import { treeList } from "@/api/sys/menu";

  export default {
    name: "role",
    directives: {
      waves
    },
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
        roleDialogFormVisible: false, //是否显示角色 dialog
        roleTableData: null,   //角色列表数据
        roleDialogStatus: "", //role dialog 状态 新增或者修改角色
        textMap: {  //显示文字
          createRole: "新增角色",
          modifyRole: "修改角色"
        },
        listTotal: null,  //用户列表总条数
        listQuery: {  //用户列表分页条件
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
    created() {
      this.roleList();
      this.menuTreeList();
    },
    methods: {
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
        treeList().then(data => {
          this.menuTreeDate = data.result;
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
      authorizeTag( row ){
        this.authorizeRole = row;

        this.mainStyle = "animation:divShow 1s;-webkit-animation:divShow 1s;";
        this.authorizeStyle = "animation:tagShow 1s;-webkit-animation:tagShow 1s; padding: 76px 50px 0px 50px; height: calc(100% - 76px);";
      }
    }
  };
</script>

<style lang="scss">
  @keyframes divShow {
    0%   { width:100%;}
    100% { width:60%;}
  }
  @-webkit-keyframes divShow {
    0%   { width:100%;}
    100% { width:60%;}
  }

  @keyframes tagShow {
    0%   { width:0%;}
    100% { width:40%;}
  }
  @-webkit-keyframes tagShow {
    0%   { width:0%;}
    100% { width:40%;}
  }
</style>
