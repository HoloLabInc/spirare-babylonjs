import express from 'express'
import * as path from 'path'

import { authMiddleware } from '../auth'

const eightwallApiKey = process.env.EIGHTHWALL_API_KEY

const router = express.Router()

router.use(authMiddleware)

const scriptDirName = path.basename(path.dirname(__filename))
let viewsDir = ''
if (scriptDirName == 'dist') {
  viewsDir = path.join(__dirname, '..', 'views')
} else {
  viewsDir = path.join(__dirname, '..', '..', 'views')
}

router.get('/', (req, res) => {
  res.sendFile(path.join(viewsDir, 'startpage.html'))
})
router.get('/editor', (req, res) => {
  res.sendFile(path.join(viewsDir, 'editor.html'))
})

if (eightwallApiKey) {
  router.get('/8thwall', (req, res) => {
    const data = {
      apiKey: eightwallApiKey,
    }
    res.render(path.join(viewsDir, '8thwallView.ejs'), data)
  })
}

router.get('/artoolkit', (req, res) => {
  res.sendFile(path.join(viewsDir, 'artoolkitView.html'))
})

export { router as pageRouter }
