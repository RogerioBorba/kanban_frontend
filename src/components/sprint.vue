<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="plusClicked">
             <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar sprint..."  class="blue--text mt-3" single-line  append-icon="search"  dark ></v-text-field>
        </v-toolbar>
        <form  v-show="showCreateOrUpdateItem">
          <v-text-field  label="Código" v-model="actualItem.code" ></v-text-field>
          <v-select label="Responsável" v-model="responsible_object" :items="responsible_list" item-text="name" @blur="blurSelectedResponsible" required></v-select>
          <v-select label="Projeto" v-model="project_object" :items="project_list" item-text="name" @blur="blurSelectedProject" required></v-select>
          <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
            <v-text-field slot="activator" label="Data incial" v-model="data_start" prepend-icon="event" readonly ></v-text-field>
            <v-date-picker v-model="data_start" no-title scrollable actions></v-date-picker>
          </v-menu>
          <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
            <v-text-field slot="activator" label="Data final" v-model="data_end" prepend-icon="event" readonly ></v-text-field>
            <v-date-picker v-model="data_end" no-title scrollable actions></v-date-picker>
          </v-menu>
           <v-btn round color="primary" @click="updateOrCreateItem">Confirmar</v-btn>
           <v-btn round color="primary" @click="cancel">Cancelar</v-btn>

       </form>
        <v-list >
            <v-list-tile v-for="(item, index) in items" :key="index" avatar @click="">
              <v-list-tile-action>
                <v-btn  purple lighten-4 icon @click.native="editItem(item)" >
                   <v-icon dark color="yellow lighten-3">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn  purple lighten-4 icon @click.native="removeItem(item);">
                   <v-icon dark color="red lighten-2">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.code" ></v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Sprint',
  data () {
    return {
      url: 'sprint-list/',
      scrum_user_list_url: 'user-list/',
      project_list_url: 'project-list/',
      items: [],
      menu_start: null,
      menu_end: null,
      data_start: null,
      data_end: null,
      responsible_list: [],
      responsible_object: {},
      project_list: [],
      project_object: {},
      actualItem: {},
      showCreateOrUpdateItem: false
    }
  },
  methods: {
    blurSelectedResponsible () {
      this.actualItem.responsible = axios.defaults.baseURL + this.scrum_user_list_url + this.responsible_object.id + '/'
    },
    blurSelectedProject () {
      this.actualItem.project = axios.defaults.baseURL + this.project_list_url + this.project_object.id + '/'
      console.log(this.actualItem.project)
    },
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
      // console.log(anUrl.slice(-1) == '/')
      let i = this.lastCharIsSlash(anUrl) ? 1 : 0
      return parseInt(anUrl.split('/').reverse()[i])
    },
    plusClicked () {
      this.showCreateOrUpdateItem = true
      this.actualItem = {}
    },
    cancel () {
      this.showCreateOrUpdateItem = false
      this.actualItem = {}
    },
    updateOrCreateItem () {
      this.actualItem.start = this.data_start
      this.actualItem.end = this.data_end
      if (this.actualItem.id != null) {
        this.updateItem()
      } else {
        this.createItem()
      }
    },
    createItem () {
      axios.post(this.url, this.actualItem).then(response => {
        if (response.status === 201) {
          this.actualItem.id = this.idFromUrl(response.headers['content-location'])
          this.items.push(this.actualItem)
          this.clearFormFields()
          this.actualItem = {}
          this.showCreateOrUpdateItem = false
          this.clearFormFields()
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
      console.log(this.actualItem)
      axios.put(this.url + this.actualItem.id + '/', this.actualItem).then(response => {
        if (response.status === 204) {
          this.clearFormFields()
        }
        console.log(response.status)
        this.showCreateOrUpdateItem = false
      })
      .catch(error => console.log(error))
    },
    get_responsible_object () {
      return this.get_generic_item_object(this.actualItem.responsible, this.responsible_list)
    },
    get_project_object () {
      return this.get_generic_item_object(this.actualItem.project, this.project_list)
    },
    get_generic_item_object (item, itemList) {
      let genericItem = null
      if (item === null) {
        return null
      }
      let newid = this.idFromUrl(item)
      console.log(`Newid: ${newid}`)
      itemList.forEach(function (anItem) {
        if (parseInt(anItem.id) === newid) {
          genericItem = anItem
          return genericItem
        }
      })
      return genericItem
    },
    editItem (item) {
      this.actualItem = item
      this.showCreateOrUpdateItem = true
      this.data_start = this.actualItem.start
      this.data_end = this.actualItem.end
      console.log(this.get_responsible_object())
      this.responsible_object = this.get_responsible_object()
      console.log(this.get_project_object())
      this.project_object = this.get_project_object()
    },
    removeItem (item) {
      let index = this.items.indexOf(item)
      axios.delete(this.url + item.id + '/').then(response => console.log(response))
      .catch(error => console.log(error))
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    requestAllUser () {
      axios.get(this.scrum_user_list_url).then(response => (this.responsible_list = response.data))
      .catch(error => console.log(error))
    },
    requestProjects () {
      axios.get(this.project_list_url).then(response => (this.project_list = response.data)).catch(error => console.log(error))
    }
  },
  created: function () {
    axios.get(this.url).then(response => (this.items = response.data))
    .catch(error => console.log(error))
    this.requestAllUser()
    this.requestProjects()
  }
}
</script>
<style scoped>
color: black
</style>
