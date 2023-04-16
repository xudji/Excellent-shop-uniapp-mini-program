<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i)  in goodsList" :key="i" @click="gotoDetial(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        isLoading: false

      }
    },

    methods: {
      gotoDetial(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detial/goods_detial?goods_id=' + goods.goods_id
        })
      },
      // 获取商品列表数据  
      async getGoodsList(cb) {
        this.isLoading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isLoading = false
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      }
    },
    onReachBottom() {
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      if (this.isLoading) return
      // 让页面值+1
      this.queryObj.pagenum++
      // 重新获取数据
      this.getGoodsList()
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      // 重新发起数据请求
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      // 重新发起数据请求
      this.getGoodsList(() =>
        uni.stopPullDownRefresh()
      )
    }

  }
</script>

<style lang="scss">

</style>