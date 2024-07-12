<script>

import exitIconUrl from '/img/exit.svg'
import starIconUrl from '/img/star.svg'
import tourIconUrl from '/img/looking-glass.svg'
import newIconUrl from '/img/new.svg'
import magicWandUrl from '/img/magic-wand.svg'

export default{

    props:{
        'setDifficulty': {
            type: Function,
            default: () => {}
        },
        'generate': {
            type: Function,
            default: () => {}
        },
        'magicWand': {
            type: Function,
            default: () => {}
        }
    },

    emits:[
        'startTour',
        'endTour',
        'setDifficulty'
    ],

    data(){
        return {
            showDialog: false,
            difficulty: 1,

            exitIconUrl,

            starIconUrl,

            tourIconUrl,

            newIconUrl,

            magicWandUrl
        }
    },

    watch:{
        difficulty( newValue, old ){
            let el = this.$el.querySelector( '.rating' )
            switch( old ){
                case 1:
                    el.classList.remove('one')
                    break;
                case 2:
                    el.classList.remove('two')
                    break;
                case 3:
                    el.classList.remove('three')
                    break;
                case 4:
                    el.classList.remove('four')
                    break;
            }
            switch( newValue ){
                case 1:
                    el.classList.add('one')
                    break;
                case 2:
                    el.classList.add('two')
                    break;
                case 3:
                    el.classList.add('three')
                    break;
                case 4:
                    el.classList.add('four')
                    break;
            }
        }
    },

    methods:{
        startTour(){
            this.$emit('startTour')
        },
        changeDifficulty( difficulty ){
            this.difficulty = difficulty
            this.$emit("setDifficulty", difficulty)
        },

        generateSudoku(){
            setTimeout( () => {
                this.generate()
            }, 1)
            this.hide()
        },
        
        startWithAutoNotes(){
            this.magicWand()
            this.hide()
        },

        show(){
            this.showDialog = true
        },

        hide(){
            this.showDialog = false
            this.$emit( 'endTour' )
        }
    }
}
</script>

<template>
  <div
    v-if="showDialog"
    class="dialog"
  >
    <form method="dialog">
      <fieldset>
        <legend />
        <div>
          <img
            v-show="false"
            class="exit"
            :src="exitIconUrl"
            @click.stop="hide()"
          >
          <div class="logo">
            Sudoku / MIT
          </div>
          <div class="view">
            <div
              tour-id="13"
              class="one rating"
            >
              <img
                class="star"
                :src="starIconUrl"
                @click="changeDifficulty(1)"
              >
              <img
                class="star"
                :src="starIconUrl"
                @click="changeDifficulty(2)"
              >
              <img
                class="star"
                :src="starIconUrl"
                @click="changeDifficulty(3)"
              >
              <img
                class="star"
                :src="starIconUrl"
                @click="changeDifficulty(4)"
              >
            </div>
            <div class="type" />
            <div class="menu">
              <img 
                tour-id="12" 
                :src="tourIconUrl"
                @click.stop="startTour()"
              >
              <img 
                tour-id="14" 
                :src="newIconUrl" 
                @click.once="generateSudoku()"
              >
              <img 
                tour-id="15" 
                :src="magicWandUrl" 
                @click.stop="startWithAutoNotes()"
              >
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style>
.dialog{
    width: 400px;
    max-width: 90vw;
    height: 250px;
    top: 100px;
    margin: 0 auto;
    border:none;
    position:absolute;
    left: calc(50vw - 200px);
}
.default .dialog{
    background-color: #5599ff;
}
.black .dialog{
    background-color: #202020;
}
.dialog form fieldset{
    border: none;
}
.dialog .logo{
    writing-mode: vertical-lr;
    position:absolute;
    transform: rotate(180deg);
    height: 100%;
    text-align:center;
    font-size:2rem;
    color: #f7f7f7;
    font-family: 'Sans serif', Arial;
    padding: 1rem;
    text-decoration:underline;
}
div.view{
    padding-left: 2rem;
}
div.type{
    width:100%;
    text-align:center;
}
img.exit {
    cursor:pointer;
    float: right;
    height: 25px;
    margin: 1rem;
}
img.star{
    height:25px;
    cursor:pointer;
}
div.rating{
    width:100%;
    text-align:center;
    padding: 4rem;
    padding-bottom:2rem;
}
div.menu{
    text-align:center;
}
div.menu img{
    cursor:pointer;
    height: 40px;
    margin: 1rem;
}
div.one img:nth-child(2),
div.one img:nth-child(3),
div.one img:nth-child(4),
div.two img:nth-child(3),
div.two img:nth-child(4),
div.three img:nth-child(4){
    filter: grayscale();
}
#app dialog *{
    font-family: 'Sans serif', Arial;
    color: #f7f7f7;
} 
dialog h1{
    padding: 4rem 0;
    padding-bottom: 1rem;
    width: 66.7%;
    margin: 0 auto;
    text-align: center;
    text-decoration: underline;
}
dialog a{
    padding: 3rem 1rem;
    color: #f7f7f7;
}
@media screen and (max-width:400px){
    .dialog{
        left: 5vw;
    }
}
</style>
