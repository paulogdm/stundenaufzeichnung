import axios from "axios"

import {Vue} from "vue-property-decorator"

export default async ({app, route, redirect}) => {
    if (process.browser) {
        let origin = window.location.origin
        if (window.location.hostname === "localhost")
            origin = window.location.protocol + "//" + window.location.hostname + ":3000"
        axios.defaults.baseURL = origin + "/api"
    }
    axios.defaults.withCredentials = false

    axios.defaults.headers.common = {
        Accept: "application/json"
    }

    axios.interceptors.response.use(response => {
        return response
    }, error => {
        if (error.response) {
            let message = error.response.data.error.message || error.response.data.message || error.response.data
            console.error(error)
            Vue.prototype.$snackbar.open({message, type: 'is-danger'})
        }
        return Promise.reject(error)
    })
}
