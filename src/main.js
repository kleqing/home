import './assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import { Modal } from '@arco-design/web-vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

import { css } from './assets/font/BlueakaBeta2GBK-DemiBold.ttf'
import { css as css2 } from './assets/font/BlueakaBeta2GBK-Bold.ttf'
// console.log(css.family, css.weight);
// console.log(css2.family, css2.weight);

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.mount('#app')

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      Modal.open({
        title: '通知',
        content: '老师，站点已更新，刷新即可访问最新内容！',
        onOk: () => {
          updateSW(true)
        }
      })
    }
  })
}

window.l2d_complete = false

setInterval(() => {
  document.querySelectorAll('a[href]:not(.tag)').forEach((link) => {
    link.classList.add('tag')
    link.addEventListener('click', async (e) => {
      const url = link.getAttribute('href')
      e.preventDefault()
      document.querySelector('#curtain').style.display = 'block'
      setTimeout(() => {
        let a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click()
      }, 900)
      setTimeout(() => (document.querySelector('#curtain').style.display = ''), 3000)
    })
  })
}, 1000)

import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'

// 这里是学生的l2d载入位置，想要修改自己喜欢的学生可以改这里
const hina_swimsuit = '/l2d/hina_swimsuit/CH0063_home'
const aris = '/l2d/aris/Aris_home'

import hina_bgm from '/l2d/hina_swimsuit/Theme_21.mp3'
import aris_bgm from '/l2d/aris/Someday_-sometime.mp3'
/*
 * students 是学生l2d的位置
 * l2dBGM 是学生背景音乐的位置
 * */
export const students = [hina_swimsuit, aris]
const l2dBGM = [hina_bgm, aris_bgm]
/*——————————————————————————————————————————————————*/

export let bgmName = []

// 加载大厅L2D文件
;(async function () {
  let a = 0
  for (let i of students) {
    PIXI.Assets.add({ alias: 'skeleton' + a, src: `${i}.skel` })
    PIXI.Assets.add({ alias: 'atlas' + a, src: `${i}.atlas` })
    await PIXI.Assets.load(['skeleton' + a, 'atlas' + a])
    a++
  }
  for (let i of l2dBGM) {
    sound.add(i.split('/').pop().split('.')[0], {
      url: i,
      loop: true
    })
    bgmName.push(i.split('/').pop().split('.')[0])
  }

  window.l2d_complete = true
})()
