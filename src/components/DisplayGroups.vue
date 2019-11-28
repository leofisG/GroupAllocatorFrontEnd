<template>
  <div class="groupings">
    <v-app id="mainScreen">
      <v-navigation-drawer v-model="drawer" app clipped :width="400">
        <v-container>
          <v-btn color="error" dark large @click="backDialog = true">Go back</v-btn>
          <back-dialog
            v-if="backDialog"
            @close="backDialog = false"
            @back="goBack"
            destination="the allocation screen"
            lossWarning="Current groupings"
          ></back-dialog>
        </v-container>
        <v-container v-if="unallocated.length > 0">
          <p>
            <v-icon color="orange">mdi-exclamation</v-icon>
            {{ unallocated.length }} unallocated students
          </p>
          <v-data-table
            style="overflow: auto; max-height: 60vh"
            show-select
            :items-per-page="-1"
            v-model="selectedUnalloc"
            :headers="unallocHeaders"
            :items="unallocated"
            hide-default-footer
            item-key="id"
            class="elevation-1 mx-2"
          ></v-data-table>
          <v-container class="mx-5">
            <v-btn
              class="mx-5"
              color="orange"
              :disabled="addButtonDisabled"
              @click="editDialog = true"
            >Add to Group</v-btn>
            <v-btn
              class="mx-5"
              color="green"
              :disabled="newButtonDisabled"
              @click="newDialog = true"
            >New group</v-btn>
          </v-container>
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
                lg="4"
                xl="3"
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
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" medium @click="removeGroup(index)">delete</v-icon>
                            </template>
                            <span>Delete the whole group</span>
                          </v-tooltip>
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
                        <!-- Implement a delete button in this slot -->
                          <template v-slot:item.action="{ item }">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small @click="unallocateStudent(item)">delete</v-icon>
                              </template>
                              <span>Remove from group</span>
                            </v-tooltip>
                          </template>
                          <!-- Custom country/timezone display -->
                          <template v-slot:item.display="{ item }">
                            {{ getLocationDisplay(item) }}
                          </template>
                        </v-data-table>
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
                ></v-data-table>
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

export default {
  name: "groupings",
  components: {
    "back-dialog": backDialog,
    "group-checker": Checker
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
        return this.groups[this.editGroupId - 1].concat(this.selectedUnalloc);
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
          value: "display"
        },
        {
          text: "",
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
          value: "display"
        }
      ]
    };
  },
  methods: {
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
        groups.push([]);
      }
      for (const student of students) {
        if (student.groupId == 0) {
          unallocated.push(student);
        } else {
          groups[student.groupId - 1].push(student);
        }
      }
      groups = groups.filter(g => g.length > 0);
      this.unallocated = unallocated;
      // this.groups = groups;
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
      this.selectedStudent = student;
      if (this.groups[student.groupId - 1].length == 1) {
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
      console.log(this.unallocated);
    },
    removeGroup(index) {
      this.selectedGroupId = index;
      this.deleteGroupDialog = true;
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
      this.unallocStudentDialog = false;
    },
    confirmGroupDelete() {
      const index = this.selectedGroupId;
      // The index is 0 indexed
      const group = this.groups[index];
      for (const student of group) {
        student.groupId = 0;
      }
      // Add students to unallocated
      this.unallocated.push(...group);
      // Shift groups down
      this.shiftGroups(index);
      this.deleteGroupDialog = false;
    },
    shiftGroups(id) {
      this.$delete(this.groups, id);
      for (let i = id; i < this.groups.length; i++) {
        const group = this.groups[i];
        for (const student of group) {
          student.groupId = student.groupId - 1;
        }
      }
    },
    shiftGroupsUp(id) {
      for (let i = id; i < this.groups.length; i++) {
        const group = this.groups[i];
        for (const student of group) {
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
      this.groups[this.editGroupId - 1] = this.currentEditGroup;
      // Reset selectedUnalloc
      this.selectedUnalloc = [];
      // Remove the students from the unallocated list
      this.unallocated = this.unallocated.filter(
        e => !this.groups[this.editGroupId - 1].includes(e)
      );
      this.editDialog = false;
    },
    confirmNewGroup() {
      // Set the new group ID for each student
      for (const student of this.selectedUnalloc) {
        student.groupId = this.editGroupId;
      }
      // Add the new group
      this.groups.splice(this.editGroupId - 1, 0, this.selectedUnalloc);
      console.log(this.groups);
      // Reset selectedUnAlloc
      this.selectedUnalloc = [];
      // Shift everyone else up
      this.shiftGroupsUp(this.editGroupId);
      // Remove the students from the unallocated list
      this.unallocated = this.unallocated.filter(
        e => !this.groups[this.editGroupId - 1].includes(e)
      );
      this.newDialog = false;
    },
    getLocationDisplay(student) {
      let timezone = "";
      if (student.timezone > 0) {
        timezone = `(UTC +${student.timezone})`
      } else if (student.timezone < 0) {
        timezone = `(UTC ${student.timezone})`
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
