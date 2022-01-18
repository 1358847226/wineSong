<template>
  <div class="main">
    <van-nav-bar style="background: #07c160" title="用户登录"/>

    <van-row type="flex" justify="center" class="img">
      <van-col span="1">&nbsp</van-col>
      <van-col span="22"><img src="@/assets/logo.png"/></van-col>
      <van-col span="1">&nbsp</van-col>
    </van-row>


    <van-row type="flex" justify="center" class="line">
      <van-col span="3">&nbsp</van-col>
      <van-col span="18">
        <van-cell-group>
          <van-field size="large" placeholder="请输入用户名" type="text" v-model="my.username" left-icon="manager"/>
        </van-cell-group>
        <van-cell-group>
          <van-field size="large" placeholder="请输入密码" type="password" v-model="my.password" left-icon="lock"/>
        </van-cell-group>
      </van-col>
      <van-col span="3">&nbsp</van-col>
    </van-row>


    <van-row type="flex" justify="center" class="btns">
      <van-col span="3">&nbsp</van-col>
      <van-col span="18" class="van-buttons">
        <van-button class="jumpBtnLeft" type="primary" @click.native="handleClick('login')" size="large">登录</van-button>
        <van-button class="jumpBtnRight" type="primary" plain @click.native="handleClick('register')" size="large">注册</van-button>
      </van-col>
      <van-col span="3">&nbsp</van-col>
    </van-row>
  </div>
</template>

<script>
import axios from "axios";
import {Dialog} from "vant";

export default {
  name: "login",
  data(){
    return{
      my:{}
    }
  },
  created () {
    this.$nextTick(function(){
      //this.initData()	;
    })
  },
  computed:{

  },
  methods: {
    doLogin(oj){
      let _config = {headers:{'Content-Type':'application/json'}};

      axios.post('/Login',oj,_config)
        .then(response => {
          console.log(response.data);
          if(response.data.data.token){
            sessionStorage.clear()
            sessionStorage['userInfo']=JSON.stringify(response.data.data)
            this.$router.push('/mine');
          }else{
            Dialog.alert({
              title: '登录提示',
              message:response.data.message
            }).then(() => {
              // on close
            });
          }
        });

    },

    handleClick(action){
      if (action === 'login'){
        this.doLogin(this.my);
      }else{
        this.doRegister(this.my)
      }

    },
    doRegister(oj){
      let _config = {headers:{'Content-Type':'application/json'}};

      axios.post('/Register',oj,_config)
        .then(response => {
          if(response.data.code === 200){
            Dialog.alert({
              title: '注册提示',
              message:response.data.message
            }).then(() => {
              // on close
            });
          }else{
            Dialog.alert({
              title: '注册提示',
              message:response.data.message
            }).then(() => {
              // on close
            });
          }
        });
    },

    initData(){
      var loginInfo = getStore({name:'loginInfo'})
      if(loginInfo){
        this.doLogin(loginInfo)
      }

    }
  }
}
</script>
<style scoped>
.line{
  margin-top: 20px;
}
.van-buttons{
  padding: 0 20px;
}
.jumpBtnLeft{
  float: left;
  width: 40%;
}
.jumpBtnRight{
  float: right;
  width: 40%;
}
</style>

