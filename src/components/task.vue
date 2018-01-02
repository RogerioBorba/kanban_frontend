<template>
  <v-flex>
    <!-- ADICIONAR TAREFA -->
      <v-card >
        <v-card-title class=" headline green white--text">
          <span v-if="task.id == null">Nova tarefa </span>
          <span v-else> Editar tarefa </span>
        </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-menu lazy  :close-on-content-click="true"  v-model="menu_inicial"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                            <v-text-field slot="activator" label="Data inicio" v-model="task.started" prepend-icon="event" readonly ></v-text-field>
                            <v-date-picker  v-model="task.started" no-title scrollable actions>
                            </v-date-picker>
                          </v-menu>
                        </v-flex>
                        <v-flex xs12>
                             <v-menu lazy  :close-on-content-click="true"  v-model="menu_final"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                               <v-text-field slot="activator" label="Data de entrega" v-model="task.due" prepend-icon="event" readonly ></v-text-field>
                               <v-date-picker v-model="task.due" no-title scrollable actions>
                               </v-date-picker>
                             </v-menu>
                        </v-flex>
                        <v-flex xs12>
                          <v-select label="Responsável" v-model="responsible_object" :items="responsible_list" item-text="name" @blur="blurSelectedResponsible" required></v-select>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field label="Nome da tarefa" required v-model="task.name"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field label="Descrição da tarefa" hint="Informações para descrever a tarefa"  v-model="task.description"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-select label="Status" v-model="task_status_object" :items="task_status_list" item-text="dominio" @blur="blurSelectedTaskStatus" required></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select label="Projeto" v-model="project_object" :items="project_list" item-text="name" @blur="blurSelectedProject"></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select label="Sprint" v-model="sprint_object" :items="sprint_list" item-text="code" @blur="blurSelectedSprint"></v-select>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*Campos requeridos</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn round color="primary" @click.native="confirmCreateOrEditTask">Confirmar</v-btn>
                    <v-btn round color="primary" @click.native="cancelCreateOrEditTask">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import draggable from 'vuedraggable'

export default {

  name: 'tarefa',
  components: {
    draggable
  },
  data () {
    return {
      data_inicio: null,
      data_devida: null,
      menu_inicial: false,
      menu_final: false,
      status: 1,
      responsible_list: [],
      sprint_list: [],
      project_list: [],
      task_status_list: [],
      responsible_object: null,
      sprint_object: null,
      project_object: null,
      task_status_object: null,
      url: 'task-list/',
      task_status_list_url: 'task-list/status-dominio-list/',
      sprint_list_url: 'sprint-list/',
      project_list_url: 'project-list/',
      scrum_user_list_url: 'user-list/'
    }
  },
  methods: {
    lastCharIsSlash (anUrl) {
      if (anUrl != null) {
        return anUrl.slice(-1) === '/'
      }
      return false
    },
    idFromUrl (anUrl) {
      if (anUrl == null) {
        return -1
      }
      let i = this.lastCharIsSlash(anUrl) ? 1 : 0
      return parseInt(anUrl.split('/').reverse()[i])
    },
    blurSelectedResponsible () {
      if (this.responsible_object) {
        this.task.responsible = axios.defaults.baseURL + this.scrum_user_list_url + this.responsible_object.id + '/'
      }
    },
    blurSelectedSprint() {
      this.task.sprint = axios.defaults.baseURL + this.sprint_list_url + this.sprint_object.id + '/'
      console.log(this.task.sprint)
    },
    blurSelectedProject () {
      this.task.project = axios.defaults.baseURL + this.project_list_url + this.project_object.id + '/'
      console.log(this.task.project)
    },
    blurSelectedTaskStatus () {
      if (this.task_status_object) {
        this.task.status = axios.defaults.baseURL + this.scrum_user_list_url + this.task_status_object.id + '/'
      }
    },
    cancelCreateOrEditTask () {
      this.$store.commit('clear_current_task')
      this.$store.commit('set_current_component_name', 'tarefas')
    },
    confirmCreateOrEditTask () {
      this.updateOrCreateItem()
    },
    get_responsible_object () {
      return this.get_generic_item_object(this.task.responsible, this.responsible_list)
    },
    get_project_object () {
      return this.get_generic_item_object(this.task.project, this.project_list)
    },
    get_task_status_object () {
      return this.get_generic_item_object(this.task.status, this.task_status_list)
    },
    get_generic_item_object (item, itemList) {
      let genericItem = null
      if (item === null) {
        return null
      }
      let newid = this.idFromUrl(item)
      itemList.forEach(function (anItem) {
        if (parseInt(anItem.id) === newid) {
          genericItem = anItem
          return genericItem
        }
      })
      return genericItem
    },
    updateOrCreateItem () {
      this.task.status = this.task_status_object.id
      if (this.task.id != null) {
        this.updateItem()
      } else {
        this.createItem()
      }
    },

    createItem () {
      axios.post(this.url, this.task).then(response => {
        if (response.status === 201) {
          this.task.id = this.idFromUrl(response.headers['content-location'])
          this.$store.commit('set_current_task', {})
          this.$store.commit('set_current_component_name', 'tarefas')
        }
        console.log(response.status)
      })
      .catch(error => console.log(error))
    },
    clearFormFields () {
      this.menu_start = null
      this.menu_end = null
      this.data_start = null
      this.data_end = null
      this.responsible_object = {}
    },

    updateItem () {
      axios.put(this.url + this.task.id + '/', this.task).then(response => {
        if (response.status === 204) {
          this.$store.commit('set_current_task', {})
        }
        this.$store.commit('set_current_component_name', 'tarefas')
      })
      .catch(error => {
        console.log(error)
      })
    },

    initializeTask () {
      axios.get(this.scrum_user_list_url).then(response => { // request all users'
        this.responsible_list = response.data
        if (this.task.id != null) {
          this.responsible_object = this.get_responsible_object()
        }
      })
      .catch(error => console.log(error))

      axios.get(this.project_list_url).then(response => { // request all project
        this.project_list = response.data
        this.project_object = this.get_project_object()
      })
      .catch(error => console.log(error))

      axios.get(this.project_list_url).then(response => { // request all project
        this.project_list = response.data
        this.project_object = this.get_project_object()
      })
      .catch(error => console.log(error))

      axios.get(this.task_status_list_url).then(response => { // request all task status
        this.task_status_list = response.data
        this.task_status_object = this.get_task_status_object()
        if (this.task.id === null) {
          this.task_status_object = this.task_status_list[0]
        }
      })
      .catch(error => console.log(error))
    }
  },
  computed: {
    ...mapGetters({
      task: 'task'
    })
  },
  created: function () {
    this.initializeTask()
  }

}
</script>
