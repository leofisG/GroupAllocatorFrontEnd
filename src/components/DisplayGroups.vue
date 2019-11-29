<template>
  <div class="groupings">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="400">
        <v-container>
          <v-btn color="error" dark large @click="backDialog = true">Go back</v-btn>
        </v-container>
        <v-container v-if="unallocated.length > 0">
          <p>
            <v-icon color="orange">mdi-exclamation</v-icon>
            {{ unallocated.length }} unallocated students
          </p>
          <table class="table is-narrower is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th><input type="checkbox" v-model="toggleState" /></th>
                <th v-for="header in unallocHeaders" :key="header.text">{{ header.text }}</th>
              </tr>
            </thead>
            <draggable
              class="list-group"
              v-model="unallocated"
              group="people"
              tag="tbody"
              @change="log"
            >
              <tr v-for="student in unallocated" :key="student.id" :student="student">
                <td><input v-model="selectedStates[$index]" type="checkbox"></td>
                <td
                  v-for="header in unallocHeaders"
                  :key="header.text"
                  :header="header"
                >{{ header.value === null ? header.function(student) : student[header.value] }}</td>
              </tr>
            </draggable>
            <!-- Implement a delete button in this slot -->
            <!-- Custom country/timezone display -->
          </table>
          <v-row>
            <v-col cols="6">
            <v-btn
              class="mx-5"
              color="orange"
              :disabled="addButtonDisabled"
              @click="editDialog = true"
            >Add to Group</v-btn>
            </v-col>
            <v-col cols="6">
            <v-btn
              class="mx-5"
              color="green"
              :disabled="newButtonDisabled"
              @click="newDialog = true"
            >New group</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-alert
          v-if="unallocated.length == 0"
          class="mx-5"
          type="success"
        >All students have been allocated!</v-alert>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img class="mx-2" max-width="4%" src="../assets/Logo/IB_LOGO_STACK_RGB_POSITIVE_RED.png"></v-img>
        <v-toolbar-title>Allocated groups</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="finishedAllocation && groups.length > 0"
          color="error"
          dark
          class="mx-2"
          @click="deleteAllDialog = true"
          justify-end
        >Delete all groups</v-btn>
        <v-btn
          v-if="finishedAllocation && isModified"
          class="mx-2 white--text"
          color="orange"
          @click="resetDialog = true"
        >Reset groupings</v-btn>
        <v-btn
          class="mx-2"
          color="green darken-1 white--text"
          justify-end
          @click="csvDialog = true"
        >Download CSV</v-btn>
      </v-app-bar>
      <v-content>
        <v-container class="fill-height mx-4" fluid>
          <v-row v-if="groups.length == 0" align="center" class="fill-height">
            <v-col cols="12" class="fill-height">
              <v-alert type="warning">No Groups have been allocated!</v-alert>
            </v-col>
          </v-row>
          <v-row v-if="groups.length > 0" class="fill-height" align="start" justify="center">
            <transition-group name="slide-fade" tag="div" class="row layout wrap">
              <v-col
                cols="3"
                sm="12"
                md="6"
                lg="6"
                xl="4"
                v-for="group in groups"
                :key="group.groupId"
                :group="group"
              >
                <v-card height="100%">
                  <v-list flat>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1 pa-2">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" medium @click="removeGroup(group.groupId)">delete</v-icon>
                            </template>
                            <span>Delete the whole group</span>
                          </v-tooltip>
                          Group {{ group.groupId }}
                          <group-checker :group="group.students"></group-checker>
                        </v-list-item-title>
                        <!-- To implement draggable tables with v-data-table is clunky -->
                        <table class="table is-narrower is-hoverable is-fullwidth">
                          <thead>
                            <tr>
                              <th v-for="header in headers" :key="header.text">{{ header.text }}</th>
                              <th></th>
                            </tr>
                          </thead>
                          <draggable
                            class="list-group"
                            v-model="group.students"
                            group="people"
                            tag="tbody"
                            @change="log"
                          >
                            <tr
                              v-for="student in group.students"
                              :key="student.id"
                              :student="student"
                            >
                              <td
                                v-for="header in headers"
                                :key="header.text"
                                :header="header"
                              >{{ header.value === null ? header.function(student) : student[header.value] }}</td>
                              <td>
                                <v-tooltip right>
                                  <template v-slot:activator="{ on }">
                                    <v-icon
                                      v-on="on"
                                      small
                                      @click="unallocateStudent(student)"
                                    >delete</v-icon>
                                  </template>
                                  <span>Remove from group</span>
                                </v-tooltip>
                              </td>
                            </tr>
                          </draggable>
                          <!-- Implement a delete button in this slot -->
                          <!-- Custom country/timezone display -->
                        </table>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </transition-group>
          </v-row>
        </v-container>
      </v-content>
      <!-- Dialogs -->
      <back-dialog
        :model="backDialog"
        @close="backDialog = false"
        @back="goBack"
        destination="the allocation screen"
        lossWarning="Current groupings"
      ></back-dialog>
      <v-dialog v-model="editDialog">
        <v-card>
          <v-card-title class="headline justify-center">Select a group to add to</v-card-title>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <v-select
                  class="mx-5"
                  v-model="editGroupId"
                  :items="groupNumbers"
                  label="Group number"
                ></v-select>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <b>The new group:</b>
                <group-checker v-bind:group="currentEditGroup"></group-checker>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-data-table
                  :headers="unallocHeaders"
                  :items="currentEditGroup"
                  hide-default-footer
                  item-key="id"
                  class="elevation-1 mx-5"
                >
                  <!-- Custom country/timezone display -->
                  <template v-slot:item.display="{ item }">{{ getLocationDisplay(item) }}</template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="editDialog = false" text>Cancel</v-btn>
            <v-btn color="green darken-1" text @click="confirmGroupEdit">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="newDialog">
        <v-card>
          <v-card-title class="headline justify-center">Select the new group ID</v-card-title>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <v-select
                  class="mx-5"
                  v-model="editGroupId"
                  :items="newGroupNumbers"
                  label="Group number"
                ></v-select>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <b>The new group:</b>
                <group-checker v-bind:group="selectedUnalloc"></group-checker>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-data-table
                  :headers="unallocHeaders"
                  :items="selectedUnalloc"
                  hide-default-footer
                  item-key="id"
                  class="elevation-1 mx-5"
                ></v-data-table>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="newDialog = false" text>Cancel</v-btn>
            <v-btn color="green darken-1" text @click="confirmNewGroup">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteAllDialog" max-width="40%">
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-alert class="mx-5" type="warning">Remove all groups?</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteAllDialog = false">No</v-btn>
            <v-btn color="red" text @click="removeAllGroups">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="resetDialog" max-width="40%">
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
      <v-dialog v-model="csvDialog" max-width="40%">
        <v-card>
          <v-card-title class="headline justify-center">Download grouping CSV?</v-card-title>
          <v-alert
            class="mx-5"
            v-if="unallocated.length > 0"
            type="error"
          >There are unallocated students!</v-alert>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="csvDialog = false">No</v-btn>
            <v-btn color="green darken-1" text @click="generateCSV">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="unallocStudentDialog" max-width="600">
        <v-card>
          <v-card-title justify-center>
            <v-alert
              width="100%"
              class="mx-5"
              type="info"
            >Remove student with ID {{ selectedStudentId }} from Group {{ selectStudentGroupId }}?</v-alert>
          </v-card-title>
          <v-alert
            class="mx-5"
            type="warning"
            v-if="lastWarning"
          >Warning, removing this student will delete the group!</v-alert>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="unallocStudentDialog=false">No</v-btn>
            <v-btn color="red" text @click="confirmUnalloc">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteGroupDialog" max-width="400">
        <v-card>
          <v-card-title justify-center>
            <v-alert width="100%" class="mx-5" type="info">Remove group {{ selectedGroupId + 1 }}?</v-alert>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteGroupDialog=false">No</v-btn>
            <v-btn color="red" text @click="confirmGroupDelete">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import { generate } from "../utility/parser/myparser";
import saveAs from "file-saver";
import { mapState } from "vuex";
import backDialog from "../dialogs/backDialog";
import Checker from "./Checker";
import { isEqual } from "lodash";
import draggable from "vuedraggable";

export default {
  name: "groupings",
  components: {
    "back-dialog": backDialog,
    "group-checker": Checker,
    draggable
  },
  computed: {
    addButtonDisabled() {
      return this.selectedUnalloc.length == 0 || this.groups.length == 0;
    },
    newButtonDisabled() {
      return this.selectedUnalloc.length == 0;
    },
    isModified() {
      return !isEqual(this.results, this.originalResults);
    },
    currentEditGroup() {
      if (this.editDialog == false || this.groups.length < this.editGroupId) {
        return [];
      } else {
        return this.groups[this.editGroupId - 1].students.concat(
          this.selectedUnalloc
        );
      }
    },
    newGroupNumbers() {
      return [...Array(this.groups.length + 1).keys()].map(i => i + 1);
    },
    groupNumbers() {
      return [...Array(this.groups.length).keys()].map(i => i + 1);
    },
    selectedStudentId() {
      if (this.selectedStudent) {
        return this.selectedStudent.id;
      } else {
        return "no_id";
      }
    },
    selectStudentGroupId() {
      if (this.selectedStudent) {
        return this.selectedStudent.groupId;
      } else {
        return "no_group";
      }
    },
    ...mapState(["results", "originalResults"])
  },
  data: function() {
    return {
      search: "",
      drawer: null,
      csvDialog: false,
      backDialog: false,
      unallocStudentDialog: false,
      deleteGroupDialog: false,
      lastWarning: false,
      resetDialog: false,
      editDialog: false,
      editGroupId: 1,
      newDialog: false,
      deleteAllDialog: false,
      deletionOccured: false,
      finishedAllocation: false,
      selectedStudent: null,
      selectedGroupId: null,
      groups: [],
      unallocated: [],
      selectedUnalloc: [],
      active: [],
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
          value: null,
          function: this.getLocationDisplay
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
          value: null,
          function: this.getLocationDisplay
        }
      ]
    };
  },
  methods: {
    addSelected(event) {
      console.log(event);
      console.log(event.target.parentElement);
    },
    log(event) {
      console.log(event);
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    goBack() {
      // Reset the results
      this.$router.push({ path: "display-students" });
    },
    generateCSV() {
      const blob = generate(this.results);
      saveAs(blob, "results.csv");
      this.csvDialog = false;
    },
    async generateGroups() {
      this.finishedAllocation = false;
      const students = this.results.students;
      const amount = this.results.numOfGroup;
      const unallocated = [];
      let groups = [];
      for (let i = 0; i < amount; i++) {
        groups.push({
          groupId: i + 1,
          students: []
        });
      }
      for (const student of students) {
        if (student.groupId == 0) {
          unallocated.push(student);
        } else {
          groups[student.groupId - 1].students.push(student);
        }
      }
      groups = groups.filter(g => g.students.length > 0);
      this.unallocated = unallocated;
      this.groups = [];
      for (const group of groups) {
        await this.sleep(10);
        this.groups.push(group);
      }
      this.finishedAllocation = true;
    },
    resetGroupings() {
      this.$store.commit("resetResults");
      this.generateGroups();
      this.selectedUnalloc = this.selectedUnalloc.filter(e => e.groupId == 0);
      this.resetDialog = false;
    },
    unallocateStudent(student) {
      console.log(student);
      this.selectedStudent = student;
      if (this.groups[student.groupId - 1].students.length == 1) {
        this.lastWarning = true;
      } else {
        this.lastWarning = false;
      }
      this.unallocStudentDialog = true;
    },
    removeAllGroups() {
      this.deletionOccured = true;
      const students = this.results.students;
      for (const student of students) {
        student.groupId = 0;
      }
      this.unallocated = [...students];
      this.groups = [];
      this.deleteAllDialog = false;
      this.deletionOccured = false;
    },
    removeGroup(groupId) {
      this.selectedGroupId = groupId;
      this.deleteGroupDialog = true;
    },
    confirmUnalloc() {
      const student = this.selectedStudent;
      this.$set(
        this.groups[student.groupId - 1],
        "students",
        this.groups[student.groupId - 1].students.filter(e => e != student)
      );
      // If group is now empty, remove and shift everyone down
      if (this.groups[student.groupId - 1].students.length == 0) {
        this.shiftGroups(student.groupId - 1);
      }
      student.groupId = 0;
      this.unallocated.push(student);
      this.unallocStudentDialog = false;
    },
    confirmGroupDelete() {
      const groupId = this.selectedGroupId;
      // The index is 1 indexed (Matches group number)
      const group = this.groups[groupId - 1];
      for (const student of group.students) {
        student.groupId = 0;
      }
      // Add students to unallocated
      this.unallocated.push(...group.students);
      // Shift groups down
      this.shiftGroups(groupId);
      this.deleteGroupDialog = false;
    },
    shiftGroups(groupId) {
      // Id is 1 indexed
      const index = groupId - 1;
      this.$delete(this.groups, index);
      for (let i = index; i < this.groups.length; i++) {
        const group = this.groups[i];
        group.groupId = group.groupId - 1;
        for (const student of group.students) {
          student.groupId = student.groupId - 1;
        }
      }
    },
    shiftGroupsUp(groupId) {
      for (let i = groupId; i < this.groups.length; i++) {
        const group = this.groups[i];
        group.groupId = group.groupId + 1;
        for (const student of group.students) {
          student.groupId = student.groupId + 1;
        }
      }
    },
    confirmGroupEdit() {
      // Set new group ID for each student
      for (const student of this.selectedUnalloc) {
        student.groupId = this.editGroupId;
      }
      // Replace the group with the new one
      this.groups[this.editGroupId - 1].students = this.currentEditGroup;
      // Reset selectedUnalloc
      this.selectedUnalloc = [];
      // Remove the students from the unallocated list
      this.unallocated = this.unallocated.filter(
        e => !this.groups[this.editGroupId - 1].students.includes(e)
      );
      this.editDialog = false;
    },
    confirmNewGroup() {
      // Set the new group ID for each student
      for (const student of this.selectedUnalloc) {
        student.groupId = this.editGroupId;
      }
      const newGroup = {
        groupId: this.editGroupId,
        students: this.selectedUnalloc
      };
      // Add the new group
      this.groups.splice(this.editGroupId - 1, 0, newGroup);
      // Reset selectedUnAlloc
      this.selectedUnalloc = [];
      // Shift everyone else up
      this.shiftGroupsUp(this.editGroupId);
      // Remove the students from the unallocated list
      this.unallocated = this.unallocated.filter(
        e => !this.groups[this.editGroupId - 1].students.includes(e)
      );
      this.newDialog = false;
    },
    getLocationDisplay(student) {
      let timezone = "";
      if (student.timezone > 0) {
        timezone = `(UTC +${student.timezone})`;
      } else if (student.timezone < 0) {
        timezone = `(UTC ${student.timezone})`;
      } else if (student.timezone == 0) {
        timezone = "(UTC)";
      }
      return student.country + " " + timezone;
    }
  },
  mounted() {
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
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}
</style>
