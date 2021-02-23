<template>
    <v-container v-if="showCoronaStatus" class="corona_status_container">

        <v-row class="corona_title">
            {{title}}
        </v-row>
        <v-row>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                
                :to="{name: 'coronaStatusTable'}"
                small text
                
            >
                {{btnTitle}} 
            </v-btn>
        </v-row>

        <v-row>

            <v-col lg="3" md="3"  cols="12" v-for=" (data, i) in cardData" :key="i">
                <v-card>
                    <v-card-title>{{data.title}}</v-card-title>
                    <v-card-title class="card_value">{{data.value}}</v-card-title>
                </v-card>
            </v-col>

        </v-row> 
    </v-container>
    
</template>

<script>
import axios from '../../services/axios';

export default {
    data() {
        return {
            totalCases:'',
            activeCases:'',
            deaths:'',
            critical:'',
            countryName: '',
            showCoronaStatus: false,
            btnTitle:'View all countries'
        }
    },
    methods: {
        setCoronaData(data){
            this.totalCases = data.total_cases;
            this.activeCases = data.active_cases;
            this.deaths = data.deaths;
            this.critical = data.critical;
            this.countryName = data.countryNameByIp;
        },
        // corona Status By Ip
        getCoronaStatus(){
            axios({
                method: 'get',
                url: `/api/coronaStatusByIp`,
            }).then(res => {
                if(res.data.DATA.status == 200){
                    this.setCoronaData(res.data.DATA.data.summary);
                    this.showCoronaStatus = true;
                }
                
            }).catch(err=>{
                console.log('corona err',err);
                this.showCoronaStatus = false;
            })
        }

    },
    created() {
        this.getCoronaStatus();
    },
    computed:{
        cardData(){
            return [
                {title:'Total cases', value: this.totalCases},
                {title:'Active cases', value:this.activeCases},
                {title:'Deaths', value:this.deaths},
                {title:'Critical', value: this.critical}
            ]
        },
        title(){
            return `Coronavirus Cases In ${this.countryName}`;
        }
    
    }

    
}
</script>

<style scoped>
    .corona_title{
        margin-top: 20px;
        font-size: 1.5em;
        font-weight: 300;
    }
    .card_value{
        font-weight: 900!important;
        font-size: x-large;
    }
    .corona_status_container > * {
        padding: 10px;
    }

    .btn_title{
        font-weight: 300;
        font-size: 0.875em;
    }
</style>