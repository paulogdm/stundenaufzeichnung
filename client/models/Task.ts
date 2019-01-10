import ApiModel from "./ApiModel"

export default class Task extends ApiModel {
  static apiPath = '/tasks'

  name: string
  region: string
  frequency: number
}
