require('dotenv').config()

import Koa from "koa"
import consola from "consola"
import cors from '@koa/cors'
import bodyParser from "koa-bodyparser"
import {createConnection} from "typeorm"
import "reflect-metadata"
import router from "./router"
import Entities from "./models"

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

async function start() {

  await createConnection({
    // @ts-ignore
    "type": process.env.DB_TYPE,
    "host": process.env.DB_HOST,
    "database":  process.env.DB_DATABASE,
    "username":  process.env.DB_USERNAME,
    "password":  process.env.DB_PASSWORD,
    "synchronize": false,
    "logging":  false,
    "entities": Entities
  })

  app.use(cors({origin: '*'}))
  app.use(bodyParser())
  app.use(router())

  app.listen(port)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

