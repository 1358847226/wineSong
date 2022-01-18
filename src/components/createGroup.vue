<template>
  <div>
    <van-nav-bar
      title="创建拍卖群"
    />
  <van-cell-group>
    <van-field v-model="group.name" label="群名称" placeholder="请输入群名称"/>
  </van-cell-group>
  <van-field
    readonly
    clickable
    label="拍卖官"
    :value="value"
    placeholder="选择拍卖官"
    @click="showPicker = true"
  />
  <van-popup v-model="showPicker" round position="bottom" >
    <van-picker
      show-toolbar
      :columns="auctioneer"
      @cancel="showPicker = false"
      @confirm="onConfirm"
      value-key="userName"
    />
  </van-popup>
    <van-button type="primary" @click="createGroup">确认创建</van-button>
    <van-button plain type="primary" to="/mine">返回上级</van-button>
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
  name: "createGroup",
  data() {
    return {
      group: {
        name: ""
      },
      auctioneer: [],
      value: '',
      showPicker: false,

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
    axios.get('/user/SearchAuctioneer', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}})
      .then(result => {
        this.auctioneer = result.data.data
        console.log(this.auctioneer)
      }).catch(err => {
      alert(err.message)
    })
  },
  methods: {
    onConfirm(value) {
      this.value = value.userName;
      this.group.auctioneerId = value.id
      this.showPicker = false;
    },
    createGroup(){
      axios.post('/v1/CreateGroup', this.group,
        {headers: {"Access-Token": JSON.parse(sessionStorage['userInfo']).token || ""},'Content-Type': 'application/json'})
        .then(response => {
          console.log(response.data);
          if (response.data.code === 200) {
            Dialog.alert({
              title: '创建提示',
              message: '成功'
            }).then(() => {
              this.$router.push('/mine');
            });

          } else {
            Dialog.alert({
              title: '创建提示',
              message: '系统错误'
            }).then(() => {
              // on close
            });
          }
        }).catch(err => {
        console.log(err)
        Dialog.alert({
          title: '创建错误',
          message: err.data.message
        }).then(() => {
          if (err.data.code === 401){
            this.$router.push('/login');
          }

        });

      });
    }
  }
}
</script>

<style scoped>

</style>
