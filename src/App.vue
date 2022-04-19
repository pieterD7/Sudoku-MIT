<script setup>

import Screen from './components/Screen.vue'

</script>

<template>
  <Screen />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body{
  max-width: 100vw;
  max-height: 100vh;
  overflow-x:hidden;
  margin:0;
}

body.default{
  background-color: #5599ff;
  color: #2a7fff;
}
body.black{
  background-color: #202020;
  color: #f7f7f7;
}

</style>
