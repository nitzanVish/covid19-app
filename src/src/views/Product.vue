<template>
    <v-container v-if="Object.keys(product).length > 0" class="product_container">
        
        <!-- Pop up while adding a product to cart -->
        <v-snackbar
            class="snackbar_style"
            v-model="snackbar"
            :timeout="timeout"
            :value="true"
            absolute
            right
            rounded="pill"
            top
            elevation="24"
            transition="scroll-x-reverse-transition"
        >
        {{ snackBarText }}
        

        <template v-slot:action="{ attrs }">
            <v-btn
                color="pink"
                text
                v-bind="attrs"
                :to="{name: 'cart'}"
                >
                VIEW CART
            </v-btn>
        </template>
        

        </v-snackbar>

        <v-card>

            <v-row class="product_details" :class="{'container_sm_screen': isSmallScreen, 'container_md_screen':isMdScreen}">
                <v-col cols="4">
                    <v-img  
                        :src="require(`@/${generateImgSrc}`)"
                        :height="imgHeight"
                    />
                </v-col>
                <v-col cols="6">
                    <div class="product_title" :class="{'sm_text': isSmallScreen, 'md_text':isMdScreen}">   
                        {{product.name}}
                    </div>
                    
                    <div class="font-weight-bold price" v-if="isAvailableProd">
                        {{product.price}} {{getCurrencySign(product.currency)}} 
                    </div>
                    
                    <v-select 
                        v-if="isAvailableProd"
                        :class="{'md_select_box': isMdScreen ,'sm_select_box': isSmallScreen}"
                        class="selectBox"
                        v-model="selectedQuantity"
                        label="Select Quantity"
                        :items="generateItemsArray"
                    >        
                    </v-select>

                        <div v-if="!isAvailableProd" class="sold_out">
                            Sold Out
                        </div>
                    
                        <v-row class="btn" v-if="isAvailableProd">

                            <v-btn 
                                color="success" outlined 
                                @click="addProduct()"
                            >
                            <!-- Show progress circle while adding a product-->
                                <v-progress-circular v-if="showProgressCircle"
                                    indeterminate
                                    :width="3"
                                    size="25"
                                ></v-progress-circular>

                                <span  v-if="!showProgressCircle">
                                    <v-icon left>fa-cart-plus</v-icon>
                                    Add to Cart
                                </span>

                            </v-btn>
                        </v-row>
                </v-col>
            </v-row>

        </v-card>

        <v-row>
            <v-spacer></v-spacer>
            <v-btn
                class="btn"
                    :to="{name:'products'}"
                >
                    Back to products
            </v-btn>
        </v-row>

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus"
            @close="closeDialog"
        >
        </myDialog>

    </v-container>
</template>

<script>
import {mapActions} from 'vuex';
import messages from '../services/messages';
import myDialog from '../components/dialog';
import responseHandel from '../services/responseHandler';
import screenSize from '../mixins/screenSize';

export default {
    mixins:[screenSize],
    data() {
        return {
            product:{},
            imagesFolder:'assets/images',
            selectedQuantity:1,
            showProgressCircle:false,
            snackBarText: 'snackBarText',
            snackbar:false,
            timeout: 5000,
            dialogStatus:false,
            dialogMessage:{
                header:'',
                body:'',
            },
        }
    },
    methods: {
        ...mapActions(['addProductToCart']),
        closeDialog(){
            this.dialogStatus = false;
        },
        async addProduct(){
            try {
                this.showProgressCircle= true;
                let newProduct = await this.addProductToCart({...this.product, selectedQuantity: this.selectedQuantity});
                this.showProgressCircle= false;
                
                if(newProduct.data.INTERNAL_STATUS_CODE == 200){
                    
                    let addedQty = await newProduct.data.DATA.addedQty;
                    
                    // Pop up text
                    this.snackBarText = (addedQty > 1) 
                        ? newProduct.data.DATA.addedQty + ' items were added to cart'
                        : newProduct.data.DATA.addedQty + ' item were added to cart';
                    
                    this.snackbar = true;
                } else {
                    // Show dialog in case of requested quantity is bigger than inventory
                    const message = responseHandel.handelError(newProduct);
                    this.dialogMessage.body = message.body;
                    this.dialogStatus = true;
                } 
            } catch(err){
                console.log(err);
                this.dialogStatus = true;
                this.dialogMessage.body = messages.body.tryAgain;
            }
        },
        getCurrencySign(currency){
            return (currency == 'dollar') ? '$' : currency;
        }, 

    },
    computed:{
        isAvailableProd(){
            return (this.product.quantity > 0 )? true : false;
        },
        generateImgSrc(){
            return `${this.imagesFolder}/${this.product.category_id.name}/${this.product.image}`;
        },
        imgHeight(){
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return '200px'
                case 'sm': return '200px'
                case 'md': return '300px'
                case 'lg': return '300px'
                case 'xl': return '300px'
            }
            return '300px'
        },
        generateItemsArray(){
            let items = [];
            for(let i = 1 ; i <= this.product.quantity; i++ ){
                items.push(i);
            }
            return items;
        },
    },
    async created() {

        if(this.$route.params.product_id){
            try{
                // get req product
                let product = await this.$store.dispatch('getProduct', this.$route.params.product_id);
                
                if(product.data.INTERNAL_STATUS_CODE == 200){
                    this.product = product.data.DATA;
                } else {
                    // if error occured, show dialog
                    this.dialogStatus = true;
                    this.dialogMessage.body = messages.body.tryAgain;
                }
            }
            catch(err){
                console.log('catch',err);
                this.dialogStatus = true;
                this.dialogMessage.body = messages.body.tryAgain;
            }
        } else {
            // missing product id, navigate to store page
            this.$router.push({name:'products'});
        }
    },
    components:{
        myDialog
    }
}
</script>

<style scoped>
    .image{
        height: 300px;
    }

    .product_details{
        align-items: center;
        justify-content: center;
    }

    .product_details > * {
        padding: 15px;
    }

    .product_container{
        width:80%;
        margin-top: 30px;
    }
    .container_sm_screen{
        width:100%;
    }
    .container_md_screen{
        width:100%;
    }
    .product_title{
        font-weight: 400;
        font-size: 25px;
        margin: 5px;
        color:rgb(94, 91, 91);
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .sm_text{
        font-size: 15px;
    }
    .md_text{
        font-weight: 300;
        font-size: 20px;
    }
    .price{
        color: rgb(180, 35, 35);
        margin: 5px;
        font-weight: 500;
        font-size: 30px;
    }
    .sold_out{
        color: rgb(180, 35, 35);
        font-weight: 500;
        font-size: 30px;
        padding: 10px;
    }

    .selectBox{
        margin-top: 20px;
        max-width: 30%;
    }
    .md_select_box{
        max-width: 40%;
    }
    .sm_select_box{
        max-width: 80%;
    }
    .btn{
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }
    .btn > *{
        /* width: 80%;  */
    }
    .sm_btn > *{
        /* width: 80%;  */
    }
    
    .snackbar_style{
        margin-top: 15px;
    }
</style>