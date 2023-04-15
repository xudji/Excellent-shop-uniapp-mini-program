<template>
  <view>
    <view class="search-box">
      <uni-search-bar @confirm="search" @input="input" :radius="80" cancelButton="none" :focus="true"></uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length != 0 ">
      <view class="sugg-item" @click="gotoDetail(item)" v-for="(item,i) in searchResults" :key="i">
        <view class="goods-name">
          {{item.goods_name}}
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 搜索时间 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag @click="gotoGoodsList(item)" :text="item" v-for="(item,i) in histories" :key="i" />
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史数组
        historyList: []
      };
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed: {
      histories() {
        return [...this.historyList].reverse()
      }
    },
    methods: {
      // input输入事件
      input(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 搜索关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        this.saveSearchHistory()
      },
      gotoDetail(item) {
        console.log(item.goods_id)
        uni.navigateTo({
          url: '/subpkg/goods_detial/goods_detial?goods_id=' + item.goods_id
        })
      },
      saveSearchHistory() {
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        // 对搜索历史数据，进行持久化存储
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      clean() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-item: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #c5c5c5;

    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      uni-tag {
        margin-top: 10px;
        margin-right: 5px;
      }
    }
  }
</style>