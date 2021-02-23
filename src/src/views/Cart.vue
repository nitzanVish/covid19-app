
<template>
    <v-container>
        <v-row >
            <!-- User's products table -->
            <v-col cols="12" md="9" >
                <productsTable/>
            </v-col>

            <!-- Order Summary -->
            <v-col cols="12" md="3" order="first" order-md="last">
                <PaymentDetails @showLogin ="showLogin"/>
            </v-col>

        </v-row>

        <signInUpDialog :dialogStatus = "dialogStatus" @closeDialog = "closeDialog"/>
        
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
    
</template>

<script>
import PaymentDetails from '../components/PaymentDetails';
import productsTable from '../components/Products/productsTable';
import signInUpDialog from './signInUpDialog';
import {bus} from '../main.js';

export default {
    components:{
        PaymentDetails,
        productsTable,
        signInUpDialog
    },
    data() {
        return {
            overlay:false,
            dialogStatus:false,
        }
    },
    methods: {
        showLogin(){
            this.dialogStatus = true;
        },
        closeDialog(){
            this.dialogStatus = false;
        },

    },
    created (){
        //Adding loader on total price while changing prod qty
        bus.$on('overlayCart', (data) => {
            this.overlay = data;
        });
    },
    computed:{

    }

    
}

</script>



