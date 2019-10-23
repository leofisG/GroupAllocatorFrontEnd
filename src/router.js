import Vue from 'vue'
import Router from 'vue-router'
import UploadCSV from "./components/UploadCSV.vue";
import DisplayStudents from "./components/DisplayStudents.vue";
import DisplayGroups from "./components/DisplayGroups.vue";

Vue.use(Router)

export default new Router({
  // Set the mode to histroy so we remove the hashtag in the URL.
  mode: 'history',
  routes: [
    {
        path: '/',
        name: 'UploadCSV',
        component: UploadCSV
    },
    {
        path: '/display-students',
        name: 'DisplayStudents',
        component: DisplayStudents,
        beforeEnter: (to, from, next) => {
            // TODO: check whether there is students store in the $root. If not redirect.
            next()
        }
    },
    {
        path: '/display-groups',
        name: 'DisplayGroups',
        component: DisplayGroups,
        beforeEnter: (to, from, next) => {
            // TODO: check whether there is results store in the $root. If not redirect.
            next()
        }
    },
  ]
})