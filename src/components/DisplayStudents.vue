<template>
  <div class="display">
    <table class="table table-bordered">
      <thead>
        <tr>
          <td v-for="(value, name) in data[0]" v-bind:key="name">{{ name }}</td>
        <tr>
      </thead>
      <tr v-for="student in data" v-bind:key="student.id">
        <td v-for="property in student" v-bind:key="property">{{ property }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'display',
  props: {
    data: Array
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
