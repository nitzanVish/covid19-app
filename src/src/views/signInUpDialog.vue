<template>
    <!-- In case of ordering without logged in -->
    <v-row justify="center">

        <v-dialog
            v-model="dialogStatus"
            persistent
            max-width="800px"
        >
            <v-tabs
                v-model="tab"
                background-color="red lighten-2"
                dark
                slider-color="white"
                centered
            >
                <v-spacer></v-spacer>
                
                <v-tab
                    v-for="item in items"
                    :key="item.tab"
                >
                    {{ item.tab }}
                </v-tab>

                <v-spacer></v-spacer>
                <v-btn
                    icon
                    dark
                    @click="closeDialog"
                    class="closeBtn"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>

            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <signUp @closeSignInUpForm= "closeDialog"/>
                </v-tab-item>
                <v-tab-item>
                    <signIn @closeSignInUpForm= "closeDialog"/>
                </v-tab-item>
            </v-tabs-items>
        </v-dialog>
    </v-row>
</template>

<script>
import signIn from '../components/signInForm';
import signUp from '../components/signUpForm';

export default {
    props:{
        dialogStatus:{
            type:Boolean,
            require:true
        },
    },
    components:{
        signIn,
        signUp
    },
    data() {
        return {
            
            tab: null,
            items: [
                { tab: 'Sign Up'},
                { tab: 'Sign In'},
            ],
        }
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog');
        },
        
    },
    
}
</script>

<style scoped>
    /* .closeBtn{
        position: absolute;
        right: 0;
    }
    .tabs{
        position: relative;
        display: flex;
    }  */
</style>