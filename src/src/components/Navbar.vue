<template>
<div class="background">
    <v-img
        class="background_image"
        :src="require(`@/assets/images/corona/background.jpg`)"
    />

            
    <v-app-bar 
        extended 
        fixed 
        class="navBar"
        
    > 
            <v-btn 
                icon x-large
                v-if="!isXtraSmall"
                @click="navigation('HomePage')"
                
                color="white"
            >
                <v-icon>{{icons.home}}</v-icon>
            </v-btn>

            <v-btn 
                icon x-large
                v-if="!isXtraSmall"
                @click="navigation('products')"
                color="white"
            >
                <v-icon>{{icons.products}}</v-icon>
                
            </v-btn>

        <span class="hidden-sm-and-up">
            <v-btn @click.stop="menudrawer = !menudrawer">
            Menu
            </v-btn>
        </span>

        <v-spacer></v-spacer>
    
        <v-toolbar-title 
            class="navbarTitle"
            :class="{'title_sm_screen': isSmallScreen, 'title_md_screen':isMdScreen}"
        >  
            {{title}} 
        </v-toolbar-title>

        <v-spacer></v-spacer>

            <v-btn 
                v-if="!isXtraSmall"
                @click="navigation('cart')"
                icon x-large
                color="white"
                class="cartBtn"
            >
            
                <v-icon>{{icons.cart}}</v-icon>
                <span class="qtyBubble">{{cartQty}}</span>
                
            </v-btn> 

            <v-menu
                v-if="!isXtraSmall"
                left
                bottom
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="userIcon"
                        icon 
                        x-large
                        color="white"
                        v-bind="attrs"
                        v-on="on" 
                    >
                        <v-icon>{{icons.user_circle}}</v-icon>
                        <span 
                            v-if="getUser"
                            class="userNameIcon"
                            >{{userNameIcon}}
                        </span>
                    </v-btn>
                </template>
                <v-list class="hidden-xs-only">
            
                    <v-list-item
                        v-for="(userItem, index) in userOptins"
                        :key="index"
                        @click="navigation(userItem.routeName)"
                    >
                    
                        <v-list-item-icon>
                            <v-icon>{{ userItem.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>
                                {{ userItem.optionName }}
                            </v-list-item-title>
                        </v-list-item-content>
                    
                    </v-list-item>
                </v-list>
            </v-menu> 

    </v-app-bar> 

    <v-navigation-drawer
        v-model="menudrawer"
        absolute
        temporary
    >

        <v-list>
            <v-list-item
                v-for="(item, index) in menuDrawerItems"
                :key="index"
                link
                @click="navigation(item.routeName)"
                
            >
            
            <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>
                    {{ item.optionName }}
                </v-list-item-title>
            </v-list-item-content>
            </v-list-item> 
        </v-list>
    </v-navigation-drawer>

</div>


    
</template>

<script>
import {mapGetters} from 'vuex';
import screenSize from '../mixins/screenSize';
export default {
    name:'Navbar',
    mixins:[screenSize],
    data(){
        return{
            title: 'Against COVID-19',
            background_title:'Stay Prepared With Our Items!',
            menudrawer:false,
            icons:{
                user_circle:'fa-user-circle',
                home:'fa-home',
                heart:'mdi-heart',
                cart:'fa-shopping-cart',
                products:'fa-shopping-basket',
                user: 'mdi-account'

            },
            routeName:''            
        }
    },
    computed: {
        ...mapGetters(['isLoggedIn', 'getUser', 'cartQty']),
        userNameIcon(){
            return this.getUser ? `Hi,${this.getUser.name}` : '';
            //getUser
        },
        isXtraSmall(){
            return this.$vuetify.breakpoint.name == 'xs' ? true : false;
        },
        userOptins(){
            if(this.isLoggedIn){
                return [
                    {optionName: 'My Profile', routeName: 'userProfile', icon: this.icons.user},
                    {optionName: 'Log Out', routeName: 'logOut', icon: this.icons.user}
                ]
            }
            return [
                {optionName: 'Sign In', routeName: 'signIn', icon: this.icons.user},
                {optionName: 'Sign Up', routeName: 'signUp', icon: this.icons.user}
            ]
        },
        menuDrawerItems(){
            return [
                ...this.userOptins,
                {optionName: 'Home', routeName: 'HomePage', icon: this.icons.home},
                {optionName: 'Cart', routeName: 'cart', icon: this.icons.cart},
                {optionName: 'Products', routeName: 'products', icon: this.icons.products}
            ]
        }


    },
    async created() {
        //Get user cart
        await this.$store.dispatch('getDbCart');
    },
    methods: {
        navigation(route){
            if(route == 'logOut'){
                this.logOutView();
            } else if(this.$router.currentRoute.name != route){
                this.$router.push({name:route});
            }
        },
        //Logout
        async logOutView(){
            await this.$store.dispatch('logout');
            //Clean cart data
            this.$store.dispatch('resetCart');
            if(this.$router.currentRoute.name != 'HomePage'){
                this.$router.push({name:'HomePage'});
            } 
        }
    }
}
</script>

<style scoped>
.userIcon{
    position: relative;
}
.userNameIcon{
    position:absolute;
    bottom: -20px;
    font-size: small;
    font-weight: 300;
}
.background{
    
    background-color:#262626;
    position: relative;
    height: 300px;

}
.background_image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-height: 100%;
    opacity: 0.6;
}

    .navBar{
        z-index: 2 !important;
        background: rgba(0,0,0,.25) !important;
        box-shadow: inset 0 -2px 5px rgba(0,0,0,.33) !important;

        padding: 10px;
        /* background-color: black !important; */
        color:white;
        /* position: relative; */
    
        /* opacity: 0.3; */
        /* height: 300px !important; */
        /* background-color: rgb(236,92,92) !important; */
    }
    .navbarTitle{
        /* margin-top:35px; */
        font-weight: 500;
        /* text-shadow: 2px 2px 5px rgb(184, 91, 91); */
        font-size: 4vw;
        color:white
    }
    .title_sm_screen{
        font-size: 6vw;
    }
    .title_md_screen{
        font-size: 3vw;
    }
    .cartBtn{
        position: relative;
    }
    .qtyBubble{
        position:absolute;
        background-color: tomato;
        top: -15px;
        right: -7px;
        height: 1.6rem;
        border-radius: .8rem;
        padding: 0 .4rem;
        padding-top: 3px
    }
</style>

