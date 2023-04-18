<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    computed: {
      ...mapState('m_user', ['redirectInfo']),
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

      // 用户授权之前，获取用户的基本信息
      getUserInfo(e) {
        uni.getUserProfile({
          desc: '登录后可同步数据',
          lang: 'zh_CN',
          success: (info) => {
            console.log('getUserProfile', info);
            this.updateUserInfo(info.userInfo)
            this.getToken(info)
          },
          fail: (err) => {
            if (err.errMsg === 'getUserProfile:fail auth deny') uni.$showMsg('您取消了授权！')
          }
        })
      },
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete() {
              this.updateRedirectInfo(null)
            }
          })
        }
      },
      getToken(info) {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            // console.log('login-res', res)
            if (res && res.errMsg === 'login:ok') {
              const query = {
                code: res.code,
                encryptedData: info.encryptedData,
                iv: info.iv,
                rawData: info.rawData,
                signature: info.signature
              }
              console.log("query", query)
              // const { data: loginResult } = uni.$http.post('/api/public/v1/users/wxlogin', query)
              //获取token失败时候使用
              const loginResult = {
                "message": {
                  "user_id": 12,
                  "user_email_code": null,
                  "is_active": null,
                  "user_sex": "男",
                  "user_qq": "",
                  "user_tel": "",
                  "user_xueli": "本科",
                  "user_hobby": "",
                  "user_introduce": null,
                  "create_time": 1525402223,
                  "update_time": 1525402223,
                  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
                },
                "meta": {
                  "msg": "登录成功",
                  "status": 200
                }
              }
              console.log("4", loginResult)
              if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')

              this.updateToken(loginResult.message.token)
              this.navigateBack()
              uni.$showMsg('登录成功！')
            } else {
              uni.$showMsg('登录失败！' + res)
            }
          },
          fail: (err) => {
            uni.$showMsg('登录失败！！！' + res)
          }
        })

      },
    }
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>