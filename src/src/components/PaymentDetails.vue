<template>
    <v-container class="orderConatiner">
        <v-card
            elevation="6" 
        >
        <div class="mainOrderSummary">
            <v-row class="orderTitle">
            <h3>
                Order Summary
            </h3>
            </v-row>
            <v-divider></v-divider>
            <v-row v-if="overlayPrice" class="price_progress">
                <v-progress-circular 
                        indeterminate
                        :width="3"
                        size="25"
                ></v-progress-circular>
            </v-row>
            <v-row class="totalPrice" v-if="!overlayPrice">
                <v-col cols="6" class="font-weight-bold">Total</v-col>
                <v-col cols="6" class="price">${{getTotalPrice}}</v-col>
            </v-row>
            </div>

            <v-row class="btn">
                    <v-btn
                        @click="order"
                        :disabled ="!isValid"
                    >
                        CHECKOUT ({{getTotalItems}})
                    </v-btn>
            </v-row>
        </v-card>

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus"
            @close = "closeDialog"
        >
        </myDialog>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

            
    </v-container>
</template>

<script>

    import { mapActions, mapGetters} from 'vuex';
    import myDialog from '../components/dialog';
    import responseHandel from '../services/responseHandler';
    import { bus } from '../main.js';

    export default{
        data(){
            return{
                dialogStatus:false,
                dialogMessage:{
                    header:'',
                    body:'',
                },
                overlay:false,
                overlayPrice:false,
            }
        },
        computed:{
            ...mapGetters(['getTotalPrice', 'getCheckBoxItems','getTotalItems','isLoggedIn']),
            isValid(){
                return (this.getTotalPrice > 0) ? true : false;
            }
        },
        methods: {
            ...mapActions(['deleteCart', 'updateCart', 'updateProductsQty']),
            showErrorMessage(data){
                const message = responseHandel.handelError(data);
                this.dialogStatus = true;
                this.dialogMessage.header = '';
                this.dialogMessage.body = message.body;
            },
            closeDialog(){
                this.dialogStatus = false;
            },
            //Add new order
            async order(){

                if(!this.isValid || this.getCheckBoxItems.length < 1){
                    return;
                }
                //Show sign up/sign in form in case of user isn't logged in
                if(!this.isLoggedIn){
                    this.$emit('showLogin');
                    return;
                }

                this.overlay = true;

                // add a new order
                const newOrder = await this.$store.dispatch(
                    'addOrder',
                    {products:this.getCheckBoxItems, total_price: this.getTotalPrice}
                );
                
                this.overlay = false;

                if(newOrder.data.INTERNAL_STATUS_CODE == 200){
                    this.$router.push({name:'thankYou'});

                    // update product's inventory
                    let products = await this.updateProductsQty(this.getCheckBoxItems);

                    //update user cart
                    let updatedCart = await this.updateCart(this.getCheckBoxItems);

                    if(updatedCart.data.INTERNAL_STATUS_CODE != 200 || products.data.INTERNAL_STATUS_CODE != 200 ){
                        console.log('error appeared while ordering');
                    } 
                    
                } else {
                    //unavailable order
                    this.showErrorMessage(newOrder);
                }
            }
        },
        components:{
            myDialog,
        },
        created (){
            //Adding loader on total price while changing prod qty
            bus.$on('progressOnOrderDetails', (data) => {
                
                this.overlayPrice = (data && this.getTotalPrice) > 0 ? true: false;
            });
        }
    }
</script>

<style scoped>

.orderTitle{
    align-items: center;
    justify-content: center;
    padding-top: 10px;
}
.btn{
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
}
.btn > * {
    width: 90%;
}
.mainOrderSummary{
    min-height: 150px;
}
.price{
    font-size: 24px;
    font-weight: 700;
    text-align: end;
}
.totalPrice{
    align-items: center;
    padding: 0px 20px;
}
.price_progress {
    align-items: center;
    justify-content: center;
}
/* .orderConatiner{
    position: fixed;
    width: 50%;
} */
</style>