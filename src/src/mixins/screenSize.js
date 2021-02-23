

export default {

    computed:{
        isSmallScreen(){
            return (this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name =='sm') 
                ? true 
                : false;
        },
        isMdScreen(){
            return (this.$vuetify.breakpoint.name == 'md') 
                ? true 
                : false;
        }
    }
}
