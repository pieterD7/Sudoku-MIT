<script>
import exitIconUrl from '/img/exit.svg'

export default{

    props:[
        'magic-wand'
    ],

    data(){
        return {
            showDialog: false,
            exitIconUrl
        }
    },

    methods:{
        show(){
            this.showDialog = true
        },

        hide(){
            this.showDialog = false
        }
    }
}
</script>


<template>
    <div class='dialog' v-if='showDialog'>
      <form method="dialog">
        <fieldset>
            <legend></legend>
            <div>
                <img data-ref='cancel' class='exit' :src='exitIconUrl' v-on:click.stop='hide()'/>
                <h1>Solved!</h1>
            </div>
        </fieldset>
      </form>
    </div>
</template>

<style>
h1{
    color:#f7f7f7;
    padding: 6rem 0;
}
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
