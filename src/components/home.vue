<template>
  <v-parallax class="background" src="../static/kanban_background.png">
    <v-layout column align-center justify-center>
      <h1 class="white--text"></h1>
      <h4 class="black--text">Visualize e planeje seus projetos, tarefas, atividades etc! <br><h6 class="text-xs-right"> Versão 1.0  </h6></h4>
    </v-layout>
  </v-parallax>
</template>

<script>

export default {
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .background {
    position: absolute;
    min-height: 100%;
    min-width: 100%;
  }
</style>
