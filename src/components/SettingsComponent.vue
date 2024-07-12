<script>
import exitIconUrl from '/img/exit.svg'
import audioIconUrl from '/img/audio.svg'
import audioOffIconUrl from '/img/audio-off.svg'
import themeBlackIconUrl from '/img/theme-black.svg'
import themeBlueIconUrl from '/img/theme-blue.svg'

export default{
    props:{
        'changeScreen': {
          type: Function,
          default: () => {}
        },
        'changeTheme': {
          type: Function,
          default: () => {}
        },
        'toggleAudio': {
          type: Function,
          default: () => {}
        },
        'settings': { 
          type: Object,
          default: new Object()
        }
    },
    data(){
        return {
            exitIconUrl,
            audioIconUrl,
            audioOffIconUrl,
            themeBlackIconUrl,
            themeBlueIconUrl
        }
    }
}
</script>

<template>
  <div>
    <div
      class="exit"
      @click.stop="changeScreen(&quot;game&quot;)"
    >
      <img :src="exitIconUrl">
    </div>
    <div>
      <div class="options">
        <img
          v-show="settings.audio"
          :src="audioIconUrl" 
          @click.stop="toggleAudio()"
        >
        <img
          v-show="settings.audio == false"
          :src="audioOffIconUrl" 
          @click.stop="toggleAudio()"
        >
      </div>
      <div class="options">
        <img
          v-show="settings.theme == &quot;default&quot;"
          :src="themeBlackIconUrl" 
          @click="changeTheme(&quot;black&quot;)"
        >
        <img
          v-show="settings.theme == &quot;black&quot;"
          :src="themeBlueIconUrl" 
          @click="changeTheme(&quot;default&quot;)"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
div{
    float: left;
    width: 100%;
}
img{
    cursor:pointer;
}
div div.options{
    padding: 1rem;
    min-height: 50px;
}
.exit img{
    float: right;
    height: 25px;
    margin: 1rem;
}
</style>
