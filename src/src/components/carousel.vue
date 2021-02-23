<template>
    
    <v-carousel 
        v-model="model"
        cycle
        :height="carouselHeight"
    >
        <v-carousel-item
            v-for="(product, i) in products"
            :key="i"
            
        >
        <v-sheet
            height="100%"
            tile
        >
            <v-row
                class="fill-height carouselItem"
                
            >
                <v-img
                    class="image"
                    :lazy-src="product.image"
                    :max-height="imageHeight"
                    max-width="300px"
                    :src="require(`@/${generateImgSrc(product)}`)"
                ></v-img>
                <div class="name">
                    {{product.name}}
                    
                </div>
            </v-row>
            
        </v-sheet>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
import screenSize from '../mixins/screenSize';

export default {
    mixins:[screenSize],
    props:{
        products:{
            require: true,
            type: Array
        }
    },
    data() {
        return {
            model: 0,
            imagesFolder:'assets/images',
            height:400
        }
    },
    methods: {
        generateImgSrc(item){
            return `${this.imagesFolder}/${item.category_id.name}/${item.image}`;
        },
    },
    computed:{
        carouselHeight(){
            return (this.isSmallScreen) ? 400 : 500;
        },
        imageHeight(){
            return (this.isSmallScreen) ? '250px' : '350px';
        }
    }
}
</script>

<style scoped>
.carouselItem{
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.name{
    color: white;
    font-weight: 200;
    font-size:20px;
}
</style>