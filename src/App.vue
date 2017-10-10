<template>
  <div id="app">
    <app-kanban></app-kanban>
  </div>
</template>

<script>
import Kanban from './components/DrawerKanban'

export default {
  name: 'kanbanpanel',
  components: {
    'app-kanban': Kanban
  },
  data() {
    return {}
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
