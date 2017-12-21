<template>

</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  created: function () {
    this.$store.commit('set_token', null)
    this.$store.commit('set_user', null)
    console.log(this.$store.getters.has_token)
    this.$store.commit('set_current_component_name', 'login')
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title {
    font-family: 'Architects Daughter';
    font-size: 3em !important;
    color: #00b2cc;
  }
</style>
