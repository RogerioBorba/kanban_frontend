<template>
  <v-app id="example-1" toolbar footer>
    <v-navigation-drawer persistent v-model="drawer" light   enable-resize-watcher app >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.title" @click="selectedItem(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="indigo darken-4" fixed dark app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-menu :nudge-width="100">
          <v-toolbar-title slot="activator">
            <v-btn icon>
                <v-icon>account_circle</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="user_action in user_actions" :key="user_action.title" @click="selectedAction(user_action.action)">
              <v-list-tile-title v-text="user_action.title"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>
    <main>
      <v-container fluid>
        <!--v-router-->
        <template>
            <div>
              <keep-alive>
                <component :is="dynamicComponent"></component>
              </keep-alive>
            </div>
        </template>
      </v-container>
    </main>
    <v-footer class="indigo">
      <span class="white--text">© 2017</span>
    </v-footer>
  </v-app>
</template>
<script>
import {config} from './config';
import Home from './home';
import Task from './task';
import Project from './project';
import ContinuousActivity from './continuousActivity';

  export default {
    components: {
      'home': Home,
      'tarefa': Task,
      'projeto': Project,
      'atividade-continua': ContinuousActivity
    },
    data () {
      return {
        drawer: true,
        right: null,
        actualItem: null,
        items: [],
        user_actions: [],
        showLogin: false,
        showLoginOrRegistrar: false,
        actualComponent: null
      }
    },
    computed: {
      dynamicComponent() {
        return this.actualComponent;
      }
    },
    methods: {

      selectedItem(an_item) {
        if (config.localstore.get('token') == null)
          return console.log('É preciso estar logado');
        this.actualItem = an_item;
        this.actualComponent = an_item.component
      },
      selectedAction(actionToExecute) {
         return actionToExecute();
      },
      login() {
        this.showLogin = true;
        this.items.forEach(anItem=>{ anItem.show = false;});
      },
      logout() {
        this.cancelLoginClicked();
      },
      registrar() {
          alert('registrar');
      },
      cancelLoginClicked() {
        config.localstore.remove('token');
        this.actualItem = this.items[0];
        this.showSelectedItem();
        this.showLoginOrRegistrar = true;
      },
      loginOrRegisterClicked(status) {
        //console.log(status);
        this.showLoginOrRegistrar = true;
        if (config.localstore.get('token') != null) {
          this.showLoginOrRegistrar = false;
          this.actualItem =this.items[0];
          this.showSelectedItem();
        }
      }
    },
    created: function () {
      this.items = [ { title: 'Gestão de atividades', icon: 'home', show: true, component: 'home' }, { title: 'Projetos', icon: 'format_list_numbered', show: false , component: 'projeto'},
                     { title: 'Tarefas', icon: 'list', show: false, component: 'tarefa' }, { title: 'Sprints', icon: 'motorcycle', show: false , component: 'home'}, { title: 'Atividades contínuas', icon: 'assignment', show: false, component: 'atividade-continua' } ];
      this.actualItem = this.items[0];
      this.actualComponent = 'home';
      this.user_actions = [{title: 'Login', action: this.login}, {title: 'Logout', action: this.logout}, { title: 'Registrar', action: this.registrar} ]
    }
  }
</script>
