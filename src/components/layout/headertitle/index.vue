<template>
   <span :class="['header_title',{typeing:isText}]">
     {{text}}
   </span>
</template>

<script>
  import store from '@/store';

  export default {
    name: "headerTitle",
    data() {
      return {
        text: "",
        isText: false,
        count: 0,
        actor: "",
      };
    },
    computed: {
      titleList: function () {
        return [
          "欢迎登录啥啥啥管理系统",
          "当前版本：V1.0",
          "当前用户：" + store.getters.userInfo.realName,
          "当前角色：" + store.getters.roles
        ]
      }
    },
    created() {
      this.actor = this.titleList[this.count] || "";
      setTimeout(() => {
        this.isText = true;
        this.setData();
      }, 2000);
    },
    methods: {
      getData() {
        if (this.count < this.titleList.length - 1) this.count++;
        else this.count = 0;

        this.isText = true;
        this.actor = this.titleList[this.count];
      },
      setData() {
        let num = 0, count = 0, active = false, timeoutstart = 5000, timeoutend = 1000, timespeed = 10;

        setInterval(() => {
          if (this.isText) {
            if (count == this.actor.length) active = true;
            else active = false;

            if (active) {
              num--;
              this.text = this.actor.substr(0, num);
              if (num == 0) {
                this.isText = false;
                setTimeout(() => {
                  count = 0;
                  this.getData();
                }, timeoutend);
              }
            } else {
              num++;
              this.text = this.actor.substr(0, num);
              if (num == this.actor.length) {
                this.isText = false;
                setTimeout(() => {
                  this.isText = true;
                  count = this.actor.length;
                }, timeoutstart);
              }
            }
          }
        }, timespeed);
      }
    }
  }
</script>

<style lang="scss">
  .header_title {
    color: white;
    font-style: oblique;
    font-size: 25px;
    margin-left: 30px;
    letter-spacing: 5px;
    text-shadow: 5px 2px 5px #676a6c;
  }

  .header_title:after {
    content: "";
    width: 3px;
    height: 25px;
    vertical-align: -5px;
    margin-left: 5px;
    background-color: whitesmoke;
    display: inline-block;
    animation: blink 0.4s infinite alternate;
  }

  .typeing:after {
    animation: none;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }
</style>
