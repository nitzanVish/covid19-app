<script>
import { Bar } from 'vue-chartjs'
export default {

    extends: Bar,
    props:{
        data:{
            type:Array,
            require:true
        },
        labels:{
            type:Array,
            require:true
        },
        chartTitle:{
            type:String,
            require:true
        }
    },
    mounted () {
        this.renderChart({
            labels: this.labels,
            datasets: [
                {
                label: this.chartTitle,
                backgroundColor: '#f87979',
                data: this.data
                }
            ]
        })
    } 

}
</script>



