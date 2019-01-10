<template lang="pug">
  v-layout.IndexPage(column).ma-5
    v-layout
      v-btn(v-for="u of users" :key="u.id" @click="selectUser(u)" :class="{red: u === userTask.user}") {{ u.firstname }}
    v-layout.ma-3
      v-menu(style="width: 120px")
        v-text-field(v-model="executedAt" slot="activator" label="Datum" prepend-icon="event" readonly)
        v-date-picker(v-model="executedAt").red
      v-text-field.ml-3(type="number" label="Stunden" prepend-icon="access_time" style="max-width: 100px" v-model="userTask.hours")
      v-select(label="Task" :items="taskSeletion" v-model="selectedTask").selectBox.ml-3
      v-btn(:disabled="!userTask.isValid" @click="save").green Speichern
    v-data-table(:items="userTasks" :headers="headers")
      template(slot="items" slot-scope="props")
        td {{ props.item.executedAt }}
        td {{ props.item.hours }}
        td {{ props.item.task.name }}
        td {{ props.item.task.region }}
        td {{ props.item.task.frequency }}
        td
          v-icon(@click="editUserTask(props.item)").util-icon-clickable.orange--text edit
        td
          v-icon(@click="deleteUserTask(props.item)").util-icon-clickable.red--text close
</template>

<script lang="ts">
  import Vue from "vue"
  import {Component, Watch} from "vue-property-decorator"
  import User from "../models/User"
  import Task from "../models/Task"
  import UserTask from "../models/UserTask"

  @Component
  export default class IndexPage extends Vue {

    users: User[] = []
    tasks: Task[] = []
    userTasks: UserTask[] = []

    userTask: UserTask = new UserTask()
    executedAt = new Date().toISOString().substr(0, 10)
    selectedTask = null

    headers = [{text: "Datum"}, {text: "Stunden"}, {text: "Typ"}, {text: "Gemeinde"}, {text: "Rhythmus"}]

    async mounted() {
      this.initUserTask()
      this.users = await User.fetch() as User[]
      this.tasks = await Task.fetch() as Task[]
    }

    initUserTask(user?: User) {
      this.userTask = new UserTask()
      this.executedAt = new Date().toISOString().substr(0, 10)
      this.userTask.user = user
    }

    @Watch("executedAt")
    onExecutedAtChange(executedAt: string) {
      this.userTask.executedAt = executedAt
    }

    @Watch("selectedTask")
    onESelectedTaskChange(selectedTask: Task) {
      this.userTask.task = selectedTask
    }

    async selectUser(user: User) {
      this.userTask.user = user
      this.userTask.executedAt = this.executedAt
      this.userTask.task = this.selectedTask
      await this.fetchUserTasks(user)
    }

    async fetchUserTasks(user: User) {
      this.userTasks = await user.fetchTasks() as UserTask[]
    }

    async save() {
      await this.userTask.save()
      this.initUserTask(this.userTask.user)
      await this.fetchUserTasks(this.userTask.user)
    }

    editUserTask(userTask: UserTask) {
      this.userTask = userTask
      this.executedAt = userTask.executedAt
      this.selectedTask = userTask.task
    }

    async deleteUserTask(userTask: UserTask) {
      await userTask.destroy()
      await this.fetchUserTasks(this.userTask.user)
    }

    taskText(task: Task) {
      return `${task.name} ${task.region} ${task.frequency ? task.frequency + "wö" : ""}`
    }

    get taskSeletion() {
      return this.tasks.map(task => {
        return {
          text: this.taskText(task),
          value: task,
        }
      })
    }
  }
</script>

<style lang="sass" scoped>
  .IndexPage
    .selectBox
      max-width: 300px
</style>

<style lang="sass">
  .IndexPage
    .selectBox
      .v-menu__content
        left: 0 !important
        top: 0 !important
</style>
