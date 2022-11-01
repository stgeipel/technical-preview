import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import HttpException from 'exeptions/httpException'
import express, { NextFunction, Request, Response } from 'express'
import http from 'http'
import https from 'https'
import Logger from 'utils/logger'
// initialize configuration
dotenv.config()

const app = express()
// Port from .env File ELSE standard port 3000
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/logger', (_, res) => {
  Logger.error('This is an error log')
  Logger.warn('This is a warn log')
  Logger.info('This is a info log')
  Logger.http('This is a http log')
  Logger.debug('This is a debug log')

  res.send('Hello world')
})

// defines a test handler
app.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

/* Error handler middleware */
app.use(
  (err: HttpException, req: Request, res: Response, next: NextFunction) => {}
)

http.createServer(app).listen(8080)
https.createServer(app).listen(8081)
