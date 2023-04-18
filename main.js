import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...',
  })
  console.log(store)
  // 判断是否为有权限接口
  if (options.url.indexOf('/my/') !== -1) {
    options.header = {
      Authorization: store.state.m_uesr.token
    }
  }
}

// 请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading()
}
// 封装弹框的方法
uni.$showMsg = function(title = "数据请求失败", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  });
}



// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'





import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif