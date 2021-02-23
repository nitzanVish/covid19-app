

<script>
import { Line } from 'vue-chartjs'
export default {

    extends: Line,
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
        }, {responsive: true, maintainAspectRatio: false})
    } 

}
</script>



