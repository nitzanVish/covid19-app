<template>
  <v-app>
    <appNavBar/>

    <v-main class="main">
      
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <myfooter/>
  
  </v-app>
</template>

<script>
import appNavBar from './components/Navbar';
import myfooter from './components/Footer';

export default {
  name: 'App',

  components: {
    appNavBar,
    myfooter
  },
};
</script>

<style lang="scss" scoped>
  .main{
    // background-color: beige;
    // border: 1px solid black;
    margin-bottom: 50px;
    margin-top: 50px;
    padding: 10px;
  
  }

</style>
