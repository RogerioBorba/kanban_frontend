<template>
  <v-card-title class="px-1 text-xs-left" >
      <div>
        <span class="dark--text">{{task.started}}</span><br>
        <span>{{task.responsible}}</span>
        <span>{{task.name}}</span><br>
      </div>
  </v-card-title>
</template>
<javascript>
  export default {
    props: ['task'],
    name: 'TaskCard',
    data() {
      return {}
    }
  }
</javascript>
