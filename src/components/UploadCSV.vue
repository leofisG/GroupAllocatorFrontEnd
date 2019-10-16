<template>
  <div class="upload">
    <h1>Upload CSV here.</h1>
    <p v-bind:style="messageStyle">{{ message }}</p>
    <input type="file" ref="file" style="display: none" v-on:change="processCSV">
    <button v-if="noFile" @click="$refs.file.click()">Upload CSV</button>
    <button v-if="!noFile" @click="parse"> Continue</button>
  </div>
</template>

<script>
import { parse } from '../myparser'

export default {
  name: 'upload',
  data() {
    return {
      message: "Choose a file",
      messageStyle: {
        color: 'black'
      },
      file: null,
      noFile: true
    }
  },
  methods: {
    processCSV() {
      console.log("Processing CSV file")
      this.noFile = false
      this.file = this.$refs.file.files[0]
      this.messageStyle.color = 'black'
      this.message = `You have uploaded ${this.file.name}`
    },
    parse() {
        parse(this.file, this)
    },
    displayErrors(amount) {
      this.noFile = true
      this.file = null
      this.messageStyle.color = 'red'
      this.message = `There were ${amount} errors parsing the csv file!`
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
