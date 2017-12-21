<template>
<v-flex xs6 sm4 md3>
    <v-card :class="tabColor">
      <v-card-text class="text-xs-center black--text" >{{name}}
        <v-btn icon color="blue darken-2" v-if='add' @click.native="addTask">
          <v-icon color="white">add</v-icon>
        </v-btn>
      </v-card-text>
        <v-layout row wrap style="display:block;">
        <draggable v-model="card_tasks" :options="{group:'task'}" @add="onAdd" :move="onMove" @end="onEnd">
          <transition-group tag="div" class="dragArea">
            <div v-for="(item, index) in card_tasks" :key="index">
              <v-flex xs12 class="mb-1" >
                <v-card class="secondary ma-1 dark" >
                  <v-card-title>
                      <span>{{item.started}}</span><br>
                      <span>{{item.responsible}}</span>
                      <span>{{item.name}}</span><br>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn icon  @click="itemEditClicked(item)">
                          <v-icon dark color="yellow lighten-3">edit</v-icon>
                    </v-btn>
                    <v-btn icon  @click="removeTask(item)">
                          <v-icon dark color="red lighten-2">delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card >
              </v-flex>
            </div>
          </transition-group>
        </draggable>
        </v-layout>
    </v-card>
</v-flex>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import draggable from 'vuedraggable';
let list_name = null;
let a_task = null;

export default {

  props: [
    'add',
    'tabColor',
    'name',
    'cardColor',
    'status'
  ],

  components: {
    'draggable': draggable
  },

  data: () => ({
    tasksUrl: 'task-list/',
    users: [],
    card_tasks: [],

  }),

  methods: {

    onMove (evt, originalEvent) {
      if(evt.draggedContext.element != null)
        a_task = evt.draggedContext.element;

      return true;
    },
    onEnd: function (/**Event*/evt) {

      if (a_task == null)
        return True;
      let url = `${this.tasksUrl}${a_task.id}/`;

      let  local_status = ['A fazer', 'Fazendo', 'Pendente', 'Feito'].indexOf(list_name) + 1;
      a_task.status = local_status;
      axios.put(url, a_task).then(res => {
      //this.$store.commit('clear_current_task')
        this.card_tasks = this.filter()
      })
	   },
     onAdd(evt) {
       list_name = this.name;
     },
     filter () {
       return this.tasks.filter(aTask => (parseInt(aTask.status) === parseInt(this.status)))
     },


    userById (url) {
      let name = '';
      let id = parseInt(url.split('/').reverse()[1]);
      this.usersList.map(user => {
        if (user.id === id) {
          name = user.name
        }
      })
      return name
    },

    projectById (url) {
      let name = ''
      let id = parseInt(url.split('/').reverse()[1])
      this.projectsList.map(project => {
        if (project.id === id) {
          name = project.name
        }
      })
      return name
    },

    sprintById (url) {
      let name = ''
      let id = parseInt(url.split('/').reverse()[1])
      this.sprintsList.map(sprint => {
        if (sprint.id === id) {
          name = sprint.code
        }
      })
      return name
    },

    reverseDate (date) {
      return date.split('-').reverse().join('/')
    },
    addTask () {
      this.$store.commit('set_current_task', {})
      this.$store.commit('set_current_component_name', 'tarefa')
    },
    itemEditClicked (task) {
      this.$store.commit('set_current_task', task)
      this.$store.commit('set_current_component_name', 'tarefa')
    },
    removeTask (task) {
      axios.delete(`${this.tasksUrl}${task.id}/`).then(res => {
        this.$store.commit('set_current_component_name', 'tarefas')
      })
      .catch(error => console.log(error))
    }
  },

  computed: {
    ...mapGetters({
      temp_task: 'task',
      tasks: 'tasks'
    })
  },
  created () {
    if (this.filter().length == 0) {
      axios.get('task-list/').then(response => {
        let items = response.data;
        this.$store.state.tasks = items;
        this.card_tasks = this.filter();
      })
      .catch(error => {
        console.log(error)
      })
      axios.get('user-list/').then(res => (this.users = res.data))
      .catch(error => console.log(error))
    }

    else {
        this.card_tasks = this.filter();
    }
  }
}
</script>

<style scoped>
.dragArea {
  min-height: 25px;
}
.icon:before {
  font-family: sans-serif;
}
.sortable-ghost {
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: my-ghost;
}

@keyframes my-ghost {
  25% {
    transform: rotate(1deg);
    opacity: 0.5;
    margin-left: 5px;
  }
  50% {
    transform: rotate(0deg);
    opacity: 0.3;
    margin-left: 0px;
  }
  75% {
    transform: rotate(-1deg);
    opacity: 0.5;
    margin-right: 5px;
  }
  100% {
    transform: rotate(0deg);
    opacity: 0.3;
    margin-right: 0px;
  }
}
</style>
