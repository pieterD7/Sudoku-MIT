<script>
import * as Vue from 'vue'
import Game from './Game.vue'
import Settings from './Settings.vue'
import Pauze from './Pauze.vue'

export default{
    components: {
        Game,
        Settings,
        Pauze,
    },
    data(){
        return {
            themes: [
                'default',
                'black',
            ],

            screen: 'game',

            settings:{
                audio: true,
                theme: 'default'
            }
        }
    },
    beforeMount(){
        this.readSettings()
        this.applyTheme( this.settings.theme )
    },
    methods:{
        
        changeScreen(screen){
            this.screen = screen
            Vue.nextTick( () => {
                if( this.$refs.game && screen == 'game' )
                    this.$refs.game.pauzed = false
            })
        },

        applyTheme( theme ){
            this.themes.forEach( ( theme ) => {
                document.querySelector('body').classList.remove( theme )
            })
            document.querySelector('body').classList.add( theme )
        },

        changeTheme( theme ){
            this.settings.theme = theme
            this.saveSettings()
            this.applyTheme( theme )
        },

        toggleAudio(){
            this.settings.audio = ! this.settings.audio
            this.saveSettings()
        },

        saveSettings(){
            localStorage.setItem( 'settings', JSON.stringify( this.settings ) )
        },

        readSettings(){
            let txt = localStorage.getItem( 'settings' )
            if( txt ){
                this.settings = JSON.parse( txt )
            }
        }
    }
}

</script>
<template>
    <keep-alive>
        <Settings v-if="screen == 'settings'" 
            :changeScreen='changeScreen'
            :changeTheme='changeTheme'
            :settings='settings'
            :toggleAudio='toggleAudio'
        />
        <Pauze v-else-if="screen == 'pauze'" 
            :changeScreen='changeScreen' 
        />
        <Game v-else 
            ref='game'
            :changeScreen='changeScreen' 
            :settings='settings'
        />
    </keep-alive>
</template>