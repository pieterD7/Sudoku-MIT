<script>
import exitIconUrl from '/img/exit.svg'
import audioIconUrl from '/img/audio.svg'
import audioOffIconUrl from '/img/audio-off.svg'
import themeBlackIconUrl from '/img/theme-black.svg'
import themeBlueIconUrl from '/img/theme-blue.svg'

export default{
    props:[
        'changeScreen',
        'changeTheme',
        'toggleAudio',
        'settings'
    ],
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
    <div class='exit' v-on:click.stop='changeScreen("game")'>
        <img :src='exitIconUrl'/>
    </div>
    <div>
        <div class='options'>
            <img v-show='settings.audio' :src='audioIconUrl' 
                v-on:click.stop='toggleAudio()' />
            <img v-show='settings.audio == false' :src='audioOffIconUrl' 
                v-on:click.stop='toggleAudio()' />
        </div>
        <div class='options'>
            <img v-show='settings.theme == "default"' :src='themeBlackIconUrl' 
                v-on:click='changeTheme("black")'/>
            <img v-show='settings.theme == "black"' :src='themeBlueIconUrl' 
                v-on:click='changeTheme("default")'/>
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
