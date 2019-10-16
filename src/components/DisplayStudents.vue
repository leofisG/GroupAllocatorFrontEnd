<template>
  <div class="display">
    <h1>Upload done</h1>
  </div>
</template>

<script>
export default {
  name: 'display',
  props: ['data'],
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
