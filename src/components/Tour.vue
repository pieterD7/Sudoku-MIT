<script>

import tour from '../tour.js'
import * as Vue from 'vue'


export default{
    data(){
        return {
            showTour: false,
            tour: new tour.tour([
                { 'tour-id': 1, 
                    txt: 'Undo last move', 
                    left: 0, top: 20, hide: '.dialog'},
                { 'tour-id': 2, 
                    txt: 'Redo last undone move', 
                    left: 0, top: 20},
                { 'tour-id': 3, 
                    txt: 'Start a new game', 
                    left: 0, top: 20},
                { 'tour-id': 4, 
                    txt: 'Refresh to the beginning and undo all moves', 
                    left:0, top: 20},
                /*{ 'tour-id': 5, 
                    txt: 'Start play', 
                    left: 0, top: 20},*/
                { 'tour-id': 6, 
                    txt: 'Pauze', 
                    left: 0, top:20},
                { 'tour-id': 7, 
                    txt: 'Settings', 
                    left: 0, top:20},
                { 'tour-id': 'board', 
                    txt: 'This is the board. Select a square and use the buttons or keyboard to enter a value.', 
                    left:-2, top: -240 },
                { 'tour-id': 8, 
                    txt: 'These are the possibilities to select from. Press-and-hold to enter letters.', 
                    left: 0, top: 0},
                { 'tour-id': 9, 
                    txt: 'Make notes while you play after clicking here or press-and-hold a square. They will be automatically updated when you make a move.', 
                    left: 0, top:0},
                { 'tour-id': 10, 
                    txt: 'If you are not sure about a move, make a backup to restore later.', 
                    left: 0, top: 0},
                { 'tour-id': 11, 
                    txt: 'Restore the last backup.', 
                    left: 0, top: 0, hide: '.dialog'},
                { 'tour-id': 12, 
                    txt: 'Take a tour around the interface.', 
                    left: 0, top: 10, show: '.dialog'},
                { 'tour-id': 13, 
                    txt: 'The difficulty of the Sudoku.', 
                    left: 0, top: -20, show: '.dialog'},
                { 'tour-id': 14, 
                    txt: 'Play Sudoku!', 
                    left: 0, top: 10, show: '.dialog'},
                { 'tour-id': 15, 
                    txt: 'Create a Sudoku and see if the computer can crack it.', 
                    left: 0, top: 10, show: '.dialog'}
                ])
        }
    },
    methods: {
        show(){
            this.showTour = true
        },
        hide(){
            this.showTour = false
            let spl = document.querySelector('.dialog')
            if( spl )
                spl.setAttribute('style', '')
        },
        hadTour(){
            let txt = localStorage.getItem( 'tour' )
            if( txt ){
                return true
            }
            return false
        },
        setTourParms( popupWidth, popupHeight ){
            this.tour.setParams( popupWidth, popupHeight )
        },
        initTour(id){
            if( ! this.showTour ){
                this.setTourParms( 200, 0 )
                this.tour.explain(this.$el, id)
                this.show()
            }
            else{
                this.hide()
            }
        },
    },
    mounted(){
        Vue.nextTick( () => {
            setTimeout( () => {
                if( ! this.hadTour() )
                    this.initTour( 11 )
            }, 500)
        })
    }
}

</script>

<template>

    <div v-show='showTour' class='popup'>
        <div class='top'>
            <div class='arrow arrow-up'></div>
        </div>
        <div class='txt'></div>
        <br/>
        <div class='bottom right'>
            <div class='arrow arrow-down'></div>
        </div>
    </div>

</template>

<style>
div.popup{
    position: absolute;
    overflow:unset;
    z-index: 999;
    width: 200px;
    padding: 0 1rem;

    border: 1px solid white;
    border-radius: 4px; 
}
.default div.popup{
    color:#f7f7f7;
    background-color: #5599ff;
}
.black div.popup{
    color:#f7f7f7;
    background-color: #202020;
}
#nextTour{
    cursor: pointer;
    display: block;
    width:100%;
    text-align:right;
}
.hide{
    visibility: hidden;
}
.top, .bottom,
.top.center, .bottom.center{
    width: 10px;
    margin: 0 auto;
}
.top.left, .bottom.left{
    margin: 0 0;
}
.top.right, .bottom.right{
    margin-left: calc(100% - 10px);
}
.arrow{
    position:relative;
    width: 0; 
    height: 0; 
    left: -5px;
}
.arrow-up{
    top: -12px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #f7f7f7;
}
.arrow-down{
    top: 12px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #f7f7f7;
}
</style>