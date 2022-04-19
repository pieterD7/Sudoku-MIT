<script>
import Hammer from 'hammerjs'
import * as Vue from 'vue'

export default{
    
    data(){
        return {
            editSet: false,
        }
    },

    props:[
        // The value
        'value',

        // The function to call on click
        'move',

        // Set to choose from (for letter sudoku)
        'set' , 

        'mode',

        'index',

        'changeSet',
        
    ],
    
    methods:{
        doMove(){
            this.$props.move(this.set[this.index])
        },

        allowedInSet( value ){
            return value.match(/[a-zA-Z1-9]/) 
                && this.set.indexOf( value ) == -1
                && ( isNaN( value ) || this.set.indexOf( parseInt( value )) == -1)
        },

        change( event ){
            if( this.allowedInSet( event.srcElement.value ) )
                this.changeSet( this.index, event.srcElement.value.toUpperCase())
            
            this.editSet = false
        },
    },

    mounted(){
        let el = this.$el,
            manager = new Hammer.Manager(el),
            press = new Hammer.Press({
                time: 500
            });
        manager.add( press )
        manager.on('press', (event) => {
            if( this.mode == 0 ){
                this.editSet = ! this.editSet
                Vue.nextTick( () => {
                    this.$el.querySelector('input').focus()
                })
            }
        })
    }
}
</script>

<template>
    <div>
        <button
            v-if='! editSet' 
            v-on:click.stop='doMove()'>{{set[index]}}</button>
        <input type='text'
            v-else 
                v-on:keyup='change' 
                v-on:keydown.esc='editSet = false'
                v-on:blur='editSet = false'/>
    </div>
</template>
