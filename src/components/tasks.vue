<template>
	<v-layout row wrap xs12>

		<task-card	:users="users" tabColor="yellow darken-2"	name="A fazer" :add="true"	cardColor="yellow lighten-2" :status="1"></task-card>

		<task-card  :users="users" tabColor="blue"	name="Fazendo" cardColor="blue lighten-2" :status="2"></task-card>

		<task-card	:users="users" tabColor="green" name="Feito"	cardColor="green lighten-2"	:status="4"></task-card>

		<task-card	:users="users" tabColor="red" 	name="Pendente"	cardColor="red lighten-2"	:status="3"></task-card>

	</v-layout>
</template>

<script>
import taskcard from './TaskCard'
import axios from 'axios'

export default {
  components: {
    'task-card': taskcard
  },
  data () {
    return {
      users: []
    }
  },
  methods: {
    getDone () {
      setTimeout(() => {
        this.getTasksList.map(task => task.status === 4 ? this.done.push(task) : null)
      }, 200)
    }
  },
  created() {
    this.url = 'task-list/'
    axios.get(this.url).then(response => {
      let items = response.data;
      this.$store.state.tasks = items;
    })
    .catch(error => {
      console.log(error)
    })
    axios.get('user-list/').then(res => (this.users = res.data))
    .catch(error => console.log(error))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
