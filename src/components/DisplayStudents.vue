<template>
  <div class="display">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="325">
        <v-list dense class="fill-height">
            <v-list-item class="pa-2 ma-2" style="background-color: #FFBABA;" @click.stop="backDialog = true">
            <v-list-item-action>
              <v-icon>mdi-arrow-left-bold</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Go back</v-list-item-title>
            </v-list-item-content>
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
        <Filters
          v-bind:studentAmount="studentAmount"
          v-bind:student="data[0]"
          @update="updateFilters"
        ></Filters>
      </v-navigation-drawer>

      <v-app-bar app fixed clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Student Allocator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" justify-end @click="nextDialog = true">Submit allocation</v-btn>
        <v-dialog v-model="nextDialog" max-width="400">
          <v-card>
            <v-card-title class="headline justify-center">Allocate groups?</v-card-title>
            <v-card-text>Have you chosen the correct filters?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="nextDialog = false">back</v-btn>
              <v-btn color="green darken-1" text @click="sendRequest">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="resultDialog" max-width="400">
          <v-card>
            <v-card-title v-if="!results" class="headline justify-center">Loading results...</v-card-title>
            <v-card-title v-if="results" class="headline justify-center">Allocation successful!</v-card-title>
            <v-progress-circular v-if="!results" indeterminate color="primary"></v-progress-circular>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="cancelResults">Cancel</v-btn>
              <v-btn v-if="results" color="green darken-1" text @click="showResults">Show results</v-btn>
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
                  :headers="this.$root.headers"
                  :items="this.$root.data"
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

export default {
  name: "display",
  data: function() {
    return {
      search: "",
      drawer: null,
      results: null,
      backDialog: false,
      nextDialog: false,
      resultDialog: false,
      studentAmount: this.data.length,
      filters: {}
    };
  },
  components: {
    Filters
  },
  methods: {
    goBack() {
      this.$router.push({path: '/'})
    },
    sendRequest() {
      this.results = null;
      const display = this;
      const requestData = {
        filters: this.filters,
        students: this.$root.data
      };
      const xml = new XMLHttpRequest();
      xml.open(
        "POST",
        "https://organiser-app.herokuapp.com/allocateGroups",
        true
      );
      xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xml.onreadystatechange = () => {
        if (xml.readyState == 4) {
          if (xml.status == 200) {
            display.results = JSON.parse(xml.responseText);
          } else {
            // eslint-disable-next-line
            console.log(xml.status)
            // eslint-disable-next-line
            console.log(xml.responseText)
          }
        }
      };
      // eslint-disable-next-line
      console.log(filters)
      xml.send(JSON.stringify(requestData));
      this.nextDialog = false;
      this.resultDialog = true;
    },
    cancelResults() {
      this.resultDialog = false;
    },
    showResults() {
      this.$root.results = this.results
      this.$router.push({path: "display-groups"})
    },
    updateFilters(newFilters) {
      this.filters = newFilters;
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
