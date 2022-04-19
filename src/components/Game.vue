<script>
import Tour from './Tour.vue'
import Board from './Board.vue'
import Settings from './Settings.vue'

import backIconUrl from '/img/back.svg'
import forwardIconUrl from '/img/forward.svg'
import newIconUrl from '/img/new.svg'
import refreshIconUrl from '/img/refresh.svg'
import playIconUrl from '/img/play.svg'
import pauzeIconUrl from '/img/pauze.svg'
import hamurgerIconUrl from '/img/hamburger.svg'
import starIconUrl from '/img/star.svg'
import pencilIconUrl from '/img/pencil.svg'
import backupIconUrl from '/img/backup.svg'
import restoreIconUrl from '/img/restore.svg'

export default{
    components: {
        Tour,
        Board,
        Settings
    },
    data(){
        return {

            // Setup game, solve sudoku or add note?
            mode: 0,

            pauzed: false,

            d: null,

            t: 0,

            time: '00:00:00',

            t1: null,

            backIconUrl,

            forwardIconUrl,

            newIconUrl,

            refreshIconUrl,

            playIconUrl,

            pauzeIconUrl,

            hamurgerIconUrl,

            starIconUrl,

            pencilIconUrl,

            backupIconUrl,

            restoreIconUrl

          }
    },
    watch:{
      mode( newMode, oldMode ){
        if( newMode == 1 && oldMode == 0 ){
          clearInterval( this.t1 )
          this.t1 = setInterval( this.updateTime, 1000 )
        }
      },
      pauzed( pauzed ){
        if( pauzed )
          clearInterval( this.t1 )
        else
          this.t1 = setInterval( this.updateTime, 1000 )
      },
    },
    methods:{
        onStartTour(){
          this.$refs.tour.initTour(11)
        },
        onEndTour(){
          this.$refs.tour.hide()
        },
        onSolved( solved ){
          if( solved )
            clearInterval( this.t1 )
        },
        onRestore( time ){
          this.t = time
        },
        onDifficulty( difficulty ){
          this.d = difficulty
        },
        toggleModeMakeNotes(){
            if( this.mode == 1 && this.$refs.board.canMakeNotes )
                this.mode = 2
            else if( this.mode == 2 )
                this.mode = 1
        },
        updateTime(){
          this.t++
          this.time = this.formatSeconds( this.t )
        },
        formatSeconds( sec_num ){ 
          var hours   = Math.floor(sec_num / 3600);
          var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
          var seconds = sec_num - (hours * 3600) - (minutes * 60);

          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          return hours+':'+minutes+':'+seconds;
        },
        start(){
          document.location.reload()
        },
        play(){
          this.changeScreen( 'game' )
          if( this.mode == 0 ){
            this.mode = 1
            this.$refs.board.play()
            this.pauzed = false
          }
          else if( this.mode == 1)
            this.pauzed = false
        },
        pauze(){
          this.pauzed = true
          this.changeScreen("pauze")
        },
        back(){
          this.$refs.board.back()
        },
        forward(){
          this.$refs.board.forward()
        },
        refresh(){
          this.$refs.board.refresh()
        },
        backup(){
          this.$refs.board.backup( this.t )
          this.changeScreen("pauze")
        },
        restore(){
          this.$refs.board.restore()
          this.mode = 1
        },
    },
    props:[
        'changeScreen',
        'settings',
    ],
}

</script>
<template>

<Tour ref='tour'/>

<div>
    <div class='top-menu'>
      <div>
        <img 
          tour-id='1'
          :src='backIconUrl' 
          v-on:click.stop='back()
          '/>
      </div>
      <div>
        <img 
          tour-id='2'
          :src='forwardIconUrl' 
          v-on:click='forward()'
          />
      </div>
      <div>
        <img 
          tour-id='3'
          :src='newIconUrl' 
          v-on:click='start()'
          />
      </div>
      <div>
        <img
          tour-id='4' 
          :src='refreshIconUrl' 
          v-on:click='refresh()'
          />
      </div>
      <div v-if='false'>
        <img 
          tour-id='5'
          :src='playIconUrl' 
          :class='{grayed: mode > 0}' 
          v-on:click.stop='play'
          />
      </div>
      <div>
        <img
          tour-id='6' 
          :src='pauzeIconUrl' 
          :class='{grayed:mode == 0}' 
          v-on:click.stop='pauze'
          />
      </div>
      <div>
        <img
          tour-id='7' 
          :src='hamurgerIconUrl' 
          v-on:click.stop='changeScreen("settings")'
          />
      </div>
    </div>
    <div class='score'>
      <div>
        <img v-if='d > -1' v-for='n in d' :src='starIconUrl'/>
      </div>
      <div>{{ time }}</div>
    </div>
    <Board 
      ref='board' 
      :mode='mode' 
      :settings='settings'
      :toggleModeMakeNotes='toggleModeMakeNotes'
      :changeScreen='changeScreen'
      v-on:startTour='onStartTour'
      v-on:endTour='onEndTour'
      v-on:difficulty='onDifficulty'
      v-on:solved='onSolved'
      v-on:restore='onRestore'
      v-on:start-play='play'
    />
    <div class='bottom-menu'>
      <img
        tour-id='9' 
        :src='pencilIconUrl' 
        v-bind:class='{grayed: mode == 0}' 
        v-on:click.stop='toggleModeMakeNotes()'
        />
      <img
        tour-id='10' 
        :src='backupIconUrl' 
        v-on:click='backup()'
        />
      <img 
        tour-id='11'
        :src='restoreIconUrl' 
        v-on:click='restore()'
        />
    </div>
</div>
</template>

<style>
img.grayed{
  opacity:0.5;
  filter:brightness(75%);
}
div.bottom-menu{
  width:500px;
  max-width:100vw;
  margin:0 auto;
}
div.top-menu{
  width: 500px;
  max-width:100vw;
  margin: 0.5rem auto;
}
div.top-menu div{
  width:calc(100% / 6);
  float:left;
  padding: 0 0.5rem;
}
div.top-menu div img{
  cursor:pointer;
  width:35px;
}
div.bottom-menu img{
  cursor:pointer;
  max-height: 50px;
  padding: 0.5rem 0.6rem;
}
div.score{
  width:500px;
  height:1.5rem;
  max-width:100vw;
  clear:left;
  padding: 0.5rem 0.5rem;
  margin: 0 auto;
  text-align:left;
  color: #fff;
}
div.score div{
  width: 50%;
  height: 1.5rem;
  float:left;
}
div.score div:nth-child(2){
  text-align:right;
}
div.score img{
  height: 1.5rem;
}
</style>
