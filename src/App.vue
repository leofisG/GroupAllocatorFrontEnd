<template>
  <div id="app">
    <UploadCSV/>
  </div>
</template>

<script>
import UploadCSV from './components/UploadCSV.vue'

export default {
  name: 'app',
  components: {
    UploadCSV
  },
  created() {
    document.title = "Student allocator"
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
