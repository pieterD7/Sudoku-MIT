<script>
import Hammer from 'hammerjs'

export default{
    props:{
        'set': {
          type: Array,
          default: new Array()
        },
        'mode': {
          type: Number,
          default: 0
        },
        'toggleModeMakeNotes':{
          type:  Function,
          default:() => {}
        }
    },
    data(){
        return {
            cell:null,
            row: null,
            column: null,
            index: '',
            notes:[],
            isInitialValue: false,
            selected: false,
            className: ''
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
            if( this.mode > 0 
                && this.index == ''){
                this.selected = true
                this.toggleModeMakeNotes()
            }
        })

        // For keyboards
        document.querySelector( 'body' )
        .addEventListener( 'keyup', ( event ) => { 
            if( this.selected )
                if(! isNaN(event.key) )
                    this.$emit( 'keyboardInput', parseInt(event.key) )
                else
                    this.$emit( 'keyboardInput', event.key.toUpperCase())
        })
    }
}
</script>

<template>
  <div
    v-if="typeof index == 'number'" 
    :class="{
      index0: index == 0,
      index1: index == 1,
      index2: index == 2,
      index3: index == 3,
      index4: index == 4,
      index5: index == 5,
      index6: index == 6,
      index7: index == 7,
      index8: index == 8,
      number: true, 
      selected: selected, 
      initialValue:isInitialValue ,
      'full-cell': className == 'fullcell',
      'full-row': className == 'fullrow',
      'full-column': className == 'fullcolumn'
    }"
  >
    <div>{{ set[index] }}</div>
  </div>
  <div
    v-else 
    :class="{number: true, notes: true, selected: selected}"
  >
    <span v-if="notes.indexOf(0) > -1">{{ set[0] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(1) > -1">{{ set[1] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(2) > -1">{{ set[2] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(3) > -1">{{ set[3] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(4) > -1">{{ set[4] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(5) > -1">{{ set[5] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(6) > -1">{{ set[6] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(7) > -1">{{ set[7] }}</span>
    <span v-else>&nbsp;</span>
    <span v-if="notes.indexOf(8) > -1">{{ set[8] }}</span>
    <span v-else>&nbsp;</span>
  </div>
</template>