<template>
  <div class="groupings">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="325">
        <v-list dense>
          <v-list-item
            class="pa-2 ma-2"
            style="background-color: #FFBABA;"
            @click.stop="backDialog = true"
          >
            <v-list-item-action>
              <v-icon>mdi-arrow-left-bold</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Go back</v-list-item-title>
            </v-list-item-content>
            <v-dialog v-model="backDialog" max-width="450">
              <v-card>
                <v-card-title class="headline justify-center">Go back to the allocation screen?</v-card-title>
                <v-card-text>Current groupings will be lost if you do!</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="backDialog = false">Stay</v-btn>
                  <v-btn color="red" text @click="goBack">Go back</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-item>
        </v-list>
        <v-list v-if="unallocated.length > 0">
            <v-subheader>Unallocated students</v-subheader>
            <v-list-item v-for="student in unallocated" :key="student.id">CID: {{student.id}}</v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Allocated groups</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" justify-end @click="csvDialog = true">Download CSV</v-btn>
        <v-dialog v-model="csvDialog" max-width="400">
          <v-card>
            <v-card-title class="headline justify-center">Download grouping CSV?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="csvDialog = false">No</v-btn>
              <v-btn color="green darken-1" text @click="generateCSV">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row class="fill-height" align="start" justify="center">
            <v-col>
              <v-card height="100%">
                  <v-list flat>
                      <v-list-item v-for="(group, index) in groups" :key="index" :group="group" :index="index">
                          <v-list-item-content>
                              <v-list-item-title>Group {{index + 1}}</v-list-item-title>
                              <v-list-item-subtitle v-for="student in group" :key="student.id" :student="student">CID: {{ student.id }}</v-list-item-subtitle>
                          </v-list-item-content>
                      </v-list-item>
                  </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { generate } from "../myparser";
import saveAs from "file-saver";

export default {
  name: "groupings",
  data: function() {
    return {
      search: "",
      drawer: null,
      csvDialog: false,
      backDialog: false,
      groups: [],
      unallocated: [],
      headers: [
        {
          text: "CID",
          value: "id"
        },
        {
          text: "Group number",
          align: "center",
          value: "groupId",
          filter: value => value != 0
        }
      ],
      unAllocHeaders: [
        {
          text: "CID",
          value: "id"
        },
        {
          text: "Group number",
          align: "center",
          value: "groupId",
          filter: value => value == 0
        }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.push({path: "display-students"})
    },
    generateCSV() {
      const blob = generate(this.$root.results);
      saveAs(blob, "results.csv");
      this.csvDialog = false;
    },
    generateGroups() {
      const students = this.$root.results.students;
      const amount = students[students.length - 1].groupId;
      const unallocated = [];
      const groups = [];
      for (var i = 0; i < amount; i++) {
          groups.push([])
      }
      for (const student of students) {
        if (student.groupId == 0) {
          unallocated.push(student);
        } else {
          groups[student.groupId - 1].push(student);
        }
      }
      this.groups = groups;
      this.unallocated = unallocated;
    }
  },
  created() {
    this.generateGroups();
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