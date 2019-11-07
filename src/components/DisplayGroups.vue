<template>
  <div class="groupings">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped temporary :width="500">
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
            :headers="unallocHeaders"
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
        <v-btn
          v-if="isModified"
          class="mx-5"
          color="orange"
          @click="resetDialog = true"
        >Reset groupings</v-btn>
        <v-dialog v-model="resetDialog" max-width="400">
          <v-card>
            <v-card-title class="headline justify-center">Reset to original groupings?</v-card-title>
            <v-alert class="mx-5" type="warning">This action cannot be undone!</v-alert>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="resetDialog = false">No</v-btn>
              <v-btn color="red" text @click="resetGroupings">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
        <v-dialog v-model="deleteDialog" max-width="600">
          <v-card>
            <v-card-title
              class="headline justify-center"
            >Remove student with ID {{ selectedStudentId }} from Group {{ selectedGroupId }}?</v-card-title>
            <v-alert
              class="mx-5"
              type="warning"
              v-if="lastWarning"
            >Warning, removing this student will delete the group!</v-alert>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteDialog=false">No</v-btn>
              <v-btn color="red" text @click="confirmUnalloc">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
                      <v-list-item-title class="headline mb-1 pa-2">
                        Group {{index + 1}}
                        <group-checker v-bind:group="group"></group-checker>
                      </v-list-item-title>
                      <v-data-table
                        dense
                        :headers="headers"
                        :items="group"
                        hide-default-footer
                        item-key="id"
                      >
                        <template v-slot:item.action="{ item }">
                          <v-icon small @click="unallocateStudent(item)">delete</v-icon>
                        </template>
                      </v-data-table>
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
import Checker from "./Checker";

export default {
  name: "groupings",
  components: {
    "back-dialog": backDialog,
    "group-checker": Checker
  },
  computed: {
    selectedStudentId() {
      if (this.selectedStudent) {
        return this.selectedStudent.id;
      } else {
        return "no_id";
      }
    },
    selectedGroupId() {
      if (this.selectedStudent) {
        return this.selectedStudent.groupId;
      } else {
        return "no_group";
      }
    },
    ...mapState(["results"])
  },
  data: function() {
    return {
      search: "",
      drawer: null,
      csvDialog: false,
      backDialog: false,
      deleteDialog: false,
      lastWarning: false,
      resetDialog: false,
      isModified: false,
      selectedStudent: null,
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
        },
        {
          text: "Action",
          value: "action",
          sortable: false
        }
      ],
      unallocHeaders: [
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
    },
    resetGroupings() {
      this.$store.commit("resetResults");
      this.generateGroups();
      this.resetDialog = false;
      this.isModified = false;
    },
    unallocateStudent(student) {
      this.selectedStudent = student;
      if (this.groups[student.groupId - 1].length == 1) {
        this.lastWarning = true;
      } else {
        this.lastWarning = false;
      }
      this.deleteDialog = true;
    },
    confirmUnalloc() {
      const student = this.selectedStudent;
      console.log(student);
      this.$set(
        this.groups,
        student.groupId - 1,
        this.groups[student.groupId - 1].filter(e => e != student)
      );
      // If group is now empty, remove and shift everyone down
      if (this.groups[student.groupId - 1].length == 0) {
        this.shiftGroups(student.groupId - 1);
      }
      student.groupId = 0;
      this.unallocated.push(student);
      this.deleteDialog = false;
      this.isModified = true;
    },
    shiftGroups(id) {
      this.$delete(this.groups, id);
      for (var i = id; i < this.groups.length; i++) {
        const group = this.groups[i];
        for (const student of group) {
          student.groupId = student.groupId - 1;
        }
      }
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
