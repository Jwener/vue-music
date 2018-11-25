<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import MusicList from '../../components/music-list/music-list'
import {getMusicList} from '../../api/rank'
import {getSongUrl} from '../../api/singer'
import {createSong} from '../../common/js/song'
import { ERR_OK } from '../../api/config'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK)

        this.songs = this._normalizeSongs(res.songlist)
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
