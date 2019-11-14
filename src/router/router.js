import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store/store'
import UploadCSV from "../components/UploadCSV.vue";
import DisplayStudents from "../components/DisplayStudents.vue";
import DisplayGroups from "../components/DisplayGroups.vue";
import Login from "../components/Login.vue";
import store from '../store/store'

Vue.use(Router)

export default new Router({
  // Set the mode to history so we remove the hashtag in the URL.
  mode: 'history',
  routes: [
    {
        path: '/',
        name: 'Login',
        component: Login,
        beforeEnter: (to, from, next) => {
            if (store.state.isAuthenticated) {
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
            if (store.state.isAuthenticated) {
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
            if (store.state.isAuthenticated && store.state.parsedStudents) {
                next()
            } else if (store.state.isAuthenticated) {
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
            if (store.state.isAuthenticated && store.state.results) {
                next()
            } else if (store.state.isAuthenticated) {
                next({ name: 'UploadCSV' })
            } else {
                next({ name: 'Login' })
            }
        }
    },
  ]
})