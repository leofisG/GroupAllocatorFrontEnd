<template>
  <div class="display">
    <!-- Dialogs are at the bottom -->
    <v-app id="mainScreen">
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        :width="325"
        data-intro="All the filters will be shown in here. Click the '+' button for more filters"
        data-step="1"
      >
        <v-container>
          <v-btn color="error" dark large @click="backDialog = true">Go back</v-btn>
        </v-container>
        <Filters></Filters>
      </v-navigation-drawer>
      <v-app-bar app fixed clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img class="mx-2" max-width="4%" src="../assets/Logo/IB_LOGO_STACK_RGB_POSITIVE_RED.png"></v-img>
        <v-toolbar-title>GroupIt!</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1 white--text"
          justify-end
          @click="startSubmission"
        >Generate groups</v-btn>
      </v-app-bar>
      <v-content>
        <v-container class="fill-height is-fluid" fluid>
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
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td v-for="header in parsedHeaders" :key="header.text" :header="header">
                        <v-layout
                          v-if="header.type === &quot;booly&quot;"
                          align-center
                          justify-center
                        >
                          <v-icon
                            class="align-center justify-center"
                            v-if="propertyIsTruthy(item, header.value)"
                            color="green"
                          >mdi-check</v-icon>
                          <v-icon v-else color="red">mdi-close</v-icon>
                        </v-layout>
                        <span v-else>{{ item[header.value] }}</span>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
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
      <back-dialog
        :model="backDialog"
        @close="backDialog = false"
        @back="goBack"
        destination="the upload screen"
        lossWarning="The current file"
      ></back-dialog>
      <request-dialogs ref="requestDialogs" :repeat="false"></request-dialogs>
    </v-app>
  </div>
</template>

<script>
import Filters from "./Filters";
import { mapState } from "vuex";
import backDialog from "../dialogs/backDialog";
import { propertyIsTruthy } from "../utility/checkers";
import requestDialogs from "../dialogs/requestDialogs"

export default {
  name: "display",
  computed: {
    usedURL: {
      get() {
        if (this.$store.state.usedURL == this.$store.state.productionURL) {
          return 0;
        } else {
          return 1;
        }
      },
      set(index) {
        this.$store.commit("updateURL", index);
      }
    },
    ...mapState(["parsedStudents", "parsedHeaders"])
  },
  data() {
    return {
      search: "",
      drawer: null,
      backDialog: false,
    };
  },
  components: {
    Filters,
    "back-dialog": backDialog,
    "request-dialogs": requestDialogs
  },
  mounted() {
    const hasDisplayStudentGuideRanField = "hasDisplayStudentGuideRan";
    if (!this.$localStorage.get(hasDisplayStudentGuideRanField)) {
      setTimeout(function() {
        require("intro.js")().start();
      }, 1000);
      this.$localStorage.set(hasDisplayStudentGuideRanField, true);
    }
  },
  methods: {
    propertyIsTruthy,
    goBack() {
      this.$router.push({ path: "/uploadcsv" });
    },
    startSubmission() {
      this.$refs.requestDialogs.triggerSubmission();
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
