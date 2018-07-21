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
        <el-dropdown-item @click.native="handlerUserInfo">个人信息</el-dropdown-item>
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

    <el-dialog title="个人信息" :visible.sync="userInfoDialogVisible" :append-to-body="true" @close="cancelUserInfoForm('userInfoForm')" width="800px">
      <el-form :model="userInfoForm" :rules="userInfoRules" ref="userInfoForm" label-width="100px" v-loading="userInfoFormLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户头像" prop="photo">
              <el-upload action="/upms/user/uploadPhoto" class="avatar-uploader-userinfo" :show-file-list="false" :disabled="modifyUserInfoTag"
                         :on-success="handleUserInfoPhotoSuccess" :before-upload="beforeUserInfoPhotoUpload">
                <img v-if="userInfoPhotoPath" :src="userInfoPhotoPath" class="avatar-userinfo">
                <i class="el-icon-plus avatar-uploader-icon-userinfo" v-else></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="userInfoForm.username" placeholder="请输入用户名称" maxlength="20" :disabled="modifyUserInfoTag"/>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="userInfoForm.realName" placeholder="请输入真实姓名" maxlength="20" :disabled="modifyUserInfoTag"/>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="userInfoForm.phone" placeholder="请输入手机号码" :disabled="modifyUserInfoTag"/>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker v-model="userInfoForm.birthday" type="date" placeholder="选择日期" style="width: 100%" :disabled="modifyUserInfoTag"/>
            </el-form-item>
            <el-form-item label="用户性别" prop="sex">
              <el-radio-group v-model="userInfoForm.sex" :disabled="modifyUserInfoTag">
                <el-radio border label="Man">男</el-radio>
                <el-radio border label="Woman">女</el-radio>
                <el-radio border label="Other">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="cancelUserInfoForm('userInfoForm')">取 消</el-button>
        <el-button v-if="modifyUserInfoTag" v-waves type="success" @click="handlerModifyUserInfo('userInfoForm')">编 辑</el-button>
        <el-button v-else v-waves :disabled="userInfoIsSubmit" type="primary" @click="modifyUserInfo('userInfoForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import store from '@/store';
  import { mapGetters } from "vuex";
  import { validatePhone, validatenull } from  "@/utils/validate";
  import { checkPassword, modifyPassword, checkUserName, modify, find } from "@/api/sys/user";

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
      /**
       * 校验手机号
       * @param rule
       * @param value
       * @param callback
       */
      var validPhone = ( rule, value,callback ) => {
        if (!validatePhone(value)) callback(new Error('请输入正确的11位手机号码'))
        else callback()
      };
      /**
       * 校验用户名是否存在
       * @param rule
       * @param value
       * @param callback
       */
      var validUsername = ( rule, value, callback ) => {
        checkUserName( this.userInfo.id, value ).then(data => {
          if( data.result ) callback(new Error('用户名称已存在'))
          else callback()
        });
      };
      return {
        modifyUserInfoTag: true, //修改个人信息
        userInfoDialogVisible: false, //是否显示个人信息的dialog
        userInfoFormLoading: false, //  修改个人信息是否正在提交
        userInfoIsSubmit: false,
        modifyPasswordDialogVisible: false, //是否显示修改密码的dialog
        passwordFormLoading: false,   //修改密码是否正在提交
        passwordIsSubmit: false,
        userInfoPhotoPath: "",
        userInfoForm: {
          username: "",
          realName: "",
          phone: "",
          sex: "Man",
          birthday: "",
          photo: "",
        },
        userInfoRules: {
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
            { required: true, message: "请输入手机号码", trigger: 'blur' },
            { validator: validPhone, trigger: 'blur' }
          ],
          realName: { required: true, message: "请输入真实姓名", trigger: "blur" }
        },
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
      /**
       * 关闭修改密码dialog
       * @param formName
       */
      cancelPasswordForm(formName){
        this.modifyPasswordDialogVisible = false;
        this.passwordFormLoading = false;
        this.passwordIsSubmit = false;
        this.$refs[formName].resetFields();
      },
      /**
       * 修改密码
       * @param formName
       */
      modifyPassword(formName){
        this.passwordIsSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.passwordFormLoading = true;

            modifyPassword(this.userInfo.id, this.passwordForm.nowPassword).then(() => {
              this.cancelPasswordForm(formName);
              this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
            });
          } else {
            this.passwordIsSubmit = false;
          }
        })
      },
      /**
       * 显示个人信息dialog
       */
      handlerUserInfo(){
        this.userInfoDialogVisible = true;

        find( this.userInfo.id ).then( data => {
          this.userInfoForm = data.result;
          if( !validatenull(data.result.photo) ) this.userInfoPhotoPath = this.website.filePath + data.result.photo;
        });
      },
      /**
       * 编辑个人信息
       */
      handlerModifyUserInfo(){
        this.modifyUserInfoTag = false;
      },
      /**
       * 关闭用户信息dialog
       * @param formName
       */
      cancelUserInfoForm( formName ){
        this.modifyUserInfoTag = true;
        this.userInfoPhotoPath = "";
        this.userInfoDialogVisible = false;
        this.userInfoFormLoading = false;
        this.userInfoIsSubmit = false;
        this.$refs[formName].resetFields();
      },
      /**
       * 修改个人信息
       */
      modifyUserInfo(formName){
        this.userInfoIsSubmit = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.userInfoFormLoading = true;
            modify(this.userInfoForm).then(() => {
              this.cancelUserInfoForm(formName);
              this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
            });
          } else {
            this.userInfoIsSubmit = true;
          }
        })
      },
      /**
       * 上传用户头像的图片条件
       * @param file
       * @returns {boolean}
       */
      beforeUserInfoPhotoUpload(file){
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
      handleUserInfoPhotoSuccess(data, file) {
        if( data.isSuccess ){
          this.userInfoPhotoPath = this.website.filePath + data.result;
          this.userInfoForm.photo = data.result;
        }
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

  .avatar-uploader-userinfo {
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
  .avatar-uploader-icon-userinfo {
    font-size: 28px;
    color: #8c939d;
    width: 255px;
    height: 255px;
    line-height: 255px;
    text-align: center;
  }
  .avatar-userinfo {
    width: 255px;
    height: 255px;
    display: block;
  }
</style>
