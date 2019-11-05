import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store/store'
import UploadCSV from "../components/UploadCSV.vue";
import DisplayStudents from "../components/DisplayStudents.vue";
import DisplayGroups from "../components/DisplayGroups.vue";

Vue.use(Router)

export default new Router({
  // Set the mode to history so we remove the hashtag in the URL.
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
            if (from.name == 'UploadCSV' || from.name == 'DisplayGroups') {
                next()
            } else {
                next({ name: 'UploadCSV' })
            }
            // TODO: check whether there is students store in the $root. If not redirect.
        }
    },
    {
        path: '/display-groups',
        name: 'DisplayGroups',
        component: DisplayGroups,
        beforeEnter: (to, from, next) => {
            if (from.name == "DisplayStudents") {
                next()
            } else {
                next({ name: 'UploadCSV' })
            }
            // TODO: check whether there is results store in the $root. If not redirect.
        }
    },
  ]
})