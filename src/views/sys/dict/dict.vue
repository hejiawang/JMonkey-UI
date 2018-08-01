<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-top-group">
        <el-button v-if="sys_dict_type_save" v-waves type="primary" @click="handleCreateDictType">新增字典</el-button>
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
    </div>
  </el-container>
</template>
<script>
  import { mapGetters } from "vuex";
  import { list as listType, find as findType, save as saveType, modify as modifyType, del as delType, checkExist as checkExistType } from "@/api/sys/dictType";
  import { list as listValue, find as findValue, save as saveValue, modify as modifyValue, del as delValue } from "@/api/sys/dictValue";

  export default {
    name: "dict",
    data () {
      return {
        dictTypeTableLoading: false,  //字典类型列表是否正在加载
        dictTypeTableData: null,  //字典类型列表数据
      }
    },
    computed: {
      ...mapGetters(["permissions"])
    },
    created() {
      this.initPermissions();
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
      handleCreateDictType(){

      },
      handleModifyDictType( row ){

      },
      deleteDictType( row ){

      },
      handleDictTypeValue( row ){

      }
    }
  }
</script>
<style lang="scss">

</style>
