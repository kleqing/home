<script setup>
import { Spine } from '@esotericsoftware/spine-pixi-v7'
import * as PIXI from 'pixi.js'
import { students } from '@/main'

const props = defineProps(['l2dOnly'])

let animation,
  id = 0

const l2d = new PIXI.Application({
  width: 2560,
  height: 1440,
  backgroundAlpha: 0
})

document.querySelector('#background').appendChild(l2d.view)

const setL2D = async (num) => {
  l2d.stage.removeChild(animation)
  switch (num) {
    case '-':
      id = id === 0 ? students.length - 1 : id - 1
      break
    case '+':
      id = id === students.length - 1 ? 0 : id + 1
      break
    default:
      id = num
  }
  animation = Spine.from('skeleton' + id, 'atlas' + id)
  l2d.stage.addChild(animation)
  animation.scale.set(0.85)
  animation.state.setAnimation(0, 'Idle_01', true)
  animation.state.timeScale = 0.6
  animation.autoUpdate = true
  animation.y = 1440
  animation.x = 2560 / 2
}

setL2D(id)
</script>

<template>
  <div id="change" v-if="!props.l2dOnly">
    <img class="css-cursor-hover-enabled" @click="setL2D('-')" src="/l2d/arrow.png" alt="" />
    <img class="css-cursor-hover-enabled" @click="setL2D('+')" src="/l2d/arrow.png" alt="" />
  </div>
</template>

<style scoped>
#change {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

img {
  width: 32px;
  height: auto;
  animation: move 2s ease-in-out infinite;
  z-index: 9999;
}

img:last-child {
  transform: rotate(180deg);
  animation: moveReverse 2s ease-in-out infinite;
}

@keyframes move {
  0% {
    transform: translateX(10px);
  }
  50% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(10px);
  }
}

@keyframes moveReverse {
  0% {
    transform: rotate(180deg) translateX(10px);
  }
  50% {
    transform: rotate(180deg) translateX(30px);
  }
  100% {
    transform: rotate(180deg) translateX(10px);
  }
}
</style>
