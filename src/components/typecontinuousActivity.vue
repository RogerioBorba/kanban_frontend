<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="plusClicked">
             <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar tipo de atividade..."  class="blue--text mt-3" single-line  append-icon="search"  dark ></v-text-field>
        </v-toolbar>
        <form  v-show="showCreateOrUpdateItem">
          <v-text-field  label="Nome" v-model="actualItem.name" ></v-text-field>
          <v-select label="Tipo" v-model="actualItem.type" :items="type_dominio_list" item-text="dominio" item-value="id"  required></v-select>
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
  name: 'ContinuousActivity',
  data () {
    return {
      url: 'type-continuous-activity-list/',
      items: [],
      actualItem: {},
      showCreateOrUpdateItem: false,
      type_dominio_list: [],
      type_object: null
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
      if (anUrl === null) {
        return -1
      }
      // console.log(anUrl.slice(-1) == '/')
      let i = this.lastCharIsSlash(anUrl) ? 1 : 0
      return parseInt(anUrl.split('/').reverse()[i])
    },

    cancel () {
      this.showCreateOrUpdateItem = false
      this.actualItem = {}
    },
    updateOrCreateItem () {
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
          this.actualItem = {}
          this.showCreateOrUpdateItem = false
        }
        console.log(response.status)
      })
      .catch(error => console.log(error))
    },
    updateItem () {
      axios.put(this.url + this.actualItem.id + '/', this.actualItem).then(response => {
        if (response.status === 204) {
          this.actualItem = {}
        }
        console.log(response.status)
        this.showCreateOrUpdateItem = false
      })
      .catch(error => console.log(error))
    },
    plusClicked () {
      this.showCreateOrUpdateItem = true
      this.actualItem = {}
    },
    editItem (item) {
      this.actualItem = item
      this.showCreateOrUpdateItem = true
    },
    removeItem (item) {
      let index = this.items.indexOf(item)
      axios.delete(this.url + item.id + '/').then(response => console.log(response))
      .catch(error => console.log(error))
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    initializeTypeContinuousActivity () {
      axios.get(this.url).then(response => (this.items = response.data))
      .catch(error => console.log(error))
      axios.get(this.url + 'type-dominio-list/').then(response => (this.type_dominio_list = response.data))
      .catch(error => console.log(error))
    }
  },
  created: function () {
    this.initializeTypeContinuousActivity()
  }
}
</script>
<style scoped>
color: black
</style>
