<template>
  <div>
    <van-nav-bar
      title="用户信息"
    />
    <van-cell-group>
      <van-field v-model="userInfo.userName" label="用户名" placeholder="请输入用户名"/>
      <van-field v-model="userInfo.password" label="密码" placeholder="请输入新密码，留空不会修改"/>
      <van-field v-model="userInfo.qq" label="qq号" placeholder="请输入qq号"/>
      <van-field v-model="userInfo.phone" label="手机号" placeholder="请输入手机号"/>
    </van-cell-group>
    <van-button type="primary" style="margin-top: 10px" @click="submit">确认提交</van-button>
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
  name: "userInfo",
  data() {
    return {
      userInfo: {}
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
  },
  methods: {
    submit() {
      if (this.userInfo.phone && this.userInfo.qq) {
        axios.post('/user/UpdateUser', this.userInfo,
          {
            headers: {"Access-Token": JSON.parse(sessionStorage['userInfo']).token || ""},
            'Content-Type': 'application/json'
          })
          .then(response => {
            console.log(response.data);
            if (response.data.code === 200) {
              Dialog.alert({
                title: '系统提示',
                message: '成功'
              }).then(() => {
                this.$router.push('/mine');
              });

            } else {
              Dialog.alert({
                title: '系统提示',
                message: '系统错误'
              }).then(() => {
                // on close
              });
            }
          }).catch(err => {
          console.log(err)
          Dialog.alert({
            title: '修改错误',
            message: err.data.message
          }).then(() => {
            if (err.data.code === 401) {
              this.$router.push('/login');
            }
          });
        });
      } else {
        alert('手机号和qq不能为空')
      }
    }
  }
}
</script>

<style scoped>

</style>
