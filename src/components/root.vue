<template>
  <v-app dark id="inspire" >
    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>
      <v-list dense>
        <v-list-tile v-for="item in item_components_drawer()" :key="item.title" @click="selectedItem(item)">
          <v-list-tile-action>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue-grey darken-3" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <div v-if="this.$store.state.user" class="blue--text"> {{this.$store.state.user.user_name}} </div>
      <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <v-btn icon>
                <v-icon>account_circle</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="user_action in user_actions_menu()"  :key="user_action.title" @click="selectedAction(user_action)">
              <v-list-tile-title>{{ user_action.title}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>
    <main>
      <v-content>
      <v-container class="containerFullWidth" fill-height>
        <v-layout justify-center>

          <component :is="this.$store.state.current_component_name"></component>

        </v-layout>
      </v-container>
    </v-content>
    </main>
    <v-footer app fixed>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import Home from './home'
import Tasks from './tasks'
import Task from './task'
import Project from './project'
import ContinuousActivity from './continuousActivity'
import TypeContinuousActivity from './typecontinuousActivity'
import Sprint from './sprint'
import Login from './login'
import Register from './register'
import Logout from './logout'
export default {
  name: 'Main',
  components: {
    'home': Home,
    'tarefas': Tasks,
    'tarefa': Task,
    'projeto': Project,
    'atividade_continua_extra': ContinuousActivity,
    'tipo_atividade_continua_extra': TypeContinuousActivity,
    'sprint': Sprint,
    'login': Login,
    'register': Register,
    'logout': Logout
  },
  data () {
    return {
      drawer: true,
      has_token: false,
      user_actions: [],
      item_components: []
    }
  },
  methods: {
    selectedAction (userAction) {
      return this.execute_action(userAction.action)
    },
    selectedItem (anUserAction) {
      if (this.$store.state.token === null) {
        this.$store.commit('set_current_component_name', 'login')
      } else {
        this.$store.commit('set_current_component_name', anUserAction.component_name)
      }
    },
    item_components_drawer () {
      return this.item_components.filter(anItem => ['home', 'projeto', 'tarefas', 'sprint', 'atividade_continua_extra', 'tipo_atividade_continua_extra'].includes(anItem.component_name))
    },
    user_actions_menu () {
      return this.user_actions
    },
    logout () {
      this.$store.commit('set_token', null)
      this.$store.commit('set_user', null)
      this.$store.commit('set_current_component_name', 'login')
    },
    register () {
      this.$store.commit('set_current_component_name', 'register')
    },
    login (value) {
      this.$store.commit('set_current_component_name', 'login')
    },
    dinamic_method_for_action () {
      return {'login': this.login, 'register': this.register, 'logout': this.logout}
    },
    execute_action (anActionName) {
      let dinMethods = this.dinamic_method_for_action()
      for (const [key, value] of Object.entries(dinMethods)) {
        if (key === anActionName) {
          return value()
        }
      }
      return null
    }
  },
  created: function () {
    this.item_components = [
      {title: 'Gestão de atividades', icon: 'home', color: 'white', component_name: 'home', enabled: this.$store.getters.has_token},
      {title: 'Projetos', icon: 'format_list_numbered', color: 'blue', component_name: 'projeto', enabled: this.$store.getters.has_token},
      {title: 'Tipo atividade contínua/extra etc', color: 'orange', icon: 'assignment', component_name: 'tipo_atividade_continua_extra', enabled: this.$store.getters.has_token},
      {title: 'Tarefas', icon: 'list', color: 'green', component_name: 'tarefas', enabled: this.$store.getters.has_token},
      {title: 'Sprints', icon: 'motorcycle', color: 'yellow', component_name: 'sprint', enabled: this.$store.getters.has_token},
      {title: 'Minhas atividades contínuas/extras etc', color: 'orange', icon: 'assignment', component_name: 'atividade_continua_extra', enabled: this.$store.getters.has_token}
    ]
    this.user_actions = [
      {title: 'Login', icon: 'account_box', color: 'white', action: 'login', enabled: this.$store.state.token == null},
      {title: 'Logout', icon: 'not_interested', color: 'gray', action: 'logout', enabled: this.$store.state.token !== null},
      {title: 'Registrar', icon: 'face', color: 'gray', action: 'register', enabled: this.$store.getters.token == null}
    ]
  }
}
</script>
<style>
  .containerFullWidth {
    max-width: 100% !important
  }
</style>
