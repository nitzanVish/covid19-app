<template>
    <v-row class="align-center">
        <!-- Add to check box -->
        <v-col cols="1" class="center">
            <td>
                <v-checkbox
                    @click="checkBoxItems(item)"
                    v-model="cartCheckBox"
                    :value="item"
                    multiple
                    color="red darken-3"
                ></v-checkbox>
                
            </td>
        </v-col>
        <!-- Image -->
        <v-col cols="4">
            <td>
                
                <v-row class="item center" >

                    <v-col cols="5" class="image_wrapper">
                        <v-img
                            :src="require(`@/${generateImgSrc(item)}`)"
                            class="image"
                        />
                    </v-col>

                    <v-col cols="6" class="prod_name"> 
                        {{ item.name }}
                        <div class="icon">

                            <v-progress-circular 
                                v-if="showProgressCircle"
                                indeterminate
                                :width="3"
                                size="25"
                                
                            ></v-progress-circular>
                        
                            <v-icon  
                                v-if="!showProgressCircle"
                                @click="deleteProduct(item)"
                            >
                                fa-trash
                            
                            </v-icon>
                        </div>
                    </v-col>
                </v-row> 
            </td>
        </v-col>

        <!-- price -->
        <v-col cols="2" class="center"> 
            <td>
                {{ item.price }} {{getCurrencySign(item.currency)}}
            </td>
        </v-col>

        <!-- Qty -->
        <v-col cols="3" class="center">
            <td>
                <v-row>
                    <v-col cols="3" @click="minusIcon(item.selectedQuantity)">
                        <v-icon>fa-minus-circle</v-icon>
                    </v-col>
                    
                    <v-col cols="2" >
                            {{ qty }}
                    </v-col>
                    <v-col cols="5" @click="plusBtn(item.selectedQuantity)">
                            <v-icon>fa-plus-circle</v-icon>
                    </v-col>
                </v-row>
                
                <v-row>
                    <v-col cols="12" v-if="itemMessage" class="message">{{itemMessage}}</v-col>
                </v-row>
            </td>
        </v-col>

        <!-- Currency -->
        <v-col cols="2" class="center">
            <td>
                {{ item.selectedQuantity * item.price }} 
                {{getCurrencySign(item.currency)}}
            </td>
        </v-col>

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus"
            @close="closeDialog"
        >
        </myDialog>
    </v-row>

    
</template>

<script>
import {mapActions} from 'vuex';
import axios from '../../services/axios';
import myDialog from '../dialog';
import responseHandel from '../../services/responseHandler';
import { bus } from '../../main.js';

export default {
    components:{
        myDialog,
    },
    props:{
        item:{
            type:Object,
            require:true
        },
    },
    data() {
        return {
            qty: this.item.selectedQuantity,
            imagesFolder:'assets/images',
            cartCheckBox:[],
            showProgressCircle: false,
            dialogStatus:false,
            dialogMessage:{
                header:'',
                body:'',
            }
        }
    },
    computed:{
        itemMessage(){
            return (this.qty == this.item.quantity) || this.item.message
            ? `Only ${this.item.quantity} items are available`
            : '';
        }
    },
    methods: {
        ...mapActions(['removeProductStore', 'filterProducts','addToCheckBoxItems', 'deleteFromCheckBoxItems']),
        // reduce product's qty
        minusIcon(){
            if(this.qty > 1 ){
                this.qty -= 1;
                this.updateItemQty();
            }
        },
        // Add to product's qty
        plusBtn(){
            if(this.qty < this.item.quantity ){
                this.qty += 1;
                this.updateItemQty();
            }
        },
        // Update product's qty
        updateItemQty(){
            bus.$emit('progressOnOrderDetails', true);
            setTimeout(() => {
                if(this.item.selectedQuantity != this.qty){
                    //save the current qty 
                    this.item.oldQty = this.item.selectedQuantity;
                    //new req qty
                    this.item.selectedQuantity = this.qty;
                    axios({
                        method: 'post',
                        url: `api/cart/product`,
                        data: {product: this.item} 
                    })
                    .then((response) => {
                        bus.$emit('progressOnOrderDetails', false);
                        if(response.data.INTERNAL_STATUS_CODE != 200){
                            // If error occured and prod qty wasn't changed
                            this.item.selectedQuantity = this.item.oldQty;
                            this.qty = this.item.oldQty;
                            
                            const errMessage = responseHandel.handelError(response);
                            this.dialogStatus = true;
                            this.dialogMessage.header = '';
                            this.dialogMessage.body = errMessage.body;
                        } else {
                            //If prod qty was changed, update 'oldQty' prop
                            this.item.oldQty = this.item.selectedQuantity;
                        }
                        
                    });
                }

            }, 3000);
        },

        closeDialog(){
            this.dialogStatus = false;
        },
        // Add to check box 
        checkBoxItems(){
            if(this.cartCheckBox.length > 0){
                //add to array
                this.addToCheckBoxItems(this.item);
            } else {
                //delete from array
                this.deleteFromCheckBoxItems(this.item);
            }
        },
        getCurrencySign(currency){
            return (currency == 'dollar') ? '$' : currency;
        },
        //Get img
        generateImgSrc(item){
            return `${this.imagesFolder}/${item.category_id.name}/${item.image}`;
        },

        // delete product from cart 
        async deleteProduct(product){

            this.showProgressCircle = true;

            // delete product from check box items
            this.deleteFromCheckBoxItems(this.item);
            
            let cart = await this.removeProductStore(product);
            this.showProgressCircle = false;
        
            if(cart.data.INTERNAL_STATUS_CODE == 200){
                //sort product's array to available/unavailable arrays
                await this.filterProducts();
            } else {
                const errMessage = responseHandel.handelError(cart);
                this.dialogStatus = true;
                this.dialogMessage.header = '';
                this.dialogMessage.body = errMessage.body;
            }
        },
    }
}
</script>

<style scoped>
    .image_wrapper{
        max-width: 100%;
    }
    .image{
        width: 150px;
        height: 200px;
    }
    .icon {
        position: absolute;
        bottom: 0;
        left: 5px;
    }
    .prod_name{
        position: relative;
    }
    .item{
        flex-wrap: nowrap;
    }
    .message{
        flex-wrap: nowrap;
        color:red;
        font-size:x-small;
        padding-top: 4px;
        position: absolute;
    }
    .selectedQuantity{
        font-size: 25px;
        font-weight: bolder;
        color:tomato
    }
    .center{
        display: flex;
        justify-content: center;
    }
</style>