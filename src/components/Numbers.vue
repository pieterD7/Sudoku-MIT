<script>
import Button from './Button.vue'

export default{

    components:{
        Button
    },

    data(){
        return {
        }
    },

    props:[
        'set',
        'changeSet',
        'move',
        'mode',
    ],
}
</script>

<template>
    <div>
        <Button index='0' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='1' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='2' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='3' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='4' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='5' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='6' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='7' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
        <Button index='8' :mode='mode' :move='move' :set='set' :changeSet='changeSet'/>
    </div>
</template>