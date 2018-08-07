<template>
    <el-radio-group v-if=" type == 'radio'" v-model="componentDictValue" @change="handleChange">
      <template v-for="dictValue in dictValueList">
        <el-radio border :label="dictValue.value">{{dictValue.lable}}</el-radio>
      </template>
    </el-radio-group>
    <el-select v-else-if=" type == 'select'" v-model="componentDictValue" :placeholder="placeholder" @change="handleChange">
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
      defaultValue : {
        type: String,
        required: false
      },
      type: {
        type: String,
        required: false,
        default: "radio"
      },
      placeholder: {
        type: String,
        required: false,
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
    methods: {
      initDictValue(){
        findValue(this.dictType).then(data => {
          this.dictValueList = data.result;

          if( !validatenull(this.defaultValue) ) {
            this.componentDictValue = this.defaultValue;
            this.handleChange();
          }
        });
      },
      handleChange(){
        this.$emit('input', this.componentDictValue);
      }
    }
  }
</script>
