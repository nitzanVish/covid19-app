<template>
    <v-container>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay> 

        <!-- Corona status table in all countries -->
        <v-card v-if="showTable">
            <v-card-title>
                {{title}}
            </v-card-title>

            <v-card-subtitle>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field
                        class="searchInput"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-row>
            </v-card-subtitle>

            <v-data-table
                :headers="headers"
                :items="coronaData"
                :items-per-page="5"
                class="elevation-1"
                :search="search"
            >
                <template v-slot:item.critical="{ item }">
                    <v-chip
                        :color="getColor(item.critical)"
                        dark
                    >
                        {{ item.critical }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-card>

        
    </v-container>
</template>

<script>
import axios from '../../services/axios';

export default {
    data() {
        return {
            title:'Corona Virus Cases',
            search: '',
            overlay: true,
            showTable:false,
            coronaData:[],
            headers: [
                {
                    text: 'Country Name',
                    sortable: true,
                    value: 'name',
                },
                { text: 'Active Cases', value: 'active_cases' },
                { text: 'Critical Cases', value: 'critical' },
                { text: 'Total Cases', value: 'total_cases' },
                { text: 'Total Deaths', value: 'deaths' },
                { text: 'Total Recovered', value: 'recovered' },
                
            ],

        }
    },
    methods: {
        // Get Corona status in all countries
        getCoronaStatus(){
            axios({
                method: 'get',
                url: `/api/coronaAllCountries`,
            }).then(res => {
                if(res.data.status == 200){
                    this.coronaData = Object.values(res.data.data.regions);
                    this.showTable = true;
                    this.overlay = false;
                }
                
            }).catch(err=>{
                console.log('corona err',err);
                this.showTable = false;
            })
        },
        getColor(deathNum) {
            return deathNum > 200 
                ? 'red' 
                : (deathNum > 100 ? 'orange' : 'green' );
        },
    },
    created() {
        this.getCoronaStatus();
    },
}
</script>
<style scoped>
    .searchInput{
        max-width: 30%;
    }
</style>