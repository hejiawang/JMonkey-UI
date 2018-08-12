<template>
  <el-container>
    <div class="main-container">

      <!-- 字典组件 start -->
      <el-row class="main-top-group">
        <el-form :inline="true" :model="dictComponentForm" >
          <el-form-item label="字典组件">
            <component-dict dictType="sys_user_sex" v-model="dictComponentForm.dictValue" />
          </el-form-item>
          <el-form-item label="字典组件">
            <component-dict dictType="sys_user_sex" v-model="dictComponentForm.dictValue" type="select" placeholder="请选择性别"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleConsoleDict">查询</el-button>
          </el-form-item>
          <el-form-item label="参数说明">
            dictType：字典类型； type：展示方式（radio、select），默认radio；  placeholder：当type为select时的placeholder
          </el-form-item>
        </el-form>
      </el-row>
      <!-- 字典组件 start -->

      <!-- 页面跳转 start -->
      <el-row class="main-top-group">

      </el-row>
      <!-- 页面跳转 end -->
    </div>
  </el-container>
</template>
<script>
  import componentDict from '@/components/dict'

  export default {
    name: "componentsTest",
    components: {
      /* 字典组件 start */
      componentDict,
      /* 字典组件 end */
    },
    data() {
      return {
        /* 字典组件 start */
        dictComponentForm : { dictValue : "woman" },
        /* 字典组件 end */
      }
    },
    methods: {
      /* 字典组件 start */
      handleConsoleDict(){
        console.info( this.dictComponentForm.dictValue )
        this.dictComponentForm.dictValue = '';
      },
      /* 字典组件 end */
    }
  }
</script>
