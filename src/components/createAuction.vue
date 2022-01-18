<template>
  <div>
    <van-nav-bar
      title="创建拍卖场次"
    />
    <van-cell title="选择拍卖时间" :value="market.startTime" @click="show = true" />
    <van-datetime-picker
      v-model="startTime"
      type="datehour"
      title="选择年月日小时"
      :min-date="minDate"
      :max-date="maxDate"
      v-if="show"
      @confirm="onConfirm"
      :formatter="formatter"
      @cancel="onCancel"
    />

    <van-field
      readonly
      clickable
      label="拍卖群"
      :value="value"
      placeholder="选择拍卖群"
      @click="showPicker1 = true"
    />
    <van-popup v-model="showPicker1" round position="bottom" >
      <van-picker
        show-toolbar
        :columns="group"
        @cancel="showPicker1 = false"
        @confirm="onConfirmGroup"
        value-key="name"
      />
    </van-popup>
    <van-button type="primary" @click="createAuction">确认创建</van-button>
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
  name: "createAuction",
  data() {
    return {
      show: false,
      market: {
        startTime: ""
      },
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      startTime: new Date(),
      showPicker: false,
      showPicker1: false,
      value: "",
      group: []
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

    axios.get('/v1/SearchGroup', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}})
      .then(result => {
        this.group = result.data.data
      }).catch(err => {
      alert(err.message)
    })
  },
  methods: {
    formatter(type, val) {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      if (type === 'hour') {
        return val + '时'
      }
      return val;
    },
    onConfirm(time){
      this.market.startTime = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日' + time.getHours() + '时'
      this.show = false
    },
    onCancel(){
      this.show = false
    },
    createAuction(){
      if (!this.market.startTime || !this.market.groupId){
        Dialog.alert({
          title: '系统提示',
          message: '必填项不能为空'
        }).then(() => {

        });
          return
      }
      axios.post('/v1/CreateMarket', this.market,
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
    },
    onConfirmGroup(group){
      this.market.groupId = group.id
      this.value = group.name
      this.showPicker1 = false
    }
  }
}
</script>

<style scoped>

</style>
