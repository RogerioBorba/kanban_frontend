<template>
  <v-app>
    <template>
      <v-layout row justify-center style="position: relative;">
        <template>
          <v-layout row justify-center>
              <v-dialog v-model="dialog" persistent max-width="500px">
                <v-card>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-menu lazy  :close-on-content-click="true"  v-model="menu_inicial"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                            <v-text-field slot="activator" label="Data inicio" v-model="data_inicio" prepend-icon="event" readonly ></v-text-field>
                            <v-date-picker  v-model="data_inicio" no-title scrollable actions>
                            </v-date-picker>
                          </v-menu>
                        </v-flex>
                        <v-flex xs12>
                             <v-menu lazy  :close-on-content-click="true"  v-model="menu_final"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
                               <v-text-field slot="activator" label="Data de entrega" v-model="data_devida" prepend-icon="event" readonly ></v-text-field>
                               <v-date-picker v-model="data_devida" no-title scrollable actions>
                               </v-date-picker>
                             </v-menu>
                        </v-flex>
                        <v-flex xs12>
                          <v-select label="Responsável" v-model="responsible_object" :items="responsible_list" item-text="name" @blur="blurSelectedResponsible" required></v-select>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field label="Nome da tarefa" required v-model="actualItem.name"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field label="Descrição da tarefa" hint="Informações para descrever a tarefa"  v-model="actualItem.description"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-select label="Status" v-model="status_object" :items="status_task_list" item-text="dominio" @blur="blurSelectedStatusTask" required></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select label="Projeto" v-model="project_object" :items="project_list" item-text="name" @blur="blurSelectedProject"></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select label="Sprint" v-model="actualItem.sprint_object" :items="sprint_list" item-text="username" @blur="blurSelectedSprint"></v-select>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*Campos requeridos</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="confirmCreateOrEditTask">Confirmar</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="cancelCreateOrEditTask">Cancelar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>
          </template>
      </v-layout>
    </template>
    <v-layout row wrap>
      <v-flex xs3>
        <v-card class="primary yellow darken-3">
          <v-card-text class="px-0">A fazer</v-card-text>
          <v-btn  icon v-tooltip:top="{ html: 'Incluir uma nova tarefa' }" slot="activator" @click="itemToDoAddClicked">
                <v-icon class="white--text">add</v-icon>
          </v-btn>

        </v-card>
        <v-card class="secondary ma-1 amber lighten-4"  v-for="(item, index) in cards_to_do()" :key="index">
          <v-card-title class="px-1 text-xs-left" >
              <div>
                <span class="dark--text">{{item.started}}</span><br>
                <span>{{item.responsible}}</span>
                <span>{{item.name}}</span><br>

              </div>
          </v-card-title>
          <v-card-actions>
            <v-btn icon v-tooltip:top="{ html: 'Editar tarefa' }" @click="itemEditClicked(item)">
                  <v-icon class="gray--text">edit</v-icon>
            </v-btn>
            <v-btn icon v-tooltip:top="{ html: 'Remover tarefa' }" @click="itemDeleteClicked(item)">
                  <v-icon class="gray--text">delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card class="primary">
          <v-card-text class="px-0">Fazendo</v-card-text>
        </v-card>
        <v-card class="secondary ma-1  indigo lighten-4"  v-for="(item, index) in cards_doing()" :key="index">
          <v-card-text class="px-1 text-xs-left">
            <div class="ma-0">
              <span style="float:left">{{item.started}} </span>
              <span style="float:right">{{item.responsible}} </span>
            </div>
          </v-card-text>
          <v-card-text class="px-0">
            <div class="ma-0">
              <span style="float:center">{{item.name}} </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn icon v-tooltip:top="{ html: 'Editar tarefa' }" @click="itemEditClicked(item)">
                  <v-icon class="gray--text">edit</v-icon>
            </v-btn>
            <v-btn icon v-tooltip:top="{ html: 'Remover tarefa' }" @click="itemDeleteClicked(item)">
                  <v-icon class="gray--text">delete</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon v-tooltip:top="{ html: 'Detalhes da tarefa'}" @click.native="itemDetailClicked(item)">
                <v-icon class="white--text">{{item.arrowDetail}}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-slide-y-transition>
            <v-card-text v-show="item.showDetail"> {{item.description}}</v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card class="green">
          <v-card-text class="px-0">Feito</v-card-text>
        </v-card>
        <v-card class="secondary ma-1 green lighten-4"  v-for="(item, index) in cards_done()" :key="index">
          <v-card-text class="px-1 text-xs-left">{{item.name}}</v-card-text>
          <v-card-actions>
            <v-btn icon v-tooltip:top="{ html: 'Editar tarefa' }" @click="itemEditClicked(item)">
                  <v-icon class="gray--text">edit</v-icon>
            </v-btn>
            <v-btn icon v-tooltip:top="{ html: 'Remover tarefa' }" @click="itemDeleteClicked(item)">
                  <v-icon class="gray--text">delete</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon v-tooltip:top="{ html: 'Detalhes da tarefa'}" @click.native="itemDetailClicked(item)">
                <v-icon class="white--text">{{item.arrowDetail}}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card class="red">
          <v-card-text class="px-0">Pendente</v-card-text>
        </v-card>
        <v-card class="secondary ma-1 deep-orange lighten-4"  v-for="(item, index) in cards_pending()" :key="index">
          <v-card-text class="px-1 text-xs-left">{{item.name}}</v-card-text>
          <v-card-actions>
            <v-btn icon v-tooltip:top="{ html: 'Editar tarefa' }" @click="itemEditClicked(item)">
                  <v-icon class="gray--text">edit</v-icon>
            </v-btn>
            <v-btn icon v-tooltip:top="{ html: 'Remover tarefa' }" @click="itemDeleteClicked(item)">
                  <v-icon class="gray--text">delete</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon v-tooltip:top="{ html: 'Detalhes da tarefa'}" @click.native="itemDetailClicked(item)">
                <v-icon class="white--text">{{item.arrowDetail}}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-flex>

    </v-layout>
</v-app>
</template>
<script>
import {config} from './config';
import axios from 'axios';

export default {

  name: 'Tarefa',
  data() {
    return {
      url: '',
      dialog: false,
      dialog_title: '',
      items: [],
      hasToAddOrEditTask: false,
      isNewTask: false,
      data_inicio: null,
      data_devida: null,
      menu_inicial: false,
      menu_final: false,
      status: 1,
      username: null,
      responsible_list: [],
      sprint_list: [],
      project_list: [],
      status_task_list: [],
      status_object: null,
      sprint_object: null,
      responsible_object: null,
      project_object: null,
      sprint_list_url: 'sprint-list/',
      project_list_url: 'project-list/',
      scrum_user_list_url: 'scrum-user-list/',

      actualItem: {}
    }
  },
  methods: {
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
    clearFieldsForm() {
      this.sprint_object =  null;
      this.responsible_object = null;
      this.project_object = null;
      this.data_inicial = null;
      this.data_devida = null;
      this.menu_inicial = false;
      this.menu_final = false;
      this.status = 1;
      this.actualItem = {};
      this.hasToAddOrEditTask = false;
      this.isNewTask = false;
    },
    itemDetail(cards, anItem, index) {
        let  nCard = {};
        nCard.impediments= anItem.inpediments;
        nCard.id= anItem.id
        nCard.name = anItem.name;
        nCard.description = anItem.description;
        nCard.status = anItem.status;
        nCard.order = anItem.order;
        nCard.started = anItem.started;
        nCard.due = anItem.due;
        nCard.completed = anItem.completed;
        nCard.sprint = anItem.sprint;
        nCard.responsible = anItem.responsible;
        nCard.showDetail = !anItem.showDetail;
        nCard.arrowDetail =  !anItem.showDetail? 'keyboard_arrow_down' : 'keyboard_arrow_up';
        cards.splice(index,1, nCard);
        this.actualItem = nCard;
    },
    itemDetailClicked(anItem, index) {
        this.itemDetail(this.itemsToDo(), anItem, index)
    },
    itemDoingDetailClicked(anItem, index) {
        this.itemDetail(this.itemsDoing(), anItem, index)
    },
    itemDoneDetailClicked(anItem, index) {
        this.itemDetail(this.itemsDone(), anItem, index)
    },
    itemPendingClicked(anItem, index) {
        this.itemDetail(this.itemsPending, anItem, index)
    },
    itemToDoAddClicked() {
      this.clearFieldsForm();
      this.isNewTask = true;
      this.dialog_title = 'Criar nova tarefa';
      this.dialog = true;
      this.actualItem = {};
      this.status_object = this.status_task_list.filter(anItem=> anItem.id==1)[0];
      console.log(this.status_task_list);
      //this.requestAllProject();
      //this.requestAllUser();
    },
    itemEditClicked(item) {
      this.dialog_title= 'Editar uma tarefa';
      this.dialog = true;
      this.actualItem = item;
      this.data_inicio = this.actualItem.started;
      this.data_devida = this.actualItem.due;
      this.isNewTask = false;
      //this.requestAllProject();
      //this.requestAllUser();
      //this.requestAllSprintForProject();
      this.responsible_object = this.get_responsible_object(this.items);
      this.status_object = this.get_status_object();
      this.data_inicio = item.started;
      this.data_devida = item.due;
      let l = this.responsible_list.length;
      //console.log(`List: ${l}`);
      //console.log(this.responsible_object);

    },
    itemDeleteClicked(item) {
        let iri = this.url  + item.id + '/';
        let idx = this.items.indexOf(item);
        console.log(idx);
        axios.delete(iri).then(response => {
          console.log(iri + ' Deleted');
          this.items.splice(idx, 1);
        }).catch(error => { console.log(error); });
    },
    createNewTask() {
      axios.post(this.url, this.actualItem).then( response => {
          if (response.status == 201) {
            this.actualItem.id = this.idFromUrl(response.headers['content-location']);
            this.items.push(this.actualItem);
            console.log(this.items);
            console.log(this.cards_to_do());
            this.clearFieldsForm();
            this.actualItem = {};
            console.log(this.items);
            console.log(this.cards_to_do());
            this.showCreateOrUpdateItem = false;
          }
        })
      .catch(error => {
        console.log(error);
      });
    },
    updateTask() {
      let iri = this.url + this.actualItem.id + '/' ;
      axios.put(iri, this.actualItem).then( response => {
          if (response.status == 204) {
            this.clearFieldsForm();
            this.actualItem = {};
            this.hasToAddOrEditTask = false;
            //this.refrehItems();
          }
        })
      .catch(error => {
        console.log(error);
      });
    },
    confirmCreateOrEditTask() {
        this.dialog= false;
        this.actualItem.started = this.data_inicio;
        this.actualItem.due = this.data_devida;
        this.actualItem.status = this.status_object.id;
        if (this.isNewTask)
          this.createNewTask()
        else
          this.updateTask()
    },
    cancelCreateOrEditTask() {
        this.dialog= false;
    },
    blurSelectedResponsible() {
      this.actualItem.responsible = axios.defaults.baseURL + this.scrum_user_list_url  + this.responsible_object.id + '/';
    },
    blurSelectedSprint() {
      this.actualItem.sprint = axios.defaults.baseURL + this.sprint_list_url  + this.sprint_object.id + '/';
    },
    blurSelectedProject() {
      this.actualItem.project = axios.defaults.baseURL + this.project_list_url  + this.project_object.id + '/';
      this.requestAllSprintForProject();

    },
    blurSelectedStatusTask() {
      this.status = this.status_object.id;
    },
    requestAllProject() {
          axios.get(this.project_list_url).then(response => {
          this.project_list = response.data;
    }).catch(error => {console.log(error);});
    },
    requestTaskDominioList() {
      let iri = this.url + 'status-dominio-list/';
      axios.get(iri).then(response => {
      this.status_task_list = response.data;
    }).catch(error => {console.log(error);});
    },
    requestAllUser() {
        //console.log(this.scrum_user_list_url);
        axios.get(this.scrum_user_list_url).then(response => {
            this.responsible_list = response.data;
        }).catch(error => { console.log(error); });
    },
    requestAllSprintForProject() {
      return [];
    },
    get_responsible_object()  {
        let genericItem = null;
        if (this.actualItem.responsible == null)
          return null;
        let newid = this.idFromUrl(this.actualItem.responsible);
        console.log(`Newid: ${newid}`);
        this.responsible_list.forEach(function(anItem) {
            if (anItem.id == newid) {
                genericItem = anItem;
                return genericItem;
            }
        });
        return genericItem;
      },
    get_status_object() {
      let genericItem = null;
      let newid = this.actualItem.status;
      this.status_task_list.forEach(function(anItem) {
          if (anItem.id == newid) {
              genericItem = anItem;
              return genericItem;
          }
      });
      return genericItem;
    },

    cards_to_do() {
      return this.items.filter(anItem=> anItem.status ==1 )
    },
    cards_doing() {
      return this.items.filter(anItem=> anItem.status ==2 )
    },
    cards_pending() {
      return this.items.filter(anItem=> anItem.status ==3 )
    },
    cards_done() {
      return this.items.filter(anItem=> anItem.status ==4 )
    },

  },
  created: function () {
        this.url = "task-list/";
        axios.get(this.url).then(response => {
                this.items = response.data;
                //this.refrehItems();
        })
        .catch(error => {
          console.log(error);
        });
        this.requestAllUser();
        this.requestTaskDominioList();
    }
}

</script>
