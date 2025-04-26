import '@/assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from '@/App.vue'
import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'
import * as pixiSpine from "@esotericsoftware/spine-pixi-v8";

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);

app.mount('#app');

window.loadComplete = false;

setInterval(() => {
    document.querySelectorAll('a[href]:not(.tag)').forEach((link) => {
        link.classList.add('tag');
        link.addEventListener('click', async (e) => {
            const url = link.getAttribute('href');
            e.preventDefault();
            document.querySelector('#curtain').style.display = 'block';
            setTimeout(() => {
                let a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.click();
            }, 900)
            setTimeout(() => (document.querySelector('#curtain').style.display = ''), 3000);
        })
    })
}, 1000);

export let characters = [];
export let bgmNames = [];

async function loadSpine(character)
{
    let pathname = window.location.pathname;
    if (!pathname.endsWith('/')) 
        pathname += '/';
    PIXI.Assets.add({ alias: character.name + '_skeleton', src: pathname + character.path + character.skel });
    PIXI.Assets.add({ alias: character.name + '_atlas', src: pathname + character.path + character.atlas });
    await PIXI.Assets.load([character.name + '_skeleton', character.name + '_atlas']);
    return pixiSpine.Spine.from({
        skeleton: character.name + '_skeleton',
        atlas: character.name + '_atlas',
    })
}

; (async function () {
    let _characters = await fetch('./characters.json');
    _characters = await _characters.json();
    
    let randomcharacters = _characters.random;
    let charactersToUse = [..._characters.fixed];
    for (let i = 0; i < _characters.randomAmount; i++) {
        let character = randomcharacters[Math.floor(Math.random() * randomcharacters.length)];
        randomcharacters = randomcharacters.filter(s => s.name !== character.name);
        charactersToUse.push(character);
    }

    for (let i = 0; i < charactersToUse.length; i++) {
        let character = charactersToUse[i];
        characters.push({
            ...character,
            spine: await loadSpine(character)
        });

        let pathname = window.location.pathname;
        if (!pathname.endsWith('/')) 
            pathname += '/';
        let bgmUrl = pathname + 'characters/bgm/' + character.bgm;

        let soundAlias = character.bgm.split('.')[0];
        if (!sound.exists(soundAlias))
            sound.add(soundAlias, {
                url: bgmUrl,
                loop: true,
                volume: 0.02
            });
        bgmNames.push(soundAlias);
    }
    window.loadComplete = true;
})()
