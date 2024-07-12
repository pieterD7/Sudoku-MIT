<script>
import Hammer from 'hammerjs'
import * as Vue from 'vue'

export default{

    props:{
        // The value
        'value': {
            type: String,
            default: ''
        },

        // The function to call on click
        'move': {
            type: Function,
            default: () => {}
        },

        // Set to choose from (for letter sudoku)
        'set': {
            type: Array,
            default: new Array()
        }, 

        'mode': {
            type: Number,
            default: 0
        },

        'index': {
            type: String,
            default : ''
        },

        'changeSet': {
            type: Function,
            default: () => {}
        }
        
    },
    
    data(){
        return {
            editSet: false,
        }
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
    },
    
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
    }
}
</script>

<template>
  <div>
    <button
      v-if="! editSet" 
      @click.stop="doMove()"
    >
      {{ set[index] }}
    </button>
    <input
      v-else
      type="text" 
      @keyup="change" 
      @keydown.esc="editSet = false"
      @blur="editSet = false"
    >
  </div>
</template>
