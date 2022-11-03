import bodyParser from 'body-parser'
import express from 'express'
import { Config } from './config'
import HttpException from './exeptions/httpException'
import evalaluationRouter from './routes/evaluation.routes'

// initialize configuration

const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// defines a test handler
app.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

/* Error handler middleware */
app.use((err: HttpException) => {
  console.log(`[ERR]:${err.message}`)
})

// Adding Routes
app.use('/evaluation', evalaluationRouter)

// App starting on given Port
app.listen(Config.port, () => {
  console.log(`Example app listening on port ${Config.port}`)
})
