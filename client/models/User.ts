import ApiModel from "./ApiModel"
import axios from "axios"
import UserTask from "./UserTask"

export default class User extends ApiModel {
  static apiPath = '/users'

  firstname: string
  lastname: string
  isDriver: boolean

  async fetchTasks(): Promise<UserTask[]> {
    let {data} = await axios.get(`${User.apiPath}/${this.id}/userTasks`)
    let userTasks = UserTask.transformResponse(data)
    userTasks.forEach(ut => ut.user = this)
    return userTasks
  }

  static async saveTask(userTask: UserTask) {
    await axios.post(`${User.apiPath}/${userTask.user.id}/userTasks`, {
      executedAt: userTask.executedAt,
      hours: userTask.hours,
      task: userTask.task.id
    })
  }
}
