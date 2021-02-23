
<template>
    <v-container class="sign_in_container">

            <v-row>
                <v-col class="title">SIGN IN </v-col>
            </v-row>
            <v-row class="changeForm">
    
                <v-list class="listItems">
                    <v-list-item class="member_title">New ?</v-list-item>
                    <v-list-item :to="{name: 'signUp'}" class="member_title">Create an account</v-list-item> 
                </v-list>

            </v-row>

        <signInForm class="sign_in_form" :class="{'sm_screen': isSmallScreen, 'md_screen':isMdScreen}"/>
        <!-- <v-row>
            <v-spacer></v-spacer>
            New ?
            <v-btn
                color="primary"
                small text
                :to="{name:'signUp'}"
                >
                    Create an account
            </v-btn>
        </v-row> -->
    </v-container>
</template>

<script>

import signInForm from '../components/signInForm';
import screenSize from '../mixins/screenSize';

export default {

    components:{
        signInForm,
    },
    mixins:[screenSize]
}
</script>

<style scoped>
    .title{
        font-size: 20px !important;
        text-align: center;
        margin-top: 15px;
    }
    .sign_in_form{
        width: 70%;
    }
    .md_screen{
        width: 80%;
    }
    .sm_screen{
        width: 100%;
    }
    .changeForm{
        justify-content: flex-end;
    }
    .listItems{
        display: flex;
        justify-content: start;
        
    }
    .member_title{
        overflow: visible !important;
        padding: 2px;
flex: none;

    }
</style>