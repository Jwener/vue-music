<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList, singerlist} from '../../api/singer'
import {ERR_OK} from '../../api/config'
import ListView from '../../base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from '../../common/js/mixin'
import Singer from '../../common/js/singer'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.singer_id}`
      }),
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.singerList.data.singerlist)
        }
      })
    },
    _normalizeSinger(list) {
      let ret = []
      list.forEach((item) => {
        ret.push(new Singer({
          city: item.country,
          id: item.singer_id,
          name: item.singer_name,
          mid: item.singer_mid,
        }))
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
