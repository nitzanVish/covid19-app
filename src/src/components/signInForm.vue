<template>

    <v-container>
        <v-card v-if="showForm"> 
            <v-card-text>
                <ValidationObserver v-slot="{ invalid }" ref="form" >
                    <form @submit.prevent="submit">

                        <ValidationProvider
                            v-slot="{ errors }"
                            name="email"
                            rules="required|email"
                        >
                            <v-text-field
                                v-model="email"
                                :error-messages="errors"
                                label="Email"
                                required
                                filled
                            ></v-text-field>
                            
                        </ValidationProvider>

                        <ValidationProvider
                            v-slot="{ errors }"
                            name="password"
                            rules="required|min:3"
                        >
                            <v-text-field
                                v-model="password"
                                :error-messages="errors"
                                label="Password"
                                required
                                filled
                                type="password"
                            ></v-text-field>
                        </ValidationProvider>
                        <v-row 
                            class="btn" 
                            :class="{'btn_sm_screen': isSmallScreen}"
                            background-color="red lighten-2"
                        >
            
                            <v-btn
                                class="mr-4"
                                type="submit"
                                :disabled="invalid"
                            >
                                SIGN IN
                            </v-btn>
                        </v-row>
                    </form>
                </ValidationObserver>
            </v-card-text>

        </v-card>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <myDialog 
            :dialogMessage="dialogMessage" 
            :dialogStatus="dialogStatus" 
        >
            <template v-slot:footer >
                <v-spacer></v-spacer>
                <v-btn
                    link
                    color="warning" outlined 
                    @click="closeDialog()"
                >
                    Close
                </v-btn>
            </template>
        </myDialog>
    </v-container>
</template>

<script>

    import { ValidationProvider, ValidationObserver } from 'vee-validate';
    import extendValidation from '../services/validation';
    import screenSize from '../mixins/screenSize'
    import messages from '../services/messages';
    import myDialog from './dialog';
    import responseHandel from '../services/responseHandler';
    import { mapActions} from 'vuex';

    export default{
        mixins:[screenSize],
        components:{
            ValidationProvider,
            ValidationObserver,
            myDialog
        },
        data(){
            return {
                overlay:false,
                dialogStatus:false,
                dialogMessage:{
                    header:'',
                    body:'',
                },
                password:'',
                email:'',
                showForm: true
            }
                
        },
        methods: {
            ...mapActions(['signIn', 'getDbCart', 'resetCart', 'filterProducts']),
            closeDialog(){
                this.dialogStatus = false;
            },
            async submit(){
                const isValid = await this.$refs.form.validate();
                if(!isValid){
                    return false;
                }
                this.overlay = true;
                let signInUser = await this.signIn({password: this.password, email:this.email});
                
                if(signInUser.data.INTERNAL_STATUS_CODE == 200){
                    // reset cart in store
                    this.resetCart();
                    // get user cart
                    await this.getDbCart();
                    
                    //Sort product's array to available/unavailable arrays
                    this.filterProducts();

                    // close sign in form
                    this.$emit('closeSignInUpForm');

                    this.overlay= false;

                    if(this.$route.name != 'cart'){
                        this.$router.push({ name: 'products'});
                    }
    
                } else {
                    this.overlay = false;
                    const message = responseHandel.handelError(signInUser);
                    this.dialogMessage.header = message.header;
                    this.dialogMessage.body = message.body;
                    this.dialogStatus = true;
                }
            },
        },
        created() {
            extendValidation;
            //Check if user already sign in
            if(this.$store.getters.isLoggedIn){
                this.dialogMessage.header = messages.userMessages.header.alreadySignIn;
                this.dialogMessage.body = messages.userMessages.body.alreadySignIn;
                this.dialogStatus = true;
                this.showForm = false;
            }
        },

    }
</script>

<style scoped>

.btn{
    align-items: center;
    justify-content: center;
}
.btn > * {
    width: 50%;
}

.btn_sm_screen > *{
    width: 90%;
}
</style>