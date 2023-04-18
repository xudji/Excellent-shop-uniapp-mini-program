<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计: <text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时秒数
        seconds: 3
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount', ]),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updataRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 用户点击了结算按钮
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算商品!')
        if (!this.addstr) return uni.$showMsg('请选择收获地址!')
        if (!this.token) return this.delayNavigate()
        this.payOrder()
      },
      async payOrder() {
        //创建订单
        const orderInfo = {
          order_price: 0.01, //this.checkedGoodsAmount
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        //发请求
        const {
          data: res
        } =
        await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return $showMsg('创建订单失败')
        // 得到服务器订单编号
        const orderNumber = res.message.order_number
        console.log(orderNumber)


        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay

        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
        // 3.3 完成了支付，进一步查询支付的结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })


      },
      // 延时导航到my页面
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds)
        setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      // 展示倒计时提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录在结算!' + n + '秒后自动跳转到登录页',
          mask: true,
          duration: 1500
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    // 将背景色从 cyan 改为 white
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
    }

    .btn-settle {
      height: 50px;
      min-width: 100px;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>