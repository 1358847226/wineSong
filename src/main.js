// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {
  Button,
  Cell,
  CellGroup,
  Col,
  Dialog,
  Field,
  Icon,
  NavBar,
  Row,
  Tabbar,
  TabbarItem,
  Image as VanImage,
  Uploader,
  Picker,
  Popup,
  Calendar,
  DatetimePicker,
  Card,
  Tag,
  Collapse,
  CollapseItem,
  Swipe,
  SwipeItem,
  Lazyload,
  DropdownItem, DropdownMenu
} from "vant";
import 'vant/lib/index.css'
import axios from "axios";
// axios.defaults.baseURL = 'http://47.96.68.74:80/api'
axios.defaults.baseURL = 'http://localhost:8889'

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(Button).use(Cell).use(CellGroup).use(Icon).use(Dialog).use(NavBar).use(Row).use(Col).use(Field).use(Tabbar).use(TabbarItem).use(VanImage).use(Uploader).use(Picker)
  .use(Popup).use(Calendar).use(DatetimePicker).use(Card).use(Tag).use(CollapseItem).use(Collapse).use(SwipeItem).use(Swipe).use(Lazyload).use(DropdownMenu).use(DropdownItem)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


