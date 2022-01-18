import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/HelloWorld'
import mine from "@/components/mine";
import login from "@/components/login";
import myAuctionSend from "@/components/myAuctionSend";
import sendAuction from "@/components/sendAuction";
import createAuction from "@/components/createAuction";
import createGroup from "@/components/createGroup";
import auctionGet from "@/components/auctionGet";
import auctionSend from "@/components/auctionSend";
import userInfo from "@/components/userInfo";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/mine',
      name: 'mine',
      component: mine
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/myAuctionSend',
      name: 'myAuctionSend',
      component: myAuctionSend
    },
    {
      path: '/sendAuction',
      name: 'sendAuction',
      component: sendAuction
    },
    {
      path: '/createAuction',
      name: 'createAuction',
      component: createAuction
    },
    {
      path: '/createGroup',
      name: 'createGroup',
      component: createGroup
    },
    {
      path: '/auctionGet',
      name: 'auctionGet',
      component: auctionGet
    },
    {
      path: '/auctionSend',
      name: 'auctionSend',
      component: auctionSend
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: userInfo
    }
  ]
})
