<template>
  <div id="app">
    <UploadCSV v-if="!uploaded" @parsed="setData"></UploadCSV>
    <DisplayStudents v-if="uploaded" data="data"></DisplayStudents>
  </div>
</template>

<script>
import UploadCSV from './components/UploadCSV.vue'
import DisplayStudents from './components/DisplayStudents.vue'

export default {
  name: 'app',
  data: function() {
    return {
      uploaded: false,
      data: {}
    }
  },
  methods: {
    setData(data) {
      this.data = data
    }
  },
  components: {
    UploadCSV,
    DisplayStudents
  },
  created() {
    document.title = "Student allocator"
    console.log("Web created")
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
