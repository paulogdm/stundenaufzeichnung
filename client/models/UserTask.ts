import ApiModel from "./ApiModel"
import Task from "./Task"
import User from "./User"
import {Type} from "class-transformer"

export default class UserTask extends ApiModel {
  static apiPath = '/usertasks'

  executedAt: string
  hours: number

  @Type(() => User)
  user: User
  @Type(() => Task)
  task: Task

  get isValid() {
    return this.hours > 0 && this.executedAt && this.user && this.task
  }
}
