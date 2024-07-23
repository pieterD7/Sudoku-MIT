<script>
import * as Vue from 'vue'
import GameComponent from './GameComponent.vue'
import SettingsComponent from './SettingsComponent.vue'
import PauzeComponent from './PauzeComponent.vue'

export default{
    components: {
        GameComponent,
        SettingsComponent,
        PauzeComponent,
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
                theme: 'black'
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
    <SettingsComponent
      v-if="screen == 'settings'" 
      :change-screen="changeScreen"
      :change-theme="changeTheme"
      :settings="settings"
      :toggle-audio="toggleAudio"
    />
    <PauzeComponent
      v-else-if="screen == 'pauze'" 
      :change-screen="changeScreen" 
    />
    <GameComponent
      v-else 
      ref="game"
      :change-screen="changeScreen" 
      :settings="settings"
    />
  </keep-alive>
</template>