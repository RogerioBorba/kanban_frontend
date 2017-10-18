<template>
  <v-app>
      <v-parallax src="../static/vbanner.jpg">
        <v-layout column align-center justify-center>
          <h1 class="white--text"></h1>
          <h4 class="white--text">Visualize seus projetos, tarefas etc!</h4>
          <h6 class="red--text" v-if="false"> Registre-se ou faça o login para utilizar este app </h6>
        </v-layout>
      </v-parallax>
  </v-app>
</template>
<script>
import {config} from './config';
export default {
  name: 'Home',
  props: ['showMessage'],
  methods: {
    user_does_not_has_token() {
      let does_not_has_token = config.localstore == null || config.localstore.get('token', '') == '';
      console.log(config.localstore);
      console.log('user_does_not_has__token()');
      console.log(does_not_has_token);
      console.log('config.localstore.get(token)');
      console.log(config.localstore.get('token'));
      return does_not_has_token;
    },

  },
  watcher: {

  }
}
</script>
