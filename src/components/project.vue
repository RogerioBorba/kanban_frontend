<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="plusClicked">
             <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar projeto..."  class="blue--text mt-3" single-line  append-icon="search"  dark ></v-text-field>
        </v-toolbar>
        <form  v-show="showCreateOrUpdateItem">
          <v-text-field  label="Nome" v-model="actualItem.name" ></v-text-field>
          <v-text-field  label="Descrição" v-model="actualItem.description" ></v-text-field>
          <v-select label="Responsável Técnico" v-model="technical_responsible_object" :items="responsible_list" item-text="name" @blur="blurSelectedTechnicalResponsible" required></v-select>
          <v-select label="Responsável Administrativo" v-model="administrative_responsible_object" :items="responsible_list" item-text="name" @blur="blurSelectedAdministrativeResponsible"></v-select>
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
                <v-list-tile-title v-text="item.name" ></v-list-tile-title>
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
  name: 'Project',
  data () {
    return {
      url: 'project-list/',
      scrum_user_list_url: 'user-list/',
      items: [],
      menu_start: null,
      menu_end: null,
      data_start: null,
      data_end: null,
      responsible_list: [],
      technical_responsible_object: {},
      administrative_responsible_object: {},
      actualItem: {},
      showCreateOrUpdateItem: false
    }
  },
  methods: {
    blurSelectedTechnicalResponsible () {
      this.actualItem.technical_responsible = axios.defaults.baseURL + this.scrum_user_list_url + this.technical_responsible_object.id + '/'
    },
    blurSelectedAdministrativeResponsible () {
      this.actualItem.administrative_responsible = axios.defaults.baseURL + this.scrum_user_list_url + this.administrative_responsible_object.id + '/'
    },
    lastCharIsSlash (anUrl) {
      if (anUrl != null) {
        return anUrl.slice(-1) === '/'
      }
      return false
    },
    idFromUrl (anUrl) {
      if (anUrl === null) {
        return -1
      }
      // console.log(anUrl.slice(-1) === '/')
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
      this.technical_responsible_object = {}
      this.administrative_responsible_object = {}
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
    get_technical_responsible_object () {
      let genericItemList = []
      console.log(this.actualItem.technical_responsible)
      if (this.actualItem.technical_responsible === null) {
        return null
      }
      let newid = this.idFromUrl(this.actualItem.technical_responsible)
      genericItemList = this.responsible_list.filter(anItem => anItem.id === newid)
      if (genericItemList.length === 0) {
        return null
      }
      return genericItemList[0]
    },
    get_administrative_responsible_object () {
      let genericItemList = []
      if (this.actualItem.administrative_responsible === null) {
        return null
      }
      let newid = this.idFromUrl(this.actualItem.administrative_responsible)
      genericItemList = this.responsible_list.filter(anItem => anItem.id === newid)
      if (genericItemList.length === 0) {
        return null
      }
      return genericItemList[0]
    },
    editItem (item) {
      this.actualItem = item
      this.showCreateOrUpdateItem = true
      this.data_start = this.actualItem.start
      this.data_end = this.actualItem.end
      this.technical_responsible_object = this.get_technical_responsible_object()
      this.administrative_responsible_object = this.get_administrative_responsible_object()
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
      // console.log(this.scrum_user_list_url)
      axios.get(this.scrum_user_list_url).then(response => {
        this.responsible_list = response.data
      }).catch(error => console.log(error))
    }
  },
  created: function () {
    axios.get(this.url).then(response => (this.items = response.data))
    .catch(error => console.log(error))
    this.requestAllUser()
  }
}
</script>
<style scoped>
color: black
</style>
