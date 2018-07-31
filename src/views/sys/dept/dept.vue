<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_dept_save" v-waves type="primary" @click="handleCreateDept">新增部门</el-button>
        <el-button v-if="sys_dept_modify" v-waves type="success" @click="handleModifyDept">编辑部门</el-button>
        <el-button v-if="sys_dept_delete" v-waves type="danger" @click="handleDeleteDept">删除部门</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <el-row>
        <el-col :span="10">
          <el-tree :data="deptTreeDate" node-key="id" highlight-current :props="deptTreeProps" @node-click="viewDept" v-loading="treeLoading">
          </el-tree>
        </el-col>
        <el-col :span="14">
          <el-card>
            <div slot="header">
              <span>部门详情</span>
              <el-button v-if="isSaveDept || isModifyDept" style="float: right; margin-left: 15px;" v-waves type="info" plain @click="cancelDeptForm">取 消</el-button>
              <el-button v-if="isSaveDept" :disabled="isSubmit" style="float: right; " v-waves type="success" plain @click="createDept">新 增</el-button>
              <el-button v-if="isModifyDept" :disabled="isSubmit" style="float: right; " v-waves type="success" plain @click="modifyDept">修 改</el-button>
            </div>
            <div>
              <el-form :model="deptForm" :rules="deptRules" ref="deptForm" label-width="100px" v-loading="formLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
                <el-form-item label="上级部门" prop="parentId">
                  <el-input size="medium" v-model="deptForm.parentName" placeholder="请选择上级部门" @focus="handleDeptParentTree()" :disabled="deptOption" readonly/>
                  <el-input v-model="deptForm.parentId" type="hidden" style="display: none"/>
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                  <el-input size="medium" v-model="deptForm.name" placeholder="请输入部门名称" maxlength="20" :disabled="deptOption" />
                </el-form-item>
                <el-form-item label="部门编码" prop="code">
                  <el-input size="medium" v-model="deptForm.code" placeholder="请输入部门编码" maxlength="20" :disabled="deptOption" />
                </el-form-item>
                <el-form-item label="部门排序" prop="sort">
                  <el-input-number v-model="deptForm.sort" :min="1" :max="10000" :disabled="deptOption" />
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog title="上级部门" :visible.sync="deptDialogTreeVisible" width="500px">
        <el-tree :data="deptTreeDate" node-key="id" highlight-current :props="deptTreeProps" @node-click="getParentDept">
        </el-tree>
      </el-dialog>

    </div>
  </el-container>
</template>
<script>
  import { mapGetters } from "vuex";
  import { treeList, find, save, modify, del } from "@/api/sys/dept";
  import { validatenull } from  "@/utils/validate";

  export default {
    name: "dept",
    data() {
      return {
        isSubmit: false,
        formLoading: false,
        deptDialogTreeVisible: false,
        isSaveDept: false,
        isModifyDept: false,
        treeLoading: false,
        deptTreeCurrent: null,
        deptTreeDate: [],
        deptTreeProps: {
          children: "children",
          label: "name"
        },
        deptForm: {
          parentId:'',
          parentName: '',
          name: '',
          code: '',
          sort: 1
        },
        deptRules: {
          name: [
            { required: true, message: "请输入部门名称", trigger: "blur" }
          ],
          code: [
            { required: true, message: "请输入部门编码", trigger: "blur" }
          ],
        }
      }
    },
    computed: {
      ...mapGetters(["permissions"]),
      deptOption: function () {
        return this.isSaveDept==false && this.isModifyDept==false;
      }
    },
    created() {
      this.initPermissions();
      this.initDeptTree();
    },
    methods: {
      /**
       * 初始化按钮权限
       */
      initPermissions(){
        this.sys_dept_save = this.permissions["sys_dept_save"];
        this.sys_dept_modify = this.permissions["sys_dept_modify"];
        this.sys_dept_delete = this.permissions["sys_dept_delete"];
      },
      /**
       * 初始化部门树
       */
      initDeptTree(){
        this.deptTreeCurrent = null;
        this.treeLoading = true;

        treeList().then(data => {
          this.deptTreeDate = data.result;
          this.treeLoading = false;
        });
      },
      /**
       * 删除部门
       */
      handleDeleteDept(){
        if( validatenull(this.deptTreeCurrent) ){
          this.$notify({ title: "警告", message: "请选择部门", type: "warning", duration: 2000 });
          return ;
        }

        this.$confirm( "此操作将永久删除该部门(部门名称:" + this.deptTreeCurrent.name + "), 是否继续?", "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        ).then(() => {
          del(this.deptTreeCurrent.id).then(( result ) => {
            this.initDeptTree();
            this.cancelDeptForm();
            this.$notify({ title: "成功", message: "删除成功", type: "success", duration: 2000 });
          });
        });
      },
      /**
       * 新增部门dialog
       */
      handleCreateDept(){
        this.$refs["deptForm"].resetFields();
        this.restDeptForm();
        this.isSaveDept = true;
        this.isModifyDept = false;
      },
      /**
       * 新增部门
       */
      createDept(){
        this.isSubmit = true;
        this.$refs["deptForm"].validate(valid => {
          if (valid) {
            this.formLoading = true;
            save(this.deptForm).then(( data ) => {
              if( data.isSuccess ){
                this.initDeptTree();
                this.cancelDeptForm();

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
      /**
       * 修改部门dialog
       */
      handleModifyDept(){
        if( validatenull(this.deptTreeCurrent) ){
          this.$notify({ title: "警告", message: "请选择部门", type: "warning", duration: 2000 });
        } else {
          this.isModifyDept = true;
          this.isSaveDept = false;

          find(this.deptTreeCurrent.id).then(data => {
            this.deptForm = data.result;
          });
        }
      },
      /**
       * 修改部门
       */
      modifyDept(){
        this.isSubmit = true;
        this.$refs["deptForm"].validate(valid => {
          if (valid) {
            this.formLoading = true;
            modify(this.deptForm).then(( data ) => {
              if( data.isSuccess ){
                this.initDeptTree();
                this.cancelDeptForm();

                this.$notify({ title: "成功", message: "修改成功", type: "success", duration: 2000 });
              } else {
                this.handleErrorCallback(data.message);
              }
            });
          } else {
            this.isSubmit = false;
          }
        })
      },
      /**
       * 查看部门信息
       */
      viewDept(row){
        this.deptTreeCurrent = row;
        this.cancelDeptForm();

        find(row.id).then(data => {
          this.deptForm = data.result;
          if( validatenull( this.deptForm.parentId ) ){
            this.deptForm.parentName = " ";
          }
        });
      },
      handleErrorCallback( message ){
        this.formLoading = false, this.isSubmit = false;
        this.$notify({ title: "失败", message: message, type: "error", duration: 2000 });
      },
      /**
       * 取消新增或修改操作
       */
      cancelDeptForm(){
        this.isSaveDept = false;
        this.isModifyDept = false;
        this.isSubmit = false;
        this.formLoading = false;

        this.$refs["deptForm"].resetFields();
        this.restDeptForm();
        if( !validatenull(this.deptTreeCurrent) ){
          find(this.deptTreeCurrent.id).then(data => {
            this.deptForm = data.result;
          });
        }
      },
      /**
       * 重置deptform值
       */
      restDeptForm(){
        this.deptForm = {
          parentId:'',
          parentName: '',
          name: '',
          code: '',
          sort: 1
        };
      },
      /**
       * 显示选择父部门的dialog
       */
      handleDeptParentTree(){
        this.deptDialogTreeVisible = true;
      },
      getParentDept( row ){
        this.deptForm.parentId = row.id;
        this.deptForm.parentName = row.name;

        this.deptDialogTreeVisible = false;
      }
    }
  }
</script>
