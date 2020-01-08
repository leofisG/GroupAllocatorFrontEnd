<template>
  <div id="upload">
    <v-app>
      <v-content>
        <v-container fluid height="100%" class="is-fluid">
          <v-row justify="start">
            <v-img max-width="10%" src="../assets/Logo/IB_LOGO_STACK_RGB_POSITIVE_RED.png"></v-img>
          </v-row>
          <v-row justify="center">
            <v-col cols="6">
              <h2 class="display-1 mx-3">GroupIt!</h2>
            </v-col>
          </v-row>
          <v-row justify="center" id="upload-row">
            <v-col cols="6" justify="center">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-spacer></v-spacer>
                  <v-toolbar-title>Start by uploading a student data CSV file</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-file-input
                      @change="processCSV"
                      v-model="file"
                      ref="file"
                      accept=".csv"
                      label="Choose a CSV file"
                      show-size
                    ></v-file-input>
                  </v-form>
                  <v-alert type="error" v-if="message != &quot;&quot;">
                    <h6>The following errors prevent parsing!</h6>
                    <v-divider />
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>{{ errors.length }} Error(s)</v-expansion-panel-header>
                        <v-expansion-panel-content v-for="error in errors" :key="error">{{ error }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-alert>
                  <v-alert type="warning" v-bind:style="messageStyle" v-if="warnings.length > 0">
                    <h6>The following issues may cause incorrect or incomplete allocation, continue if you are certain!</h6>
                    <v-divider />
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>{{ warnings.length }} Warning(s)</v-expansion-panel-header>
                        <v-expansion-panel-content
                          v-for="warning in warnings"
                          :key="warning"
                        >{{ warning }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="!this.file || this.errors.length > 0 || !finishedParsing"
                    @click="commitUpload"
                    color="primary"
                  >Continue</v-btn>
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
      errors: [],
      warnings: [],
      messageStyle: {
        color: "black"
      },
      file: null,
      finishedParsing: false
    };
  },
  methods: {
    processCSV() {
      this.reset();
      if (this.file) {
        parse(this.file, this);
      }
    },
    commitUpload() {
      this.$router.push({ path: "display-students" });
    },
    reset() {
      this.finishedParsing = false;
      this.message = "";
      this.errors = [];
      this.warnings = [];
    },
    displayErrors(errors) {
      if (errors.length === 1) {
        this.message = `There was ${errors.length} error parsing the csv file!`;
      } else {
        this.message = `There were ${errors.length} errors parsing the csv file!`;
      }
      this.errors = errors;
    },
    displayWarnings(warnings) {
      this.warnings = warnings;
    },
    finishParsing() {
      this.finishedParsing = true;
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
