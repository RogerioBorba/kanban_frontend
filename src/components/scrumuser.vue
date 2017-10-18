<template>
  <v-app>
    <main>
      <v-container fluid>
        <v-flex xs12 md6 offset-md3>
          <v-card>
            <v-toolbar class="indigo" dark>
            <v-toolbar-title>Novo Usuário </v-toolbar-title>
          </v-toolbar>
          <form>
              <v-text-field  label="Nome" class="mt-5" v-model="scrum_user.name" :rules="nomeRules"  required ></v-text-field>
              <v-text-field  label="Nome do usuário" v-model="scrum_user.user_name" :rules="nomeRules" required ></v-text-field>
              <v-text-field label="E-mail" v-model="scrum_user.email" :rules="[rules.required, rules.email]"></v-text-field>
              <v-text-field name="input-10-2" label="Informe a senha" v-model="scrum_user.password" hint="No mínimo 8 caracteres"  min="8"  append-icon="visibility_off" type="password"  class="input-group--focused"  :rules="senhaRules" required></v-text-field>
              <v-text-field name="input-10-3" label="Informe a senha novamente" v-model="scrum_user.password_again"  append-icon="visibility_off" type="password"  class="input-group--focused" @blur="blurNewPassword"></v-text-field>
              <p class="red" v-show="isNewpasswordNotEqualpassword">As senhas informadas não são idênticas</p>
              <v-btn @click="register">Confirmar</v-btn>
              <v-btn @click="cancel">Cancelar</v-btn>
         </form>
       </v-card>
     </v-flex>
    </v-container>
  </main>
  <v-footer></v-footer>
</v-app>
</template>
<script>
import axios from 'axios';
import {config, Base} from './config';
  export default {
    name: 'scrumuserform',
    data () {
        return {
          scrum_user: {},
          scrum_user_list_url: 'user-list/'
          fi: '',
          showRegistrar: false,
          menu: false,
          modal: false,
          isNewpasswordNotEqualpassword: false,
          nomeRules: [
            (v) => !!v || 'Nome é obrigatório',
            (v) => v.length > 1 || 'Nome precisar ter mais de um character'
          ],
          senhaRules:[
            (v) => !!v || 'Senha é obrigatória',
            (v) => v.length > 1 || 'No mínimo 8 caracteres'
          ],
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
        if (this.pessoa.senha==this.pessoa.senha_novamente)
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
      register() {
          if  (!(this.scrum_user.password.length > 0 && this.scrum_user.password == this.scrum_user.password_again)) {
            this.isNewpasswordNotEqualpassword = true;
            return;
          }

        axios.post(url, this.scrum_user).then( response => {
            if (response.status == 201) {
              this.scrum_user.id = this.idFromUrl(response.headers['content-location']);
              config.localstore.set('token', response.headers['x-access-token']);
            }
            this.$emit('UserRegister', response.status);
            console.log(response.status);

          })
        .catch(error => {
          console.log(error);
          this.$emit('UserRegister', error);
        });
      },
      cancel() {
       this.scrum_user.name =  '';
       this.scrum_user.password = '';
       this.scrum_user.email = '';
       this.scrum_user.password_again = '';
       this.avatar = '';
       this.$emit('CancelRegister');
     }
    }
  }
</script>
