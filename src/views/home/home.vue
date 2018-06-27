<template>
  <el-container>
    <div class="main-container">
      <el-row style="margin: 20px 0px;">
        <el-button @click="dialogFormVisible = true">默认按钮</el-button>
        <el-button type="primary" @click="getTestTableSelect">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </el-row>

      <el-table :data="tableData" ref="testTable" height="calc(100% - 80px)" tooltip-effect="dark"
                v-loading="loading" @row-click="rowClieck" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="date" label="日期" width="150">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip/>
        <el-table-column prop="age" label="性别" width="80" show-overflow-tooltip/>
        <el-table-column prop="phone" label="电话" width="150" show-overflow-tooltip/>
        <el-table-column prop="live" label="爱好" show-overflow-tooltip/>
        <el-table-column prop="address" label="地址" show-overflow-tooltip/>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination layout="prev, pager, next" :total="1000" />

      <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </el-container>
</template>
<script>
  export default {
    name: "home",
    data () {
      const item = [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '辽宁省沈阳市浑南经济开发区沈本大街3-5号5-15-4;辽宁省沈阳市浑南经济开发区沈本大街3-5号5-15-4',
          age: '18',
          phone: '1333333333',
          live: '足球、篮球、乒乓球；蛙泳、蝶泳、自由泳；长跑、短跑、接力跑；'
        },
        {
          date: '2016-05-03',
          name: '王大虎',
          address: '辽宁省沈阳市浑南经济开发区沈本大街3-5号5-15-4;辽宁省沈阳市浑南经济开发区沈本大街3-5号5-15-4',
          age: '18',
          phone: '1333333333',
          live: '足球、篮球、乒乓球；蛙泳、蝶泳、自由泳；长跑、短跑、接力跑；'
        }
      ];
      return {
        //tableData: Array(2).fill(item),
        tableData: item,
        loading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          name: '',
          region: ''
        },
        testTableSelection: []
      }
    },
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    methods: {
      handleDelete( $index, row ){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!'
          });
        });
      },
      getTestTableSelect(){
        console.info(this.testTableSelection);
      },
      rowClieck( row, event, column ){
        this.$refs.testTable.toggleRowSelection(row);
      },
      handleSelectionChange( val ){
        this.testTableSelection = val;
      }
    }
  };
</script>
