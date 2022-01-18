<template>
  <div>
    <van-nav-bar
      title="我的"
    />
    <div>
      <van-image
        round
        width="10rem"
        height="10rem"
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc7a5303b16c7e040713cec0e2c2ff9c1c3107c20d48f-rCBz6w_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642924239&t=ca900b4707f7c534bb4318ab1d78ac5c"
      />

    </div>
    {{userInfo.userName}}
    <van-cell is-link to="/userInfo">修改个人信息</van-cell>
    <van-cell is-link to="/auctionSend">我的投单</van-cell>
    <van-cell is-link v-if="isAdmin" to="/auctionGet">我的拍卖</van-cell>
    <van-cell is-link v-if="isAdmin" to="/createAuction">创建拍卖场次</van-cell>
    <van-cell is-link v-if="isSuperAdmin" to="/createGroup">创建拍卖群</van-cell>
    <van-cell is-link to="/login">退出登录</van-cell>
<!--    <van-tabbar v-model="active" @change="changeTabbar">-->
<!--      <van-tabbar-item icon="home-o">拍卖</van-tabbar-item>-->
<!--      <van-tabbar-item icon="search">投单</van-tabbar-item>-->
<!--      <van-tabbar-item icon="friends-o">我的</van-tabbar-item>-->
<!--    </van-tabbar>-->
    <router-view />

    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="home-o">拍卖</van-tabbar-item>
      <van-tabbar-item replace to="/sendAuction" icon="search">投单</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="search">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import {Dialog, Icon} from "vant";
import axios from "axios";

export default {
  name: "mine",
  data() {
    return {
      active: 2,
      userInfo:{},
      isAdmin: false,
      isSuperAdmin: false
    }
  },
  components: {
    Icon
  },
  created() {
    axios.get('/user/UserInfo', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}})
      .then(response => {
        console.log(response.data);
        if (response.data.data.token) {
          sessionStorage.clear()
          sessionStorage['userInfo'] = JSON.stringify(response.data.data)
          this.userInfo = response.data.data
          if (response.data.data.role === 'auctioneer'){
            this.isAdmin = true
          }
          if (response.data.data.role === 'admin'){
            this.isSuperAdmin = true
          }
        } else {
          Dialog.alert({
            title: '登录提示',
            message: '系统错误'
          }).then(() => {
            // on close
          });
        }
      }).catch(err => {
      this.$router.push('/login');

    });
  },
  methods:{
    changeTabbar(){
      console.log(this.active)
    }
  }
}
</script>

<style scoped>

</style>
