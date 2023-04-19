import { NextFunction, Request, Response } from 'express'

export const getUserId = (req: Request): string | undefined => {
  const dummyUserId = process.env.DUMMY_USER_ID
  const principalId = req.get('X-MS-CLIENT-PRINCIPAL-ID')
  return dummyUserId || principalId
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    if (req.url === '/.auth/login/aad') {
      res.sendStatus(404)
    } else {
      res.redirect('/.auth/login/aad')
    }
    return
  }
  next()
}
