<template>
    <v-container class="cart" >

        <v-simple-table
            v-if="showConatiner"
            fixed-header
        >
            <template v-slot:default>
                <thead>
                    <tr>
                        <v-row>
                            <v-col cols="1" >
                                <th></th>
                            </v-col>
                            <v-col cols="4" class="center">
                                <th> Item </th>
                            </v-col>
                            <v-col cols="2" class="center">
                                <th> Price </th>
                            </v-col>
                            <v-col cols="3" class="center">
                                <th> Quantity </th>
                            </v-col>
                            <v-col cols="2" class="center">
                                <th> Total </th>
                            </v-col>
                        </v-row>
                    </tr>
                </thead>

                <!-- Sold Out products -->
                <tbody 
                    v-if="getUnAvailableProducts.length > 0" 
                    class="tableBody"
                >
                    <tr v-for="item in getUnAvailableProducts" :key="item._id">
                        <unavailableProd :item = "item"/>
                    </tr>
                </tbody>

                <!-- Available products -->
                <tbody 
                    v-if="getAvailableProducts.length > 0"
                    class="tableBody"
                    >
                    <tr v-for="item in getAvailableProducts" :key="item._id">
                        <tableRow :item = "item"/>
                    </tr>
                </tbody>

            </template>
        </v-simple-table>

        <!-- Show this card in case of empty cart -->
        <v-card v-if="showCard">
            <v-row>
                <v-col cols="2" class="d-flex justify-end align-center" >
                    <v-icon right x-large>fa-cart-plus</v-icon>
                </v-col>
                <v-col> 
                <v-card-title>{{cardBody}}</v-card-title>
            </v-col>
            </v-row>
        </v-card>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay> 

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus"
            @close="closeDialog"
        >
        </myDialog>

    </v-container>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import tableRow from './availableProductTableRow';
import unavailableProd from './unavailableProductRow';
import messages from '../../services/messages';
import myDialog from '../dialog';
import {bus} from '../../main.js';

export default {
    data(){
        return{
            showConatiner: false,
            card: false,
            cardBody:messages.cartMessages.body.emptyCart,
            overlay:true,
            dialogStatus:false,
            dialogMessage:{
                header:'',
                body:'',
            }
        }
    },
    computed: {
        ...mapGetters(['getUnAvailableProducts', 'getAvailableProducts']),
        // Show this card in case of empty cart
        showCard(){
            return (this.getAvailableProducts.length < 1 && this.getUnAvailableProducts.length < 1
            && this.showConatiner)
            || this.card
            ? true
            : false;
        }
    }, 
    methods: {
        ...mapActions(['filterProducts', 'resetCart', 'changeBoxItems']),
        // Get user cart
        async getCart(){
            bus.$emit('overlayCart', true);
            // Clean cart's values
            this.resetCart();
            let cart = await this.$store.dispatch('getDbCart');
            this.overlay= false;
            if(cart.data.INTERNAL_STATUS_CODE == 200){
                //sort product's array to available/unavailable arrays
                this.filterProducts();
                this.showConatiner = true;
                bus.$emit('overlayCart', false);
                
            } else if (cart.data.INTERNAL_STATUS_CODE == 400){
                this.showConatiner = true;
                bus.$emit('overlayCart', false);
                // Show this card in case of empty cart
                this.card = true;
            } else{
                this.showConatiner = true;
                bus.$emit('overlayCart', false);
                this.dialogStatus = true;
                this.dialogMessage.header = '';
                this.dialogMessage.body = messages.body.tryAgain;
            }
        },
        closeDialog(){
            this.dialogStatus = false;
        },

    },
    components:{
        tableRow,
        myDialog,
        unavailableProd
    },
    async created(){
        this.getCart();
         // Delete items from check box 
        this.changeBoxItems([]);
    }  
}
</script>

<style >
    thead tr{
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 60px;
    }
    .tableBody {
        margin: 10px;
        border-bottom: 1px solid #e5e5e5;
        /* border: 1px solid pink; */
    }
    tbody tr{
        height: 250px ;
        padding: 0;
        
    }
    .center{
        display: flex;
        justify-content: center;
    }
    /* .table{
      
        align-items: center;
        align-content: center;
    } */
    /* v-row{ */
        /* margin-top: 5px;
        margin-bottom: 5px; */
        /* align-content: center; */
    /* } */
</style>
