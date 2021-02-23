<template>
    <v-container v-if="showChart">
    
        <v-row>
            <v-col lg="6" md="6" cols="12">

            <v-card class="middle">
                <v-card-title>Daily Deaths</v-card-title>
                <lineChart 
                    :data ="deathsChanges.data" 
                    :labels="deathsChanges.labels"
                    :chartTitle="deathsChanges.title"
                />
            </v-card>

            </v-col>

            <v-col lg="6" md="6" cols="12">
                <v-card class="middle">
                    <v-card-title>Daily New Cases</v-card-title>
                    <barChart 
                        :data ="totalCasesChanges.data" 
                        :labels="totalCasesChanges.labels"
                        :chartTitle="totalCasesChanges.title"
                    />
                </v-card>
            </v-col>
        </v-row>
        
    </v-container>
    
</template>

<script>
import axios from '../../services/axios';
import lineChart from '../Chart/line';
import barChart from '../Chart/bar';

export default {
    data(){
        return{
            width: 400,
            height:200,
            deathsChanges: {
                data:[],
                labels:[],
                title:'Daily Deaths'
            },
            totalCasesChanges:{
                data:[],
                labels:[],
                title:'Daily Cases'
            },
            showChart: false,
        }
    },
    methods: {
        // Get Last Week status (by ip)
        getLastWeekStatus(){
            axios({
                method: 'get',
                url: `/api/coronaLastWeekStatus`,
            }).then(res => {
                if(res.data.status){
                    this.setCoronaData(res.data.data);
                }
                
            }).catch(err=>{
                console.log('corona err',err);
                this.showChart = false;
            })
        },
        // calculate deaths and total cases delata for charts
        setCoronaData(data){
            
            const dates = Object.keys(data);
            let deathDelta = 0;
            let totalCasesDelta = 0;
            for(let i = dates.length-2; i >= 0 ; i-- ){
                deathDelta = data[dates[i]].deaths - data[dates[i+1]].deaths;
                totalCasesDelta = data[dates[i]].total_cases - data[dates[i+1]].total_cases;
    
                this.deathsChanges.data.push(deathDelta);
                this.deathsChanges.labels.push(dates[i]);
                
                this.totalCasesChanges.data.push(totalCasesDelta);
                this.totalCasesChanges.labels.push(dates[i]);

            }
            this.showChart = true;
        }
    },
    created() {
        this.getLastWeekStatus();
    },
    components:{
        barChart,
        lineChart
    },

}
</script>

<style scoped>
.middle{
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 10px;
}
</style>
