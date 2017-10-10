<template>
  <app-kanban-panel> </app-kanban-panel>
</template>

<script>
import Sprint from './sprint'
import KanbanPanel from './kanbanpanel'
export default {
  components: {
    'app-sprint': Sprint,
    'app-kanban-panel': KanbanPanel
  },
  name: 'kanban',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #example-3 {
    color: #fff;
    text-align: center;
  }

  #example-3 .flex {
    margin-bottom: 16px;
  }
</style>
