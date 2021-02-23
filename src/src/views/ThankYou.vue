
<template>
<div>
        <v-card class="container">
            <v-card-title class="title">Thank you!</v-card-title>
            <v-card-subtitle class="sub_title">Your order will be shipped soon.</v-card-subtitle>
            <v-card-title class="order_id">Order number : 
                <span>{{getOrder._id}}</span>
            </v-card-title>
        </v-card>

</div>
</template>

<script>
import {mapGetters} from 'vuex';

export default{
    computed: {
        ...mapGetters(['getOrder']),
    },

}
</script>

<style scoped>
.container > *{
    margin: 10px;
}
.title{
    font-weight: 400;
    font-size: 25px;
}
.sub_title{
    font-weight: 200;
    font-size: 20px;
}

.order_id{
    font-weight: 400;
    font-size: 25px;
}
.order_id span{
    color: rgb(128, 48, 48);
    font-weight: 500;
    font-size: 40px;
}
</style>