<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '../../components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
// import {getSingerDetail, getSongUrl} from '../../api/singer'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.title
    },
    bgImage() {
      return this.disc.cover
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.content_id) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.content_id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          //  getSongUrl(musicData.songmid).then((res) => {
          //   if (res.code === ERR_OK) {
          //     const songurl = res.req_0.data.midurlinfo[0].purl
          //     const url = `http://isure.stream.qqmusic.qq.com/${songurl}`
          //     ret.push(createSong(musicData, url))
          //   }
          // })
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%,0,0)
</style>
