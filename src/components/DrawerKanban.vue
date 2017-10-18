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
      <v-toolbar-title v-if="does_not_has_token"><p class="red--text"> Registre-se ou faça o login para utilizar este app </p> </v-toolbar-title>
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
            <div v-if="!showLoginOrRegister">
              <keep-alive>
                <component :is="dynamicComponent" v-if="!does_not_has_token"></component>
              </keep-alive>
            </div>
            <template v-if="does_not_has_token">
              <login-form :showRegister="showRegister" v-on:loginOrRegister="loginOrRegister" v-on:loginOrRegisterError="loginOrRegisterError"></login-form>
            </template>
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
import Sprint from './sprint';
import LoginForm from './LoginForm';

  export default {
    components: {
      'home': Home,
      'tarefa': Task,
      'projeto': Project,
      'atividade-continua': ContinuousActivity,
      'sprint': Sprint,
      'login-form': LoginForm
    },
    data () {
      return {
        drawer: true,
        right: null,
        actualItem: null,
        items: [],
        user_actions: [],
        showRegister: false,
        showLoginOrRegister: false,
        actualComponent: null,
        does_not_has_token: true

      }
    },
    computed: {
      dynamicComponent() {
        return this.actualComponent;
      },

    },
    methods: {

      set_does_not_has_token() {
        this.does_not_has_token =  config.localstore == null || config.localstore.get('token', '') == '';
      },
      selectedItem(an_item) {
        if (config.localstore.get('token') == null)
          //return console.log('É preciso estar logado');
        this.actualItem = an_item;
        this.actualComponent = an_item.component
      },
      cancelLogin() {
        //console.log('cancelar login');
        this.showLoginOrRegister = false;
      },
      selectedAction(actionToExecute) {
         return actionToExecute();
      },
      login() {

        this.showRegister = false;
        //this.showLoginOrRegister = false;
        this.showLoginOrRegister = true;
        //console.log(this.showRegister);
        //this.items.forEach(anItem=>{ anItem.show = false;});
      },
      logout() {
        this.showRegister = false;
        this.showLoginOrRegister = true;
        config.localstore.set('token', '');
        this.set_does_not_has_token() ;
        this.actualItem = this.items[0];
      },
      register() {
          //console.log(this.showRegister);
          //this.showLoginOrRegister = false;
          this.showLoginOrRegister = true;
          this.showRegister = true;
      },

      loginOrRegister(value) {
        if(value instanceof Error);
          console.log(value);
        if (value == 201) {
          this.set_does_not_has_token();
          this.showLoginOrRegister = false;
          this.actualItem = this.items[0];
        }
      },
      loginOrRegisterError(error) {
        console.log(error.name + ' - ' + error.message);
      }
    },
    created: function () {
      this.items = [ { title: 'Gestão de atividades', icon: 'home',  component: 'home' }, { title: 'Projetos', icon: 'format_list_numbered',  component: 'projeto'},
                     { title: 'Tarefas', icon: 'list',  component: 'tarefa' }, { title: 'Sprints', icon: 'motorcycle',  component: 'sprint'}, { title: 'Atividades contínuas', icon: 'assignment',  component: 'atividade-continua'} ];
      this.actualItem = this.items[0];
      this.actualComponent = 'home';
      this.user_actions = [{title: 'Login', action: this.login}, {title: 'Logout', action: this.logout}, { title: 'Registrar', action: this.register} ]
    }
  }
</script>
