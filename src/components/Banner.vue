<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import 'APlayer/dist/APlayer.min.css'
import APlayer from 'APlayer'

const ap = ref(null)
const songTimes = ref(0)
const songName = ref('')
const isMiniMode = ref(false)

const songlist = [
  2059151619, 2098476758, 2630220461, 2630217054, 2630217057, 2099308172, 2098477269, 2098478097,
  2098478355, 2098473565, 2098473572, 2008994667, 1840401436, 2029212574, 2612747239, 2140425047,
  1832392174
]

const checkScreenSize = () => {
  isMiniMode.value = window.innerWidth <= 768 // 768px as breakpoint
  if (isMiniMode.value) {
    ap.value.setMode('mini')
  } else {
    ap.value.setMode('normal')
  }
}

// 初始化播放器
onMounted(() => {
  ap.value = new APlayer({
    container: document.getElementById('aplayer'),
    autoplay: false,
    mini: false,
    order: 'random',
    lrcType: 1,
    listFolded: true,
    loop: 'none',
    audio: []
  })

  // 歌曲结束事件监听
  ap.value.on('ended', addRandomSong)

  // 初始加载一首歌
  addRandomSong()

  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

// 组件卸载时销毁播放器
onBeforeUnmount(() => {
  if (ap.value) {
    ap.value.destroy()
  }
})

// 获取歌曲数据
const fetchSongData = async (songId) => {
  try {
    const response = await axios.get(
      `https://www.lihouse.xyz/coco_widget/music_resource/id/${songId}`
    )
    const data = response.data.song_data

    songName.value = data.name

    return {
      name: data.name,
      artist: data.artist,
      url: data.url,
      cover: data.pic,
      lrc: data.lyric || '[00:00.000]暂无歌词\n'
    }
  } catch (error) {
    console.error('获取歌曲数据失败:', error)
    return null
  }
}

// 添加随机歌曲
const addRandomSong = async () => {
  if (!ap.value) return

  try {
    // 清空当前播放列表
    ap.value.lrc.hide()
    ap.value.list.clear()

    // 随机选择一首歌
    const randomIndex = Math.floor(Math.random() * songlist.length)
    const songId = songlist[randomIndex]

    // 获取歌曲数据
    const songData = await fetchSongData(songId)

    if (songData) {
      songTimes.value++
      ap.value.list.add(songData)
      ap.value.lrc.show()
      ap.value.play()
    } else if (songTimes.value === 0) {
      // 如果第一次尝试就失败，销毁播放器
      ap.value.destroy()
    }
  } catch (error) {
    console.error('添加歌曲失败:', error)
    if (songTimes.value === 0) {
      ap.value.destroy()
    }
  }
}
</script>

<template>
  <div id="aplayer-container">
    <a-tooltip :content="songName" :popup-visible="isMiniMode" position="bottom">
      <div id="aplayer"></div>
    </a-tooltip>
  </div>
</template>

<style scoped>
#aplayer {
  position: absolute;
  left: 50px;
  bottom: 180px;
  width: 300px;
  aspect-ratio: 446 / 158;
  opacity: 0.9;
  transition: transform 0.1s;
}

#aplayer:active {
  transform: scale(0.95);
}

@media screen and (max-width: 768px) {
  #aplayer {
    right: 20px;
    top: 192px;
    left: unset;
    bottom: unset;
    width: 120px;
    aspect-ratio: 1;
    border-radius: 100%;
    border: 2px white solid;
  }
}
</style>

<style>
.aplayer.aplayer-withlrc .aplayer-pic {
  height: 100%;
  aspect-ratio: 1;
  width: unset;
}

.aplayer .aplayer-body,
.aplayer.aplayer-narrow .aplayer-body,
.aplayer.aplayer-narrow .aplayer-pic {
  height: 100%;
}

.aplayer .aplayer-body {
  background-size: contain;
  background: #f0f0f0 var(--deco1) no-repeat right !important;
}

.aplayer.aplayer-withlrc .aplayer-info {
  margin-left: 103px;
  height: 100%;
}

.aplayer .aplayer-lrc {
  height: 45px;
}

.aplayer .aplayer-lrc:after,
.aplayer .aplayer-lrc:before {
  background: unset;
}
</style>
