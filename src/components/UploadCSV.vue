<template>
  <div class="upload">
    <h1>Upload CSV here.</h1>
    <p>{{ fileName }}</p>
    <input type="file" ref="file" style="display: none" v-on:change="processCSV">
    <button v-if="noFile" @click="$refs.file.click()">Upload CSV</button>
    <button v-if="!noFile"> Continue</button>
  </div>
</template>

<script>
import { parse } from '../myparser'

export default {
  name: 'upload',
  data() {
    return {
      fileName: "Choose a file",
      file: null,
      noFile: true
    }
  },
  methods: {
    processCSV() {
      console.log("Processing CSV file")
      this.noFile = false
      this.file = this.$refs.file.files[0]
      this.fileName = `You have uploaded ${this.file.name}`
      parse(this.file, this)
    }
  }
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
