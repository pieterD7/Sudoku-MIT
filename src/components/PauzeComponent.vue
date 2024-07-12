<script>

import exitIconUrl from '/img/exit.svg'

export default{
    props:{
        'changeScreen': {
            type: Function,
            default: () => {}
        }
    },
    data(){
        return {
            t1: null,
            m: 0,
            square: [
                [6,7,2,1,5,9,8,3,4],
                [2,9,4,7,5,3,6,1,8],
                [4,3,8,9,5,1,2,7,6],
                [8,1,6,2,5,7,4,9,2],
            ],
            exitIconUrl
        }
    },
    mounted(){
        this.t1 = setInterval( () => {
            this.m++ 
            this.m %= 4
        }, 1000)
    },
    unmounted(){
        clearInterval( this.t1 )
    }
}

</script>

<template>
  <div>
    <div
      class="exit"
      @click.stop="changeScreen(&quot;game&quot;)"
    >
      <img :src="exitIconUrl">
    </div>
    <div class="square">
      <div
        v-for="n in 9"
        :key="n"
        class="tile"
      >
        {{ square[m][n - 1] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
div{
    float: left;
    width: 100%;
}
.exit img{
    float: right;
    height: 25px;
    margin: 1rem;
    cursor:pointer;
}
div.square{
    width: 150px;
    margin: 0 auto;
    padding: 12rem 0;
    float: none;
}
div div.tile{
    float:left;
    width:50px;
    height: 50px;
    padding: 1rem;
}
.default div div.tile{
    background-color: #f7f7f7;
    border: 2px solid #f7f7f7;
}
.default div div.tile:nth-child(2n+2){
    border: 2px solid #fff;
}
.black div div.tile{
    background-color: black;
    border: 2px solid black;
}
.black div div.tile:nth-child(2n+2){
    border: 2px solid #404040;
}
div div.tile:nth-child(3n+1){
    clear:left;
}
.default div div.tile:nth-child(5){
    color:#202020;
}
.black div div.tile:nth-child(5){
    color:#f7f7f7;
}
</style>
