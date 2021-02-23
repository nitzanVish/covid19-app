
<template>
    <div class="home_container">
        
        <popularProducts/>
        
        <!-- <v-card>
            
            <v-row class="background" :class="{'sm_screen': isSmallScreen, 'md_screen':isMdScreen}">
                {{title}}
                <v-btn
                    
                    :to="{name:'products'}"
                    class="get_items_btn"
                >
                        Shop Now
                </v-btn>
                <v-img
                    class="background_image"
                    :src="require(`@/assets/images/corona/red_background.jpg`)"
                />
            </v-row>

        </v-card> -->
    
        <coronaStatus/>
        
        <coronaLastWeekStatus></coronaLastWeekStatus>
        
    </div>
</template>

<script>

import coronaStatus from '../components/Corona/coronaStatus';
import coronaLastWeekStatus from '../components/Corona/coronaDeathDeltaChart';
import screenSize from '../mixins/screenSize';
import popularProducts from './PupolarProducts';

export default {
    mixins:[screenSize],
    name:'HomePage',
    data(){
        return{
            title:'Stay Prepared With Our Items!'
        }
    },
    computed: {

    },
    components:{
        coronaStatus,
        coronaLastWeekStatus,
        popularProducts  
    },
    methods: {
        navigation(value){
            console.log(value);
        }
    },
}
</script>

<style scoped>
.background{
    background-color: black;
    position: relative;
    height: 300px;
    color: white;
    font-weight: 700!important;
    align-items: center;
    justify-content: center;
    font-size: 4em;
    z-index: 1;
}
/* .popular_prod{
    position: relative;
    height: 500px;
    
} */
.md_screen {
    height: 250px;
    font-size: 2.5em;
}
.sm_screen {
    height: 200px;
    font-size: 2em;
}
.background_image{
    opacity: 0.6;
    position: absolute;
    top: 0;
    max-height: 100%;
}
.get_items_btn{
    position: absolute;
    bottom: 1em;
    z-index: 1;
}

.title{
    display: flex;
    align-items: center;
    
}
.covid{
    display: flex;
    align-content: center;
}
.home_container > * {
    margin-top: 50px;
}
</style>
