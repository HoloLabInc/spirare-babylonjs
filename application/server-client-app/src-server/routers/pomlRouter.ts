import express from 'express'
import * as path from 'path'
import { authMiddleware, getUserId } from '../auth'
import { contentDataPath } from '../dataPath'

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  res.send('ok')
})

// /poml/[pomlId]
router.get('/:pomlId', async (req, res) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    res.sendStatus(401)
    return
  }

  const params = req.params
  console.log(`Get poml\npomlId: ${params.pomlId}\n`)

  const dataPath = path.join(contentDataPath, userId, `${params.pomlId}.poml`)

  res.sendFile(dataPath, (err) => {
    // If setndFile works fine
    if (err === undefined) {
      return
    }

    // If error occurs
    const errnoErr = err as any
    if ('code' in errnoErr) {
      if (errnoErr.code === 'ENOENT') {
        res.sendStatus(404)
        return
      }
    }

    res.sendStatus(500)
  })
})

// /poml/[ownerId]/[pomlId]/[fileName]
router.get('/:ownerId/:pomlId/:fileName', async (req, res) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    res.sendStatus(401)
    return
  }

  const params = req.params
  const ownerId = params.ownerId
  if (userId !== ownerId) {
    res.sendStatus(401)
    return
  }

  const dataPath = path.join(
    contentDataPath,
    ownerId,
    params.pomlId,
    params.fileName
  )
  res.sendFile(dataPath)
})

export { router as pomlRouter }
