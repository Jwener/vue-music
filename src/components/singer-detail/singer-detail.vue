<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" ></music-list>
  </transition>
</template>

<script>
import jsonp from 'jsonp'
import {mapGetters} from 'vuex'
import {getSingerDetail, getSongUrl} from '../../api/singer'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'
import MusicList from '../../components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.singer.singer_name
    },
    bgImage() {
      return this.singer.singer_pic
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.singer_mid) {
        this.$router.push('/singer')// 不存在id时回退到歌手页
        return
      }
      getSingerDetail(this.singer.singer_mid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normallizeSongs(res.data.list)
        }
      })
    },
    _normallizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if ( musicData.songid && musicData.albummid) {
          getSongUrl(musicData.songmid).then((res) => {
            if (res.code === ERR_OK) {
              const songurl = res.req_0.data.midurlinfo[0].purl
              const url = `http://isure.stream.qqmusic.qq.com/${songurl}`
              ret.push(createSong(musicData, url))
            }
          })
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .slide-enter-active,.slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

