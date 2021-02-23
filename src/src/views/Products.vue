

<template>
    <v-container>
        <v-row v-if="!overlay">

            <!-- Filter products -->
            <v-col cols="12" md="3">
                <SideBar @filter="filter" />
            </v-col>

            <!--  Products list-->
            <v-col cols="12" md="9" v-if="!showMissingProductsCard">
                <v-row>
                    <v-col cols="12" sm="6" lg="4" 
                        v-for="(product, index) in filteredProducts" :key="index">
                        <verticalProductsList :product = "product"/>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Missing Products (after filtering products by category and price)-->
            <v-col v-if="showMissingProductsCard">
                <v-container>
                        <v-card>
                        <v-row>
                            <v-col cols="2" class="d-flex justify-end align-center" >
                                <v-icon right x-large>fa-search</v-icon>
                            </v-col>
                            <v-col>  
                            <v-card-title>Missing Products</v-card-title> 
                            <v-card-subtitle>{{missingProductMessage}}</v-card-subtitle>
                        </v-col>
                        </v-row>
                    </v-card>   
                </v-container>
            </v-col>
            
        </v-row>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus"
            :btnName = "btnName" 
            @close="closeDialog">
        </myDialog>

    </v-container>
</template>

<script>
import SideBar from '../components/SideBar';
import messages from '../services/messages';
import myDialog from '../components/dialog';
import verticalProductsList from '../components/Products/verticalProductsList';

export default {
    data(){
        return {
            overlay:true,
            products:[],
            productsAfterFilter:[],
            priceFilter:{},
            categoryFilter:{},
            requestedFilter: false,
            btnName:'',
            routerName:'',
            dialogStatus:false,
            dialogMessage:{
                header:'',
                body:'',
            },
        }
    },
    components:{
        SideBar,
        verticalProductsList,
        myDialog
    },
    computed:{
        // Filtered Products
        filteredProducts(){
            return this.requestedFilter ? this.productsAfterFilter : this.products;
        },
        //Missing Products (after filtering products by category and price)
        showMissingProductsCard(){
            return (this.productsAfterFilter.length == 0 && this.requestedFilter) ? true : false;
        },
        //Missing Products message
        missingProductMessage(){
            return messages.productMessages.body.MissingProductsAfterFiltering;
        }
    },
    methods: {
        closeDialog(){
            this.dialogStatus = false;
            if(this.routerName){
                this.$router.push({name:this.routerName});
            }
        },
        // Get requested filter
        filter(filter){
            this.requestedFilter = true;
            if(Object.prototype.hasOwnProperty.call(filter,'price')){
                this.priceFilter = filter.price;
            }
            if(Object.prototype.hasOwnProperty.call(filter,'category')){
                this.categoryFilter = filter.category;
            }
            
            this.filterProducts();
        },
        //Use this filter to filter products
        filterProducts(){
            this.productsAfterFilter = [];
            let compatiblePrice;
            let compatibleCategory;

            this.products.forEach(product => {
                //filter products by price
                if(Object.keys(this.priceFilter).length > 0){
                    compatiblePrice = this.isCompatiblePrice(product, this.priceFilter);
                }
                //filter products by category
                if(Object.keys(this.categoryFilter).length > 0){
                    compatibleCategory = this.isCompatibleCategory(product, this.categoryFilter);
                }
                //if requested price and category are matching to current product 
                //this product will be added to 'productsAfterFilter' array

                if( (Object.keys(this.priceFilter).length > 0 && compatiblePrice || Object.keys(this.priceFilter).length == 0) 
                    && (Object.keys(this.categoryFilter).length > 0 && compatibleCategory || Object.keys(this.categoryFilter).length == 0)
                ){
                            this.productsAfterFilter.push(product);
                }
            });
        },
        isCompatiblePrice(product, price){
                if(price.lowerBoundary <= product.price 
                && (price.upperBoundary.length == 0 || product.price <= price.upperBoundary )
                ){
                    return true;
                } 
                return false;
        },
        isCompatibleCategory(product, category){
            if(!category.value || category.value == product.category_id.name){
                return true;
            }
            return false;
        },
    },
    async created(){
        try{ 
            this.productsAfterFilter = [];
            // Get products
            let products = await this.$store.dispatch('dbProducts');
            this.overlay= false;

            if(products.data.INTERNAL_STATUS_CODE == 200){
                this.products = products.data.DATA;
        
            } else {
                this.products = [];
                this.dialogStatus = true;
                this.dialogMessage.header = messages.header.succeeded;
                this.dialogMessage.body = messages.productMessages.body.MissingProducts;
                this.routerName = 'HomePage';
                this.btnName = 'Home Page';
            }
        } catch(err){
                console.log('catch',err);
                this.dialogStatus = true;
                this.dialogMessage.header = messages.header.failed;
                this.dialogMessage.body = messages.body.tryAgain;
                this.routerName = 'HomePage';
                this.btnName = 'Home Page';
        }

    }
    
}
</script>