

<template>
    <v-container>

        <v-row>
            <v-col class="title">MY PROFILE </v-col>
        </v-row>
        <signUpForm class="sign_up_form" :class="{'sm_screen': isSmallScreen, 'md_screen':isMdScreen}"/>

    </v-container>
    
</template>

<script>

import signUpForm from '../components/signUpForm';
import screenSize from '../mixins/screenSize';

export default {
    name:'userProfile',
    components:{
        signUpForm
    },
    mixins:[screenSize]

}
</script>

<style scoped>
    .title{
        font-size: 30px !important;
        text-align: center;
        margin-top: 15px;
        margin-bottom: 10px;
    }
    .sign_up_form{
        width: 70%;
    }
    .md_screen{
        width: 80%;
    }
    .sm_screen{
        width: 100%;
    }
</style>