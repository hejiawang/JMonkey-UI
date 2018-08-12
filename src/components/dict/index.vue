<template>
    <el-radio-group v-if=" type == 'radio'" v-model="componentDictValue">
      <template v-for="dictValue in dictValueList">
        <el-radio border :label="dictValue.value">{{dictValue.lable}}</el-radio>
      </template>
    </el-radio-group>
    <el-select v-else-if=" type == 'select'" v-model="componentDictValue" :placeholder="placeholder">
      <el-option v-for="item in dictValueList" :key="item.id" :label="item.lable" :value="item.value" />
    </el-select>
</template>
<script>
  import { findValue } from "@/api/sys/dictValue";
  import { validatenull } from  "@/utils/validate";

  export default {
    name: 'componentDict',
    props: {
      dictType: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: false,
        default: "radio"
      },
      placeholder: {
        type: String,
        required: false,
      },
      value: {
        type: String,
        default:""
      }
    },
    watch:{
      value(val) {
        this.componentDictValue = val;
      },
      componentDictValue(val) {
        this.$emit('input', val);
      }
    },
    data(){
      return {
        dictValueList: [],
        componentDictValue: "",
      }
    },
    created() {
      this.initDictValue();
    },
    mounted() {
      this.componentDictValue = this.value;
    },
    methods: {
      initDictValue(){
        findValue(this.dictType).then(data => {
          this.dictValueList = data.result;
        });
      }
    }
  }
</script>
