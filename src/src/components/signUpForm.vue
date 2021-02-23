

<template>
    <v-container>
        <!-- Sign up/Update form -->
        <v-card> 
            <v-card-text>
                <ValidationObserver v-slot="{ invalid }" ref="form" >
                    <form @submit.prevent="submit">
                        <ValidationProvider
                            v-slot="{ errors }"
                            name="name"
                            rules="required|min:3"
                        >
                            <v-text-field
                            v-model="name"
                            :error-messages="errors"
                            label="Name"
                            required
                            filled
                            ></v-text-field>
                        </ValidationProvider>

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
                                type="password"
                                required
                                filled
                            ></v-text-field>
                        
                        </ValidationProvider>

                        <ValidationProvider
                            name="phoneNumber"
                        >
                            <v-text-field
                                v-model="phoneNumber"
                                label="Phone Number"
                            ></v-text-field>
                        </ValidationProvider>

                        <ValidationProvider
                            name="address"
                        >
                            <v-text-field
                                v-model="address"
                                label="Address"
                            ></v-text-field>
                        </ValidationProvider>

                            <v-radio-group v-model="gender">
                                <v-radio
                                    label="Femal"
                                    value="1"
                                ></v-radio>
                                <v-radio
                                    label="Male"
                                    value="0"
                                ></v-radio>
                            </v-radio-group>
                            <v-row 
                                class="btn" 
                                :class="{'btn_sm_screen': isSmallScreen}"
                                background-color="red lighten-2"
                            >
                                <v-btn
                                    v-if="signUpRoute"
                                    class="mr-4"
                                    type="submit"
                                    :disabled="invalid"
                                >
                                    SIGN UP
                                </v-btn>
                                <v-btn
                                    v-if="!signUpRoute"
                                    class="mr-4"
                                    type="submit"
                                    :disabled="invalid"
                                >
                                    UPDATE DETAILS
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
    import {mapActions} from 'vuex';
    import myDialog from './dialog';
    import responseHandel from '../services/responseHandler';
    import screenSize from '../mixins/screenSize'
    
    export default{
        mixins:[screenSize],
        components:{
            ValidationProvider,
            ValidationObserver,
            myDialog
        },
        data(){
            return {
                name: '',
                email: '',
                address:'',
                password:'',
                phoneNumber:'',
                gender: "0",
                overlay:false,
                dialogStatus:false,
                dialogMessage:{
                    header:'',
                    body:'',
                },
            }
        },
        computed: {
            signUpRoute(){
                return (this.$route.name =='userProfile' ) ? false : true;
            },
            formTitle(){
                return this.$route.name == 'signUp'? 'Sign Up Form': 'Update Details';
            },
        },
        methods: {
            ...mapActions(['addOrUpdateUser', 'resetCart','getDbCart','filterProducts' ]),
            async submit(){
                //Check form validation
                const isValid = await this.$refs.form.validate();
                if(!isValid){
                    return false;
                }
                this.overlay = true;

                const data = {
                    email:this.email,
                    name: this.name,
                    gender: this.gender,
                    phoneNumber: this.phoneNumber,
                    address: this.address,
                    password: this.password
                };

                const url = (this.signUpRoute) ? 'signup' : 'update'; 
                let response = await this.addOrUpdateUser({data:data, url:url});
    
                if(response.data.INTERNAL_STATUS_CODE == 200){
                    
                    this.resetCart();
                    //Get user cart
                    await this.getDbCart();

                    //Sort product's array to available/unavailable arrays
                    this.filterProducts();
                    this.overlay= false;

                    // close sign up form
                    this.$emit('closeSignInUpForm');
                    
                    if(this.$route.name != 'cart'){
                        this.$router.push({ name: 'products'});
                    }
    
                } else {
                    this.overlay = false;
                    const message = responseHandel.handelError(response);
                    this.dialogMessage.header = message.header;
                    this.dialogMessage.body = message.body;
                    this.dialogStatus = true;
                }
            },
            closeDialog(){
                this.dialogStatus = false;
            }
        },
        created() {
            extendValidation;
            let user = this.$store.getters.getUser;
            if(user){
                this.name = user.name;
                this.email = user.email;
                this.gender = (user.gender == "1") ? "1" : "0";
                this.phoneNumber = user.phoneNumber;
                this.address = user.address;
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