<script>

import * as Vue from 'vue'
import sudoku from '../sudoku.js'
import {Howl} from 'howler';
import TileComponent from './TileComponent.vue'
import NumbersComponent from './NumbersComponent.vue'
import StartDialogComponent from './StartDialogComponent.vue'
import FinishedDialogComponent from './FinishedDialogComponent.vue'

export default {
  
  components: {
    TileComponent,
    NumbersComponent,
    StartDialogComponent,
    FinishedDialogComponent,
  },

  props: {
    'theme': { 
      type: String, 
      default:''
    },
    'mode': {
      type: Number,
      default: 0
    },
    'toggleModeMakeNotes': {
      type: Function,
      default: () => {}
    },
    'settings': {
      type: Object,
      default: () => {}
    },
    'changeScreen': { 
      type: Function,
      default: () => {}
    } 
  },

  emits:[
    'startTour',
    'endTour',
    'difficulty',
    'solved',
    'restore',
    'startPlay'
  ],

  data(){
    return {

      // Selected tile to enter number or note
      selectedTile: null,

      // Only make notes if tile has no value yet
      canMakeNotes: false,

      // Index of current move
      index: 0,

      // Refresh to this index 
      startPlayIndex: 0,

      // The set of nine to play with
      set: [1,2,3,4,5,6,7,8,9],

      // The game
      game: [{
        board:[], 
        notes:[], 
        columnsFull:[], 
        rowsFull:[], 
        cellsFull:[]}],

      // With magic wand
      autoNotes: false,

      sudoku: sudoku,

      difficulty: 1,

    }
  },

  watch:{

    index( index ){
      this.syncBoard( this.game, index )
      if( this.selectedTile )
        this.afterMove( this.selectedTile )
    }
  },

  mounted(){
    this.$refs.tile.forEach( ( tile, n ) => {
      tile.cell = this.indexToCell(n)
      tile.row = this.indexToRow(n)
      tile.column = this.indexToCol(n)
    })
    this.$refs.start.show()
  },

  methods:{

    onStartTour(){
      this.$emit('startTour')
    },

    onEndTour(){
      this.$emit('endTour')
    },
    
    syncBoard( game, index ){
      this.setValues(game[index].board)

      if( this.autoNotes ){
        let s = new this.sudoku.sudoku( this.getTiles() )
        this.$emit("difficulty", s.getDifficulty())
        game[index].notes = s.getNotes()
      }
      this.setNotes(game[index].notes)
    },

    onSetDifficulty( difficulty ){
      this.difficulty = difficulty
    },

    generateSudoku(){
      var worker = new Worker( new URL('../generate.js', import.meta.url), {type:'module'});
      worker.onmessage = ( e ) => {
        this.game[this.index].board = e.data.tiles
        this.game[this.index].notes = e.data.notes
        this.syncBoard(this.game, this.index)
        this.$emit("difficulty", e.data.d)
        this.$emit("startPlay", true)
      }
      worker.postMessage({tiles:this.getTiles(), d: this.difficulty});

      this.changeScreen( 'pauze' )
    },

    startWithAutoNotes(){
      this.autoNotes = true
    },

    indexToCell( index ){
      return Math.floor( index / 9 )
    },

    indexToRow( index ){
      return Math.floor( index  / 3 ) % 3 + Math.floor( Math.floor( index / 9) / 3) * 3 + 1
    },

    indexToCol( index ){
      return index % 3 + Math.floor( index / 9) % 3 * 3 + 1
    },

    /* Functions to access the child components */
    
    /* Indices base 0 */
    cellRowColToIndex(cell, r, c){
      return cell * 9 + (3 * r + c)
    },

    /* Indices base 1 */
    rowColToIndex(row, col){
      return ((row-1) % 3) * 3 + Math.floor((row-1) / 3) * 27 
        + Math.floor((col-1) / 3) * 9 + (col-1) % 3;
    },

    /* Indices base 0, through 2 for row/column */
    cellRowColumnToRowColumn(cell, r, c){
      let row = r+1 + Math.floor(cell / 3) * 3,
        column = c+1 + cell % 3 * 3

      return {row:row,column:column};
    },

    /* Functions to use for validating if move is valid */
    cell(cell){
      let tiles = []
      for( let n = 0; n < 3; n++){
        for(let m = 0; m < 3; m++){
          tiles.push( this.$refs.tile[this.cellRowColToIndex(cell, n, m)])
        }
      }
      return tiles
    },

    row(row){
      let tiles = []
      for( let n = 1; n < 10; n++){
        tiles.push( this.$refs.tile[this.rowColToIndex(row, n)])
      }
      return tiles
    },

    column(col){
      let tiles = []
      for( let n = 1; n < 10; n++){
        tiles.push( this.$refs.tile[this.rowColToIndex(n, col)])
      }
      return tiles
    },

    getTiles(){
      let t = []
      this.$refs.tile.forEach( ( tile ) => {
        t.push( {
          cell: tile.cell,
          row: tile.row,
          column: tile.column,
          index: tile.index 
        })
      })
      return t
    },

    taken( tiles ){
      let had = []
      tiles.forEach( ( tile ) => {
        if( typeof tile.index == 'number'  )
          had.push( tile.index )
      })
      return had.length
    },

    isFull( tiles ){
      if( this.taken( tiles ) == 9 )
        return true
      return false
    },

    beforeMove(selectedTile, index){
      // Is valid?
      let tiles = [],
        isValid = true;
      
      tiles = tiles.concat( 
        this.cell( selectedTile.cell ),
        this.row( selectedTile.row),
        this.column( selectedTile.column)
      )
      tiles.forEach( ( tile ) => {
        if( typeof tile.index == 'number' && tile.index == index)
          isValid = false
        if( tile.row == selectedTile.row
            && tile.column == selectedTile.column 
            && tile.initialValue && this.mode != 0 )
          isValid = false
      })

      return isValid
    },

    playSound( file ){
      var sound = new Howl({
        src: ['snds/' + file ]
      });
      if( this.settings.audio )
        sound.play()
    },

    /* Animate board after move if suitable */
    afterMove( selectedTile ){
      let tiles = this.cell( selectedTile.cell ),
        snd = false

      if(this.isFull(tiles) && this.game[this.index].cellsFull.indexOf( selectedTile.cell ) == -1){
        this.animateFullCell( selectedTile.cell )
        this.game[this.index].cellsFull.push( selectedTile.cell )
        snd = true
      }

      tiles = this.row( selectedTile.row )
      if(this.isFull(tiles) && this.game[this.index].rowsFull.indexOf( selectedTile.row ) == -1){
        this.animateFullRow( selectedTile.row )
        this.game[this.index].rowsFull.push( selectedTile.row )
        snd = true
      }

      tiles = this.column( selectedTile.column )
      if( this.isFull( tiles ) && this.game[this.index].columnsFull.indexOf( selectedTile.column ) == -1){
        this.animateFullColumn( selectedTile.column)
        this.game[this.index].columnsFull.push( selectedTile.column )
        snd = true
      }

      if( snd )
        if( this.game[this.index].cellsFull.length == 9 ){
            this.$emit( 'solved', true )
            this.playSound( 'triangle-3x.mp3' )
            this.$refs.finished.show()
        }
        else
  	        this.playSound( 'triangle.mp3' )

    },

    animateFullCell( cell ){
      let tiles = this.cell( cell )
      tiles.forEach( ( tile ) => {
        tile.className = 'fullcell'
      })
    },

    animateFullRow( row ){
      let tiles = this.row( row )
      tiles.forEach( ( tile ) => {
        tile.className = 'fullrow'
      })
    },

    animateFullColumn( col ){
      let tiles = this.column( col )
      tiles.forEach( ( tile ) => {
        tile.className = 'fullcolumn'
      })
    },

    /* Functions to update the notes after player move */
    removeFromNotes( selectedTile, value, tiles ){
      if( value > -1)
        tiles.forEach( ( tile ) => {
            tile.notes.splice( tile.notes.indexOf( value ), 1 )
        })
    },

    updateNotes( selectedTile, value ){
      this.removeFromNotes( selectedTile, value, this.cell( selectedTile.cell ))
      this.removeFromNotes( selectedTile, value, this.row( selectedTile.row ))
      this.removeFromNotes( selectedTile, value, this.column( selectedTile.column ))
    },

    /* Functions to set the value of a child component */
    moveRowCol(row, col, index, isInitialValue ){
      this.$refs.tile[this.rowColToIndex(row, col)].index = index
      this.$refs.tile[this.rowColToIndex(row, col)].isInitialValue = isInitialValue
      this.$refs.tile[this.rowColToIndex(row, col)].className = ''
    },

    addNotesRowCol(row, col, notes){
      this.$refs.tile[this.rowColToIndex(row, col)].notes = notes
    },

    /* Select a tile */
    setSelectedTile(cell, row, column){
      this.selectedTile = {cell:cell, row:row, column:column}
    },

    unsetSelectedTile(){
      this.unselectAll()
      this.selectedTile = null
    },

    unset(){
      this.move( '' )
    },

    /* Player actions */
    keyboardInput( value ){
      if( this.set.indexOf( value ) > -1 ){
        if(! this.beforeMove(this.selectedTile, this.set.indexOf(value)))
          return 
        this.move( value )
      }
      else if( value == 'ENTER' ){
        this.move( '' )
      }
    },

    move( value ){
      if(this.selectedTile){

        if( this.game.length > this.index + 1 )
          this.game.splice(this.index + 1)

        let game = this.game.concat(),
          board = game[this.index].board.concat(),
          notes = game[this.index].notes.concat(),
          cellsFull = game[this.index].cellsFull.concat(),
          rowsFull = game[this.index].rowsFull.concat(),
          columnsFull = game[this.index].columnsFull.concat()

        game.push({board: board, notes: notes, cellsFull: cellsFull, rowsFull: rowsFull, columnsFull: columnsFull})
        let index = this.index + 1

        if( this.mode == 2 ){
          let found = []
          notes.forEach( ( note ) => {
            if( note.row == this.selectedTile.row 
              && note.column == this.selectedTile.column)
              found = note.notes.concat()
          })
          if(found.indexOf(this.set.indexOf(value)) == -1)
            found.push(this.set.indexOf(value))
          else
            found.splice(found.indexOf(this.set.indexOf(value)), 1)
          found.sort()

          game[index].notes.push({
            row:this.selectedTile.row,
            column:this.selectedTile.column,
            cell:this.selectedTile.cell,
            notes:found
          })
        }
        else{
          game[index].board.push({
            row:this.selectedTile.row,
            column:this.selectedTile.column,
            cell:this.selectedTile.cell,
            index: this.set.indexOf(value) > -1 ? this.set.indexOf(value) : '',
            initialValue:this.mode == 0? true : false
          })
          this.updateNotes( this.selectedTile, this.set.indexOf(value) )
          this.unselectAll()
        }
        this.game = game
        this.index = this.game.length - 1
      }
    },

    select(cell, r, c){
      let obj = this.cellRowColumnToRowColumn(cell, r, c)
      this.setSelectedTile(cell, obj.row, obj.column)

      this.unselectAll()
      this.$refs.tile[this.cellRowColToIndex(cell, r, c)].selected = true
      if(this.$refs.tile[this.cellRowColToIndex(cell, r, c)].index == '')
        this.canMakeNotes = true
      else
        this.canMakeNotes = false
    },

    unselectAll(){
      this.$refs.tile.forEach( ( t ) => {
        t.selected = false
      })
    },

    clearBoard(){
      for( let n = 1; n < 10; n++){
        for( let m = 1; m < 10; m++)
          this.moveRowCol( n, m, '')
      }
    },

    clearNotes(){
      for(let n = 1; n < 10; n++){
        for(let m = 1; m < 10; m++){
          this.addNotesRowCol(n, m, [])
        }
      }
    },

    /* Called by the watcher */
    setValues( board ){
      this.clearBoard()
      board.forEach( ( item ) => {
        this.moveRowCol( item.row, item.column, item.index, item.initialValue )
      })
    },

    setNotes( notes ){
      this.clearNotes()
      notes.forEach( ( item ) => {
        this.addNotesRowCol( item.row, item.column, item.notes )
      })
    },

    changeSet(index, value ){
      if(index > -1 && index < this.set.length)
        this.set[index] = value
    },

    back(){
      if( this.index > 0 )
        this.index--
    },

    forward(){
      if( this.index < this.game.length - 1 )
        this.index++
    },

    play(){
      this.startPlayIndex = this.index
    },

    refresh(){
      this.index = this.startPlayIndex
    },

    backup( time ){
      let o = {
        index:this.index, 
        startPlayIndex: this.startPlayIndex,
        set: this.set,
        game: this.game,
        time: time
      }
      localStorage.setItem( 'backup', JSON.stringify(o) )
    },

    restore(){
      let o = {},
        txt = localStorage.getItem( 'backup' )

      if(txt){
        o = JSON.parse( txt )
        this.game = o.game
        this.set = o.set
        this.startPlayIndex = o.startPlayIndex
        if(this.index == o.index){
          this.syncBoard( this.game, this.index )
        }
        else{
          this.index = o.index
        }
        this.$emit( 'restore', o.time )
      }
    },
  },
}

</script>

<template>
  <div>
    <StartDialogComponent
      ref="start" 
      :generate="generateSudoku"
      :magic-wand="startWithAutoNotes"
      @set-difficulty="onSetDifficulty"
      @startTour="onStartTour"
      @endTour="onEndTour"
    />

    <FinishedDialogComponent ref="finished" />

    <div
      tour-id="board"
      @click="unsetSelectedTile(), onEndTour()"
    >
      <div class="board">
        <div
          v-for="k in [0,1,2]"
          :key="k"
          class="row"
        >
          <div
            v-for="l in [0,1,2]"
            :key="l"
            class="cell"
          >
            <div
              v-for="m in [0,1,2]"
              :key="m"
              class="cellrow"
            >
              <div
                v-for="n in [0,1,2]"
                :key="n"
                :class="{'make-notes': mode == 2 && canMakeNotes}"
                @click.stop="select(3 * k + l, m, n)"
              >
                <TileComponent 
                  ref="tile"
                  :set="set" 
                  :mode="mode" 
                  :toggle-mode-make-notes="toggleModeMakeNotes"
                  @keyboardInput="keyboardInput"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        tour-id="8"
        class="buttons"
      >
        <NumbersComponent 
          :set="set" 
          :move="move" 
          :mode="mode" 
          :change-set="changeSet"
          :unset="unset"
        />
      </div>
    </div>
  </div>
</template>

<style>
*{
  box-sizing: border-box;
  margin:0;
  padding:0;
}

button{
  cursor:pointer;
  width:2.5rem;
  padding: 0.75rem 0.75rem;
  font-weight:bold;
  background-color: #fff;
}

input{
  width: 2.5rem;
  height:2.5rem;
  padding: 0.75rem 0.75rem;
}

.azure .buttons{
  color:#202020;
}

.default.game{
  background-color: #5599ff;
  color: #2a7fff;
}
.default button{
  border: 1px solid #2a7fff;
}
.default .buttons *{
  color:#2a7fff;
}
.default .number{
  background-color:#f7f7f7;
  border-bottom: 1px solid #808080;
  border-right: 1px solid #808080;
}
.default .cell{
  border-bottom: 2px solid #2a7fff;
  border-right: 2px solid #2a7fff;
}
.default .row:nth-child(3) .cell{
  border-bottom: none;
}
.default .cell:nth-child(3){
  border-right:none;
}
.default .number.selected{
  background: #2a7fff;
  color: #fff;
}
.default .make-notes .number.selected{
  background: #fff;
  border: 2px solid #2a7fff;
}
.default .number.initialValue{
  color: black;
}
.black.game{
  color: #f7f7f7;
  background-color: black;
}
.black button{
  background-color: black;
  border: 1px solid black;
}
.black .buttons *{
  color:#f7f7f7;
}
.black .number{
  background-color:black;
  border: 1px solid #808080;
}
.black .number.notes *{
  color: #f7f7f7;
}
.black .cell{
  border-bottom: 2px solid white;
  border-right: 2px solid white;
}
.black .row:nth-child(3) .cell{
  border-bottom: none;
}
.black .cell:nth-child(3){
  border-right:none;
}
.black .number.selected{
  background: #f7f7f7;
}
.black .number.selected *{
  color: #202020;
}
.black .make-notes .number.selected{
  background: #000;
  border: 2px solid #202020;
}
.black .buttons{
  color:#f7f7f7;
}

.black .number.index0{
  color: #5599FF;
}
.black .number.index1{
 	color: #6555FE;
}
.black .number.index2{
 	color: #BB55FE;
}	
.black .number.index3{
 	color: #FE55ED;
}
.black .number.index4{
 	color: #FE5598;
}
.black .number.index5{
 	color: #FE6655;
}
.black .number.index6{
 	color: #FEBB55;
}
.black .number.index7{
 	color: #EDFE55;
}
.black .number.index8{
 	color: #55FE66;
}
.black .number.initialValue{
  text-decoration: underline;
  font-weight: bold;
}
.buttons{
  margin: 0 auto;
  width: 100vw;
  max-width:500px;
}
.buttons > div{
  float:left;
  clear:left;
  width: 100%;
  margin: 0.5rem 0;
}
.buttons > div > div{
  float:left;
  width:calc(100% / 10);
  max-width: calc(100% / 10);
}
.board{
  margin: 0.5rem auto;
  width: 100vw;
  height:100vw;
  max-width:500px;
  max-height: 500px;
}
.row {
  float: left;
  width: 100%;
}
.row:nth-child(1) .cell:nth-child(1) .cellrow:nth-child(1) div:nth-child(1) .number{
  border-top-left-radius: 25px;
}
.row:nth-child(1) .cell:nth-child(3) .cellrow:nth-child(1) div:nth-child(3) .number{
  border-top-right-radius: 25px;
}
.row:nth-child(3) .cell:nth-child(1) .cellrow:nth-child(3) div:nth-child(1) .number{
  border-bottom-left-radius: 25px;
}
.row:nth-child(3) .cell:nth-child(3) .cellrow:nth-child(3) div:nth-child(3) .number{
  border-bottom-right-radius: 25px;
}
.cell {
  width: 33.333%;
  float:left;
}
.cellrow{
  float:left;
  clear:left;
  width:100%;
}
.number{
  font-size:18px;
  cursor:pointer;
  padding:1rem;
  min-height: calc((3 * 55.55px - 2px) / 3);
  max-height: calc((3 * 55.55px - 2px) / 3);
  height: 33.333%;
  width: 33.333%;
  float:left;
}
.number.selected{
  border:none;
}
.number.notes{
  padding: 0.5em;
  font-size: 12px;
}
.notes > span{
  float:left;
  width: 33.333%;
  color:#000;
}
.selected.notes > span{
  color:#fff;
}
.make-notes .selected.notes > span{
  color:#000;
}

.cell .cellrow:nth-child(1) div:nth-child(1) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0s;
}
.cell .cellrow:nth-child(1) div:nth-child(2) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.11s;
}
.cell .cellrow:nth-child(1) div:nth-child(3) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.22s;
}
.cell .cellrow:nth-child(2) div:nth-child(1) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.33s;
}
.cell .cellrow:nth-child(2) div:nth-child(2) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.44s;
}
.cell .cellrow:nth-child(2) div:nth-child(3) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.55s;
}
.cell .cellrow:nth-child(3) div:nth-child(1) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.66s;
}
.cell .cellrow:nth-child(3) div:nth-child(2) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.33s;
  animation-delay: 0.77s;
}
.cell .cellrow:nth-child(3) div:nth-child(3) .number.full-cell{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.88s;
}

.row:nth-child(1) div.cellrow:nth-child(1) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0s;
} 
.row:nth-child(1) div.cellrow:nth-child(2) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.11s;
}
.row:nth-child(1) div.cellrow:nth-child(3) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.22s;
}
.row:nth-child(2) div.cellrow:nth-child(1) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.33s;
} 
.row:nth-child(2) div.cellrow:nth-child(2) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.44s;
}
.row:nth-child(2) div.cellrow:nth-child(3) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.55s;
}
.row:nth-child(3) div.cellrow:nth-child(1) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.66s;
} 
.row:nth-child(3) div.cellrow:nth-child(2) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.77s;
}
.row:nth-child(3) div.cellrow:nth-child(3) .number.full-column{
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.88s;
}

.cell:nth-child(1) div.cellrow div:nth-child(1) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0s;
} 
.cell:nth-child(1) div.cellrow div:nth-child(2) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.11s;
} 
.cell:nth-child(1) div.cellrow div:nth-child(3) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.22s;
}
.cell:nth-child(2) div.cellrow div:nth-child(1) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.33s;
} 
.cell:nth-child(2) div.cellrow div:nth-child(2) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.44s;
} 
.cell:nth-child(2) div.cellrow div:nth-child(3) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.55s;
}
.cell:nth-child(3) div.cellrow div:nth-child(1) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.66s;
} 
.cell:nth-child(3) div.cellrow div:nth-child(2) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.77s;
} 
.cell:nth-child(3) div.cellrow div:nth-child(3) .number.full-row {
  animation-name: dance;
  animation-duration: 0.3s;
  animation-delay: 0.88s;
} 

@keyframes dance{
  0%{
    position: relative;
    top: -0.2rem;
  }
  25%{
    position: relative;
    top: -0.4rem;
  }
  50%{
    position: relative;
    top: -0.6rem;
  }
  75%{
    position: relative;
    top: -0.4rem;
  }
  100%{
    position: inherit;
    top: 0rem;
  }
}

@media only screen and (max-width:500px){
  .board{
    width: 100vw;
    max-width:100vw;
    max-height: 100vw;
  }
  .number{
    min-height: calc(100vw / 9);
    max-height: calc(100vw / 9);
  }
  .number.notes{
    font-size: 11px;
  }
}
</style>
