<template>
  <div class="groupings">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="325">
        <v-list dense>
          <v-list-item>
            <v-btn width="100%" color="error" dark large @click="backDialog = true">Go back</v-btn>
            <back-dialog
              v-if="backDialog"
              @close="backDialog = false"
              @back="goBack"
              destination="the allocation screen"
              lossWarning="Current groupings"
            ></back-dialog>
          </v-list-item>
        </v-list>
        <v-list v-if="unallocated.length > 0">
          <v-subheader>Unallocated students</v-subheader>
          <v-data-table
            dense
            :headers="headers"
            :items="unallocated"
            hide-default-footer
            item-key="id"
            class="elevation-1"
          ></v-data-table>
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
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="(group, index) in groups"
              :key="index"
              :group="group"
              :index="index"
            >
              <v-card height="100%">
                <v-list flat>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="headline mb-1 pa-2">Group {{index + 1}}</v-list-item-title>
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="group"
                        hide-default-footer
                        item-key="id"
                      ></v-data-table>
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
import { generate } from "../utility/parser/myparser";
import saveAs from "file-saver";
import { mapState } from "vuex";
import backDialog from "../dialogs/backDialog";

export default {
  name: "groupings",
  components: {
    "back-dialog": backDialog
  },
  computed: {
    ...mapState(["results"])
  },
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
          text: "Gender",
          value: "gender"
        },
        {
          text: "Age",
          value: "age"
        },
        {
          text: "Country",
          value: "country"
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
      this.$router.push({ path: "display-students" });
    },
    generateCSV() {
      const blob = generate(this.results);
      saveAs(blob, "results.csv");
      this.csvDialog = false;
    },
    generateGroups() {
      const students = this.results.students;
      const amount = this.results.numOfGroup;
      const unallocated = [];
      const groups = [];
      for (var i = 0; i < amount; i++) {
        groups.push([]);
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
