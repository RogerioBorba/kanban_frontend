<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar class="white--text indigo" dark>
          <v-btn icon @click="insertSprint">
             <v-icon>add</v-icon>
          </v-btn>
          <v-btn icon>
             <v-icon>search</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
          <form v-if="isInserOrUpdatetSprint">
              <v-text-field  label="Nome" v-model="name" :rules="nameRules" :counter="100"  required ></v-text-field>
              <v-divider class="grey lighten-1"></v-divider>
              <v-text-field  label="Descrição" v-model="description"></v-text-field>
              <v-divider class="grey lighten-1"></v-divider>
              <v-text-field  label="Data início" v-model="start"></v-text-field>
              <v-divider class="grey lighten-1"></v-divider>
              <v-text-field  label="Data fim" v-model="end"></v-text-field>
              <v-divider class="grey lighten-1"></v-divider>
              <v-btn @click="submit">submit</v-btn>
              <v-btn @click="clear">Cancel</v-btn>
          </form>
        <v-list two-line>
          <template v-for="item in items" >
            <v-divider class="grey lighten-1"></v-divider>
            <v-list-tile v-bind:key="item.title" @click="">
                <v-btn icon @click="removeSprint(item)">
                 <v-icon>delete</v-icon>
              </v-btn>
              <v-btn icon @click="editSprint(item)">
                 <v-icon>edit</v-icon>
              </v-btn>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-text="item.description"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from 'axios';
export default {
  name: 'sprint',
  data() {
    return {
      name: '',
      description: '',
      start: null,
      end: null,
      items: [],
      actualItem: {},
      nameRules: [
          (v) => !!v || 'Nome é obrigatório',
          (v) => v && v.length <= 100 || 'Nome deve ter até 100 characters'
        ],
      isInserOrUpdatetSprint: false,
    }
  },
  methods: {
    insertSprint() {
      this.isInserOrUpdatetSprint = true;
      actualItem: {};
    },
    editSprint(an_item) {
      this.isInserOrUpdatetSprint = true;
      this.name = an_item.name;
      this.description= an_item.description;
      this.start= an_item.start;
      this.end= an_item.end;
      this.actualItem = an_item;
    },
    removeSprint(item) {
      let index = this.items.indexOf(item);
      axios.delete(this.url + item.id + '/').then( response => {
            if (response.status == 204) {
                console.log(response.status);
                if (index > -1) {
                  this.items.splice(index, 1);
                }
            }
      }).catch(error => {
          console.log(error);
      });
    },
    clearFields() {
      this.name = '',
      this.description= '',
      this.start= null,
      this.end= null
    },
    clear() {
      this.clearFields();
      this.isInserOrUpdatetSprint = false;
    },
    idFromUrl(an_url) {
        return parseInt(an_url.split('/').reverse()[0]);
      },

    submitPost() {
      this.actualItem = {};
      this.actualItem.id = null;
      this.actualItem.name = this.name;
      this.actualItem.description = this.description;
      this.actualItem.start = this.start;
      this.actualItem.end = this.end;
      axios.post(this.url, this.actualItem).then( response => {
            if (response.status == 201) {
              console.log("resp: " + response.headers['content-location']);
              this.actualItem.id= this.idFromUrl(response.headers['content-location']);
              this.items.push(this.actualItem);
              this.clearFields();
            }
      }).catch(error => {
          console.log(error);
      });

    },
    submitPut() {
      this.actualItem.name = this.name;
      this.actualItem.description = this.description;
      this.actualItem.start = this.start;
      this.actualItem.end = this.end;
      axios.put(this.url + this.actualItem.id + '/', this.actualItem).then( response => {
            if (response.status == 204)
                this.clearFields();
      }).catch(error => {
          console.log(error);
      });

    },
    submit() {
      if (this.actualItem.id == null)
          return this.submitPost();
      this.submitPut();
    }
  },
  created: function () {
        axios.defaults.baseURL = 'http://localhost:8000/kanban/';
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        this.url = "sprints/";
        axios.get(this.url).then(response => {
                this.items = response.data;

        })
        .catch(error => {
          console.log(error);
        });
      }
}
</script>
<style>
</style>
