<template>
  <div class="display">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="325">
        <v-list dense>
          <v-list-item>
            <v-btn width="100%" color="error" dark large @click="backDialog = true">Go back</v-btn>
            <v-dialog v-model="backDialog" max-width="400">
              <v-card>
                <v-card-title class="headline justify-center">Go back to the upload screen?</v-card-title>
                <v-card-text>Your work will be lost if you do!</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="backDialog = false">Stay</v-btn>
                  <v-btn color="red" text @click="goBack">Go back</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-item>
        </v-list>
        <Filters></Filters>
      </v-navigation-drawer>
      <v-app-bar app fixed clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Student Allocator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" justify-end @click="checkSubmission">Submit allocation</v-btn>
        <v-dialog v-model="warningDialog" max-width="400">
          <v-card>
            <v-card-title class="headline justify-center">Error in filters!</v-card-title>
            <v-card-text>Please correct errors in the following filters:</v-card-text>
            <v-list>
              <v-list-item
                v-for="warning in warnings"
                :key="warning"
                :v-bind:warning="warning"
              >{{warning}}</v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="warningDialog = false">back</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="nextDialog" max-width="400">
          <v-card>
            <v-card-title class="headline justify-center">Allocate groups?</v-card-title>
            <v-card-text>Have you chosen the correct filters?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="nextDialog = false">back</v-btn>
              <v-btn color="green darken-1" text @click="prepareRequest">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="resultDialog" max-width="400">
          <v-card>
            <v-card-title
              v-if="!results"
              class="headline justify-center"
            >Generating Group Allocation...</v-card-title>
            <v-card-title v-if="results" class="headline justify-center">Allocation successful!</v-card-title>
            <v-card-text v-if="results">{{ allocationMessage }}</v-card-text>
            <v-progress-circular v-if="!results" indeterminate color="primary"></v-progress-circular>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="cancelResults">Cancel</v-btn>
              <v-btn v-if="results" color="green darken-1" text @click="showResults">Show results</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="errorDialog" max-width="400">
          <v-card>
            <v-card-title class="headline justify-center">Server error occured!</v-card-title>
            <v-card-text>Status: {{ error.status }}</v-card-text>
            <v-card-text>Message: {{ error.message }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="errorDialog = false">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="prepareRequest">Try again</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>

      <v-content>
        <v-container class="fill-height" fluid>
          <v-row class="fill-height" align="start" justify="center">
            <v-col>
              <v-card height="100%">
                <v-card-title>
                  Students
                  <v-spacer></v-spacer>
                  <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="parsedHeaders"
                  :items="parsedStudents"
                  :footer-props="{
                     'items-per-page-options': [20, 50, 100, -1]
                  }"
                  :items-per-page="20"
                  :search="search"
                  class="elevation-1"
                  loading-text="Loading... Please wait"
                ></v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Filters from "./Filters";
import { mapState } from "vuex";
import sendRequest from "../utility/request";

export default {
  name: "display",
  computed: {
    ...mapState([
      "parsedStudents",
      "parsedHeaders",
      "filters",
      "results",
      "warnings"
    ])
  },
  data: function() {
    return {
      search: "",
      drawer: null,

      backDialog: false,
      warningDialog: false,
      nextDialog: false,
      errorDialog: false,
      resultDialog: false,

      allocationMessage: "",
      error: {}
    };
  },
  components: {
    Filters
  },
  methods: {
    prepareRequest() {
      this.errorDialog = false;
      this.error = {};
      this.$store.commit("removeResults");
      sendRequest(this);
      this.nextDialog = false;
      this.resultDialog = true;
    },
    goBack() {
      this.$router.push({ path: "/" });
    },
    cancelResults() {
      this.resultDialog = false;
    },
    showResults() {
      this.combineResults();
      this.$router.push({ path: "display-groups" });
    },
    combineResults() {
      const results = this.results.students;
      const students = this.parsedStudents;
      const map = {};
      for (const student of results) {
        map[student.id] = student.groupId;
      }
      for (const student of students) {
        student["groupId"] = map[student.id];
      }
      this.$store.commit("updateResultStudents", students);
    },
    generateResultMessage(response) {
      var message = `${response.numOfGroup} groups allocated`;
      if (response.numOfUnalloc == 1) {
        message += ", 1 student could not be allocated";
      } else if (response.numOfUnalloc > 1) {
        message += `, ${response.numOfUnalloc} students could not be allocated`;
      }
      message += ".";
      return message;
    },
    checkSubmission() {
      if (this.warnings.length > 0) {
        this.warningDialog = true;
      } else {
        this.nextDialog = true;
      }
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
