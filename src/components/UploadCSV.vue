<template>
  <div class="upload">
    <v-app id="upload">
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Upload a CSV file</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-file-input
                      @change="resetMsg"
                      v-model="file"
                      ref="file"
                      accept=".csv"
                      label="Upload CSV"
                      show-size
                    ></v-file-input>
                  </v-form>
                  <v-alert
                    type="error"
                    v-bind:style="messageStyle"
                    v-if="message != &quot;&quot;"
                  >{{ message }}</v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="this.file" @click="parse" color="primary">Continue</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { parse } from "../utility/parser/myparser";

export default {
  name: "upload",
  data() {
    return {
      message: "",
      messageStyle: {
        color: "black"
      },
      file: null,
      validFile: true
    };
  },
  methods: {
    processCSV() {
      this.noFile = false
      this.file = this.$refs.file.files[0]
      this.fileName = `You have uploaded ${this.file.name}`
      parse(this.file)
    },
    resetMsg() {
      this.message = "";
    },
    parse() {
      parse(this.file, this);
    },
    displayErrors(amount) {
      this.file = null;
      this.message = `There were ${amount} errors parsing the csv file!`;
    }
  }
};
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
