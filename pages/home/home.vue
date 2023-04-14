<template>
  <view>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detial/goods_detial?=' + item.goods_id  ">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <view class="nav">
      <view class="nav-content" v-for="(item,i) in navList" :key="i" @click="goTab(item.name)">
        <image :src="item.image_src" mode=""></image>
      </view>
    </view>




    <view class="floor-list">
      <!-- 每一个楼层的 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层的标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层的图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"></image>
          </navigator>

          <!-- 右侧 4 个小图片的盒子 -->

          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
              :url="item2.url">
              <image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>


  </view>

</template>

<script>
  export default {
    data() {
      return {
        // 轮播图数据列表
        swiperList: [],
        navList: [],
        floorList: []
      };
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 
      async getSwiperList() {
        // 3.1 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // 3.3 请求成功，为 data 中的数据赋值

        uni.$showMsg('数据请求成功!')
        this.swiperList = res.message
      },
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // 3.3 请求成功，为 data 中的数据赋值

        uni.$showMsg('数据请求成功!')
        this.navList = res.message
      },

      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        // 3.3 请求成功，为 data 中的数据赋值
        console.log(res)
        uni.$showMsg('数据请求成功!')
        this.floorList = res.message
      },



      goTab(name) {
        if (name = "分类") {
          uni.switchTab({
            url: '/pages/cate/cate'
          });
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav {
    display: flex;
    justify-content: space-around;

    .nav-content {
      margin: 30rpx 0 0 0;

      image {
        width: 160rpx;
        height: 160rpx;
      }
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }

  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>