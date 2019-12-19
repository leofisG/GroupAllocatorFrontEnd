import Vue from 'vue'
import Router from 'vue-router'
import UploadCSV from "../components/UploadCSV.vue";
import DisplayStudents from "../components/DisplayStudents.vue";
import DisplayGroups from "../components/DisplayGroups.vue";
import Login from "../components/Login.vue";
import store from '../store/store'

Vue.use(Router)

function isUserAutenticated() {
    return Vue.prototype.$session.get("isAuthenticatedUser");
}

function isStudentDataParsed() {
    return store.state.parsedStudents;
}

function isGroupAllocationStored() {
    return store.state.results;
}

export default new Router({
  // Set the mode to history so we remove the hashtag in the URL.
  mode: 'history',
  routes: [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter: (to, from, next) => {
            if (isUserAutenticated()) {
                next({ name: 'UploadCSV' })
            } else {
                next()
            }
        }
    },
    {
        path: '/uploadcsv',
        name: 'UploadCSV',
        component: UploadCSV,
        beforeEnter: (to, from, next) => {
            if (isUserAutenticated()) {
                next()
            } else {
                next({ name: 'Login' })
            }
        }
    },
    {
        path: '/display-students',
        name: 'DisplayStudents',
        component: DisplayStudents,
        beforeEnter: (to, from, next) => {
            if (isUserAutenticated() && isStudentDataParsed()) {
                next()
            } else if (isUserAutenticated()) {
                next({ name: 'UploadCSV' })
            } else {
                next({ name: 'Login' })
            }
        }
    },
    {
        path: '/display-groups',
        name: 'DisplayGroups',
        component: DisplayGroups,
        beforeEnter: (to, from, next) => {
            if (isUserAutenticated() && isGroupAllocationStored()) {
                next()
            } else if (isUserAutenticated()) {
                next({ name: 'UploadCSV' })
            } else {
                next({ name: 'Login' })
            }
        }
    },
    {   // Redirect to login page for all other URLs.
        path: '*',
        redirect: 'login'
    }
  ]
})