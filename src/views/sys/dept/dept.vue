<template>
  <el-container>
    <div class="main-container">
      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_dept_save" v-waves type="primary" @click="handleCreateDept">新增部门</el-button>
        <el-button v-waves type="success" @click="handleModifyDept">编辑部门</el-button>
        <el-button v-waves type="danger" @click="handleDeleteDept">删除部门</el-button>
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
              <el-button v-if="isSaveDept" style="float: right; " v-waves type="success" plain @click="createDept">确 定</el-button>
              <el-button v-if="isModifyDept" style="float: right; " v-waves type="success" plain @click="modifyDept">确 定</el-button>
            </div>
            <div>
              <el-form :model="deptForm" :rules="deptRules" ref="deptForm" label-width="100px">
                <el-form-item label="上级部门" prop="parentId">
                  <el-input size="medium" v-model="deptForm.parentName" placeholder="请选择上级部门" :disabled="isSaveDept==false || isModifyDept==false"></el-input>
                  <el-input v-model="deptForm.parentId" type="hidden" style="display: none"/>
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                  <el-input size="medium" v-model="deptForm.name" placeholder="请输入部门名称" :disabled="isSaveDept==false || isModifyDept==false"></el-input>
                </el-form-item>
                <el-form-item label="部门编码" prop="code">
                  <el-input size="medium" v-model="deptForm.code" placeholder="请选择部门编码" :disabled="isSaveDept==false || isModifyDept==false"></el-input>
                </el-form-item>
                <el-form-item label="部门排序" prop="sort">
                  <el-input-number v-model="deptForm.sort" :min="1" :max="10000" :disabled="isSaveDept==false || isModifyDept==false" />
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>


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
        isSaveDept: false,
        isModifyDept: false,
        treeLoading: false,
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

        }
      }
    },
    computed: {
      ...mapGetters(["permissions"]),
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
        this.sys_dept_save = true;//this.permissions["sys_dept_save"];
        this.sys_dept_modify = this.permissions["sys_dept_modify"];
        this.sys_dept_delete = this.permissions["sys_dept_delete"];
      },
      /**
       * 初始化部门树
       */
      initDeptTree(){
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

      },
      /**
       * 新增部门dialog
       */
      handleCreateDept(){

      },
      createDept(){

      },
      /**
       * 修改部门dialog
       */
      handleModifyDept(){

      },
      modifyDept(){

      },
      /**
       * 查看部门信息
       */
      viewDept(row){
        find(row.id).then(data => {
          this.deptForm = data.result;
        });
      }
    }
  }
</script>
