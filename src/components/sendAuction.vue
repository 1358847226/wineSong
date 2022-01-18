<template>
  <div>
    <van-nav-bar
      title="投单"
    />

    <van-cell-group>
      <van-field v-model="auction.title" label="标题" placeholder="请输入标题"/>
    </van-cell-group>
    <van-uploader v-model="fileList" multiple :after-read="afterRead" :before-delete="remove" upload-text="点击上传"
                  preview-size="200px"/>
    <van-field
      v-model="auction.content"
      rows="1"
      autosize
      label="简介"
      type="textarea"
      placeholder="请输入简介"
    />
    <van-cell-group>
      <van-field v-model="auction.startPrice" label="起拍价" placeholder="请输入起拍价"/>
    </van-cell-group>
    <van-field
      readonly
      clickable
      label="拍卖群"
      :value="valueGroup"
      placeholder="选择拍卖群"
      @click="showPickerGroup = true"
    />
    <van-popup v-model="showPickerGroup" round position="bottom">
      <van-picker
        show-toolbar
        :columns="group"
        @cancel="showPickerGroup = false"
        @confirm="onConfirmGroup"
        value-key="name"
      />
    </van-popup>

    <van-field
      readonly
      clickable
      label="拍卖场次"
      :value="value2"
      placeholder="选择拍卖场次"
      @click="showPicker2 = true"
    />
    <van-popup v-model="showPicker2" round position="bottom">
      <van-picker
        show-toolbar
        :columns="market"
        @cancel="showPicker2 = false"
        @confirm="onConfirm2"
        value-key="startTime"
      />
    </van-popup>
    <van-cell-group>
      <van-field v-model="auctioneerName" label="拍卖官" readonly/>
    </van-cell-group>
    <van-field
      v-if="isAdmin && this.$route.query.id"
      readonly
      clickable
      label="拍卖状态"
      :value="auction.state"
      placeholder="选择拍卖状态"
      @click="showPicker3 = true"
    />
    <van-popup v-model="showPicker3" round position="bottom">
      <van-picker
        show-toolbar
        :columns="state"
        @cancel="showPicker3 = false"
        @confirm="onConfirm3"
      />
    </van-popup>
    <van-cell-group v-if="isAdmin && (auction.state === '已成交')">
      <van-field v-model="auction.finalPrice" label="成交价" placeholder="请输入成交价" />
    </van-cell-group>
    <van-cell-group v-if="isAdmin && (auction.state === '已成交')">
      <van-field v-model="auction.buyer" label="买家qq" placeholder="请输入买家qq" />
    </van-cell-group>
    <van-button type="primary" @click="createAuction">确认保存</van-button>
    <van-button plain type="primary" to="/mine">返回上级</van-button>

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
import async from "async";

export default {
  name: "sendAuction",
  data() {
    return {
      fileList: [],
      auction: {
        images: [],
        content: "",
        startPrice: "",
        auctioneerId: 0,
        marketId: 0
      },
      auctioneer: [],
      value: '',
      showPicker: false,
      value2: '',
      showPicker2: false,
      valueGroup: '',
      showPickerGroup: false,
      group: [],
      market: [],
      auctioneerName: "",
      allMarket:[],
      isAdmin:false,
      showPicker3: false,
      state:["待拍卖","流拍","已成交"]
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
          if (!this.userInfo.qq){
            Dialog.alert({
              title: '系统提示',
              message: '请先完善个人信息中的qq号'
            }).then(() => {
              this.$router.push('/mine')
            });
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
    axios.get('/v1/SearchAllGroup', {headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}})
      .then(result => {
        this.group = result.data.data
        console.log(this.group)
      }).catch(err => {
      alert(err.message)
    });
    if (this.$route.query.id) {
      this.auction.id = this.$route.query.id
      axios.get('/v1/SearchAuctionById', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
        params: {"auctionId": this.auction.id}
      })
        .then(result => {
          this.auction = result.data.data
          for (let i = 0 ; i < this.auction.images.length; i ++){
            let f = {url: this.auction.images[i]}
            this.fileList.push(f)
          }
          this.searchAuctioneer()
          this.searchAllMarket()

        }).catch(err => {
        alert(err.message)
      });
    }
  },
  methods: {
    async doUpload(file) {
      var fd = new FormData()
      fd.append('file', file.file)
      axios.post('/upload/UploadImg', fd,
        {
          headers: {"Access-Token": JSON.parse(sessionStorage['userInfo']).token || ""},
          'Content-Type': 'multippart/form-data'
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code === 200) {
            this.auction.images.push(response.data.data)
          } else {
            Dialog.alert({
              title: '上传提示',
              message: '系统错误'
            }).then(() => {
              // on close
            });
          }
        }).catch(err => {
        console.log(err)
        Dialog.alert({
          title: '请先登录',
          message: err.data.message
        }).then(() => {
          this.$router.push('/login');
        });

      });
    },
    async afterRead(file) {
      if (file.length) {
        for (let i = 0; i < file.length; i++) {
          await this.doUpload(file[i])
        }
      } else {
        await this.doUpload(file)
      }
      console.log(this.fileList)
    },
    remove(file, detail) {
      this.auction.images.splice(detail.index, 1)
      this.fileList.splice(detail.index, 1)
    },
    onConfirm(value) {
      this.value = value.userName;
      this.auction.auctioneerId = value.id
      this.showPicker = false;
    },
    onConfirm2(value) {
      console.log("ad", value)
      this.value2 = value.startTime;
      this.auction.marketId = value.id
      this.auction.auctioneerId = value.auctioneerId
      this.showPicker2 = false;
      this.searchAuctioneer()
    },
    onConfirmGroup(value) {
      this.valueGroup = value.name
      this.auction.groupId = value.id
      this.showPickerGroup = false
      this.searchMarket()
    },
    searchMarket() {
      axios.get('/v1/SearchMarket', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
        params: {"groupId": this.auction.groupId}
      })
        .then(result => {
          this.market = result.data.data
        }).catch(err => {
        alert(err.message)
      })
    },
    searchAuctioneer() {
      console.log(this.market)
      axios.get('/user/SearchAuctioneer', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
        params: {"userId": this.auction.auctioneerId}
      })
        .then(result => {
          this.auctioneerName = result.data.data.userName
        }).catch(err => {
        alert(err.message)
      })
    },
    createAuction() {
      axios.post('/v1/CreateAuction', this.auction,
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
              if (this.isAdmin){
                this.$router.push('/auctionGet');
              }else{
                this.$router.push('/mine');
              }

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
          title: '创建错误',
          message: err.data.message
        }).then(() => {
          if (err.data.code === 401) {
            this.$router.push('/login');
          }

        });

      });
    },
    searchAllMarket() {
      axios.get('/v1/SearchAllMarket', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''}
      })
        .then(result => {
          this.allMarket = result.data.data
          for (let i = 0 ; i < this.allMarket.length; i ++){
            if (this.auction.marketId === this.allMarket[i].id) {
              this.value2 = this.allMarket[i].startTime
              this.searchGroupById(this.allMarket[i].groupId)
            }
          }
        }).catch(err => {
        alert(err.message)
      })
    },
    searchGroupById(id) {
      axios.get('/v1/SearchGroupById', {
        headers: {"Access-Token": sessionStorage['userInfo'] ? JSON.parse(sessionStorage['userInfo']).token : ''},
        params: {"groupId": id}
      })
        .then(result => {
          this.valueGroup = result.data.data.name
          this.searchMarket()
        }).catch(err => {
        alert(err.message)
      })
    },
    onConfirm3(value){
      this.auction.state = value
      this.showPicker3 = false
    }
  }
}
</script>

<style scoped>

</style>
