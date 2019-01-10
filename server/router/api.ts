import Router from "koa-router"
import User from "../models/User"
import UserTask from "../models/UserTask"
import Task from "../models/Task"

const router = new Router({prefix: "/api"})

router.get('/ping', ctx => ctx.body = "Ping")

router.get("/users", async ctx => {
  ctx.body = await User.find()
})

router.get("/users/:id", async ctx => {
  ctx.body = await User.findOne(ctx.params.id)
})

router.get("/users/:id/userTasks", async ctx => {
  ctx.body = await UserTask.find({
    take: 100,
    order: {executedAt: "DESC"},
    where: {user: ctx.params.id},
    relations: ["task"],
  })
})

router.get("/tasks", async ctx => {
  ctx.body = await Task.find({order: {region: "ASC", name: "ASC"}})
})

router.get("/userTasks", async ctx => {
  ctx.body = await UserTask.find()
})

router.post("/userTasks", async ctx => {
  let params = ctx.request.body

  let ut = new UserTask
  ut.executedAt = params.executedAt
  ut.hours = params.hours
  ut.task = params.task.id
  ut.user = params.user.id
  await ut.save()

  ctx.body = ut
})

router.patch("/userTasks/:userTaskId", async ctx => {
  let params = ctx.request.body

  let ut = await UserTask.findOne(ctx.params.userTaskId)
  if (!ut)
    return

  ut.executedAt = params.executedAt
  ut.hours = params.hours
  ut.task = params.task.id
  ut.user = params.user.id
  await ut.save()

  ctx.body = ut
})

router.delete("/userTasks/:userTaskId", async ctx => {
  await UserTask.delete(ctx.params.userTaskId)
  ctx.body = "UserTask deleted"
})

export default router

