<template>
  <!-- 使用自定义组件 -->
  <view>

    <my-search :radius="'16'" @click="goSearch"></my-search>
    <view class="soroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height:wh + 'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChange(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>

      <!-- 右侧滑动区域 -->
      <scroll-view class="right-scroll-view" scroll-y="true" :style="{height:wh + 'px'}" :scroll-top="screenTop">
        <view class="cate-lv2" v-for="item2,i2 in cateLevel2" :key="i2">
          <view class="cate-lv2-title">
            / {{item2.cat_name}} /
          </view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <image :src="item3.cat_icon" mode=""></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>


<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],

    data() {
      return {
        // 当前设备可用高度
        wh: 0,
        cateList: [],
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        screenTop: 0
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      console.log(sysInfo)
      this.getCateList()
      this.wh = sysInfo.windowHeight

    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 二级分类赋值
        this.cateLevel2 = res.message[0].children
        console.log(this.cateLevel2)
      },
      activeChange(i) {
        this.active = i
        // 重新赋值二级分类
        this.cateLevel2 = this.cateList[i].children
        this.screenTop = 1 ? 0 : 1
      },
      // 跳转到商品列表页面(item也是动态的)
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      goSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }

    }
  }
</script>

<style lang="scss">
  .soroll-view-container {
    display: flex;

    // 固定宽高直接用px
    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #fffff;
          position: relative;

          &::before {
            content: '  ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }


    }

    .right-scroll-view {
      background-color: #fff;

      .cate-lv2-title {
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
      }

      .cate-lv3-list {
        display: flex;
        flex-wrap: wrap;


        .cate-lv3-item {
          width: 33.33%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;

          image {
            width: 60px;
            height: 60px;
          }

          text {
            font-size: 12px
          }
        }
      }
    }

  }
</style>