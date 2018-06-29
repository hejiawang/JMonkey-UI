<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-btn-group">
        <el-button v-waves type="primary" @click="handleCreateUser">新增用户</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 列表 start -->
      <el-table :data="userTableData" ref="userTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="listLoading">

        <el-table-column prop="username" label="姓名" show-overflow-tooltip/>
        <el-table-column prop="phone" label="电话" show-overflow-tooltip/>
        <el-table-column prop="sex" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sex | sexFilter }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" v-waves @click="handleModifyUser(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-waves @click="deleteUser(scope.row)">删除</el-button>
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

          <el-form-item label="用户名称" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名称"></el-input>
          </el-form-item>

          <el-form-item label="登录密码" prop="password">
            <el-input v-model="userForm.password" placeholder="请输入登录密码"></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>

          <el-form-item label="用户性别" prop="sex">
            <el-radio-group v-model="userForm.sex">
              <el-radio border label="Man">男</el-radio>
              <el-radio border label="Woman">女</el-radio>
              <el-radio border label="Other">其他</el-radio>
            </el-radio-group>

          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelUserForm('userForm')">取 消</el-button>
          <el-button v-waves type="primary" v-if=" userDialogStatus == 'createUser' " @click="createUser('userForm')">确 定</el-button>
          <el-button v-waves type="primary" v-else @click="modifyUser('userForm')">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改用户 end -->

    </div>
  </el-container>
</template>
<script>
  import waves from "@/directive/waves/index.js"; //按钮水波纹效果
  import { list, find, save, modify, del } from "@/api/sys/user";

  export default {
    name: "user",
    directives: {
      waves
    },
    data () {
      return {
        listLoading: false,  //页面是否在加载
        userDialogFormVisible: false, //是否显示user dialog
        userTableData: null,   //用户列表数据
        userDialogStatus: "", //user dialog 状态 新增用户或者修改用户
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
          password: "",
          phone: "",
          sex: "Man"
        },
        userRules: {  //user form rule
          username: [
            { required: true, message: "请输入用户名称", trigger: "blur" },
            { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
          ],
          phone: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            { min: 11, max: 11, message: "请输入正确的11位手机号码", trigger: "blur" }
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
          password: "",
          phone: "",
          sex: "Man"
        }
      }
    }
  };
</script>
