import axios from 'axios'
import 'reflect-metadata'
import moment from 'moment'
import PaginatedResponse from "./PaginatedResponse"
import {plainToClass} from "class-transformer"

export default class ApiModel {
    protected static apiPath: string

    id: number
    $loading: boolean = false

    constructor (args = {}) {
        for (let key in args) {
            if(moment(args[key], moment.ISO_8601).isValid()) {
                args[key] = moment.utc(args[key])
            }
            this[key] = args[key]
        }
    }

    async save (): Promise<void> {
        try {
            this.$loading = true
            if (this.id) {
                await ApiModel.update(this)
            } else {
                await ApiModel.create(this)
            }
        }
        finally {
            this.$loading = false
        }
    }

    async destroy (): Promise<void> {
        if (this.id) {
            try {
                this.$loading = true
                await ApiModel.destroy(this)
            }
            finally {
                this.$loading = false
            }
        }
    }

    static async destroy (item, apiPath = item.constructor.apiPath): Promise<void> {
        try {
            item.$loading = true
            await axios.delete(apiPath + '/' + item.id)
        }
        finally {
            item.$loading = false
        }
    }

    static async create (item, apiPath = item.constructor.apiPath): Promise<void> {
        try {
            item.$loading = true
            await axios.post(apiPath, item)
        }
        finally {
            item.$loading = false
        }
    }

    static async update (item, attributes = item, apiPath = item.constructor.apiPath): Promise<void> {
        try {
            item.$loading = true
            await axios.patch(apiPath + '/' + item.id, attributes)
        }
        finally {
            item.$loading = false
        }
    }

    static async fetchById (id: string|number, Model = this, apiPath = this.apiPath): Promise<any> {
        let { data } = await axios.get(apiPath + '/' + id)
        return this.transformResponse(data)
    }

    static async fetch<T extends typeof ApiModel> (this: T, params = {}, Model = this, apiPath = this.apiPath): Promise<ApiResponse<T>> {
        let { data } = await axios.get(apiPath, { params })
        return Model.transformResponse(data)
    }

    protected static transformResponse(data: any) {
      if(data.data) {
        if(data.data instanceof Array) {
          let instances = this.createInstances(data.data)
          return (data.data && data.meta) ? { data: instances, meta: data.meta, links: data.links} : instances
        }
        else {
          return this.createInstance(data.data)
        }
      }
      else {
        return data instanceof Array ? this.createInstances(data) : this.createInstance(data)
      }
    }

    protected static createInstances(arr: any[] | undefined, Model = this) {
        if(!arr) return []
        return arr.map(obj => this.createInstance(obj, Model))
    }

    protected static createInstance(obj: any, Model = this) {
        if(!(obj instanceof Model)){
            try {
              return plainToClass(Model, obj)
            } catch(err){
              return obj
            }
        }
        return obj
    }
}

export type ApiResponse<T extends typeof ApiModel> = Array<InstanceType<T>> | PaginatedResponse<InstanceType<T>>
