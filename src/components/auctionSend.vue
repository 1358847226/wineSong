<template>
  <div>
    <van-nav-bar
      title="我的投单"
    />
    <div v-for="(item, i) in auction">
      <van-card
        num="1"
        :price="item.startPrice"
        :desc="item.content"
        :title="item.title"
        :thumb="item.images ? item.images[0] : ''"
      >
        <!--      <template #tags>-->
        <!--        <van-tag plain type="danger">标签</van-tag>-->
        <!--        <van-tag plain type="danger">标签</van-tag>-->
        <!--      </template>-->
        <template #footer>
          <van-button size="small" @click="remove(item.id)">删除</van-button>
          <van-button size="small" :to="{path:'/sendAuction',query:{id:item.id}}">修改</van-button>
        </template>
      </van-card>
    </div>
    <router-view />

    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="home-o">拍卖</van-tabbar-item>
      <van-tabbar-item replace to="/sendAuction" icon="search">投单</van-tabbar-item>
      <van-tabbar-item replace to="/mine" icon="search">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import axios from "axios";
import {Dialog} from "vant";

export default {
  name: "auctionSend",
  data(){
    return{
      auction: []
    }
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
    this.searchAuction()
  },
  methods: {
    searchAuction(){
      axios.get('/v1/SearchAuctionSend', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}})
        .then(result => {
          this.auction = result.data.data
        }).catch(err => {
        alert(err.message)
      })
    },
    remove(id){
      axios.get('/v1/DeleteAuction', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}, params:{"auctionId": id}} )
        .then(result => {
          this.searchAuction()
        }).catch(err => {
        alert(err.message)
      })
    }

  }
}
</script>

<style scoped>

</style>
