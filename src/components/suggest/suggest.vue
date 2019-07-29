<template>
  <scroll class="suggest"
          :data="result" :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- <loading v-show="hasMore" title=""></loading> -->
    </ul>
    <div v-show="!hasMore && !this.result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {mapMutations, mapActions} from 'vuex'
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import NoResult from '../../base/no-result/no-ruselt'
import Singer from '../../common/js/singer'
import {search} from '../../api/search'
import { ERR_OK } from '../../api/config'
import {getSongUrl} from '../../api/singer'
import {createSong} from '../../common/js/song'

const TYPE_SINGER = 'singer'
const perpage =  20
export default {
  data() {
    return {
      page: 1,
      result: [],
      pullup: false, // 是否开启下拉加载
      beforeScroll: true,
      hasMore: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  watch: {
    query() {
      this._search()
    }
  },
  methods: {
    getIconCls(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName(item) {
      return item.type === TYPE_SINGER ? `${item.singername}` : `${item.name}-${item.singer}`
    },
    searchMore() {
      return
      if (!this.hasMore) {
        return
      }
      this.page ++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          let moreResult = this._getResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singerid,
          name: item.singername,
          mid: item.singermid
        })
      this.$router.push({
        path: `/search/${singer.singer_id}`
      }),
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    _search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code ===  ERR_OK) {
          this.result = this._getResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data) {
      let ret = []
      if (data.song) {
        ret = this._normalizeSongs(data.song.list)
      }
      if (this.page === 1) {
        if (data.zhida && data.zhida.singerid) {
          ret.unshift({...data.zhida, ...{type: TYPE_SINGER}})
        }
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          // getSongUrl(musicData.songmid).then((res) => {
          //     if (res.code === ERR_OK) {
          //       const songurl = res.req_0.data.midurlinfo[0].purl
          //       const url = `http://isure.stream.qqmusic.qq.com/${songurl}`
          //       ret.push(createSong(musicData, url))
          //    }
          // })
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
