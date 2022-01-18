<template>
  <div>
    <van-nav-bar
      title="拍卖"
    />

    <van-collapse v-model="activeNames" accordion @change="searchMarket" style="margin-bottom: 50px">
      <div v-for="(item, index) in group">
        <van-collapse-item :title="'群名：' + item.name" :name="item.id">
          <van-collapse v-model="activeNamesMarket" accordion @change="searchAuction">
            <div v-for="(itemMarket, indexMarket) in market">
              <van-collapse-item :title="'时间：' + itemMarket.startTime" :name="itemMarket.id">
                <div v-for="(itemAuction, indexAuction) in auction">
                  <div class="van-ellipsis" style="font-size: large;font-weight: bolder">{{ indexAuction + 1 }}、{{ itemAuction.title || "" }}</div>
                  <van-swipe :autoplay="3000">
                    <van-swipe-item v-for="(image, index) in itemAuction.images" :key="index">
                      <img v-lazy="image" height="300px"/>
                    </van-swipe-item>
                  </van-swipe>
                  <div class="van-multi-ellipsis--l3">
                    {{ itemAuction.content || "" }}
                  </div>

                </div>

              </van-collapse-item>
            </div>
          </van-collapse>
        </van-collapse-item>
      </div>
    </van-collapse>
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
  name: 'home',
  data() {
    return {
      activeNames: 0,
      group: [],
      market: [],
      activeNamesMarket: [],
      images: [
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
      ],
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

    axios.get('/v1/SearchAllGroup', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}})
      .then(result => {
        this.group = result.data.data
      }).catch(err => {
      alert(err.message)
    });
  },
  methods: {
    searchMarket(value) {
      if (value) {
        axios.get('/v1/SearchMarket', {
          headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
          params: {"groupId": value}
        })
          .then(result => {
            this.market = result.data.data
            console.log(this.market)
          }).catch(err => {
          alert(err.message)
        })
      }

    },
    searchAuction(value) {
      if (value) {
        axios.get('/v1/SearchAuctionByMarket', {
          headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
          params: {"marketId": value}
        })
          .then(result => {
            this.auction = result.data.data
            console.log(this.auction)
          }).catch(err => {
          alert(err.message)
        })
      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
