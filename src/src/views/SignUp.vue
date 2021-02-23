<template>
    <v-container>
        
            <v-row>
                <v-col class="title">SIGN UP</v-col>
                
            </v-row>
            <v-row class="changeForm">
    
                <v-list class="listItems">
                    <v-list-item-title class="member_title">Already a member ?</v-list-item-title>
                    <v-list-item :to="{name: 'signIn'}">Sign In</v-list-item> 
                </v-list>

            </v-row>
            <signUpForm class="sign_up_form" :class="{'sm_screen': isSmallScreen, 'md_screen':isMdScreen}"/>

    </v-container>
</template>

<script>
import signUpForm from '../components/signUpForm';
import screenSize from '../mixins/screenSize';

export default {
    mixins:[screenSize],
    components:{
        signUpForm,
    },
}
</script>

<style scoped>
    .title{
        font-size: 20px !important;
        text-align: center;
        margin-top: 15px;
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
    .changeForm{
        justify-content: flex-end;
    }
    .listItems{
        display: flex;
        justify-content: center;
        
    }
    .member_title{
        overflow: visible !important;
    }

</style>