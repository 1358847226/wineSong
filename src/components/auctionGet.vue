<template>
  <div>
    <van-nav-bar
      title="我的拍卖"
    />
    <van-dropdown-menu>
      <van-dropdown-item v-model="value1" :options="option1" @change="searchAuction"/>
      <van-dropdown-item v-model="value2" :options="option2" @change="searchAuction"/>
    </van-dropdown-menu>
    <div v-for="(item, i) in auction">
      <van-card
        num="1"
        :tag="item.state"
        :price="'成交价：￥' + (item.finalPrice || 0)"
        :desc="item.content"
        :title="item.title"
        :thumb="item.images[0] || ''"
        currency=""
      >
        <!--      <template #tags>-->
        <!--        <van-tag plain type="danger">标签</van-tag>-->
        <!--        <van-tag plain type="danger">标签</van-tag>-->
        <!--      </template>-->
        <template #tags>
          <van-tag plain type="danger">起拍价：{{ item.startPrice }}</van-tag>
          <van-tag plain type="danger">拍卖场次：{{ item.marketTime }}</van-tag>
          <van-tag plain type="danger">卖家qq：{{ item.seller }}</van-tag>
          <van-tag plain type="danger">买家qq：{{ item.buyer }}</van-tag>
        </template>
        <template #footer>
          <van-button size="small" @click="remove(item.id)">删除</van-button>
          <van-button size="small" :to="{path:'/sendAuction',query:{id:item.id}}">修改</van-button>
        </template>
      </van-card>
    </div>
    <router-view/>

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
  name: "auctionGet",
  data() {
    return {
      auction: [],
      allMarket: [],
      value1: "",
      value2: "",
      option1: [
        {text: '显示全部', value: ''},
        {text: '带拍卖', value: '带拍卖'},
        {text: '流拍', value: '流拍'},
        {text: '已成交', value: '已成交'},
      ],
      option2: [
        {text: '默认排序', value: ''},
        {text: '从早到晚', value: 'asc'},
        {text: '从晚到早', value: 'desc'},
      ],
      alluser:[]
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
          if (response.data.data.role === 'auctioneer') {
            this.isAdmin = true
          }
          if (response.data.data.role === 'admin') {
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
    this.searchAllUser()
    this.searchAllMarket()
    this.searchAuction()
  },
  methods: {
    searchAuction() {
      axios.get('/v1/SearchAuctionGet', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
        params: {
          'condition':this.value1,
          'sort':this.value2
        }
      })
        .then(result => {
          this.auction = result.data.data
          for (let i in this.auction) {
            for (let j in this.allMarket) {
              if (this.auction[i].marketId === this.allMarket[j].id) {
                this.auction[i].marketTime = this.allMarket[j].startTime
              }
            }
            for(let k in this.allUser){
              if (this.auction[i].userId === this.allUser[k].id) {
                this.auction[i].seller = this.allUser[k].qq
              }
            }
          }
        }).catch(err => {
        alert(err.message)
      })
    },
    remove(id) {
      axios.get('/v1/DeleteAuction', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
        params: {"auctionId": id}
      })
        .then(result => {
          this.searchAuction()
        }).catch(err => {
        alert(err.message)
      })
    },
    searchAllMarket() {
      axios.get('/v1/SearchAllMarket', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}
      })
        .then(result => {
          this.allMarket = result.data.data
        }).catch(err => {
        alert(err.message)
      })
    },
    searchAllUser() {
      axios.get('/user/SearchAllUser', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}
      })
        .then(result => {
          this.allUser = result.data.data
        }).catch(err => {
        alert(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
