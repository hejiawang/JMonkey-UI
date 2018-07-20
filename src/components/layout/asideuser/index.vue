<template>
  <div>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-row>
        <img v-if="userInfo.photo" :src="website.filePath + userInfo.photo">
        <img src="../../../assets/img/userDefaule.png" v-else>
      </el-row>
      <el-row style="text-align: center">
        <span>
          <template v-if="userInfo.realName">{{userInfo.realName}}</template>
          <template v-else>{{userInfo.username}}</template>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </el-row>
    </span>
    <el-dropdown-menu style="width: 100px;" slot="dropdown">
      <el-dropdown-item>个人信息</el-dropdown-item>
      <el-dropdown-item @click.native="handlerModifyPassword">修改密码</el-dropdown-item>
      <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

  <el-dialog title="修改密码" :visible.sync="modifyPasswordDialogVisible" :append-to-body="true" width="600px">
    <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px" v-loading="passwordFormLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
      <el-form-item label="原始密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" maxlength="20"/>
      </el-form-item>
      <el-form-item label="修改密码" prop="nowPassword">
        <el-input v-model="passwordForm.nowPassword" type="password" maxlength="20"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" maxlength="20"/>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button v-waves @click="cancelPasswordForm('passwordForm')">取 消</el-button>
      <el-button v-waves :disabled="passwordIsSubmit" type="primary" @click="modifyPassword('passwordForm')">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
  import store from '@/store';
  import { mapGetters } from "vuex";
  import { checkPassword, mofidyPasswsord } from "@/api/sys/user";

  export default {
    name: "asideUser",
    computed: {
      ...mapGetters(["website"]),
      ...mapGetters(["userInfo"]),
    },
    data(){
      /**
       * 校验原始密码是否正确
       * @param rule
       * @param value
       * @param callback
       */
      var validPassword = ( rule, value, callback ) => {
        checkPassword( this.userInfo.id, value ).then(data => {
          if( data.result ) callback(new Error('原始密码不正确'))
          else callback()
        });
      };
      /**
       * 校验新密码
       * @param rule
       * @param value
       * @param callback
       */
      var validNewPassword = ( rule, value, callback ) => {
        if (this.passwordForm.confirmPassword !== '') this.$refs.passwordForm.validateField('confirmPassword');
        else callback();
      };
      /**
       * 校验确认密码
       * @param rule
       * @param value
       * @param callback
       */
      var validConfirmPassword = ( rule, value, callback ) => {
        if( value != this.passwordForm.nowPassword ) callback(new Error('两次输入密码不一致!'));
        else callback();
      };

      return {
        modifyPasswordDialogVisible: false, //是否显示修改密码的dialog
        passwordFormLoading: false,   //修改密码是否正在提交
        passwordIsSubmit: false,
        passwordForm: {
          oldPassword: "",
          nowPassword: "",
          confirmPassword: "",
        },
        passwordRules: {
          oldPassword: [
            { required: true, message: "请输入原始密码", trigger: "blur" },
            { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
            { validator: validPassword, trigger: 'blur' }
          ],
          nowPassword: [
            { required: true, message: "请输入修改密码", trigger: "blur" },
            { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
            { validator: validNewPassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: "请输入确认密码", trigger: "blur" },
            { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
            { validator: validConfirmPassword, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      /**
       * 退出系统
       */
      logout() {
        this.$confirm("此操作将退出系统, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        });
      },
      /**
       * 修改密码dialog
       */
      handlerModifyPassword(){
        this.modifyPasswordDialogVisible = true;
      },
      cancelPasswordForm(formName){
        this.modifyPasswordDialogVisible = false;
        this.passwordFormLoading = false;
        this.passwordIsSubmit = false;
        this.$refs[formName].resetFields();
      },
      modifyPassword(formName){

        this.passwordIsSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.passwordFormLoading = true;

            this.passwordForm.userId = this.userInfo.id;
            mofidyPasswsord(this.userInfo.id, this.passwordForm.nowPassword).then(() => {
              this.cancelPasswordForm(formName);
              this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
            });
          } else {
            this.passwordIsSubmit = false;
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-dropdown {
    margin-left: 50px;
    margin-bottom: 20px;
    display: inline-block;
    position: relative;
    font-size: 14px;
    img {
      height: 100px;
      width: 100px
    }
    span {
      color: white;
    }
  }
</style>
