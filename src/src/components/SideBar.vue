<template>

    <v-container>
        <!-- Filter products by category and price -->
        <!-- display on xs and sm screens -->
        <v-expansion-panels
            v-model="panel"
            multiple
            v-if="isCollapsedFilter" 
        >
                <v-expansion-panel>
                    <v-expansion-panel-header> Category 
                        <span class="font-weight-bold" v-if="panelCategoryHeader">: {{ panelCategoryHeader}}</span> 
                    </v-expansion-panel-header>

                    <v-expansion-panel-content  
                        v-for="(category,index) in categories"
                        :key="index"
                    >
                    <v-radio-group v-model="categoryFilter">
                        <v-radio @change="filterChanged({category: category})"
                            :label="category.message"
                            :value="index"
                        ></v-radio>
                    </v-radio-group>

                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-header> Price 
                        <span class="font-weight-bold" v-if="panelPriceHeader">: {{ panelPriceHeader}}</span> 
                    </v-expansion-panel-header>
                    <v-expansion-panel-content  
                        v-for="(price,index) in prices"
                        :key="index"
                    >
                    <v-radio-group v-model="priceFilter">
                        <v-radio @change="filterChanged({price: price})"
                            :label="price.message"
                            :value="index"
                        ></v-radio>
                    </v-radio-group>

                    </v-expansion-panel-content>
                </v-expansion-panel>

        </v-expansion-panels>

        <!-- display on md and up screens -->
        <v-card v-if="!isCollapsedFilter" :elevation="4">                
            <v-card-text>
                <v-card-text class="font-weight-bold">Price</v-card-text>
                <v-radio-group v-model="priceFilter">
                    <v-radio
                        @change="filterChanged({price: price})"
                        v-for="(price,index) in prices"
                        :key="index"
                        :label="price.message"
                        :value="index"
                    ></v-radio>
                </v-radio-group>
            </v-card-text>

            <v-card-text>
                <v-card-text class="font-weight-bold">Category</v-card-text>
                <v-radio-group v-model="categoryFilter">
                    <v-radio
                        @change="filterChanged({category: category})"
                        v-for="(category,index) in categories"
                        :key="index"
                        :label="category.message"
                        :value="index"
                    ></v-radio>
                </v-radio-group>
            </v-card-text>
        </v-card>
        
    </v-container>

</template>

<script>
export default {
    name:'SideBar',
    data() {
        return {
            prices: [
                {upperBoundary:'', lowerBoundary:0, message: 'All'},
                {upperBoundary:25, lowerBoundary: 0, message: 'Under $25'},
                {upperBoundary:'100', lowerBoundary:'25', message: '$25 to $100'},
                {upperBoundary:'500', lowerBoundary:'100', message: '$100 to $500'},
                {upperBoundary:'', lowerBoundary:'500', message: '$500 & Above'},
            ],
            priceFilter: 0,
            categoryFilter:0,
            panel:[],
            categories:[
                {message: 'All', value: 0 },
                {message:'Gloves', value:'gloves'},
                {message:'Thermometers', value:'thermometers'},
                {message:'Protective Suits', value:'suits'},
                {message:'Masks', value:'masks'},
                {message:'Hand sanitizers', value:'gels'},
                
            ]
            
        }
    },
    computed: {
        isCollapsedFilter(){
            return !this.$vuetify.breakpoint.mdAndUp;
        },
        panelPriceHeader(){
            return this.prices[this.priceFilter].message;
        },
        panelCategoryHeader(){
            return this.categories[this.categoryFilter].message;
            
        }

    },
    methods: {
        closePanels(){
            this.panel = [];
        },
        filterChanged(filter){
            if(this.isCollapsedFilter){
                this.closePanels();
            }
            
            //Filter products by price and category
            this.$emit('filter', filter);
        }
    },
}
</script>

<style>


</style>
