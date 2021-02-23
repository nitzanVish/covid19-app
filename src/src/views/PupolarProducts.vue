
<template>
    <v-container>
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <div v-if="!overlay">
            <v-row>
                <v-col >
                    <h2>
                        Popular Products 
                        <v-btn 
                            color="primary" small text
                            :to="{name:'products'}"
                        >   Shop Now
                        </v-btn>
                    </h2>
                </v-col>
            </v-row>

            <v-row>
                <carousel :products="pupolarProducts" class="carousel"></carousel>
            </v-row>
        </div>

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus" 
            @close="closeDialog">
        </myDialog>

    </v-container>
</template>

<script>

import messages from '../services/messages';
import myDialog from '../components/dialog';
import carousel from '../components/carousel';

export default {
    data(){
        return {
            overlay:true,
            pupolarProducts:[],
            dialogStatus:false,
            dialogMessage:{
                header:'',
                body:'',
            },
        }
    },
    computed: {
        // isLoggedInUser(){
        //     return this.$store.getters.isLoggedIn;
        // }
    },
    methods: {
        // viewAll(){
        //     const routeName = this.isLoggedInUser ? 'products' : 'signIn';
        //     this.$router.push({name: routeName});
        // },
        closeDialog(){
            this.dialogStatus = false;
        }
    },
    components:{
        myDialog,
        carousel
    },
    async created(){
        let products = await this.$store.dispatch('dbProducts');
        this.overlay= false;

        if(products.data.INTERNAL_STATUS_CODE == 200){
            this.pupolarProducts = products.data.DATA.filter((product)=> {
                return product.favorite;
            });
            console.log(this.pupolarProducts);
        } else {
            this.pupolarProducts = [];
            this.dialogStatus = true;
            this.dialogMessage.header = messages.header.succeeded;
            this.dialogMessage.body = messages.productMessages.body.MissingProducts;
        }
        
    }
}
</script>
<style scoped>
.carousel{
    /* height: 400px !important; */
}
</style>