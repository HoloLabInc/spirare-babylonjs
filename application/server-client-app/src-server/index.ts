import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import https from 'https'
import fs from 'fs'

import * as bodyParser from 'body-parser'
import { pageRouter } from './routers/pageRouter'
import { apiRouter } from './routers/apiRouter'
import { pomlRouter } from './routers/pomlRouter'
import { temporaryPomlRouter } from './routers/temporaryPomlRouter'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express)

app.use('/api', apiRouter)
app.use('/poml', pomlRouter)
app.use('/temporary-poml', temporaryPomlRouter)
app.use('/', pageRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`HTTP Server: listening on port ${port}`)
})

const enableHttps = process.env.ENABLE_HTTPS
if (enableHttps) {
  const httpsPort = process.env.HTTPS_PORT || 3001

  const options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert'),
  }

  https.createServer(options, app).listen(httpsPort, () => {
    console.log(`HTTPS Server: listening on port ${httpsPort}`)
  })
}

export default app
