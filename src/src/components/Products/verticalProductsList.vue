
<template>
<v-container>

    <v-card>
        <v-img  
            :src="require(`@/${generateImgSrc(product)}`)"
            height= "200px"
        />
        
        <div
            class="font-weight-thin textStyle" 
        >   
            <div>{{product.name}}</div>
        </div>
        
        <div class="font-weight-bold price">
            {{product.price}} {{getCurrencySign(product.currency)}} 
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                color="success" outlined 
                @click="moreDetails(product)"
            >
                More Details
            </v-btn>


            
        </v-card-actions>
    
    </v-card>

</v-container>


</template>

<script>

export default {
    props:{
        product:{
            type:Object,
            require:true
        },
    },
    methods: {
        generateImgSrc(){
            return `${this.imagesFolder}/${this.product.category_id.name}/${this.product.image}`;
        },

        getCurrencySign(currency){
            return (currency == 'dollar') ? '$' : currency;
        }, 
        moreDetails(product){
            this.$router.push({name:'product', params: { product_id: product._id }});
        }
    },
    computed: {
    },
    data(){
        return{
            imagesFolder:'assets/images',
            
        }
    },

}
</script>

<style scoped>

    .textStyle{
        margin: 5px;
        color:rgb(94, 91, 91);
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .price{
        color: rgb(180, 35, 35);
        margin: 5px;
    }
</style>
