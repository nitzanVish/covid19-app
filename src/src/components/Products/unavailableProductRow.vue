<template>
    <v-row class="align-center unavailable_item">

        <v-col cols="1">
            <td></td>
        </v-col>

        <!-- Image -->
        <v-col cols="4">
            <td>
                <v-row class="item center" >
                    <v-col cols="5" class="image_wrapper" >
                        <v-img
                            :src="require(`@/${generateImgSrc(item)}`)"
                            class="image"
                        />
                        <div class="sold_out">{{soldOutMessage}}</div>
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

        <!-- Price -->
        <v-col cols="2" class="center"> 
            <td>
                {{ item.price }} {{getCurrencySign(item.currency)}}
            </td>
        </v-col>

        <!-- Qty -->
        <v-col cols="3" class="center">
            <td>{{item.selectedQuantity}}</td>
        </v-col>

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
import myDialog from '../dialog';
import responseHandel from '../../services/responseHandler';

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
            imagesFolder:'assets/images',
            soldOutMessage:'Sold Out',
            showProgressCircle: false,
            dialogStatus:false,
            dialogMessage:{
                header:'',
                body:'',
            }
        }
    },
    methods: {
        ...mapActions(['removeProductStore', 'filterProducts']),
        // Get Currency sign
        getCurrencySign(currency){
            return (currency == 'dollar') ? '$' : currency;
        },
        // Get Img
        generateImgSrc(item){
            return `${this.imagesFolder}/${item.category_id.name}/${item.image}`;
        },
        closeDialog(){
            this.dialogStatus = false;
        },
        // Delete product from cart 
        async deleteProduct(product){

            this.showProgressCircle = true;

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

    .unavailable_item{
        color: rgba(153,153,153,.4);
    }
    .image_wrapper{
            max-width: 100%;
    }

    .image{
        width: 150px;
        height: 200px;
        padding: 0;
        opacity: 0.5;
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

    .sold_out{
        position: absolute;
        bottom: 0;
        background: rgba(59, 59, 59, 0.705);
        padding: 6px 16px;
        line-height: 1;
        color: #fff;
        width: 150px;
        text-align: center;
    }

    .center{
        display: flex;
        justify-content: center;
    }
</style>