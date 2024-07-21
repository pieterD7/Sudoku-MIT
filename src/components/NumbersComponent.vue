<script>
import ButtonComponent from './ButtonComponent.vue';

export default{

    components:{
        ButtonComponent
    },

    props:{
        'set': {
          type: Array,
          default: new Array()
        },
        'unset':{
          type: Function,
          default: () => {}
        },
        'changeSet': {
          type: Function,
          default: () => {}
        },
        'move': {
          type: Function,
          default: () => {}
        },
        'mode': {
          type: Number,
          default: 0
        },
    },

    data(){
        return {
        }
    },
}
</script>

<template>
  <div>
    <ButtonComponent
      index="0"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="1"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="2"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="3"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="4"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="5"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="6"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="7"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <ButtonComponent
      index="8"
      :mode="mode"
      :move="move"
      :set="set"
      :change-set="changeSet"
    />
    <button @click.stop="unset()">
      x
    </button>
  </div>
</template>