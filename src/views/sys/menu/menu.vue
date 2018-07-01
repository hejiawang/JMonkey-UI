<template>
  <el-container>
    <div class="main-container">

      <!-- 功能按钮 start -->
      <el-row class="main-btn-group">
        <el-button v-waves type="primary" >新增菜单</el-button>
      </el-row>
      <!-- 功能按钮 end -->

      <el-tree
        :data="data5"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <span  slot-scope="{ node, data }" style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span >{{ node.label }}</span>
          <span >{{ node.name }}</span>
          <span> 123123123 </span>
        </span>
      </el-tree>




    </div>
  </el-container>
</template>
<script>
  import waves from "@/directive/waves/index.js"; //按钮水波纹效果

  export default {
    name: "menu",
    directives: {
      waves
    },
    data(){
      const data = [{
        id: 1,
        label: '一级 1',
        name: 'aaaa',
        children: [{
          id: 4,
          label: '二级 1-1',
          name: '123',
          children: [{
            id: 9,
            label: '三级 1-1-1',
            name: '123',
          }, {
            id: 10,
            label: '三级 1-1-2',
            name: '123',
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        name: '123',
        children: [{
          id: 5,
          label: '二级 2-1',
          name: '123',
        }, {
          id: 6,
          label: '二级 2-2',
          name: '123',
        }]
      }, {
        id: 3,
        label: '一级 3',
        name: '123',
        children: [{
          id: 7,
          label: '二级 3-1',
          name: '123',
        }, {
          id: 8,
          label: '二级 3-2',
          name: '123',
        }]
      }];
      return {
        data4: JSON.parse(JSON.stringify(data)),
        data5: JSON.parse(JSON.stringify(data))
      }
    }
  };
</script>
