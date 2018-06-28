<template>
  <el-container>
    <div class="main-container">
      <el-row class="main-btn-group">
        <el-button v-waves type="success" @click="handleCreateUser">新增用户</el-button>
      </el-row>

      <el-table :data="userTableData" ref="testTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="loading">

        <el-table-column prop="username" label="姓名" show-overflow-tooltip/>
        <el-table-column prop="phone" label="电话" show-overflow-tooltip/>
        <el-table-column prop="sex" label="性别" show-overflow-tooltip/>

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-waves>编辑</el-button>
            <el-button size="mini" type="danger" v-waves>删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination layout="prev, pager, next" :total="100" />

      <el-dialog :title="textMap[userDialogStatus]" :visible.sync="userDialogFormVisible">
        <el-form :model="userForm" :rules="userRules" ref="userForm" label-width="100px">

          <el-form-item label="用户名称" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="登录密码" prop="password">
            <el-input v-model="userForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>

          <el-form-item label="用户性别" prop="sex">
            <el-radio-group v-model="userForm.sex">
              <el-radio border label="man">男</el-radio>
              <el-radio border label="women">女</el-radio>
              <el-radio border label="other">其他</el-radio>
            </el-radio-group>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUserForm('userForm')">取 消</el-button>
          <el-button type="primary" @click="createUser('userForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
  import waves from "@/directive/waves/index.js";

  export default {
    name: "user",
    directives: {
      waves
    },
    data () {
      const item = [
        {
          username: '王小虎',
          sex: '1',
          phone: '1333333333'
        },
        {
          username: '王大虎',
          sex: '1',
          phone: '1333333333'
        }
      ];
      return {
        loading: true,
        userDialogFormVisible: false,
        userTableData: item,
        userDialogStatus: "",
        textMap: {
          createUser: "新增用户",
          modifyUser: "修改用户"
        },
        userForm: {
          username: "",
          password: "",
          phone: "",
          sex: "man"
        },
        userRules: {
          username: [
            { required: true, message: "请输入账户", trigger: "blur" },
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
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    methods: {
      handleCreateUser(){
        this.userDialogStatus = "createUser";
        this.userDialogFormVisible = true;
      },
      createUser(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.info(this.userForm);
            this.userDialogFormVisible = false;
            this.$notify({ title: "成功", message: "创建成功", type: "success", duration: 2000 });
          }
        })
      },
      cancelUserForm(formName){
        this.userDialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
    }
  };
</script>
