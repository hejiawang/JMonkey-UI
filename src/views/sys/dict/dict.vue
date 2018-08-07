<template>
  <el-container>

    <div class="main-container" :style="dictTypeStyle">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_dict_type_save" v-waves type="primary" @click="handleCreateDictType">新增字典</el-button>

        <el-input placeholder="请输入查询内容" v-model="search.value"  class="main-search" @keyup.enter.native="searchDictType">
          <i slot="suffix" class="el-input__icon el-icon-close search-close" @click="restSearchDictType"></i>
          <el-select v-model="search.key" slot="prepend" placeholder="请选择" @change="changeSearch">
            <el-option label="字典类型" value="type"></el-option>
            <el-option label="角色描述" value="remark"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" v-waves @click="searchDictType"></el-button>
        </el-input>
      </el-row>
      <!-- 功能按钮 end -->

      <!-- 字典类型列表 start -->
      <el-table :data="dictTypeTableData" ref="dictTypeTable" height="calc(100% - 80px)" tooltip-effect="dark" v-loading="dictTypeTableLoading">
        <el-table-column prop="type" label="字典类型" show-overflow-tooltip/>
        <el-table-column prop="remark" label="备注说明" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button v-if="sys_dict_type_modify" size="mini" type="success" v-waves @click="handleModifyDictType(scope.row)">编辑</el-button>
            <el-button v-if="sys_dict_type_delete" size="mini" type="danger" v-waves @click="deleteDictType(scope.row)">删除</el-button>
            <el-button v-if="sys_dict_type_value" size="mini" type="warning" v-waves @click="handleDictTypeValue(scope.row)">键值</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 字典类型列表 end -->

      <!-- 分页 start -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal" />
      <!-- 分页 end -->

      <!-- 新增修改字典类型 start -->
      <el-dialog :title="textMap[dictDialogStatus]" :visible.sync="dictTypeDialogFormVisible" @close="cancelDictTypeForm()" >

        <el-form :model="dictTypeForm" :rules="dictTypeRules" ref="dictTypeForm" label-width="100px" v-loading="formLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
          <el-form-item label="字典类型" prop="type">
            <el-input v-model="dictTypeForm.type" placeholder="请输入字典类型" maxlength="20"/>
          </el-form-item>
          <el-form-item label="类型描述" prop="remark">
            <el-input v-model="dictTypeForm.remark" type="textarea" :rows="2" maxlength="100"/>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelDictTypeForm()">取 消</el-button>
          <el-button v-waves :disabled="isSubmit" type="primary" v-if=" dictDialogStatus == 'createDictType' " @click="createDictType">确 定</el-button>
          <el-button v-waves :disabled="isSubmit" type="primary" v-if=" dictDialogStatus == 'modifyDictType' " @click="modifyDictType">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改字典类型 end -->

    </div>

    <div class="main-container" :style="dictValueStyle">

      <!-- 字典类型对应的字典值列表 start -->
      <el-card>
        <div slot="header" class="clearfix">
          <span>字典类型： <el-tag type="info" key="tag" closable @close="closeDictTypeValue()" v-if="dictTypeSelect">{{ dictTypeSelect.type }}</el-tag> </span>
          <el-button style="float: right; " v-if="sys_dict_value_save" type="primary" plain @click="handleCreateDictValue">新增类型值</el-button>
        </div>

        <el-table :data="dictValueTableData" ref="dictValueTable" tooltip-effect="dark" v-loading="dictValueTableLoading">
          <el-table-column prop="lable" label="字典标签" show-overflow-tooltip/>
          <el-table-column prop="value" label="字典键值" show-overflow-tooltip/>
          <el-table-column prop="sort" label="字典排序" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button v-if="sys_dict_value_modify" size="mini" type="success" v-waves @click="handleModifyDictValue(scope.row)">编辑</el-button>
              <el-button v-if="sys_dict_value_delete" size="mini" type="danger" v-waves @click="deleteDictValue(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 字典类型对应的字典值列表 end -->

      <!-- 新增修改字典值 start -->
      <el-dialog :title="textMap[dictDialogStatus]" :visible.sync="dictValueDialogFormVisible" @close="cancelDictValueForm()" >

        <el-form :model="dictValueForm" :rules="dictValueRules" ref="dictValueForm" label-width="100px" v-loading="formLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
          <el-form-item label="字典标签" prop="lable">
            <el-input v-model="dictValueForm.lable" placeholder="请输入字典标签" maxlength="20"/>
          </el-form-item>
          <el-form-item label="字典键值" prop="value">
            <el-input v-model="dictValueForm.value" placeholder="请输入字典键值" maxlength="20"/>
          </el-form-item>
          <el-form-item label="字典排序" prop="sort">
            <el-input-number v-model="dictValueForm.sort" :min="1" :max="10000" />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="cancelDictValueForm()">取 消</el-button>
          <el-button v-waves :disabled="isSubmit" type="primary" v-if=" dictDialogStatus == 'createDictValue' " @click="createDictValue">确 定</el-button>
          <el-button v-waves :disabled="isSubmit" type="primary" v-if=" dictDialogStatus == 'modifyDictValue' " @click="modifyDictValue">修 改</el-button>
        </div>
      </el-dialog>
      <!-- 新增修改字典值 end -->
    </div>

  </el-container>
</template>
<script>
  import { mapGetters } from "vuex";
  import { list as listType, find as findType, save as saveType, modify as modifyType, del as delType, checkExist as checkExistType } from "@/api/sys/dictType";
  import { list as listValue, find as findValue, save as saveValue, modify as modifyValue, del as delValue } from "@/api/sys/dictValue";
  import { validatenull } from  "@/utils/validate";

  export default {
    name: "dict",
    data () {
      var validType = ( rule, value, callback ) => {
        var id = this.dictTypeForm.id ? this.dictTypeForm.id : null;
        checkExistType( id, value ).then(data => {
          if( data.result ) callback(new Error('字典类型已存在'))
          else callback()
        });
      };

      return {
        isSubmit: false,  //是否在提交数据
        formLoading: false, //表单是否正在提交
        dictTypeDialogFormVisible: false, //字典类型dialog是否显示
        dictTypeTableLoading: false,  //字典类型列表是否正在加载
        dictTypeTableData: null,  //字典类型列表数据
        listTotal: null,  //字典类型列表总条数
        listQuery: {  //字典类型列表分页条件
          current: 1,
          size: 10
        },
        dictDialogStatus: "", //dialog状态值
        textMap: {  //显示文字
          createDictType: "新增字典类型",
          modifyDictType: "修改字典类型",
          createDictValue: "新增字典值",
          modifyDictValue: "修改字典值"
        },
        dictTypeForm: {
          type: "",
          remark: ""
        },
        dictTypeRules: {
          type: [
            { required: true, message: "请输入字典类型", trigger: "blur" },
            { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
            { validator: validType, trigger: 'blur' }
          ],
          remark: [
            { max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
          ]
        },
        dictTypeStyle: "width: 100%",
        dictValueStyle: "display: none;",
        dictTypeSelect: null,
        dictValueTableLoading: false,//字典值列表是否正在加载
        dictValueTableData: null,
        dictValueDialogFormVisible: false,
        dictValueForm: {
          lable: "",
          value: "",
          sort: 1
        },
        dictValueRules: {
          lable: {required: true, message: "请输入字典标签", trigger: "blur"},
          value: {required: true, message: "请输入字典键值", trigger: "blur"}
        },
        search: {
          key: "type",
          value: ""
        },
      }
    },
    computed: {
      ...mapGetters(["permissions"])
    },
    created() {
      this.initPermissions();
      this.initDictTypeList();
    },
    methods: {
      /**
       * 初始化按钮权限
       */
      initPermissions(){
        this.sys_dict_type_save = this.permissions["sys_dict_type_save"];
        this.sys_dict_type_modify = this.permissions["sys_dict_type_modify"];
        this.sys_dict_type_delete = this.permissions["sys_dict_type_delete"];
        this.sys_dict_type_value = this.permissions["sys_dict_type_value"];
        this.sys_dict_value_save = this.permissions["sys_dict_value_save"];
        this.sys_dict_value_modify = this.permissions["sys_dict_value_modify"];
        this.sys_dict_value_delete = this.permissions["sys_dict_value_delete"];
      },
      /**
       * 字典类型分页列表
       */
      initDictTypeList(){
        this.dictTypeTableLoading = true;
        listType(this.listQuery).then(data => {
          this.listTotal = data.total;
          this.dictTypeTableData = data.rows;

          this.dictTypeTableLoading = false;
        });
      },
      /**
       * 新增字典类型dialog
       */
      handleCreateDictType(){
        this.closeDictTypeValue();

        this.restDictTypeForm();
        this.dictDialogStatus = "createDictType";
        this.dictTypeDialogFormVisible = true;
      },
      /**
       * 新增字典类型
       */
      createDictType(){
        this.isSubmit = true;
        this.$refs.dictTypeForm.validate(valid => {
          if (valid) {
            this.formLoading = true;
            saveType(this.dictTypeForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelDictTypeForm();
                this.initDictTypeList();
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
       * 修改字典类型dialog
       */
      handleModifyDictType( row ){
        this.closeDictTypeValue();

        findType( row.id ).then( data => {
          this.dictTypeForm = data.result;

          this.dictDialogStatus = "modifyDictType";
          this.dictTypeDialogFormVisible = true;
        });
      },
      /**
       * 修改字典类型
       */
      modifyDictType(){
        this.isSubmit = true;
        this.$refs.dictTypeForm.validate(valid => {
          if (valid) {
            this.formLoading = true;
            modifyType(this.dictTypeForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelDictTypeForm();
                this.initDictTypeList();
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
       * 关闭字典类型dialog
       */
      cancelDictTypeForm(){
        this.dictTypeDialogFormVisible = false;
        this.formLoading = false;
        this.isSubmit = false;
        this.restDictTypeForm();
        this.$refs.dictTypeForm.resetFields();
      },
      /**
       * 重置字典类型form值
       */
      restDictTypeForm(){
        this.dictTypeForm = {
          type: "",
          remark: ""
        }
      },
      /**
       * 错误操作回调
       */
      handleErrorCallback( message ){
        this.formLoading = false, this.isSubmit = false;
        this.$notify({ title: "失败", message: message, type: "error", duration: 2000 });
      },
      /**
       * 删除字典类型
       */
      deleteDictType( row ){
        this.closeDictTypeValue();

        this.$confirm( "此操作将永久删除该类型(字典类型:" + row.type + "), 是否继续?", "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        ).then(() => {
          delType(row.id).then(( result ) => {
            this.initDictTypeList();
            this.$notify({ title: "成功", message: "删除成功", type: "success", duration: 2000 });
          });
        });
      },
      /**
       * 分页插件——每页数量变化
       */
      handleSizeChange(val){
        this.listQuery.size = val;
        this.initDictTypeList();
      },
      /**
       * 分页插件——当前页变化
       */
      handleCurrentChange(val){
        this.listQuery.current = val;
        this.initDictTypeList();
      },
      /**
       * 展现字典类型的值
       */
      handleDictTypeValue( row ){
        this.dictTypeStyle = "animation:dictTypeShow 1s;-webkit-animation:dictTypeShow 1s;";
        this.dictValueStyle = "animation:dictValueShow 1s;-webkit-animation:dictValueShow 1s; padding: 20px 30px 0px 50px; ";

        this.dictTypeSelect = row;
        this.dictValueList();
      },
      dictValueList(){
        this.dictValueTableLoading = true;
        listValue( {typeId: this.dictTypeSelect.id} ).then(data => {
          this.dictValueTableData = data.result;
          this.dictValueTableLoading = false;
        });
      },
      /**
       * 关闭字典类型的值tag
       */
      closeDictTypeValue(){
        if( ! validatenull( this.dictTypeSelect ) ){
          this.dictTypeStyle = "animation:dictTypeHidden 1s;-webkit-animation:dictTypeHidden 1s; width: 100%";
          this.dictValueStyle = "animation:dictValueHidden 1s;-webkit-animation:dictValueHidden 1s; display: none;";

          this.dictTypeSelect = null;
          this.dictValueTableData = null;
        }
      },
      /**
       * 新增字典值dialog
       */
      handleCreateDictValue(){
        this.dictDialogStatus = "createDictValue";
        this.dictValueDialogFormVisible = true;
      },
      /**
       * 新增字典值
       */
      createDictValue(){
        this.isSubmit = true;
        this.$refs.dictValueForm.validate(valid => {
          if (valid) {
            this.formLoading = true;
            this.dictValueForm.typeId = this.dictTypeSelect.id;
            saveValue(this.dictValueForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelDictValueForm();
                this.dictValueList();
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
       * 修改字典值dialog
       */
      handleModifyDictValue( row ){
        findValue( row.id ).then( data => {
          this.dictValueForm = data.result;

          this.dictDialogStatus = "modifyDictValue";
          this.dictValueDialogFormVisible = true;
        });
      },
      /**
       * 修改字典值
       */
      modifyDictValue(){
        this.isSubmit = true;
        this.$refs.dictValueForm.validate(valid => {
          if (valid) {
            this.formLoading = true;
            modifyValue(this.dictValueForm).then(( data ) => {
              if( data.isSuccess ){
                this.cancelDictValueForm();
                this.dictValueList();
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
       * 关闭字典键值新增或修改dialog
       */
      cancelDictValueForm(){
        this.dictValueDialogFormVisible = false;
        this.formLoading = false;
        this.isSubmit = false;
        this.restDictValueForm();
        this.$refs.dictValueForm.resetFields();
      },
      /**
       * 重置字典键值form
       */
      restDictValueForm(){
        this.dictValueForm = {
          lable: "",
          value: "",
          sort: 1
        }
      },
      /**
       * 删除字典标签
       * @param row
       */
      deleteDictValue( row ){
        this.$confirm( "此操作将永久删除该字典标签(" + row.lable + "), 是否继续?", "提示",
          { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
        ).then(() => {
          delValue(row.id).then(( result ) => {
            this.dictValueList();
            this.$notify({ title: "成功", message: "删除成功", type: "success", duration: 2000 });
          });
        });
      },
      /**
       * 字典类型查询
       */
      searchDictType(){
        this.listQuery[this.search.key] = this.search.value;
        this.initDictTypeList();
      },
      /**
       * 重置字典类型查询条件
       */
      restSearchDictType(){
        this.changeSearch();
        this.searchDictType();
      },
      /**
       * 查询条件改变的回调函数
       */
      changeSearch(){
        let searchParam = ['type','remark'];
        searchParam.forEach( param => this.listQuery[param] = '' );
        this.search.value = "";
      }
    }
  }
</script>
<style lang="scss">
  @keyframes dictTypeShow {
    0%   { width:100%;}
    100% { width:60%;}
  }
  @-webkit-keyframes dictTypeShow {
    0%   { width:100%;}
    100% { width:60%;}
  }

  @keyframes dictValueShow {
    0%   { width:0%;}
    100% { width:40%;}
  }
  @-webkit-keyframes dictValueShow {
    0%   { width:0%;}
    100% { width:40%;}
  }

  @keyframes dictTypeHidden {
    0%   { width:60%;}
    100% { width:100%;}
  }
  @-webkit-keyframes dictTypeHidden {
    0%   { width:60%;}
    100% { width:100%;}
  }

  @keyframes dictValueHidden {
    0%   { width:40%;}
    100% { width:0%;}
  }
  @-webkit-keyframes dictValueHidden {
    0%   { width:40%;}
    100% { width:0%;}
  }

  .el-card{
    height: 100%;
  }
</style>
