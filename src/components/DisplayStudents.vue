<template>
  <div class="display">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="325">
        <v-list dense>
          <v-list-item>
            <v-btn width="100%" color="error" dark large @click="backDialog = true">Go back</v-btn>
            <back-dialog
              v-if="backDialog"
              @close="backDialog = false"
              @back="goBack"
              destination="the upload screen"
              lossWarning="The current file"
            ></back-dialog>
          </v-list-item>
        </v-list>
        <Filters></Filters>
      </v-navigation-drawer>
      <v-app-bar app fixed clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Student Allocator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1 white--text"
          justify-end
          @click="checkSubmission"
        >Submit allocation</v-btn>
        <v-dialog v-model="warningDialog">
          <v-card>
            <v-card-title class="headline justify-center">Error in filters!</v-card-title>
            <v-alert class="mx-5" type="error">Please correct errors in the following filters:</v-alert>
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
        <v-dialog v-model="nextDialog">
          <v-card>
            <v-card-title class="headline justify-center">Allocate groups?</v-card-title>
            <v-alert class="mx-5" type="info">Have you chosen the correct filters?</v-alert>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="nextDialog = false">back</v-btn>
              <v-btn color="green darken-1" text @click="prepareRequest">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="resultDialog">
          <v-card>
            <v-card-title
              v-if="!results"
              class="headline justify-center"
            >Generating Group Allocation...</v-card-title>
            <v-card-title v-if="results" class="headline justify-center">Allocation successful!</v-card-title>
            <v-alert v-if="results" class="mx-5" type="info">{{ allocationMessage }}</v-alert>
            <v-progress-circular v-if="!results" indeterminate color="primary"></v-progress-circular>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="cancelResults">Cancel</v-btn>
              <v-btn v-if="results" color="green darken-1" text @click="showResults">Show results</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="errorDialog">
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
              <v-card>
              <v-btn-toggle class="mx-5" v-model="usedURL" mandatory>
                <v-btn>Master</v-btn>
                <v-btn>Sprint</v-btn>
              </v-btn-toggle>
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
import backDialog from "../dialogs/backDialog";
import { merge } from "lodash";

export default {
  name: "display",
  computed: {
    usedURL: {
      get() {
        if (this.$store.state.usedURL == this.$store.state.productionURL) {
          return 0
        } else {
          return 1
        }
      },
      set(index) {
        this.$store.commit('updateURL', index)
      }
    },
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
    Filters,
    "back-dialog": backDialog
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
        map[student.id] = {
          groupId: student.groupId,
          timezone: student.timezone
        };
      }
      for (const student of students) {
        merge(student, map[student.id]);
      }
      this.$store.commit("updateResultStudents", students);
    },
    generateResultMessage(response) {
      let message = `${response.numOfGroup} groups allocated`;
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
