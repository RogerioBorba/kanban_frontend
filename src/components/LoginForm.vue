<template>
  <v-app>
    <main>
      <v-container fluid>
        <v-flex xs12 md6 offset-md3>
          <v-card>
            <v-toolbar class="indigo" dark>
            <template v-if="showRegister">
              <v-toolbar-title>Registrar</v-toolbar-title>
            </template>
            <template v-else>
              <v-toolbar-title>{{title}}</v-toolbar-title>
            </template>
          </v-toolbar>
        <form>
          <template v-if="showRegister">
            <v-text-field  label="Nome" class="mt-5" v-model="user.name"   required ></v-text-field>
          </template>
           <v-text-field  label="Nome do usuário" v-model="user.user_name"  required ></v-text-field>
           <template v-if="showRegister">
             <v-flex xs12>
                <v-text-field label="E-mail" v-model="user.email" :rules="[rules.required, rules.email]"></v-text-field>
              </v-flex>
          </template>
          <v-flex xs8>
            <v-text-field name="input-10-2" label="Informe a senha" v-model="user.password" hint="No mínimo 8 caracteres"  min="8"  append-icon="visibility_off" type="password"  class="input-group--focused"  :rules="[() => user.password > 0 || 'Campo obrigatório']" required></v-text-field>
          </v-flex>
          <template v-if="showRegister">
            <v-flex xs8>
              <v-text-field name="input-10-3" label="Informe a senha novamente" v-model="password_again"  append-icon="visibility_off" type="password"  class="input-group--focused" @blur="blurNewPassword"></v-text-field>
              <p class="red" v-show="isNewpasswordNotEqualpassword">As senhas informadas não são idênticas</p>
            </v-flex>
          </template >
          <v-btn @click="confirmLoginOrRegister">Confirmar</v-btn>
          <v-btn @click="cancel">Cancelar</v-btn>
       </form>
     </v-card>
     </v-flex >
      </v-container>
    </main>
    <v-footer></v-footer>
  </v-app>
</template>
<script>
import axios from 'axios';
import {config, Base} from './config';
  export default {
    name: 'UserForm',
    props: ['showRegister'],
    data () {
        return {
          fi: '',
          user: {},
          menu: false,
          modal: false,
          title: 'Login',
          password_again: null,
          isNewpasswordNotEqualpassword: false,
          rules: {
            required: (value) => !!value || 'Required.',
            email: (value) => {
              const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            }
          }

        }
    },
    methods: {
      blurNewPassword() {
        if (this.user.password==this.password_again)
          this.isNewpasswordNotEqualpassword = false;
        else
          this.isNewpasswordNotEqualpassword = true;
      },
      lastCharIsBar(an_url) {
        if (an_url != null )
          return an_url.slice(-1) == '/';
        return false;
      },
      idFromUrl(an_url) {
        if (an_url == null)
          return -1;
        //console.log(an_url.slice(-1) == '/');
        let i =  this.lastCharIsBar(an_url) ? 1:0;
        return parseInt(an_url.split('/').reverse()[i]);
      },
      confirmLoginOrRegister() {
        let url = '';
        this.title= this.showRegister ? 'Registro': 'Login';
        if (this.showRegister) {

          url = 'user-list/register/';
          if  (!(this.user.password.length > 0 && this.user.password == this.password_again)) {
                        this.isNewpasswordNotEqualpassword = true;
            return;
          }
        } else
          url = 'user-list/login/';
          this.user.password = Base.encode(this.user.password);
          axios.post(url, this.user).then( response => {
              if (response.status == 201) {
                this.user.id = this.idFromUrl(response.headers['content-location']);
                config.localstore.set('token', response.headers['x-access-token']);
                axios.defaults.headers.common['Authorization'] = `Bearer ${config.localstore.get('token','')}`;

              }
              this.$emit('loginOrRegister', response.status);
              
          })
          .catch(error => {
            this.title= 'Login incorreto ou senha incorreta';
            console.log(error);
            this.$emit('loginOrRegisterError', error);
          });

      },
      cancel(){
       this.user= {};
       this.$emit('cancelLogin');
     }
   },
   created() {

     this.title= this.showRegister ? 'Registro': 'Login';
   }
  }
</script>
