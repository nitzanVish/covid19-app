
<template>
        <v-dialog
            v-model="dialogStatus"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">
                    {{dialogMessage.header}}
                </v-card-title>
                <v-card-text>{{dialogMessage.body}}</v-card-text>
                <v-card-actions>
                    <slot name="footer">
                    <v-spacer></v-spacer>
                    <v-btn
                        link
                        color="warning" outlined 
                        @click="close"
                    >
                        {{btnName}} 
                    </v-btn>
                    </slot>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>

export default{
    props:{
        dialogMessage:{
            type:Object,
            require:true
        },
        dialogStatus:{
            type:Boolean,
            require:true
        },
        btnName:{
            type:String,
            default:'Close'
        }
    },

    methods: {
        close(){
            this.$emit('close');
        }
    }
}
</script>