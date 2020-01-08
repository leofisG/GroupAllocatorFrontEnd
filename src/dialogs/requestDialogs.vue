<template>
  <div>
    <warning-dialog :model="warningDialog" @close="warningDialog = false"></warning-dialog>
    <confirmation-dialog
      :model="confirmationDialog"
      @close="confirmationDialog = false"
      :next="prepareRequest"
    ></confirmation-dialog>
    <result-dialog :model="resultDialog" @close="cancelResults" :next="showResults"></result-dialog>
    <error-dialog :model="errorDialog" @close="cancelError" :next="prepareRequest"></error-dialog>
  </div>
</template>

<script>
import { combineResults } from "../utility/request";
import filterWarningDialog from "../dialogs/filterWarningDialog";
import confirmationDialog from "../dialogs/confirmationDialog";
import resultDialog from "../dialogs/resultDialog";
import errorDialog from "../dialogs/errorDialog";
import { sendRequest } from "../utility/request";
import { mapGetters } from "vuex";

export default {
  name: "request-dialogs",
  props: {
    repeat: Boolean,
    generate: Function,
    toggleFilter: Function
  },
  data() {
    return {
      warningDialog: false,
      confirmationDialog: false,
      errorDialog: false,
      resultDialog: false
    };
  },
  computed: {
    ...mapGetters(["filterWarnings"])
  },
  components: {
    "warning-dialog": filterWarningDialog,
    "confirmation-dialog": confirmationDialog,
    "result-dialog": resultDialog,
    "error-dialog": errorDialog
  },
  methods: {
    triggerSubmission() {
      if (this.filterWarnings.length > 0) {
        this.warningDialog = true;
      } else {
        this.confirmationDialog = true;
      }
    },
    prepareRequest() {
      this.toggleFilterIfDefined();
      this.errorDialog = false;
      this.$store.commit("clearRequestError");
      this.$store.commit("resetRequestStatus");
      sendRequest(this);
      this.confirmationDialog = false;
      this.resultDialog = true;
    },
    showResults() {
      combineResults();
      if (this.repeat) {
        this.resultDialog = false;
        this.generate();
      } else {
        this.$router.push({ path: "display-groups" });
      }
    },
    cancelResults() {
      this.resultDialog = false;
      this.toggleFilterIfDefined();
    },
    cancelError() {
      this.errorDialog = false;
      this.toggleFilterIfDefined();
    },
    toggleFilterIfDefined() {
      if (this.toggleFilter) {
        this.toggleFilter();
      }
    }
  }
};
</script>

<style>
</style>